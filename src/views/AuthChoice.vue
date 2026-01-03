<template>
  <main class="page">
    <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />

    <h1>Create your bag</h1>
    <p class="subtitle">
      Log in of maak een account om jouw chips bag te ontwerpen.
    </p>

    <div class="actions">
      <router-link to="/login" class="btn solid">
        Ik heb al een account
      </router-link>

      <router-link to="/register" class="btn outline">
        Nieuw account maken
      </router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: "AuthChoiceView",
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
  font-family: 'Poppins', system-ui, sans-serif;
}

.logo {
  width: 160px;
  margin-bottom: 24px;
}

h1 {
  font-size: 40px;
  font-weight: 900;
  color: #b10f0f;
}

.subtitle {
  max-width: 420px;
  font-weight: 600;
  color: rgba(0,0,0,.7);
  margin-bottom: 28px;
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 14px 26px;
  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
}

.btn.outline {
  background: rgba(255,255,255,.9);
  color: #b10f0f;
  border: 2px solid #b10f0f;
}
</style>
