const fileInput = document.querySelector("#file");

fileInput.addEventListener("change", handleFileSelection);
fileInput.addEventListener("click", restart);

function restart() {
  together = ["name, latitude, longitude, timestamp"];
  downloadButton.disabled = true;
  document.querySelector("#result").innerHTML = "";
}

fileInput.addEventListener("click", () => restart);
function handleFileSelection(event) {
  download.disabled = false;

  for (let i = 0; i < fileInput.files.length; i++) {
    const selectedFile = event.target.files[i];

    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContents = event.target.result;
      transform(fileContents);
    };

    reader.readAsText(selectedFile);
  }
}

let result = "";

let together = [];

function transform(str) {
  let obj = JSON.parse(str);

  const act = obj.timelineObjects
    .filter((e) => e.hasOwnProperty("activitySegment"))
    .map((e) => e.activitySegment);

  const actWaypath = act.filter((e) => e.hasOwnProperty("waypointPath"));
  // .map((e) => e.waypointPath.waypoints);

  for (let i = 0; i < actWaypath.length; i++) {
    for (let j = 0; j < actWaypath[i].waypointPath.waypoints.length; j++) {
      together.push(
        "activity" +
          ", " +
          actWaypath[i].waypointPath.waypoints[j].latE7 / 1e7 +
          ", " +
          actWaypath[i].waypointPath.waypoints[j].lngE7 / 1e7 +
          ", " +
          actWaypath[i].duration.startTimestamp
      );
    }
  }

  const actRaw = act
    .filter((e) => !e.hasOwnProperty("waypointPath"))
    .filter((e) => e.hasOwnProperty("simplifiedRawPath"))
    .map((e) => e.simplifiedRawPath.points);

  for (let i = 0; i < actRaw.length; i++) {
    for (let j = 0; j < actRaw[i].length; j++) {
      together.push(
        "activity" +
          ", " +
          actRaw[i][j].latE7 / 1e7 +
          ", " +
          actRaw[i][j].lngE7 / 1e7 +
          ", " +
          actRaw[i][j].timestamp
      );
    }
  }

  let visited = obj.timelineObjects
    .filter((e) => e.hasOwnProperty("placeVisit"))
    .map((e) => e.placeVisit);

  for (let i = 0; i < visited.length; i++) {
    together.push(
      visited[i].location.name +
        ", " +
        visited[i].location.latitudeE7 / 1e7 +
        ", " +
        visited[i].location.longitudeE7 / 1e7 +
        ", " +
        visited[i].duration.startTimestamp
    );
  }

  result = together.join("\n");

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

const downloadButton = document.querySelector("#download");
downloadButton.addEventListener("click", () => downloadCSV(result, "data.csv"));
