<template>
  <main class="page">
    <div class="wrap">
      <header class="top">
        <img class="logo" src="@/assets/images/laysLogo.png" alt="Lay's" />

        <h1>Community</h1>
        <p class="subtitle">Bekijk community bags en stem op je favorieten.</p>

        <div class="actions">
          <router-link class="btn outline" to="/">← Home</router-link>
          <router-link class="btn solid" to="/configurator">Create my own bag</router-link>
        </div>
      </header>

      <section class="card">
        <div class="toolbar">
          <button class="btn small outline" @click="loadBags" :disabled="loading">
            {{ loading ? "Loading..." : "Refresh" }}
          </button>

          <div class="hint" v-if="!hasToken">
            Je bent niet ingelogd → votes kunnen mislukken als de API auth vereist.
          </div>
          <div class="hint ok" v-else>
            Token gevonden ✓ je kan voten.
          </div>
        </div>

        <p v-if="error" class="msg error">{{ error }}</p>

        <div v-if="loading" class="wip">
          <h2>Even laden…</h2>
          <p>We halen de community bags op.</p>
        </div>

        <div v-else-if="bags.length === 0" class="wip">
          <h2>Nog geen bags</h2>
          <p>Er staan nog geen opgeslagen chips bags in de database (of de endpoint klopt niet).</p>
        </div>

        <div v-else class="grid">
          <article v-for="bag in sortedBags" :key="bag._id || bag.id" class="bag">
            <div class="bagTop">
              <div class="badge">
                <span class="dot" :style="{ background: bag.color || '#d71920' }"></span>
                <span class="badgeText">{{ bag.color || "unknown color" }}</span>
              </div>

              <div class="votes">
                <span class="heart">♥</span>
                <span class="votesNum">{{ bag.votes ?? bag.likes ?? 0 }}</span>
              </div>
            </div>

            <h3 class="bagTitle">
              {{ bag.name || bag.title || "Unnamed bag" }}
            </h3>

            <p class="bagMeta">
              Font: <b>{{ bag.font || "default" }}</b>
              <span v-if="bag.flavour || bag.flavor"> • Flavour: <b>{{ bag.flavour || bag.flavor }}</b></span>
            </p>

            <div class="bagActions">
              <button
                class="btn solid"
                @click="vote(bag)"
                :disabled="votingId === (bag._id || bag.id)"
              >
                <span v-if="votingId === (bag._id || bag.id)" class="spinner"></span>
                {{ votingId === (bag._id || bag.id) ? "Voting..." : "Vote" }}
              </button>

              <button class="btn outline" @click="openBag(bag)">
                View
              </button>
            </div>
          </article>
        </div>

        <p class="smallNote">
          Tip: als votes 404 geven, stuur mij de exacte endpoint uit je backend of een screenshot van je Network tab,
          dan fixen we dat in 1 minuut.
        </p>
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
      votingId: null,
    };
  },
  computed: {
    hasToken() {
      return !!localStorage.getItem("token");
    },
    sortedBags() {
      // Sorteer op votes/likes (hoog naar laag)
      return [...this.bags].sort((a, b) => {
        const av = (a.votes ?? a.likes ?? 0);
        const bv = (b.votes ?? b.likes ?? 0);
        return bv - av;
      });
    },
  },
  mounted() {
    this.loadBags();
  },
  methods: {
    getApiBase() {
      // In jouw project is VITE_API_URL meestal: https://lays-api-yvwa.onrender.com
      const API = import.meta.env.VITE_API_URL;
      if (!API) throw new Error("VITE_API_URL ontbreekt in .env");
      return API;
    },

    async loadBags() {
      this.error = "";
      this.loading = true;

      try {
        const API = this.getApiBase();
        const token = localStorage.getItem("token");

        // Waarschijnlijk jouw list endpoint (je gebruikte POST naar /api/v1/bag eerder)
        const url = `${API}/api/v1/bag`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          this.error =
            data?.message ||
            `Bags ophalen mislukt (${res.status}). Check of GET ${url} bestaat.`;
          this.bags = [];
          return;
        }

        // data kan bv array zijn of {bags:[...]}
        const list = Array.isArray(data) ? data : (data.bags || data.data || []);
        this.bags = Array.isArray(list) ? list : [];
      } catch (e) {
        this.error = e?.message || "API niet bereikbaar";
        this.bags = [];
      } finally {
        this.loading = false;
      }
    },

    async vote(bag) {
      this.error = "";
      const id = bag._id || bag.id;
      if (!id) {
        this.error = "Bag heeft geen id (kan niet voten).";
        return;
      }

      const token = localStorage.getItem("token");
      const API = this.getApiBase();

      this.votingId = id;

      try {
        // We proberen 3 veel voorkomende endpoints (want we weten jouw exacte route nog niet)
        const endpoints = [
          { method: "POST", url: `${API}/api/v1/bag/${id}/vote`, body: null },
          { method: "POST", url: `${API}/api/v1/bag/${id}/like`, body: null },
          { method: "POST", url: `${API}/api/v1/vote`, body: { bagId: id } },
        ];

        let ok = false;
        let updatedBag = null;

        for (const ep of endpoints) {
          const res = await fetch(ep.url, {
            method: ep.method,
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: ep.body ? JSON.stringify(ep.body) : null,
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            ok = true;
            // data kan de bijgewerkte bag teruggeven
            updatedBag = data?.bag || data?.data || data;
            break;
          }

          // Als het geen 404 is (bv 401), stop meteen
          if (res.status !== 404) {
            this.error = data?.message || `Vote mislukt (${res.status})`;
            return;
          }
        }

        if (!ok) {
          this.error =
            "Vote endpoint niet gevonden (404). Stuur mij de juiste vote route van je backend, dan passen we het aan.";
          return;
        }

        // UI update
        this.bags = this.bags.map((b) => {
          const bid = b._id || b.id;
          if (bid !== id) return b;

          // Als backend updated bag teruggeeft -> gebruik die
          if (updatedBag && (updatedBag._id || updatedBag.id)) {
            return { ...b, ...updatedBag };
          }

          // Anders: optimistic increment
          const current = (b.votes ?? b.likes ?? 0);
          return { ...b, votes: current + 1 };
        });
      } catch (e) {
        this.error = e?.message || "Vote request faalde";
      } finally {
        this.votingId = null;
      }
    },

    openBag(bag) {
      // Voor nu simpel: toon info (later linken we naar ThreeJS viewer)
      const name = bag.name || bag.title || "Unnamed bag";
      const votes = bag.votes ?? bag.likes ?? 0;
      alert(`Bag: ${name}\nVotes: ${votes}`);
    },
  },
};
</script>

