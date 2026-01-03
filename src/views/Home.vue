<template>
  <main class="page">
    <header class="hero">
      <h1>Lays Lab</h1>
      <p>Maak je eigen chipszak of ontdek designs van anderen.</p>
    </header>

    <section class="actions">
      <button class="primary" @click="go('/login')">
        Login & maak je chipszak
      </button>

      <button class="secondary" @click="go('/community')">
        Bekijk designs & vote
      </button>
    </section>

    <p class="note">
      Tip: eerst login = token opslaan, daarna kan je naar de configurator (threejs).
    </p>
  </main>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    go(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  font-family: Arial, sans-serif;
  background: #fff;
}
.hero {
  width: min(900px, 100%);
  text-align: center;
  margin-bottom: 24px;
}
.hero h1 {
  font-size: 54px;
  margin: 0 0 10px 0;
}
.hero p {
  margin: 0;
  font-size: 18px;
  opacity: 0.75;
}
.actions {
  width: min(520px, 100%);
  display: grid;
  gap: 14px;
  margin: 18px 0 12px;
}
button {
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,.15);
  cursor: pointer;
  font-weight: 800;
  font-size: 16px;
}
.primary {
  background: #ffd000;
  border-color: #ffd000;
}
.secondary {
  background: #fff;
}
.note {
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
  max-width: 520px;
}
</style>
