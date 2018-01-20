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
        res.results[0].address_components.map(item => {
            if(item.types.includes("country")) {
                countryCode = item.short_name;
            }
        });
    }
    catch(e) {
        countryCode = "US";
    }

    if("LR|MM|US".indexOf(countryCode) !== -1) {
        measurementUnit = "mile";
        $("#toggle-imperial").prop("checked", true);
    }
    else {
        measurementUnit = "kilometer";
        $("#toggle-metric").prop("checked", true);
    }
};


const toMiles = meters => meters * 0.000621371;

const toKilometers = meters => meters * 0.001;

const getDistance = distance => measurementUnit === "mile" ? toMiles(distance) : toKilometers(distance);