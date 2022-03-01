/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

 const request = require('request');
 const fs = require('fs');
 
 const fetchMyIP = function(callback) {
   // use request to fetch IP address from JSON AP
   //const domain = process.argv[2]; -> if want to put it in the terminal
 
   request('https://api.ipify.org?format=json', (error, response, body) => {
     const ip = JSON.parse(body);
     fs.readFile(body, 'utf8', () => { //use readFile to read the data
       // error can be set if invalid domain, user is offline, etc.
       if (error) {
         callback(error, null);
         return;
       }
       // if non-200 status, assume server error
       if (response.statusCode !== 200) {
         callback(error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
         return;
       }
       callback(null, ip);
     });
   });
 };
 
 const fetchCoordsByIP = function(ip, callback) {
   ip = '2001:448a:2061:4b52:50a1:d213:f0a9:c802';
   request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
     fs.readFile(body, 'utf8', () => { //use readFile to read the data
       // error can be set if invalid domain, user is offline, etc.
       if (error) {
         callback(error, null);
         return;
       }
       // if non-200 status, assume server error
       if (response.statusCode !== 200) {
         callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
         return;
       }
       const { latitude, longitude } = JSON.parse(body);
       callback(null, { latitude, longitude });
     });
   });
 };
 
 /**
  * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
  * Input:
  *   - An object with keys `latitude` and `longitude`
  *   - A callback (to pass back an error or the array of resulting data)
  * Returns (via Callback):
  *   - An error, if any (nullable)
  *   - The fly over times as an array of objects (null if error). Example:
  *     [ { risetime: 134564234, duration: 600 }, ... ]
  */
 const fetchISSFlyOverTimes = function(coords, callback) {
   request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
     fs.readFile(body, 'utf8', () => { //use readFile to read the data
       // error can be set if invalid domain, user is offline, etc.
       if (error) {
         callback(error, null);
         return;
       }
       // if non-200 status, assume server error
       if (response.statusCode !== 200) {
         callback(Error(`Status Code ${response.statusCode} when fetching ISS pass time: ${body}`), null);
         return;
       }
       const pass = JSON.parse(body).response;
       callback(null, pass);
     });
   });
 };
 
 /**
  * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
  * Input:
  *   - A callback with an error or results.
  * Returns (via Callback):
  *   - An error, if any (nullable)
  *   - The fly-over times as an array (null if error):
  *     [ { risetime: <number>, duration: <number> }, ... ]
  */
 
 const nextISSTimesForMyLocation = function(callback) {
   fetchMyIP((error, ip) => {
     if (error) {
       return callback(error, null);
     }
 
     fetchCoordsByIP(ip, (error, loc) => {
       if (error) {
         return callback(error, null);
       }
 
       fetchISSFlyOverTimes(loc, (error, nextPasses) => {
         if (error) {
           return callback(error, null);
         }
 
         callback(null, nextPasses);
       });
     });
   });
 };
 
 
 module.exports = { nextISSTimesForMyLocation };