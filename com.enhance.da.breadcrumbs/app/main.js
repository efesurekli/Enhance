var messagesArr;

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
        getCurrentPosition().then((result) => {
            console.log('current position: ', result);
            // Store fetched result to global messagesArr
            fetch('http://localhost:3000/nearbyMessage', {
                method: 'POST',
                body: {
                    coordinates: [result.longitude, result.latitude]
                }
            })
            .then(response => response.json())
            .then(function(json) {
                console.log('result from server: ', json);
                messagesArr = json.messages;
                da.startSegment(null, null);
            });
        });
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
    // Only triggered by voice command for now
    // if ( trigger === 'voice') {
        // Read message if message exists
        if ( messagesArr.length !== 0 ) {
            readCurrentLocationMessages(messagesArr)
            .then(() => {
                da.stopSegment();
            });
        } else {
            speak('There are no messages for your current location.')
            .then(() => {
                da.stopSegment();
            });
        }
    // }
};