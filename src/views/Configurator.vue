<template>
  <div class="page">
    <div class="card">
      <h1>Configurator</h1>
      <p>
        De 3D configurator staat in een aparte Three.js app.
        Klik hieronder om de configurator te openen.
      </p>

      <a class="btn" :href="threeUrl" target="_blank" rel="noopener">
        Open 3D Configurator
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfiguratorView",
  data() {
    return {
      threeUrl: "https://lays-threejs.vercel.app/",
    };
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #fff;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
}
.card {
  width: min(520px, 92vw);
  padding: 24px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 0 18px 40px rgba(0,0,0,0.08);
  display: grid;
  gap: 12px;
}
h1 { margin: 0; }
p { margin: 0; opacity: .8; line-height: 1.4; }

.btn{
  display: inline-block;
  text-align: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffd000;
  color: #000;
  font-weight: 800;
  text-decoration: none;
}
</style>
