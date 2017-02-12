// /**
//  * Check the locality every 60 seconds. The polling interval is defined in Manifest.json file.
//  * If locality is changed, start the segment and speak the loacality.
//  * @param  {string} trigger null is set.
//  * @param  {object} args    null is set.
//  */
// da.segment.onstart = function (trigger, args) {
//     console.log('worker started');
//     var callbacks = {
//         onsuccess: function (result) {
//             console.log('getCurrentPosition success.', result);
//             // fetch('http://144.217.91.64/nearbyMessage', {
//             fetch('http://localhost:3000/nearbyMessage', {
//                 method: 'POST',
//                 body: {
//                     coordinates: [result.longitude, result.latitude]
//                 }
//             })
//             .then(response => response.json())
//             .then(function(json) {
//                 // Figure out how this response will be structured
//                 console.log(json);
//                 if (json) {
//                     // Play a ding sound (or just tell that a message arrived)
//                     var synthesis = da.SpeechSynthesis.getInstance();
//                     synthesis.speak('A message arrived !', {
//                         onstart: function () {
//                             console.log('message start');
//                         },
//                         onend: function () {
//                             console.log('message onend');
//                             da.stopSegment();
//                         },
//                         onerror: function (error) {
//                             console.log('message cancel: ' + error.messsage);
//                             da.stopSegment();
//                         }
//                     });
//                     // Store message to local storage if it is not already there
//                     // Remove messages that are no longer in the response object
//                     da.stopWorker();
//                 } else {
//                     // Remove all messages from local storage if there are any
//                     da.stopWorker();
//                 }
//             });
//         },
//         onerror: function (error) {
//             console.log('getCurrentPosition fail.' + error.message);
//             da.stopWorker();
//         }
//     };
//     var option = {
//         timeout: 30000,
//         enablehighaccuracy: true
//     };
//     var geo = new da.Geolocation();
//     geo.getCurrentPosition(callbacks, option);
// };
