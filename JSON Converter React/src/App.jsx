import { useState } from "react";
import "./App.css";
import FileInput from "./fileInput" 

function App() {
  const [result, setResult] = useState('');


  return (
    <>
      <div className="header">
        <h1>Timeline JSON converter to CSV </h1>
      </div>
       <div id="drop-area" className="drop-area">
        <p>Drop files here or select file</p>
        
        <FileInput/>
      </div>
          
      <a>
        <button id="download" disabled>
          Download
        </button>
      </a>
      <span id="progress"></span>
      <p id="result">{result}</p>
    </>
  );
}

export default App;
