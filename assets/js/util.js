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

const toMiles = kilometers => kilometers * 0.000621371;