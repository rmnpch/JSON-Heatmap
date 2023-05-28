import React, { useState } from "react";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  // The together array is initialized with the first row of the .csv file. In this array, all coordinate points will be united to form the final result.
  const [together, setTogether] = useState([
    "name, latitude, longitude, timestamp"
  ]);

  const handleFileChange = (event) => {
    // setSelectedFile(e=>([e1,2,3]));
    const fileInput = event.target.files;
    console.log(fileInput.length);
    // console.log(selectedFile)
    download.disabled = false;
    let j = 0;
    for (let i = 0; i < fileInput.length; i++) {
      const file = fileInput[i];
      //The FileReader object in JavaScript provides a way to read the contents of files asynchronously.
      const reader = new FileReader();
      // This anonymous function will be executed once the reader.readAsText finishes reading the selectedFile
      reader.onload = function (event) {
        const fileContents = event.target.result;
        transform(fileContents);
        j++;
        console.log(j + "/" + fileInput.length);
      };

      reader.readAsText(file);
    }
  };

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
    const actWaypath = act.filter((e) => e.hasOwnProperty("waypointPath"));
    for (let i = 0; i < actWaypath.length; i++) {
      for (let j = 0; j < actWaypath[i].waypointPath.waypoints.length; j++) {
        setTogether((e) => [
          ...e,
          "activity" +
            ", " +
            actWaypath[i].waypointPath.waypoints[j].latE7 / 1e7 +
            ", " +
            actWaypath[i].waypointPath.waypoints[j].lngE7 / 1e7 +
            ", " +
            actWaypath[i].duration.startTimestamp,
        ]);
      }
    }
    console.log(together);
    const actRaw = act
      .filter((e) => !e.hasOwnProperty("waypointPath"))
      .filter((e) => e.hasOwnProperty("simplifiedRawPath"))
      .map((e) => e.simplifiedRawPath.points);
  
    for (let i = 0; i < actRaw.length; i++) {
      for (let j = 0; j < actRaw[i].length; j++) {
        setTogether((e) => [
            ...e,
          "activity" +
            ", " +
            actRaw[i][j].latE7 / 1e7 +
            ", " +
            actRaw[i][j].lngE7 / 1e7 +
            ", " +
            actRaw[i][j].timestamp]
        );
      }
    }
    let visited = obj.timelineObjects
    .filter((e) => e.hasOwnProperty("placeVisit"))
    .map((e) => e.placeVisit);

  for (let i = 0; i < visited.length; i++) {
    setTogether((e) => [
        ...e,
      visited[i].location.name +
        ", " +
        visited[i].location.latitudeE7 / 1e7 +
        ", " +
        visited[i].location.longitudeE7 / 1e7 +
        ", " +
        visited[i].duration.startTimestamp]
    );
  }    

  console.log(together.length)

  }

  const handleSubmit = (event) => {
    console.log(together);
    event.preventDefault();
    // Perform file upload logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <br />
      <br />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;
