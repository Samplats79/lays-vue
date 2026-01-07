<template>
  <div class="page">
    <div class="card">
      <img class="logo" src="@@/assets/laysLogo.png" alt="Lay's" />

      <h1>Create account</h1>
      <p class="subtitle">Maak een account aan om jouw chips bag te maken en te saven.</p>

      <label>Name</label>
      <input v-model.trim="name" type="text" placeholder="Jouw naam" />

      <label>Email</label>
      <input v-model.trim="email" type="email" autocomplete="username" placeholder="jij@email.com" />

      <label>Password</label>
      <input v-model="password" type="password" autocomplete="new-password" placeholder="••••••••" />

      <button class="btn solid" @click="register" :disabled="loading || !name || !email || !password">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? "Bezig..." : "Create account" }}
      </button>

      <p v-if="error" class="msg error">{{ error }}</p>
      <p v-if="ok" class="msg ok">{{ ok }}</p>

      <div class="actions">
        <router-link to="/" class="btn outline">← Home</router-link>
        <router-link to="/login" class="btn outline">Log in</router-link>
      </div>

      <p class="switch">
        Heb je al een account?
        <router-link class="link" to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      loading: false,
      error: "",
      ok: "",
    };
  },
  methods: {
    normalizeBase(url) {
      return (url || "").trim().replace(/\/+$/, "");
    },
    async register() {
      this.error = "";
      this.ok = "";
      this.loading = true;

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");

        const res = await fetch(`${API}/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error = data?.message || `Account aanmaken mislukt (${res.status})`;
          return;
        }

        this.ok = "Account aangemaakt! Je kan nu inloggen.";
        setTimeout(() => {
          this.$router.push("/login");
        }, 700);
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
  font-family: "Poppins", system-ui, Avenir, Helvetica, Arial, sans-serif;
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
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.15));
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f;
  text-align: center;
}

.subtitle {
  margin: -6px 0 8px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 600;
}

label {
  font-weight: 800;
  color: rgba(0, 0, 0, 0.8);
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
  padding: 14px 16px;
  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.08s ease, filter 0.2s ease, opacity 0.2s ease;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.msg {
  margin-top: 6px;
  font-weight: 900;
  text-align: center;
}

.error {
  color: #b10f0f;
}

.ok {
  color: #166534;
}

.actions {
  margin-top: 8px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.switch {
  margin-top: 6px;
  text-align: center;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.65);
}

.link {
  color: #b10f0f;
  text-decoration: none;
  font-weight: 900;
}

.link:hover {
  text-decoration: underline;
}
</style>
