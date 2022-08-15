<script context=module lang=ts>
    declare const naver:any;
</script>

<script lang=ts>
    import { onMount } from 'svelte';

    import {PUBLIC_NAVER_MAPS_CLIENT_ID} from '$env/static/public';

    // Props from API;
    export let data:any;

    onMount(() => {
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 10
        };

        const map = new naver.maps.Map('map', mapOptions);

        let markers:any = [];
        let infoWindows:any = [];

        for (const d of data) {
            const position = new naver.maps.LatLng(d.position.lat, d.position.lng);

            const marker = new naver.maps.Marker({
                map,
                position,
                zIndex: 100
            });

            let infoContent = '';
            for (const detail in d.info) {
                infoContent += `<b>${detail}:</b> ${d.info[detail]} <br />`
            }

            const infoWindow = new naver.maps.InfoWindow({
                content: `<div style="width:150px;padding:10px;">
                              ${infoContent}
                          </div>`
            });

            markers.push(marker);
            infoWindows.push(infoWindow);
        }

        function showMarker(map:any, marker:any) {
            if (!marker.getMap()) {
                marker.setMap(map);
            }
        }

        function hideMarker(map:any, marker:any) {
            if (marker.getMap()) {
                marker.setMap(null);
            }
        }

        naver.maps.Event.addListener(map, 'idle', () => {
            const mapBounds = map.getBounds();

            for (const marker of markers) {
                const position = marker.getPosition();

                if (mapBounds.hasLatLng(position)) {
                    showMarker(map, marker);
                } else {
                    hideMarker(map, marker);
                }
            }

        })

        function createClickHandler(seq:number) {
            return () => {
                const marker = markers[seq];
                const infoWindow = infoWindows[seq];

                if (infoWindow.getMap()) {
                    infoWindow.close();
                } else {
                    infoWindow.open(map, marker);
                }
            }
        }

        markers.forEach((marker:any, index:number) => {
            naver.maps.Event.addListener(marker, 'click', createClickHandler(index));
        })
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
