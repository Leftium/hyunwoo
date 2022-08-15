<script context=module lang=ts>
    declare const naver:any;
</script>

<script lang=ts>
    import { onMount } from 'svelte';

    import { Lightbox } from 'svelte-lightbox';

    import {PUBLIC_NAVER_MAPS_CLIENT_ID} from '$env/static/public';

    // Props from API;
    export let data:any;

    let url = '';
    let programmaticController: any;

    onMount(() => {
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 10
        };

        const COLORS = new Map(Object.entries({
                '준공': 'blue',
                '공사중': 'purple',
                '공급중': 'green',
                '공급예정': 'orange'
              }));

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

            const number = d.info['연번'];
            const color = COLORS.get(<string>d.info['구분']) || 'black';

            const marker = new naver.maps.Marker({
                map,
                position,
                zIndex: 100,
                icon: {
                    url: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_${color}${number}.png`
                }
            });

            let infoContent = '';
            for (const detail in d.info) {
                if (detail[0] != '_') {
                    infoContent += `<b>${detail}:</b> ${d.info[detail]} <br />`
                }
                if (detail == '_Slide Url' && d.info[detail] != 'n/a') {
                    marker.url = d.info[detail];
                    infoContent += `<center><button class=more-info onclick="handleClick()" >자세한 정보</button></center>`
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
                    url = marker.url;
                }
            }
        }

        markers.forEach((marker:any, index:number) => {
            naver.maps.Event.addListener(marker, 'click', createClickHandler(index));
        })

        function handleClick() {
            console.log('handleClick');
            programmaticController.open();
        }
        window.handleClick = handleClick;
    });

</script>

<svelte:head>
    <script src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId={PUBLIC_NAVER_MAPS_CLIENT_ID}"></script>
</svelte:head>


<div id=map />

<div class=hidden>
    <Lightbox imagePreset=fullscreen bind:programmaticController >
            <iframe title="Slides" src="{url}" frameborder="0" allowfullscreen={true} ></iframe>
    </Lightbox>
</div>



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

    .hidden {
        display:none;
    }

    iframe {
        max-width: 100vw;
        max-height: 100vh;
        width: 100vw;
        height: 100vh;
    }

    :global(button.more-info) {
        width: 100%;
        height: 40px;
        margin-top: 8px;
    }
</style>
