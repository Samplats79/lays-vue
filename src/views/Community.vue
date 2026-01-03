<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />

        <h1>Community</h1>
        <p class="subtitle">Bekijk community bags en stem op je favorieten.</p>

        <div class="actions">
          <router-link class="btn outline" to="/">← Home</router-link>
          <router-link class="btn solid" to="/login">Create my own bag</router-link>
          <button class="btn outline" type="button" @click="loadBags" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </header>

      <section class="card">
        <p class="hint" v-if="!token">
          Je bent niet ingelogd → votes kunnen mislukken als de API auth vereist.
        </p>

        <p v-if="error" class="msg error">{{ error }}</p>

        <div v-if="!loading && bags.length === 0 && !error" class="empty">
          <h2>Nog geen bags</h2>
          <p>Er staan nog geen opgeslagen chips bags in de database (of de endpoint klopt niet).</p>
        </div>

        <div v-if="loading" class="loadingBox">
          <p>Even laden...</p>
        </div>

        <div v-if="bags.length > 0" class="grid">
          <article v-for="bag in bags" :key="bag._id" class="bag">
            <div class="bagTop">
              <h3 class="bagTitle">{{ bag.name || "Unnamed bag" }}</h3>
              <span class="badge">{{ formatDate(bag.createdAt) }}</span>
            </div>

            <div class="bagMeta">
              <div class="metaRow">
                <span class="k">Color</span>
                <span class="v">{{ bag.bagColor || "-" }}</span>
              </div>
              <div class="metaRow">
                <span class="k">Font</span>
                <span class="v">{{ bag.font || "-" }}</span>
              </div>
              <div class="metaRow">
                <span class="k">Pattern</span>
                <span class="v">{{ bag.pattern || "-" }}</span>
              </div>
              <div class="metaRow">
                <span class="k">User</span>
                <span class="v">{{ bag.user || "anonymous" }}</span>
              </div>
            </div>

            <div class="bagActions">
              <button class="btn solid small" type="button" @click="vote(bag)" :disabled="votingId === bag._id">
                {{ votingId === bag._id ? "Voting..." : "❤️ Vote" }}
              </button>

              <span class="votes">
                Votes: <b>{{ bag.votes ?? 0 }}</b>
              </span>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "CommunityView",
  data() {
    return {
      bags: [],
      loading: false,
      error: "",
      votingId: "",
      token: localStorage.getItem("token") || "",
    };
  },
  mounted() {
    this.loadBags();
  },
  methods: {
    normalizeBase(url) {
      return (url || "").trim().replace(/\/+$/, "");
    },
    async loadBags() {
      this.error = "";
      this.loading = true;

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");

        const res = await fetch(`${API}/bag`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          this.error = data?.message || `Failed to fetch (${res.status})`;
          this.bags = [];
          return;
        }

        this.bags = Array.isArray(data) ? data : data?.bags || [];
      } catch (e) {
        this.error = e?.message || "Failed to fetch";
        this.bags = [];
      } finally {
        this.loading = false;
      }
    },
    async vote(bag) {
      this.error = "";
      this.votingId = bag._id;

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");

        const res = await fetch(`${API}/bag/${bag._id}/vote`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error = data?.message || `Vote failed (${res.status})`;
          return;
        }

        const updated = data?.bag || data;
        this.bags = this.bags.map((b) => (b._id === bag._id ? { ...b, ...updated } : b));
      } catch (e) {
        this.error = e?.message || "Vote failed";
      } finally {
        this.votingId = "";
      }
    },
    formatDate(iso) {
      if (!iso) return "-";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.page {
  font-family: "Poppins", system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  padding: 28px 18px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
}

.wrap {
  max-width: 1050px;
  margin: 0 auto;
}

.top {
  text-align: center;
  margin: 18px 0 18px;
}

.logo {
  width: 140px;
  margin: 0 auto 10px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.15));
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f;
}

.subtitle {
  margin: 6px 0 14px;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: transform 0.08s ease, filter 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
  background: transparent;
}

.btn:active {
  transform: translateY(1px);
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
  border-color: #b10f0f;
}

.btn.solid:hover {
  filter: brightness(1.05);
}

.btn.outline {
  background: rgba(255, 255, 255, 0.85);
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.7);
}

.btn.outline:hover {
  filter: brightness(1.03);
}

.btn.small {
  padding: 10px 14px;
  font-size: 14px;
}

.card {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(203, 36, 36, 0.15);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  padding: 22px;
}

.hint {
  margin: 0 0 12px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
}

.msg {
  margin: 0 0 12px;
  font-weight: 900;
  text-align: center;
}

.error {
  color: #b10f0f;
}

.empty {
  text-align: center;
  padding: 18px 10px;
}

.empty h2 {
  margin: 0 0 6px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.85);
}

.empty p {
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 600;
}

.loadingBox {
  text-align: center;
  padding: 18px 10px;
  font-weight: 800;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.bag {
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  padding: 16px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
}

.bagTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.bagTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.85);
}

.badge {
  font-size: 12px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(177, 15, 15, 0.08);
  color: #b10f0f;
  border: 1px solid rgba(177, 15, 15, 0.15);
  white-space: nowrap;
}

.bagMeta {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
}

.metaRow {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.7);
}

.k {
  opacity: 0.85;
}

.v {
  color: rgba(0, 0, 0, 0.85);
}

.bagActions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.votes {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.75);
}
</style>
