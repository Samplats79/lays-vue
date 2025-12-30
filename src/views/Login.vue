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
    async login() {
      this.error = "";
      this.ok = "";
      this.loading = true;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          this.error = data?.message || "Login mislukt";
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
  border: 1px solid rgba(0,0,0,.1);
  display: grid;
  gap: 10px;
}
button {
  padding: 12px;
  border-radius: 12px;
  border: 0;
  background: #ffd000;
  font-weight: 700;
}
.error { color: #b91c1c; }
.ok { color: #166534; }
</style>