<style scoped>
.page {
  font-family: 'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  padding: 28px 18px;
  background: linear-gradient(180deg, #ffd400 0%, #fff2b3 100%);
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
}

.top {
  text-align: center;
  margin: 18px 0 18px;
}

.logo {
  width: 140px;
  margin: 0 auto 10px;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.15));
}

h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #b10f0f;
}

.subtitle {
  margin: 6px 0 14px;
  color: rgba(0,0,0,.7);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(203, 36, 36, 0.15);
  box-shadow: 0 18px 40px rgba(0,0,0,.12);
  padding: 22px;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.hint {
  font-weight: 800;
  color: rgba(0,0,0,.65);
  font-size: 13px;
}
.hint.ok {
  color: rgba(20, 90, 40, .85);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 950px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .grid { grid-template-columns: 1fr; }
}

.bag {
  background: rgba(255,255,255,.95);
  border: 2px solid rgba(203, 36, 36, 0.12);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 14px 26px rgba(0,0,0,.08);
  display: grid;
  gap: 10px;
}

.bagTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 244, 210, 0.9);
  border: 1px solid rgba(0,0,0,.08);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.7);
}

.badgeText {
  font-weight: 900;
  font-size: 13px;
  color: rgba(0,0,0,.75);
}

.votes {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 900;
  color: rgba(0,0,0,.75);
}

.heart {
  color: #b10f0f;
}

.bagTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: rgba(0,0,0,.85);
}

.bagMeta {
  margin: 0;
  color: rgba(0,0,0,.65);
  font-weight: 700;
  font-size: 14px;
}

.bagActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Buttons (zelfde theme als je andere pages) */
.btn {
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 900;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: transform 0.08s ease, filter 0.2s ease, opacity 0.2s ease;
  cursor: pointer;
}

.btn:active {
  transform: translateY(1px);
}

.btn.solid {
  background: #b10f0f;
  color: #fff;
  border-color: #b10f0f;
}

.btn.solid:hover {
  filter: brightness(1.05);
}

.btn.outline {
  background: rgba(255,255,255,.85);
  color: #b10f0f;
  border-color: rgba(177, 15, 15, 0.7);
}

.btn.outline:hover {
  filter: brightness(1.03);
}

.btn.small {
  padding: 10px 14px;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.wip {
  text-align: center;
  padding: 18px 10px;
}

.wip h2 {
  margin: 0 0 6px;
  color: rgba(0,0,0,.85);
  font-weight: 900;
}

.wip p {
  margin: 0;
  color: rgba(0,0,0,.65);
  font-weight: 600;
}

.msg {
  margin: 0 0 10px;
  font-weight: 900;
  text-align: center;
}

.msg.error {
  color: #b10f0f;
}

.smallNote {
  margin-top: 14px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(0,0,0,.55);
  text-align: center;
}
</style>
