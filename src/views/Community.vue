<template>
  <main class="page">
    <header class="top">
      <h1>Community</h1>
      <p>Hier komen straks de bags + votes.</p>
    </header>

    <section class="card">
      <p>Work in progress…</p>
    </section>
  </main>
</template>

<script>
export default {
  name: "CommunityView",
};
</script>

<style scoped>
.page {
  max-width: 1000px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}
.top {
  margin-bottom: 18px;
}
.card {
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 18px;
  padding: 18px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(0,0,0,.06);
}
</style>
