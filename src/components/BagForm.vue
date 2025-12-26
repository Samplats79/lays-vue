<script setup>
import { ref } from "vue";
import BagPreview from "./BagPreview.vue";

const emit = defineEmits(["created"]);

const API_URL = import.meta.env.VITE_API_URL;

// form state
const name = ref("");
const bagColor = ref("yellow");
const pattern = ref("dots");
const font = ref("bold");

const loading = ref(false);
const error = ref("");

const submit = async () => {
  error.value = "";
  loading.value = true;

  try {
    const res = await fetch(`${API_URL}/bag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        bagColor: bagColor.value,
        pattern: pattern.value,
        font: font.value,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create bag");
    }

    // reset form
    name.value = "";
    bagColor.value = "yellow";
    pattern.value = "dots";
    font.value = "bold";

    emit("created");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- ✅ LIVE PREVIEW -->
  <BagPreview
    :name="name"
    :bagColor="bagColor"
    :pattern="pattern"
    :font="font"
  />

  <section style="max-width: 520px; margin: 0 auto 30px;">
    <h2 style="text-align:center;">Nieuwe bag toevoegen</h2>

    <form @submit.prevent="submit" style="display:grid; gap: 10px;">
      <input
        v-model="name"
        type="text"
        placeholder="Naam (bv. My Lays Bag)"
        required
        style="padding: 10px;"
      />

      <select v-model="bagColor" style="padding: 10px;">
        <option value="yellow">yellow</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
      </select>

      <select v-model="pattern" style="padding: 10px;">
        <option value="dots">dots</option>
        <option value="stripes">stripes</option>
        <option value="plain">plain</option>
      </select>

      <select v-model="font" style="padding: 10px;">
        <option value="bold">bold</option>
        <option value="regular">regular</option>
        <option value="italic">italic</option>
      </select>

      <button :disabled="loading" style="padding: 10px; cursor:pointer;">
        {{ loading ? "Saving..." : "Add Bag" }}
      </button>

      <p v-if="error" style="color:red; text-align:center;">
        {{ error }}
      </p>
    </form>
  </section>
</template>
