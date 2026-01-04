<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />

        <h1>Community</h1>
        <p class="subtitle">Bekijk community bags en stem op je favorieten.</p>

        <div class="actions">
          <router-link class="btn outline" to="/">← Home</router-link>
          <router-link class="btn solid" to="/login">Create my own bag</router-link>
          <button class="btn outline" type="button" @click="loadBags" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </header>

      <section class="card">
        <p v-if="error" class="msg error">{{ error }}</p>

        <div v-if="loading" class="loadingBox">
          <p>Even laden...</p>
        </div>

        <div v-if="!loading && bags.length === 0 && !error" class="empty">
          <p>Nog geen community bags.</p>
        </div>

        <div v-if="bags.length > 0" class="grid">
          <article v-for="bag in bags" :key="bag._id" class="bag">
            <div class="preview">
              <img
                v-if="bag.image"
                :src="bag.image"
                alt="Bag preview"
                class="previewImg"
              />
              <div v-else class="noPreview">No preview</div>
            </div>

            <div class="info">
              <div class="creator">
                by <b>{{ bag.name || "anonymous" }}</b>
              </div>

              <div class="bottom">
                <button
                  class="btn solid small"
                  type="button"
                  @click="vote(bag)"
                  :disabled="votingId === bag._id"
                >
                  ❤️ Vote
                </button>

                <div class="votes">
                  {{ bag.votes ?? 0 }}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: "CommunityView",
  data() {
    return {
      bags: [],
      loading: false,
      error: "",
      votingId: "",
      token: localStorage.getItem("token") || "",
    };
  },
  mounted() {
    this.loadBags();
  },
  methods: {
    normalizeBase(url) {
      return (url || "").trim().replace(/\/+$/, "");
    },
    async loadBags() {
      this.loading = true;
      this.error = "";

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        const res = await fetch(`${API}/bag`);
        const data = await res.json();
        this.bags = Array.isArray(data) ? data : [];
      } catch {
        this.error = "Kon community bags niet laden.";
      } finally {
        this.loading = false;
      }
    },
    async vote(bag) {
      this.votingId = bag._id;
      this.error = "";

      try {
        const API = this.normalizeBase(import.meta.env.VITE_API_URL);
        const res = await fetch(`${API}/bag/${bag._id}/vote`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        this.bags = this.bags.map((b) =>
          b._id === bag._id ? { ...b, votes: data.votes } : b
        );
      } catch {
        this.error = "Vote failed.";
      } finally {
        this.votingId = "";
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28px 18px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
  font-family: "Poppins", system-ui, Arial, sans-serif;
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.top {
  text-align: center;
  margin-bottom: 18px;
}

.logo {
  width: 140px;
  margin: 0 auto 8px;
  display: block;
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  color: #b10f0f;
}

.subtitle {
  margin: 6px 0 14px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 900;
  border: 2px solid transparent;
  cursor: pointer;
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
}

.btn.outline {
  background: #fff;
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.6);
}

.btn.small {
  padding: 8px 14px;
  font-size: 14px;
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22px;
  padding: 22px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.bag {
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.preview {
  height: 260px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.previewImg {
  max-height: 220px;
  max-width: 100%;
  object-fit: contain;
}

.noPreview {
  font-weight: 800;
  opacity: 0.5;
}

.info {
  padding: 14px 16px;
}

.creator {
  font-weight: 900;
  margin-bottom: 10px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.votes {
  font-weight: 900;
  font-size: 18px;
}

.error {
  text-align: center;
  font-weight: 900;
  color: #b10f0f;
}

.loadingBox,
.empty {
  text-align: center;
  font-weight: 800;
}
</style>
