<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  bagColor: { type: String, default: "yellow" },
  pattern: { type: String, default: "dots" },
  font: { type: String, default: "bold" },
});

const colorMap = {
  yellow: ["#FFE26B", "#FFD000"],
  red: ["#FF6B6B", "#E11D48"],
  blue: ["#60A5FA", "#2563EB"],
  green: ["#86EFAC", "#16A34A"],
};

const title = computed(() =>
  props.name?.trim() ? props.name.trim() : "My Lays Bag"
);

const fontStyle = computed(() => {
  if (props.font === "italic") return { fontStyle: "italic", fontWeight: 600 };
  if (props.font === "regular") return { fontStyle: "normal", fontWeight: 500 };
  return { fontStyle: "normal", fontWeight: 800 }; // bold
});

const bagStyle = computed(() => {
  const [c1, c2] = colorMap[props.bagColor] || colorMap.yellow;

  let patternBg = "none";
  if (props.pattern === "dots") {
    patternBg =
      "radial-gradient(rgba(255,255,255,0.55) 2px, transparent 3px)";
  } else if (props.pattern === "stripes") {
    patternBg =
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 10px, rgba(255,255,255,0) 10px 20px)";
  }

  return {
    backgroundImage:
      patternBg === "none"
        ? `linear-gradient(180deg, ${c1}, ${c2})`
        : `${patternBg}, linear-gradient(180deg, ${c1}, ${c2})`,
    backgroundSize: patternBg === "none" ? "cover" : "28px 28px, cover",
    backgroundPosition: "center",
  };
});
</script>

<template>
  <section class="wrap">
    <h2 class="h2">Preview</h2>

    <div class="bag" :style="bagStyle">
      <div class="bag-top"></div>
      <div class="bag-shine"></div>

      <!-- small “flavor” tag (niet packaging, gewoon decoratief) -->
      <div class="badge">{{ pattern.toUpperCase() }}</div>

      <div class="brand">
        <div class="brand-small">LAYS</div>
        <div class="brand-name" :style="fontStyle">{{ title }}</div>
      </div>

      <div class="bag-bottom"></div>
    </div>
  </section>
</template>

<style scoped>
.wrap {
  max-width: 520px;
  margin: 0 auto 18px;
}
.h2 {
  text-align: center;
  margin: 0 0 10px;
}
.bag {
  position: relative;
  height: 260px;
  border-radius: 26px 26px 44px 44px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* “seams” boven/onder */
.bag-top,
.bag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 18px;
  background: rgba(0, 0, 0, 0.08);
}
.bag-top {
  top: 0;
}
.bag-bottom {
  bottom: 0;
}

/* shine */
.bag-shine {
  position: absolute;
  top: -40px;
  left: -60px;
  width: 220px;
  height: 360px;
  transform: rotate(18deg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.38),
    rgba(255, 255, 255, 0)
  );
  opacity: 0.7;
}

.badge {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.86);
  color: rgba(0, 0, 0, 0.75);
}

.brand {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 36px;
  padding: 14px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.brand-small {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  opacity: 0.7;
  margin-bottom: 6px;
}

.brand-name {
  font-size: 22px;
  line-height: 1.1;
  color: rgba(0, 0, 0, 0.78);
}
</style>
