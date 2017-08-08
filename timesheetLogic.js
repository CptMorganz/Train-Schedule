/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyApsYglDNPCeGiFNosyX9Z7CUtE9PqHsGE",
  authDomain: "train-schedule-7fe99.firebaseapp.com",
  databaseURL: "https://train-schedule-7fe99.firebaseio.com",
  projectId: "train-schedule-7fe99",
  storageBucket: "",
  messagingSenderId: "695146200287"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstDepart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: firstDepart,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstDepart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(firstDepart);
  // console.log(trainFrequency);

  // Calculate the next train arrival time
  var oldTime = firstDepart;
  // console.log(oldTime);

  oldTime = oldTime.split(':');
  var hours = Number(oldTime[0]);
  var minutes = Number(oldTime[1]);

  // console.log(hours);
  // console.log(minutes);

  // Holders for the arrival hours and minutes
  var nxtArrival, arrivalHr, arrivalMin;

  // Converting and calculating the arrival time using the military time given and frequency
  var convertHr;
  var convertMin = minutes + trainFrequency;
  if (convertMin > 59) {
    convertHr = hours + Math.floor(convertMin/60);
    if (convertHr > 23) {
      arrivalHr = convertHr % 24;
    } else {
      arrivalHr = convertHr;
    }
    arrivalMin = convertMin % 60;
  } else {
    arrivalMin = convertMin;
  }

  console.log(arrivalHr);

  if (arrivalHr > 0 && arrivalHr <= 12) {
    nxtArrival = "" + arrivalHr;
  } else if (arrivalHr > 12) {
    nxtArrival = "" + (arrivalHr - 12);
  } else if (arrivalHr == 0) {
    nxtArrival = "12";
  }
   
  nxtArrival += (arrivalMin < 10) ? ":0" + arrivalMin : ":" + arrivalMin;  // get minutes
  nxtArrival += (arrivalHr >= 12) ? " P.M." : " A.M.";  // get AM/PM

  // Calculate the time from first departure and frequency to determine arrival time.
  var minAway = "Until it gets here";

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nxtArrival + "</td><td>" + minAway + "</td><td>");
});