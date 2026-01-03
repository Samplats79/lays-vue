<template>
  <div class="page">
    <div class="card">
      <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />

      <h1>Create account</h1>
      <p class="subtitle">Maak een account aan om jouw chips bag te maken en te saven.</p>

      <label>Name</label>
      <input v-model.trim="name" type="text" placeholder="Your name" autocomplete="name" />

      <label>Email</label>
      <input v-model.trim="email" type="email" placeholder="you@email.com" autocomplete="username" />

      <label>Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="Min. 6 tekens"
        autocomplete="new-password"
      />

      <button class="btn solid" @click="register" :disabled="loading || !name || !email || !password">
        <span v-if="loading" class="spinner"></span>
        {{ loading ? "Bezig..." : "Create account" }}
      </button>

      <p v-if="error" class="msg error">{{ error }}</p>
      <p v-if="ok" class="msg ok">{{ ok }}</p>

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
    async register() {
      this.error = "";
      this.ok = "";
      this.loading = true;

      try {
        const API = import.meta.env.VITE_API_URL;
        if (!API) throw new Error("VITE_API_URL ontbreekt in .env");

        const candidates = [
          { url: `${API}/api/v1/user/register`, body: { name: this.name, email: this.email, password: this.password } },
          { url: `${API}/api/v1/user/signup`, body: { name: this.name, email: this.email, password: this.password } },
        ];

        let res = null;
        let data = null;

        for (const c of candidates) {
          res = await fetch(c.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(c.body),
          });

          data = await res.json().catch(() => ({}));

          if (res.ok) break;

          if (res.status !== 404) break;
        }

        if (!res.ok) {
          this.error = data?.message || `Account aanmaken mislukt (${res.status})`;
          return;
        }

        if (data?.token) {
          localStorage.setItem("token", data.token);
          this.ok = "Account gemaakt ✓ Je bent ingelogd.";
          this.$router.push("/configurator");
          return;
        }

        this.ok = "Account gemaakt ✓ Je kan nu inloggen.";
        this.$router.push("/login");
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
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f;
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
  padding: 14px 16px;
  border-radius: 999px;
  font-weight: 900;
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
  font-weight: 900;
  text-align: center;
}

.error { color: #b10f0f; }
.ok { color: #166534; }

.switch {
  margin-top: 6px;
  text-align: center;
  font-weight: 800;
  color: rgba(0,0,0,.65);
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
