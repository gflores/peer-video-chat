<template>
    <router-view/>
</template>

<script>
import './components/index.js';

export default {
    
}
</script>

<style lang="scss">
    body, html {
        margin: 0;
        padding: 0;
        font-family: 'Source Sans Pro', sans-serif;
        color: #26292c;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    button {
        &:hover {
            cursor: pointer;
        }
    }
</style>
