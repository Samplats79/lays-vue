<script setup>
import BagForm from "./components/BagForm.vue";
import { ref, onMounted } from "vue";
import BagCard from "./components/BagCard.vue";

const bags = ref([]);
const error = ref("");
const loading = ref(false);

const API_URL = import.meta.env.VITE_API_URL;

const loadBags = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(`${API_URL}/bag`);
    if (!res.ok) throw new Error("Failed to fetch bags");
    bags.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBags();
});
</script>

<template>
  <main style="max-width: 900px; margin: 80px auto; font-family: Arial;">
    <h1 style="text-align:center;">Lays Bags</h1>

    <BagForm @created="loadBags" />


    <div style="display:flex; justify-content:center; margin: 20px 0;">
      <button
        @click="loadBags"
        :disabled="loading"
        style="padding: 10px 16px; cursor:pointer;"
      >
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <p v-if="error" style="color:red; text-align:center;">
      {{ error }}
    </p>

    <p v-else-if="loading" style="text-align:center;">
      Bags ophalen...
    </p>

    <ul v-else>
      <BagCard v-for="bag in bags" :key="bag._id" :bag="bag" />
    </ul>
  </main>
</template>
