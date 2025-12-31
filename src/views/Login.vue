<template>
  <div class="page">
    <div class="card">
      <h1>Login</h1>

      <label>Email</label>
      <input v-model="email" type="email" placeholder="admin@admin.com" />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Admin" />

      <button @click="login" :disabled="loading">
        {{ loading ? "Bezig..." : "Login" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="ok" class="ok">{{ ok }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: "",
      ok: "",
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.ok = "";
      this.loading = true;

      const API = import.meta.env.VITE_API_URL; // moet eindigen op /api/v1

      try {
        const res = await fetch(`${API}/user/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error = data?.message || `Login mislukt (${res.status})`;
          this.loading = false;
          return;
        }

        if (!data?.token) {
          this.error = "Geen token teruggekregen van API";
          this.loading = false;
          return;
        }

        localStorage.setItem("token", data.token);
        this.ok = "Login OK – token opgeslagen";
      } catch (e) {
        this.error = "API niet bereikbaar (check VITE_API_URL / CORS)";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
  background: #fff;
}
.card {
  width: 360px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: grid;
  gap: 10px;
}
input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,.2);
}
button {
  padding: 12px;
  border-radius: 12px;
  border: 0;
  background: #ffd000;
  font-weight: 700;
  cursor: pointer;
}
button:disabled { opacity: .7; cursor: not-allowed; }
.error { color: #b91c1c; }
.ok { color: #166534; }
</style>
