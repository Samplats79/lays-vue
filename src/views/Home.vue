<template>
  <div class="page">
    <header class="hero">
      <div class="logoRow">
        <div class="dot"></div>
        <span class="brand">Lay’s Lab</span>
      </div>

      <h1>Create Your Perfect Chips Bag</h1>
      <p class="subtitle">
        Ontwerp je eigen Lay’s verpakking of bekijk & vote op designs van anderen.
      </p>
    </header>

    <main class="grid">
      <!-- Card 1: Create -->
      <section class="card">
        <div class="badge">Create</div>
        <h2>Maak jouw eigen chipszak</h2>
        <p>
          Log in en start de configurator. Kies kleur, font en naam en sla je design op.
        </p>

        <button class="btn" @click="goLogin">
          Start configurator
        </button>

        <p class="hint">
          Je gaat eerst naar login. Daarna sturen we je door naar de threejs configurator.
        </p>
      </section>

      <!-- Card 2: Vote -->
      <section class="card">
        <div class="badge red">Vote</div>
        <h2>Bekijk designs & vote</h2>
        <p>
          Zie wat anderen gemaakt hebben en geef je stem. Top designs komen bovenaan.
        </p>

        <button class="btn outline" @click="goCommunity">
          Ga naar community
        </button>

        <p class="hint">
          (Volgende stap maken we een “Votes/Community” page. Nu is dit nog een placeholder route.)
        </p>
      </section>
    </main>

    <footer class="footer">
      <span>© {{ new Date().getFullYear() }} Lay’s Lab</span>
      <span class="sep">•</span>
      <a class="link" :href="threeUrl" target="_blank" rel="noreferrer">Open configurator</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  computed: {
    threeUrl() {
      return import.meta.env.VITE_THREE_URL || "https://lays-threejs.vercel.app";
    },
  },
  methods: {
    goLogin() {
      // Router gaan we in stap 2 linken.
      // Voor nu sturen we je naar /login (als die al bestaat)
      window.location.href = "/login";
    },
    goCommunity() {
      // Placeholder route (maken we later)
      window.location.href = "/community";
    },
  },
};
</script>

<style scoped>
:root {
  --yellow: #ffd000;
  --red: #e10600;
  --text: #1f2937;
  --muted: #6b7280;
  --bg: #ffffff;
  --card: #ffffff;
}

.page {
  min-height: 100vh;
  background:
    radial-gradient(1200px 600px at 50% -20%, rgba(255, 208, 0, 0.35), transparent 60%),
    radial-gradient(900px 500px at 110% 30%, rgba(225, 6, 0, 0.12), transparent 60%),
    var(--bg);
  color: var(--text);
  padding: 48px 18px 28px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.hero {
  max-width: 980px;
  margin: 0 auto 26px;
  text-align: center;
}

.logoRow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 208, 0, 0.18);
  border: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 14px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--red);
  box-shadow: 0 0 0 4px rgba(225, 6, 0, 0.12);
}

.brand {
  font-weight: 800;
  letter-spacing: 0.2px;
}

h1 {
  font-size: clamp(34px, 5vw, 54px);
  margin: 0 0 10px;
  font-weight: 900;
}

.subtitle {
  max-width: 720px;
  margin: 0 auto;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.5;
}

.grid {
  max-width: 980px;
  margin: 22px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--card);
  border-radius: 22px;
  padding: 22px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 20px 45px rgba(0,0,0,0.08);
  display: grid;
  gap: 10px;
}

.badge {
  justify-self: start;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  background: rgba(255, 208, 0, 0.22);
  border: 1px solid rgba(255, 208, 0, 0.45);
}

.badge.red {
  background: rgba(225, 6, 0, 0.10);
  border: 1px solid rgba(225, 6, 0, 0.22);
}

h2 {
  margin: 4px 0 0;
  font-size: 22px;
  font-weight: 900;
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.btn {
  margin-top: 10px;
  padding: 14px 18px;
  border-radius: 999px;
  border: 0;
  background: var(--yellow);
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.12s ease;
  box-shadow: 0 14px 26px rgba(255, 208, 0, 0.25);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0px);
}

.btn.outline {
  background: transparent;
  border: 2px solid rgba(0,0,0,0.12);
  box-shadow: none;
}

.hint {
  font-size: 12px;
  color: rgba(107, 114, 128, 0.9);
  margin-top: 2px;
}

.footer {
  max-width: 980px;
  margin: 22px auto 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  color: rgba(107, 114, 128, 0.9);
  font-size: 13px;
  align-items: center;
  flex-wrap: wrap;
}

.sep {
  opacity: 0.5;
}

.link {
  color: rgba(31, 41, 55, 0.9);
  font-weight: 800;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
