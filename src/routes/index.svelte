<script context=module lang=ts>
    declare const naver: any;
</script>

<script lang=ts>
    import { onMount } from 'svelte';

    import {PUBLIC_NAVER_MAPS_CLIENT_ID} from '$env/static/public';


    onMount(() => {
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 10
        };

        const map = new naver.maps.Map('map', mapOptions);
    });

</script>

<svelte:head>
    <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId={PUBLIC_NAVER_MAPS_CLIENT_ID}"></script>
</svelte:head>


<div id=map />

<style>
    :global(html, body),
    :global(body > div:first-child ) {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    #map {
        width: 100%;
        height: 100%;

        background-color: #2aa198;
        padding: 0;
    }
</style>
