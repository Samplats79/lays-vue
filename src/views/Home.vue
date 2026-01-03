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
  main{
      font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;

  }

.page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
  text-align: center;

  margin: 0;
  padding: 0;
}

.logo {
  width: 180px;
  margin-bottom: 32px;
}

h1 {
  font-size: 45px;
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
}

.btn {
  padding: 14px 26px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #d71920;
  color: #fff;
}

.btn.primary:hover {
  background: #b3151a;
}

.btn.outline {
  border: 2px solid #d71920;
  color: #d71920;
  background: transparent;
}

.btn.outline:hover {
  background: #d71920;
  color: #fff;
}
</style>
