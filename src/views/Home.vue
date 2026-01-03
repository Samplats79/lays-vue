<template>
  <main class="page">
    <img
      src="@/assets/images/laysLogo.png"
      alt="Lay's logo"
      class="logo"
    />

    <h1>Create your perfect chips bag</h1>

    <p class="subtitle">
      Design your own Lays bag or discover what others created
    </p>

    <div class="actions">
      <router-link to="/login" class="btn primary">
        Create my own bag
      </router-link>

      <router-link to="/community" class="btn outline">
        View community bags
      </router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
  text-align: center;
  padding: 24px;
  font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.logo {
  width: 180px;
  margin-bottom: 32px;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  color: #d71920;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #333;
  max-width: 420px;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #d71920;
  color: #fff;
  border: 2px solid #d71920;
}

.btn.primary:hover {
  filter: brightness(1.05);
}

.btn.outline {
  background: rgba(255, 255, 255, 0.95);
  color: #b10f0f;
  border: 2px solid #b10f0f;
  border-color: rgba(177, 15, 15, 0.7);

}

.btn.outline:hover {
  background: #fff;
  filter: brightness(1.02);
}
</style>
