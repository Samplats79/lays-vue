<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/laysLogo.png" alt="Lay's" />

        <h1>Admin • Submissions</h1>
        <p class="subtitle">Bekijk alle ingezonden bags en verwijder submissions.</p>

        <div class="actions">
          <router-link class="btn outline" to="/admin">← Admin</router-link>
          <router-link class="btn outline" to="/">Home</router-link>
          <button class="btn solid" type="button" @click="loadBags" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </header>

      <section class="card">
        <p v-if="error" class="msg error">{{ error }}</p>

        <div v-if="loading" class="loadingBox">
          <p>Even laden...</p>
        </div>

        <div v-if="!loading && bags.length === 0 && !error" class="empty">
          <h2>Geen submissions</h2>
          <p>Nog geen bags in de database.</p>
        </div>

        <div v-if="bags.length > 0" class="grid">
          <article v-for="bag in bags" :key="bag._id" class="bag">
            <div class="stage">
              <img v-if="bag.image" :src="bag.image" alt="Bag preview" class="bagCutout" />
              <div v-else class="noPreview">No preview</div>
            </div>

            <div class="meta">
              <div class="rowTop">
                <div class="title">
                  <div class="name">{{ bag.name || "Unnamed" }}</div>
                  <div class="small">Made by <b>{{ bag.user || "anonymous" }}</b></div>
                </div>

                <div class="pill">
                  <span>{{ formatDate(bag.createdAt) }}</span>
                </div>
              </div>

              <div class="rowMid">
                <div class="chip">
                  <span class="k">Color</span>
                  <span class="v">{{ bag.bagColor || "-" }}</span>
                </div>
                <div class="chip">
                  <span class="k">Font</span>
                  <span class="v">{{ bag.font || "-" }}</span>
                </div>
                <div class="chip">
                  <span class="k">Votes</span>
                  <span class="v">{{ bag.votes ?? 0 }}</span>
                </div>
              </div>

              <div class="rowBottom">
                <button
                  class="btn danger"
                  type="button"
                  @click="removeBag(bag)"
                  :disabled="deletingId === bag._id"
                >
                  {{ deletingId === bag._id ? "Deleting..." : "Delete" }}
                </button>

                <div class="idText">ID: {{ bag._id }}</div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "AdminBagsView",
  data() {
    return {
      bags: [],
      loading: false,
      error: "",
      deletingId: "",
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
    formatDate(iso) {
      if (!iso) return "-";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    },
    async loadBags() {
      this.loading = true;
      this.error = "";

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) {
          this.error = "VITE_API_URL ontbreekt in .env";
          this.bags = [];
          return;
        }

        const res = await fetch(`${API}/bag`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          this.error =
            (data && data.message) ? data.message : `Kon bags niet laden (${res.status}).`;
          this.bags = [];
          return;
        }

        this.bags = Array.isArray(data) ? data : [];
      } catch (e) {
        this.error = "Kon bags niet laden.";
        this.bags = [];
      } finally {
        this.loading = false;
      }
    },
    async removeBag(bag) {
      this.deletingId = bag._id;
      this.error = "";

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");

        const res = await fetch(`${API}/bag/${bag._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error = data?.message || `Delete failed (${res.status})`;
          return;
        }

        this.bags = this.bags.filter((b) => b._id !== bag._id);
      } catch (e) {
        this.error = e?.message || "Delete failed.";
      } finally {
        this.deletingId = "";
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28px 18px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
  font-family: "Poppins", system-ui, Arial, sans-serif;
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.top {
  text-align: center;
  margin-bottom: 18px;
}

.logo {
  width: 140px;
  margin: 0 auto 8px;
  display: block;
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  color: #b10f0f;
}

.subtitle {
  margin: 6px 0 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
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
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
  border-color: #b10f0f;
}

.btn.outline {
  background: #fff;
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.6);
}

.btn.danger {
  background: #b10f0f;
  color: #fff;
  border-color: #b10f0f;
  padding: 10px 16px;
}

.btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22px;
  padding: 22px;
  border: 2px solid rgba(203, 36, 36, 0.12);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}

.msg {
  text-align: center;
  font-weight: 900;
  margin: 0 0 12px;
}

.error {
  color: #b10f0f;
}

.loadingBox,
.empty {
  text-align: center;
  font-weight: 800;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.bag {
  border-radius: 26px;
  overflow: hidden;
  background: #111;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  transition: transform 0.22s ease;
}

.bag:hover {
  transform: translateY(-6px);
}

.stage {
  height: 300px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 40%, #ffffff 0%, #f2f2f2 52%, #e8e8e8 100%);
}

.bagCutout {
  max-height: 260px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.18));
}

.noPreview {
  font-weight: 900;
  opacity: 0.6;
  color: rgba(0, 0, 0, 0.7);
}

.meta {
  padding: 14px 16px 18px;
  color: #fff;
}

.rowTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.name {
  font-weight: 900;
  font-size: 18px;
}

.small {
  margin-top: 4px;
  font-weight: 700;
  opacity: 0.85;
}

.pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-weight: 900;
  white-space: nowrap;
}

.rowMid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.chip {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 10px 12px;
}

.k {
  display: block;
  font-weight: 800;
  opacity: 0.75;
  font-size: 12px;
}

.v {
  display: block;
  font-weight: 900;
  margin-top: 2px;
}

.rowBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.idText {
  font-size: 12px;
  opacity: 0.75;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 55%;
}
</style>
