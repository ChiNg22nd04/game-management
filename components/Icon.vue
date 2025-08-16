<template>
    <FontAwesomeIcon :icon="icon" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

type IconPrefix = "fas" | "far" | "fab";

interface Props {
    name: string;
    prefix?: IconPrefix;
}

const props = defineProps<Props>();

const icon = computed(() => [props.prefix || "fas", props.name]);
</script>
