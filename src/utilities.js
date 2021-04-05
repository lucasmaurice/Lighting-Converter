import { handleFiles } from './DragNDrop.js';

// Check browser compatibilities
if (!window.FileReader) {
  message = '<p>The ' +
    '<a href="http://dev.w3.org/2006/webapi/FileAPI/" >File API</a> ' +
    'are not fully supported by this browser.</p>' +
    '<p>Upgrade your browser to the latest version.</p>';
  document.querySelector('body').innerHTML = message;
} else {
  // Set up the file drag and drop listeners:         
  document.getElementById('fileDropBox').addEventListener('dragover', handleDragOver, false);
  document.getElementById('fileDropBox').addEventListener('drop', handleFileDrop, false);
}

document.getElementById('fileSelection').addEventListener('change', handleFileSelection, false);

function handleDragOver(evt) {
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
}

function handleFileDrop(evt) {
  resetError()
  evt.stopPropagation(); // Do not allow the drop event to bubble.
  evt.preventDefault(); // Prevent default drop event behavior.

  handleFiles(evt.dataTransfer.files); // Grab the list of files dragged to the drop box.
}

function resetError(){
  document.getElementById("fileDropBoxMessage").innerHTML = "";
}

function handleFileSelection(){
  handleFiles(this.files);
}
