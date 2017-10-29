// Check if geolocation is enabled/supported
if(!navigator.geolocation) {
    console.warn("Couldn't use geolocation");
}

function updateAllTable(clubs) {
    const $body = $(".table[data-type='all'] > tbody");
    $body.empty();
    for(const club of clubs) {
        $body.append(`
            <tr>
                <td>${club.name}</td>
                <td>${club.address}</td>
                <td>${parseFloat(club.latitude).toFixed(3)}, ${parseFloat(club.longitude).toFixed(3)}</td>
            </tr>
        `);
    }
}

function updateClosestTable(clubs) {
    clubs = clubs.slice(0, 10);
    const $body = $(".table[data-type='closest'] > tbody");
    const TO_MILE = 0.000621371;
    $body.empty();
    for(const club of clubs) {
        $body.append(`
            <tr>
                <td>${club.name}</td>
                <td>${(club.distance * TO_MILE).toFixed(1)}</td>
            </tr>
        `);
    }
}

$(() => {
    let clubsCache = [];
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
                minMatchCharLength: 2,
                keys: [
                    "name",
                    "address"
                ]
            });
            updateAllTable(clubs);
            navigator.geolocation.getCurrentPosition(pos => {
                updateClosestTable(geolib.orderByDistance({latitude: pos.coords.latitude, longitude: pos.coords.longitude}, clubs));
            });
        })
        .fail(console.log);

    $("input[data-action='find-nearby").on("input", function() {
        const val = $(this).val();
        if(val.length === 0) {
            return;
        }
        $.ajax({
            url: "https://maps.google.com/maps/api/geocode/json?address=" + encodeURI(val),
            type: "get",
            dataType: "json"
        })
            .done(data => {
                const pos = data.results[0].geometry.location;
                updateClosestTable(geolib.orderByDistance({latitude: pos.lat, longitude: pos.lng}, clubsCache));
            })
            .fail(console.log);
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