/**
 * Check the locality every 60 seconds. The polling interval is defined in Manifest.json file.
 * If locality is changed, start the segment and speak the loacality.
 * @param  {string} trigger null is set.
 * @param  {object} args    null is set.
 */
da.segment.onstart = function (trigger, args) {
    console.log('worker started');
    var callbacks = {
        onsuccess: function (result) {
            console.log('getCurrentPosition success.', result);
            fetch('/users.html', {
                method: 'GET',
                body: {
                    coordinates: [result.longitude, result.latitude]
                }
            })
            .then(function(response) {
                // Figure out how this response will be structured
                if (response.message) {
                    // Play a ding sound
                    // Store message to local storage if it is not already there
                    // Remove messages that are no longer in the response object
                    da.stopWorker();
                } else {
                    // Remove all messages from local storage if there are any
                }
            })
        },
        onerror: function (error) {
            console.log('getCurrentPosition fail.' + error.message);
            da.stopWorker();
        }
    };
    var option = {
        timeout: 30000,
        enablehighaccuracy: true
    };
    var geo = new da.Geolocation();
    geo.getCurrentPosition(callbacks, option);
};
