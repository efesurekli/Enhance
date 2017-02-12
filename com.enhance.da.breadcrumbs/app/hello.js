/**
 * The callback to prepare a segment for play.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
da.segment.onpreprocess = function (trigger, args) {
    console.log('onpreprocess', { trigger: trigger, args: args });
    da.startSegment(null, null);
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
            da.stopSegment();
        },
        onerror: function (error) {
            console.log('getCurrentPosition fail.' + error.message);
            da.stopSegment();
        }
    };
    var option = {
        timeout: 30000,
        enablehighaccuracy: true
    };
    var geo = new da.Geolocation();
    geo.getCurrentPosition(callbacks, option);
};