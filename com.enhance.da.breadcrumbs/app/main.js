var currentAddress;
var currentLocality;
var isPositionAnnounced;

/**
 * The callback to prepare a segment for play.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
da.segment.onpreprocess = function (trigger, args) {
    console.log('=== onpreprocess called ===');
    console.log('onpreprocess', { trigger: trigger, args: args });
    // Check the trigger type.
    if(trigger === 'launchRule' || trigger === 'voice') {
        console.log('=== trigger type is ', trigger);
        // Fetch the segment configuration options from the server.
        getSegmentConfig().then(function (result) {
            isPositionAnnounced {
                // Get current address and locality data.
                // That's why we need a global variable!! (currentAddress, currentLocality)

            }
        })
        da.startSegment(null, null);
    } else {
        console.log('=== cannot find correct trigger type ===');
    }
};

/**
 * The callback to start a segment.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
da.segment.onstart = function (trigger, args) {
    console.log('onstart', { trigger: trigger, args: args });
    var callbacks = {
        onsuccess: function (result) {
            console.log('getCurrentPosition success.', result);
            // fetch('http://144.217.91.64/nearbyMessage', {
            fetch('http://localhost:3000/nearbyMessage', {
                method: 'POST',
                body: {
                    coordinates: [result.longitude, result.latitude]
                }
            })
            .then(response => response.json())
            .then(function(json) {
                // Figure out how this response will be structured
                console.log(json);
                if (json) {
                    // Play a ding sound (or just tell that a message arrived)
                    var synthesis = da.SpeechSynthesis.getInstance();
                    synthesis.speak('A message arrived !', {
                        onstart: function () {
                            console.log('message start');
                        },
                        onend: function () {
                            console.log('message onend');
                            da.stopSegment();
                        },
                        onerror: function (error) {
                            console.log('message cancel: ' + error.messsage);
                            da.stopSegment();
                        }
                    });
                    // Store message to local storage if it is not already there
                    // Remove messages that are no longer in the response object
                    da.stopWorker();
                } else {
                    // Remove all messages from local storage if there are any
                    da.stopWorker();
                }
            });
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
    da.stopSegment();
};