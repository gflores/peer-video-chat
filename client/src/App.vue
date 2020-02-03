<template>
    <PlayClient :roomId="roomId" :isMicRequired="isMicRequired" class="silverchat-widget"/>
</template>

<script>
import './components/index.js';
import PlayClient from './pages/ClientWidget';

export default {
    components: {
        PlayClient
    },
    props: ['roomId', 'isMicRequired']
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
            opacity: 0.88;
        }
    }
</style>
