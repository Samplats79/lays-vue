<template>
  <div class="page">
    <div class="card">
      <h1>Login</h1>

      <label>Email</label>
      <input v-model="email" type="email" />

      <label>Password</label>
      <input v-model="password" type="password" />

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
    buildAuthUrl() {
      // env bv:
      // 1) https://lays-api-yvwa.onrender.com
      // 2) https://lays-api-yvwa.onrender.com/api/v1
      const raw = import.meta.env.VITE_API_URL || "";
      const base = raw.replace(/\/+$/, ""); // trailing slashes weg

      // als base al eindigt op /api/v1 => plak alleen /user/auth
      if (base.endsWith("/api/v1")) return `${base}/user/auth`;

      // anders => voeg /api/v1 toe
      return `${base}/api/v1/user/auth`;
    },

    async login() {
      this.error = "";
      this.ok = "";
      this.loading = true;

      try {
        const url = this.buildAuthUrl();

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error = `Login mislukt (${res.status})`;
          this.loading = false;
          return;
        }

        if (!data.token) {
          this.error = "Login OK maar geen token ontvangen";
          this.loading = false;
          return;
        }

        localStorage.setItem("token", data.token);
        this.ok = "Login OK – token opgeslagen";
        this.loading = false;
      } catch (e) {
        this.error = "API niet bereikbaar";
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
}
.card {
  width: 360px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: grid;
  gap: 10px;
}
button {
  padding: 12px;
  border-radius: 12px;
  border: 0;
  background: #ffd000;
  font-weight: 700;
  cursor: pointer;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.error {
  color: #b91c1c;
}
.ok {
  color: #166534;
}
</style>
