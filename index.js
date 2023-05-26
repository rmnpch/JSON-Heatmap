// Declaring a varible for the file input
const fileInput = document.querySelector("#file");

// Binding the file selection function the upload(change) on the file input
fileInput.addEventListener("change", handleFileSelection);
fileInput.addEventListener("click", restart);

function restart() {
  together = ["name, latitude, longitude"];
  downloadButton.disabled = true
  document.querySelector("#result").innerHTML = "";
}

fileInput.addEventListener("click", () => restart);
// This function is responsible for reading the selected file
function handleFileSelection(event) {
    // Once a file has been uploaded (fileInput changed), the download button can the enabled
    download.disabled = false;
    
    for (let i=0; i<fileInput.files.length; i++)
    {
  // Selecting the first file uploaded
  const selectedFile = event.target.files[i];

  //The FileReader object in JavaScript provides a way to read the contents of files asynchronously.
  const reader = new FileReader();

  // This anonymous function will be executed once the reader.readAsText finishes reading the selectedFile
  reader.onload = function (event) {
    const fileContents = event.target.result;
    transform(fileContents);
  };

  reader.readAsText(selectedFile);
}}

// Defining result as a global variable so that it is available for multiple functions to access
let result = "";

// The together array is initialized with the first row of the .csv file. In this array, all coordinate points will be united to form the final result.
let together = ["name, latitude, longitude"];

// The transform function is responsible for extracting location name (when available), latitude and longitude from the JSON exported from Google TakeOut (takeout.google.com). Once you downloaded the Location History, you can select the files for each month of the year and the function will return rows and columns like a .csv file
function transform(str) {
  //In order to be transformed into a string, the JSON in each file needs to be parsed
  let obj = JSON.parse(str);

  //The JSON file consists of an object that contains an array of objects. Each object in this array has a property named either activitySegment or placeVisited
  //act consists in an array of all activitySegment objects
  const act = obj.timelineObjects
    .filter((e) => e.hasOwnProperty("activitySegment"))
    .map((e) => e.activitySegment);
  // Within these objetcs, they differ in those who have or not the waypointPath property. It's necessary separate them so that the coordinate points can be extracted. It's worth noting that there is no name for the coordinates in these objects.
  const actWaypath = act
    .filter((e) => e.hasOwnProperty("waypointPath"))
    .map((e) => e.waypointPath.waypoints);
  const actRaw = act
    .filter((e) => !e.hasOwnProperty("waypointPath"))
    .filter((e) => e.hasOwnProperty("simplifiedRawPath"))
    .map((e) => e.simplifiedRawPath.points);

  // Once the objects have been mapped to follow the same structure, they can be reunited in the same array once again
  let activity = actRaw.concat(actWaypath);

  // These couple loops present in this code are responsible for dividing every coordinate point on the activity array by 10^7.
  for (let i = 0; i < activity.length; i++) {
    for (let j = 0; j < activity[i].length; j++) {
      activity[i][j].latE7 = activity[i][j].latE7 / 1e7;
      activity[i][j].lngE7 = activity[i][j].lngE7 / 1e7;
    }
  }

  //act consists in an array of all placeVisited objects
  let visited = obj.timelineObjects
    .filter((e) => e.hasOwnProperty("placeVisit"))
    .map((e) => e.placeVisit.location);

  for (let i = 0; i < visited.length; i++) {
    visited[i].latitudeE7 = visited[i].latitudeE7 / 1e7;
    visited[i].longitudeE7 = visited[i].longitudeE7 / 1e7;
  }

  // These next two loops will push into the together array the name, latitude and longitude of all recorded points on the JSON file and will represent each data line on the csv file.
  for (let i = 0; i < visited.length; i++) {
    together.push(
      visited[i].name +
        ", " +
        visited[i].latitudeE7 +
        ", " +
        visited[i].longitudeE7
    );
  }

  for (let i = 0; i < activity.length; i++) {
    for (let j = 0; j < activity[i].length; j++) {
      together.push(
        "activity" + ", " + activity[i][j].latE7 + ", " + activity[i][j].lngE7
      );
    }
  }

  // Joining all rows with a return after every row
  result = together.join("\n");

  console.log(document.querySelector('#file').files[0].name, together.length)

  //Printing the together on the webpage with a HTML break row joining the rows
  document.querySelector("#result").innerHTML = together.join("<br>");
}

function downloadCSV(data, filename) {
  const csvContent = "data:text/csv;charset=utf-8," + data;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//assigning the download function to the download button
const downloadButton = document.querySelector("#download");
downloadButton.addEventListener("click", () => downloadCSV(result, "data.csv"));