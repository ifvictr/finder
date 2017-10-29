// Check if geolocation is enabled/supported
if(!navigator.geolocation) {
    console.warn("Couldn't use geolocation");
}

function updateAllTable(clubs) {
    const $body = $(".table[data-type='all'] > tbody");
    $body.empty();
    clubs.map(club => {
        $body.append(`
            <tr>
                <td>${club.name}</td>
                <td>${club.address}</td>
                <td>${parseFloat(club.latitude).toFixed(3)}, ${parseFloat(club.longitude).toFixed(3)}</td>
            </tr>
        `);
    });
}

function updateClosestTable(clubs, coords) {
    const $body = $(".table[data-type='closest'] > tbody");
    const TO_MILE = 0.000621371;
    $body.empty();
    geolib.orderByDistance(coords, clubs)
        .filter(club => (club.distance * TO_MILE) < parseInt($("select[name='radius']").val()))
        .map(club => {
            $body.append(`
                <tr>
                    <td>${club.name}</td>
                    <td>${(club.distance * TO_MILE).toFixed(1)}</td>
                </tr>
            `);
        });
}

$(() => {
    let clubsCache = [];
    let coordsCache = [];
    let fuse = null;

    $.ajax({
        // url: "https://api.hackclub.com/v1/clubs",
        url: "/assets/json/clubs.json",
        type: "get",
        dataType: "json"
    })
        .done(clubs => {
            clubsCache = clubs.sort(byField("name"));
            fuse = new Fuse(clubs, {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: [
                    "name",
                    "address"
                ]
            });
            updateAllTable(clubsCache);
            navigator.geolocation.getCurrentPosition(pos => {
                coordsCache = {latitude: pos.coords.latitude, longitude: pos.coords.longitude};
                updateClosestTable(clubsCache, coordsCache);
            });
        })
        .fail(console.log);

    $("input[data-action='find-nearby").on("input", function() {
        const val = $(this).val();
        if(val.length === 0) {
            updateClosestTable(clubsCache, coordsCache);
            return;
        }
        /*
         * This is so we don't spam requests. It checks one second after the input for a change.
         * If there's no change (the user has stopped typing), fire the request.
         */
        setTimeout(() => {
            const currentVal = $("input[data-action='find-nearby']").val();
            if(val === currentVal) {
                $.ajax({
                    url: `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(currentVal)}`,
                    type: "get",
                    dataType: "json"
                })
                    .done(data => {
                        const pos = data.results[0].geometry.location;
                        coordsCache = {latitude: pos.lat, longitude: pos.lng};
                        updateClosestTable(clubsCache, coordsCache);
                    })
                    .fail(console.log);
            }
        }, 1000);
    });

    $("select[name='radius']").on("change", function() {
        updateClosestTable(clubsCache, coordsCache);
    });

    $("input[data-action='find-club']").on("input", function() {
        const val = $(this).val();
        // List all clubs if input is blank
        if(val.length === 0) {
            updateAllTable(clubsCache);
            return;
        }
        updateAllTable(fuse.search(val));
    });
});