/**
 * Check the locality every 60 seconds. The polling interval is defined in Manifest.json file.
 * If locality is changed, start the segment and speak the loacality.
 * @param  {string} trigger null is set.
 * @param  {object} args    null is set.
 */
da.segment.onstart = function (trigger, args) {
    console.log('worker started');
    da.stopWorker();
    // Get the current address (locality)
    // getCurrentLocationData().then(function (address, locality) {
    //     if (address !== 'error') {
    //         var storage = new da.Storage();
    //         if (storage.getItem('locality') !== locality) {
    //             // If current locality has been changed, update the current locality stored locally request to start the segment.
    //             storage.setItem('locality', locality);
    //             da.requestStartSegment('full', {
    //                 cueVoice: 'launchRulesAnnounce',
    //                 cueVoiceArgs: ['worker'],
    //                 args: locality
    //             });
    //         } else {
    //             // if the current locality is not changed, stop the worker itself
    //             da.stopWorker();
    //         }
    //     } else {
    //         da.stopWorker();
    //     }
    // });
};
