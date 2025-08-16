<template>
  <FontAwesomeIcon
    :icon="icon"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Không dùng interface/ type ngoài defineProps
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: "fas"
  }
})

const icon = computed(() => [props.prefix || "fas", props.name]);
</script>