/*
// Get drop area element
let dropArea = document.getElementById('drop-area');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when a file is dragged over
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

// Unhighlight drop area when a file is dragged outside
['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Prevent default drag behaviors
function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

// Highlight drop area when a file is dragged over
function highlight(event) {
  dropArea.classList.add('highlight');
}

// Unhighlight drop area when a file is dragged outside
function unhighlight(event) {
  dropArea.classList.remove('highlight');
}

// Handle dropped files
function handleDrop(event) {
  let files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    // console.log('Dropped file:', file);
    // console.log(event.dataTransfer.files);
    console.log(fileInput.files)
    // Perform desired operations with the dropped file
  }
} */

// Get drop area element
let dropArea = document.getElementById('drop-area');
// let fileInput = document.getElementById('file');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Open file dialog when the area is clicked
dropArea.addEventListener('click', function() {
  fileInput.click();
});

// Handle selected files from file input
fileInput.addEventListener('change', handleFiles, false);

// Prevent default drag behaviors
function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

// Handle dropped files
function handleDrop(event) {
  let files = event.dataTransfer.files;
  handleFiles(files);
}

// Handle selected files
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    console.log('Selected file:', file);
    // Perform desired operations with the selected file
  }
}