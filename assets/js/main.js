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
            </tr>
        `);
    });
}

function updateNearbyTable(clubs, coords) {
    const $body = $(".columns[data-type='nearby']");
    const TO_MILE = 0.000621371;
    $body.empty();
    geolib.orderByDistance(coords, clubs)
        .filter(club => (club.distance * TO_MILE) < parseInt($("select[name='radius']").val()))
        .map(club => {
            const milesAway = (club.distance * TO_MILE).toFixed(1);
            $body.append(`
                <div class="column is-3">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-3by2">
                                <img src="assets/images/school/${club.id}.jpg">
                            </figure>
                        </div>
                        <div class="card-content">
                            <h2 class="title is-5">${club.name}</h2>
                            <h3 class="subtitle is-6">${club.address}</h3>
                            <i>${milesAway > 1 ? milesAway + " miles" : "<1 mile"} away</i>
                        </div>
                        <footer class="card-footer">
                            <a href="#" target="_blank" class="card-footer-item" title="Visit club website"><span class="icon"><i class="fa fa-link"></i></span></a>
                            <a href="https://www.google.com/maps/place/${club.name + ", " + club.address}" target="_blank" class="card-footer-item" title="View on Google Maps"><span class="icon"><i class="fa fa-map"></i></span></a>
                            <a href="#" target="_blank" class="card-footer-item" title="Reach out"><span class="icon"><i class="fa fa-comment"></i></span></a>
                        </footer>
                    </div>
                </div>
            `);
        });
}

$(() => {
    let clubsCache = [];
    let coordsCache = [];
    let fuse = null;

    $.ajax({
        // url: "https://api.hackclub.com/v1/clubs",
        url: "assets/json/clubs.json",
        type: "get",
        dataType: "json"
    })
        .done(clubs => {
            clubsCache = clubs.sort(byField("name"));
            fuse = new Fuse(clubsCache, {
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
                updateNearbyTable(clubsCache, coordsCache);
            });
        })
        .fail(console.log);

    $("input[data-action='find-nearby").on("input", function() {
        const val = $(this).val();
        if(val.length === 0) {
            updateNearbyTable(clubsCache, coordsCache);
            return;
        }
        /*
         * This is so we don't spam requests. It checks 1.25 seconds after the input for a change.
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
                        updateNearbyTable(clubsCache, coordsCache);
                    })
                    .fail(console.log);
            }
        }, 1250);
    });

    $("select[name='radius']").on("change", function() {
        updateNearbyTable(clubsCache, coordsCache);
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

    // TODO: Find better way to notify
    $("body").on("click", "a", function(event) {
        if($(this).attr("href") === "#") {
            event.preventDefault();
            alert("Not implemented yet.");
        }
    });
});