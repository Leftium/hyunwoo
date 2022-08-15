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

        let minLat = Infinity;
        let minLng = Infinity;
        let maxLat = -Infinity;
        let maxLng = -Infinity;

        for (const d of data) {
            const position = new naver.maps.LatLng(d.position.lat, d.position.lng);

            minLat = Math.min(minLat, d.position.lat);
            minLng = Math.min(minLng, d.position.lng);
            maxLat = Math.max(maxLat, d.position.lat);
            maxLng = Math.max(maxLng, d.position.lng);


            const marker = new naver.maps.Marker({
                map,
                position,
                zIndex: 100
            });

            let infoContent = '';
            for (const detail in d.info) {
                if (detail[0] != '_') {
                    infoContent += `<b>${detail}:</b> ${d.info[detail]} <br />`
                }
                if (detail == '_Slide Url') {
                    infoContent += `<center><a href="${d.info[detail]}" target=_blank>자세한 정보</a></center>`
                }

            }

            const infoWindow = new naver.maps.InfoWindow({
                content: `<div class=info-content style="padding: 8px;">
                              ${infoContent}
                          </div>`
            });

            markers.push(marker);
            infoWindows.push(infoWindow);
        }
        map.fitBounds(new naver.maps.LatLngBounds(
            new naver.maps.LatLng(minLat, minLng),
            new naver.maps.LatLng(maxLat, maxLng)
        ))

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
