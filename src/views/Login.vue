<template>
  <div class="page">
    <div class="card">
      <img class="logo" src="/src/assets/images/laysLogo.png" alt="Lay's" />

      <h1>Login</h1>
      <p class="subtitle">Log in om jouw chips bag te maken en te saven.</p>

      <label>Email</label>
      <input v-model.trim="email" type="email" autocomplete="username" placeholder="admin@admin.com" />

      <label>Password</label>
      <input v-model="password" type="password" autocomplete="current-password" placeholder="••••••••" />

      <button class="btn" @click="login" :disabled="loading || !email || !password">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? "Bezig..." : "Login" }}
      </button>

      <p v-if="error" class="msg error">{{ error }}</p>
      <p v-if="ok" class="msg ok">{{ ok }}</p>
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
        const API = import.meta.env.VITE_API_URL; // => https://lays-api-yvwa.onrender.com
        const THREE = import.meta.env.VITE_THREE_URL; // => https://lays-threejs.vercel.app

        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");
        if (!THREE) throw new Error("VITE_THREE_URL ontbreekt in .env");

        const res = await fetch(`${API}/api/v1/user/auth`, {
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

        if (!data?.token) {
          this.error = "Geen token gekregen van API";
          return;
        }

        localStorage.setItem("token", data.token);
        this.ok = "Login OK – token opgeslagen";

        window.location.href = `${THREE}?token=${encodeURIComponent(data.token)}`;
      } catch (e) {
        this.error = e?.message || "API niet bereikbaar";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
}

.card {
  width: min(460px, 100%);
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(203, 36, 36, 0.15);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  display: grid;
  gap: 12px;
}

.logo {
  width: 150px;
  margin: 0 auto 6px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.15));
}

h1 {
  margin: 0;
  font-size: 44px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f; /* Lay’s red vibe */
  text-align: center;
}

.subtitle {
  margin: -6px 0 8px;
  text-align: center;
  color: rgba(0,0,0,.65);
  font-weight: 600;
}

label {
  font-weight: 800;
  color: rgba(0,0,0,.8);
}

input {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  outline: none;
  background: #fff;
  font-weight: 600;
  transition: box-shadow 0.2s, border-color 0.2s;
}

input:focus {
  border-color: rgba(203, 36, 36, 0.35);
  box-shadow: 0 0 0 4px rgba(203, 36, 36, 0.12);
}

.btn {
  margin-top: 6px;
  padding: 14px 16px;
  border-radius: 999px;
  border: 2px solid #b10f0f;
  background: #b10f0f;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.08s ease, filter 0.2s ease, opacity 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn:hover {
  filter: brightness(1.05);
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.msg {
  margin-top: 6px;
  font-weight: 800;
  text-align: center;
}

.error {
  color: #b10f0f;
}

.ok {
  color: #166534;
}
</style>
