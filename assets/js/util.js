const byField = field => {
    return (a, b) => {
        const first = a[field];
        const second = b[field];
        if(first < second) {
            return -1;
        }
        else if(first > second) {
            return 1;
        }
        return 0;
    };
};

const isSuccess = (url, callback) => {
    $.ajax({
        url: url,
        statusCode: {
            200: callback
        }
    });
};

const updateUnit = res => {
    let countryCode;
    try {
        // TODO: Find a proper way to retrieve country code
        countryCode = res.results[0].address_components.slice(-1)[0].short_name;
    }
    catch(e) {
        countryCode = "US";
    }

    if("US|MM|LR".indexOf(countryCode) != -1) {
        defaultUnit = "Imperial";
        defaultDistance = "mile";
    }
    else {
        defaultUnit = "Metric";
        defaultDistance = "kilometer";
    }
    $("#toggle-unit").click();
};


const toMiles = meters => meters * 0.000621371;

const toKilometers = meters => meters * 0.001;

const getDistance = distance => defaultUnit == "Imperial" ? toMiles(distance) : toKilometers(distance);