const { nextISSTimesForMyLocation } = require('./iss');

/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
});
fetchCoordsByIP('2001:448a:2061:4b52:50a1:d213:f0a9:c802', (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned coordinate:', coordinates);
});
const coords = {latitude:'-6.1741', longitude:'106.8296'}
fetchISSFlyOverTimes(coords,(error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned flyover times:', passTimes);
});
*/

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});