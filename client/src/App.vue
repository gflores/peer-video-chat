<template>
    <PlayClient :roomId="roomId" class="silverchat-widget"/>
</template>

<script>
import './components/index.js';
import PlayClient from './pages/ClientWidget';

export default {
    components: {
        PlayClient
    },
    props: ['roomId']

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
</style>
