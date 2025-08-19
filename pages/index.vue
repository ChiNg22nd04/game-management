<template>
    <div>
        <h1>Welcome to the Game Management</h1>
    </div>
</template>

<script setup>
import { navigateTo } from 'nuxt/app';
navigateTo('/games'); // Redirect to games page on load
</script>
