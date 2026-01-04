<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />
        <h1>Community</h1>

        <div class="actions">
          <router-link class="btn outline" to="/">← Home</router-link>
          <router-link class="btn solid" to="/login">Create my own bag</router-link>
          <button class="btn outline" type="button" @click="loadBags" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </header>

      <section class="card">
        <p v-if="error" class="msg error">{{ error }}</p>

        <div v-if="!loading && bags.length === 0 && !error" class="empty">
          <h2>Nog geen bags</h2>
          <p>Geen inzendingen gevonden.</p>
        </div>

        <div v-if="loading" class="loadingBox">
          <p>Even laden...</p>
        </div>

        <div v-if="bags.length > 0" class="grid">
          <article v-for="bag in bags" :key="bag._id" class="bag">
            <div class="preview">
              <img v-if="bag.image" :src="bag.image" alt="Bag preview" />
              <div v-else class="noPreview">No preview</div>
            </div>

            <div class="meta">
              <div class="madeBy">Made by <b>{{ bag.user || bag.createdBy || "anonymous" }}</b></div>

              <div class="bottom">
                <div class="votes">Votes: <b>{{ bag.votes ?? bag.likes ?? 0 }}</b></div>

                <button
                  class="btn solid small"
                  type="button"
                  @click="vote(bag)"
                  :disabled="votingId === bag._id || !token"
                >
                  {{ votingId === bag._id ? "Voting..." : "Vote" }}
                </button>
              </div>

              <p v-if="!token" class="hint">Log in om te kunnen stemmen.</p>
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
          headers: { "Content-Type": "application/json" },
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
        if (!this.token) throw new Error("Geen token, log eerst in.");

        const candidates = [
          { url: `${API}/vote/${bag._id}`, method: "POST", body: { bag: bag._id } },
          { url: `${API}/vote/${bag._id}`, method: "POST", body: {} },
          { url: `${API}/vote/bag`, method: "POST", body: { bag: bag._id } },
        ];

        let lastStatus = 0;
        let lastMessage = "";

        for (const c of candidates) {
          const res = await fetch(c.url, {
            method: c.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(c.body),
          });

          lastStatus = res.status;
          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            const updated = data?.bag || data;

            this.bags = this.bags.map((b) =>
              b._id === bag._id ? { ...b, ...updated } : b
            );

            this.votingId = "";
            return;
          }

          lastMessage = data?.message || `Vote failed (${res.status})`;
        }

        this.error = lastMessage || `Vote failed (${lastStatus})`;
      } catch (e) {
        this.error = e?.message || "Vote failed";
      } finally {
        this.votingId = "";
      }
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

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 14px;
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
  cursor: pointer;
  background: transparent;
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
  border-color: #b10f0f;
}

.btn.outline {
  background: rgba(255, 255, 255, 0.85);
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.7);
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

.loadingBox {
  text-align: center;
  padding: 18px 10px;
  font-weight: 800;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.bag {
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s ease;
}

.bag:hover {
  transform: translateY(-6px);
}

.preview {
  background: #fff;
  height: 240px;
  display: grid;
  place-items: center;
  padding: 14px;
}

.preview img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.noPreview {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.45);
}

.meta {
  padding: 14px 16px 16px;
}

.madeBy {
  font-weight: 900;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.bottom {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.votes {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.75);
}

.hint {
  margin-top: 10px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.6);
}
</style>
