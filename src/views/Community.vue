<template>
  <main class="page">
    <header class="header">
      <h1>Community</h1>
      <p class="sub">Bekijk inzendingen en vote op je favorieten (komt in de volgende stappen).</p>

      <div class="actions">
        <a class="btn" href="/" >← Terug naar Home</a>
        <a class="btn primary" href="/login">Login</a>
      </div>
    </header>

    <section class="grid">
      <article v-for="n in 6" :key="n" class="card">
        <div class="thumb">Preview</div>
        <div class="meta">
          <strong>Chipsbag #{{ n }}</strong>
          <span class="likes">❤️ 0</span>
        </div>
        <button class="vote" disabled>Vote (volgende stap)</button>
      </article>
    </section>
  </main>
</template>

<script>
export default {
  name: "CommunityView",
};
</script>

<style scoped>
.page { max-width: 1000px; margin: 40px auto; padding: 0 16px; font-family: Arial; }
.header { display: grid; gap: 10px; margin-bottom: 18px; }
.sub { color: rgba(0,0,0,.65); }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.btn {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.12);
  text-decoration: none;
  color: #111;
  background: #fff;
}
.btn.primary { background: #ffd000; border-color: transparent; font-weight: 800; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.card {
  border: 1px solid rgba(0,0,0,.10);
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
  display: grid;
  gap: 10px;
}
.thumb {
  height: 160px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffe27a, #fff4c7);
  display: grid;
  place-items: center;
  font-weight: 800;
}
.meta { display: flex; justify-content: space-between; align-items: center; }
.likes { color: rgba(0,0,0,.65); font-weight: 700; }
.vote {
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  background: #111;
  color: #fff;
  font-weight: 800;
  opacity: .5;
}
</style>
