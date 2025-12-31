<template>
  <div class="page">
    <div class="card">
      <h1>Login</h1>

      <label>Email</label>
      <input v-model.trim="email" type="email" autocomplete="username" />

      <label>Password</label>
      <input v-model.trim="password" type="password" autocomplete="current-password" />

      <button @click="login" :disabled="loading || !email || !password">
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
      email: "admin@admin.com",
      password: "Admin",
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

      try {
        // .env => VITE_API_URL=https://lays-api-yvwa.onrender.com/api/v1
        const API = import.meta.env.VITE_API_URL;

        // ✅ BELANGRIJK: NIET /api/v1 nog eens toevoegen
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
          return;
        }

        const token = data?.token || data?.accessToken;
        if (!token) {
          this.error = "Geen token ontvangen van API";
          return;
        }

        localStorage.setItem("token", token);
        this.ok = "Login OK – token opgeslagen";

        // Redirect naar ThreeJS en token meegeven in query
        const THREE = import.meta.env.VITE_THREE_URL; // bv: https://lays-threejs.vercel.app
        window.location.href = `${THREE}?token=${encodeURIComponent(token)}`;
      } catch (e) {
        this.error = "API niet bereikbaar";
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
  background: #fff;
  padding: 24px;
}
.card {
  width: min(420px, 100%);
  padding: 28px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,.1);
  display: grid;
  gap: 12px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
}
h1 { font-size: 44px; margin-bottom: 8px; }
label { font-weight: 700; }
input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.2);
  outline: none;
}
button {
  margin-top: 6px;
  padding: 14px;
  border-radius: 14px;
  border: 0;
  background: #ffd000;
  font-weight: 800;
  cursor: pointer;
}
button:disabled { opacity: .6; cursor: not-allowed; }
.error { color: #b91c1c; font-weight: 700; }
.ok { color: #166534; font-weight: 700; }
</style>
