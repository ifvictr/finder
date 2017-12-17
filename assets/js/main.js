// Check if geolocation is enabled/supported
if (!navigator.geolocation) {
  console.warn("Couldn't use geolocation")
}

function updateResultCount(count) {
  $("[data-output='total-results']").html(count)
}

function updateResults(clubs, coords, searchAll = false) {
  const $results = $('#results')
  $results.empty()

  if (!searchAll) {
    clubs = geolib
      .orderByDistance(coords, clubs)
      .filter(
        club =>
          toMiles(club.distance) < parseInt($("input[name='radius']").val())
      )
  }

  updateResultCount(clubs.length)

  clubs.map(club => {
    const distanceAway = toMiles(club.distance).toFixed(1)
    const imageUri = `assets/images/school/${club.id}.jpg`

    $results.append(`
            <div class="column is-3" data-club-id="${club.id}">
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-3by2">
                            <img src="assets/images/placeholder.svg">
                        </figure>
                    </div>
                    <div class="card-content">
                        <h2 class="title is-5">${club.name}</h2>
                        <h3 class="subtitle is-6">${club.address}</h3>
                        ${
                          !searchAll
                            ? `<span class='is-italic'>${
                                distanceAway > 1
                                  ? distanceAway + ' miles'
                                  : '<1 mile'
                              } away</span>`
                            : ''
                        }
                    </div>
                    <footer class="card-footer">
                        <!-- <a href="#" target="_blank" class="card-footer-item" title="Visit club website"><span class="icon"><i class="fa fa-link"></i></span></a> -->
                        <a href="https://www.google.com/maps/place/${club.name +
                          ', ' +
                          club.address}" target="_blank" class="card-footer-item" title="View on Google Maps"><span class="icon"><i class="fa fa-map"></i></span></a>
                        <!-- <a href="#" target="_blank" class="card-footer-item" title="Reach out"><span class="icon"><i class="fa fa-comment"></i></span></a> -->
                    </footer>
                </div>
            </div>
        `)

    isSuccess(imageUri, () => {
      const $club = $(`[data-club-id="${club.id}"] .image`)
      $club.find('img').attr('src', imageUri)
      $club.css('opacity', 1)
    })
  })
}

$(() => {
  let clubs = []
  let coords = []
  let fuse = null

  $.ajax({
    url: 'https://api.hackclub.com/v1/clubs',
    type: 'get',
    dataType: 'json'
  })
    .done(data => {
      clubs = data.sort(byField('name'))
      fuse = new Fuse(clubs, {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ['name', 'address']
      })
      navigator.geolocation.getCurrentPosition(pos => {
        coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
        updateResults(clubs, coords)
        $("[data-output='location']").html('near you')
      })
    })
    .fail(console.log)

  $("input[data-action='search-nearby").on('input', function() {
    const val = $(this).val()
    if (val.length === 0) {
      return
    }
    /*
     * This is so we don't spam requests. It checks 1.25 seconds after the input for a change.
     * If there's no change (the user has stopped typing), fire the request.
     */
    setTimeout(() => {
      const currentVal = $("input[data-action='search-nearby']").val()
      if (val === currentVal) {
        $.ajax({
          url: `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
            currentVal
          )}`,
          type: 'get',
          dataType: 'json'
        })
          .done(data => {
            if (data.results.length > 0) {
              const result = data.results[0]
              const pos = result.geometry.location
              coords = { latitude: pos.lat, longitude: pos.lng }
              updateResults(clubs, coords)
              $("[data-output='location']").html(
                'near ' + result.formatted_address
              )
            } else {
              updateResults([], coords)
            }
          })
          .fail(console.log)
      }
    }, 1250)
  })

  $("input[data-action='search-all']").on('input', function() {
    const val = $(this).val()
    // List all clubs if input is blank
    if (val.length === 0) {
      return
    }
    setTimeout(() => {
      const currentVal = $("input[data-action='search-all']").val()
      if (val === currentVal) {
        updateResults(fuse.search(val), coords, true)
      }
    }, 1250)
  })

  $("input[type='range']").on('input', function() {
    const val = $(this).val()
    $("[data-output='radius']").html(val)
    setTimeout(() => {
      const currentVal = $("input[type='range']").val()
      if (val === currentVal) {
        updateResults(clubs, coords)
      }
    }, 1250)
  })

  $('#toggle-search-all').on('change', function() {
    $("[data-type='nearby']").toggleClass('is-hidden')
    $("[data-type='all']").toggleClass('is-hidden')
    $("[data-output='location']").toggleClass('is-hidden')
    updateResults(clubs, coords, this.checked)
  })
})
