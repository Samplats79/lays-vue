<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Beheer inzendingen en moderatie.</p>

        <div class="actions">
          <router-link class="btn outline" to="/">Home</router-link>
          <router-link class="btn solid" to="/admin/bags">Submissions</router-link>
          <button class="btn outline" type="button" @click="logout">Logout</button>
        </div>
      </header>

      <section class="card">
        <div class="stats">
          <div class="stat">
            <div class="k">Admin</div>
            <div class="v">{{ adminEmail }}</div>
          </div>

          <div class="stat">
            <div class="k">Total submissions</div>
            <div class="v">{{ total }}</div>
          </div>

          <div class="stat">
            <div class="k">Laatste refresh</div>
            <div class="v">{{ lastRefresh }}</div>
          </div>
        </div>

        <div class="cta">
          <button class="btn solid" type="button" @click="refresh" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh stats" }}
          </button>
        </div>

        <p v-if="error" class="msg error">{{ error }}</p>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "AdminView",
  data() {
    return {
      total: 0,
      loading: false,
      error: "",
      lastRefresh: "-",
      adminEmail: "admin@admin.com",
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    normalizeBase(url) {
      return (url || "").trim().replace(/\/+$/, "");
    },
    async refresh() {
      this.loading = true;
      this.error = "";

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) {
          this.error = "VITE_API_URL ontbreekt in .env";
          this.total = 0;
          return;
        }

        const res = await fetch(`${API}/bag`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          this.error = data?.message || `Kon bags niet laden (${res.status}).`;
          this.total = 0;
          return;
        }

        this.total = Array.isArray(data) ? data.length : 0;
        this.lastRefresh = new Date().toLocaleString();
      } catch (e) {
        this.error = "Kon stats niet laden.";
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
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
  max-width: 900px;
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
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.stat {
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.06);
  padding: 14px;
}
.k {
  font-weight: 900;
  opacity: 0.7;
  font-size: 12px;
}
.v {
  font-weight: 900;
  margin-top: 6px;
  font-size: 18px;
}
.cta {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.msg {
  text-align: center;
  font-weight: 900;
  margin: 14px 0 0;
}
.error {
  color: #b10f0f;
}
@media (max-width: 760px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
