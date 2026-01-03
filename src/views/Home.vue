<template>
  <div class="home">
    <img
      src="@/assets/images/laysLogo.png"
      alt="Lays logo"
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

      <router-link to="/community" class="btn secondary">
        View community bags
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home {
  font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd400 0%, #fff6c2 100%);
  text-align: center;
  padding: 24px;
}

.logo {
  width: 180px;
  margin-bottom: 24px;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  color: #d71920; /* Lays rood */
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  max-width: 420px;
  margin-bottom: 32px;
  color: #3a3a3a;
}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.primary {
  background: #d71920;
  color: white;
}

.secondary {
  background: white;
  color: #d71920;
  border: 2px solid #d71920;
}
</style>
