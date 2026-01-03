<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="/src/assets/images/laysLogo.png" alt="Lay's" />

        <h1>Community</h1>
        <p class="subtitle">Bekijk community bags en stem op je favorieten.</p>

        <div class="actions">
          <router-link class="btn outline" to="/">← Home</router-link>
          <router-link class="btn solid" to="/configurator">Create my own bag</router-link>
        </div>
      </header>

      <section class="card">
        <div class="wip">
          <h2>Work in progress…</h2>
          <p>Hier komen straks de bags + votes (grid + like knop).</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "CommunityView",
};
</script>

<style scoped>
.page {
  font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  padding: 28px 18px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
}

.wrap {
  max-width: 1000px;
  margin: 0 auto;
}

.top {
  text-align: center;
  margin: 18px 0 18px;
}

.logo {
  width: 140px;
  margin: 0 auto 10px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.15));
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f;
}

.subtitle {
  margin: 6px 0 14px;
  color: rgba(0,0,0,.7);
  font-weight: 600;
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
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
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
  background: rgba(255,255,255,.85);
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.7);
}

.btn.outline:hover {
  filter: brightness(1.03);
}

.card {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(203, 36, 36, 0.15);
  box-shadow: 0 18px 40px rgba(0,0,0,.12);
  padding: 22px;
}

.wip {
  text-align: center;
  padding: 18px 10px;
}

.wip h2 {
  margin: 0 0 6px;
  color: rgba(0,0,0,.85);
  font-weight: 900;
}

.wip p {
  margin: 0;
  color: rgba(0,0,0,.65);
  font-weight: 600;
}
</style>
