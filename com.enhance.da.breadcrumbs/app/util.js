/**
 * Speak the input text. This method is implemented by speak API.
 * @param  {string} text
 * @return {object} Promise
 */
var speak = function (text) {
    var def = $.Deferred();
    var synthesis = da.SpeechSynthesis.getInstance();
    synthesis.speak(text, {
        onstart: function () {
            console.log('speak start');
        },
        onend: function () {
            console.log('speak onend');
            def.resolve();
        },
        onerror: function (error) {
            console.log('speak cancel: ' + error.message);
            def.resolve();
        }
    });
    return def.promise();
};

/**
 * Get current position. This method is implemented by getCurrentPosition API.
 * @return {object} Promise
 */
var getCurrentPosition = function () {
    var def = $.Deferred();
    var callbacks = {
        onsuccess: function (result) {
            console.log('getCurrentPosition success.', result);
            def.resolve(result);
        },
        onerror: function (error) {
            console.log('getCurrentPosition fail.' + error.message);
            def.resolve(null);
        }
    };
    var option = {
        timeout: 30000,
        enablehighaccuracy: true
    };
    var geo = new da.Geolocation();
    geo.getCurrentPosition(callbacks, option);
    return def.promise();
};

/**
 * Get the segment configuration. This method is implemented by getSegmentConfig API.
 * @return {object} Promise
 */
var getSegmentConfig = function () {
    var def = $.Deferred();
    var callback = {
        onsuccess: function (result) {
            console.log('getSegmentConfig success.', result);
            def.resolve(result);
        },
        onerror: function (error) {
            console.log('getSegmentConfig fail.');
            def.resolve(null);
        }
    };
    da.getSegmentConfig(callback);
    return def.promise();
};

/**
 * Convert time format to 12 hour clock and signify AM or PM.
 * @param  {number} hours
 * @param  {number} minutes
 * @return {string} converted time
 */
var convertTimeFormat = function (hours, minutes) {
    var ampm = 'AM';
    if (hours >= 12) {
        hours = hours - 12;
        ampm = 'PM';
    }
    if (hours === 0) {
        hours = 12;
    }
    return hours + ' ' + minutes + ' ' + ampm;
};

/**
 * Reads list of messages.
 * @param  {array} messages
 * @return {object} Promise
 */
var readCurrentLocationMessages = function (messages) {
    var messagesIntro = 'Here are the messages for your current location.';
    var messagesBody = '';
    var messagesEnd = 'That is all!';
    console.log('messages in util', messages);
    messages.forEach((message, index) => {
        messagesBody += `Message ${index + 1}, From ${message.username}, ${message.text}.\n`
    });

    return speak(`${messagesIntro}, ${messagesBody}, ${messagesEnd}`);
};