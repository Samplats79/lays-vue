<script setup>
defineProps({
  bag: Object
});
</script>

<template>
  <li style="margin: 16px 0;">
    <strong>{{ bag.name }}</strong>
    <div style="font-size: 14px; opacity: 0.7;">
      Color: {{ bag.bagColor }} •
      Pattern: {{ bag.pattern }} •
      Packaging: {{ bag.packaging }}
    </div>
  </li>
</template>
