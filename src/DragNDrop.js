import { DepenceToWYG } from './Converter.js';

let availlable_converters = [
  DepenceToWYG
]

export function handleFiles(theFiles){
  // Check if the drag and drop has work
  if (!theFiles) {
    addError("At least one selected file is invalid - do not select any folders.");
    return;
  } else if (theFiles.length > 1) {
    addError("Please drag only one file.");
    return;
  }

  let file = theFiles[0]

  // Check the dropped file
  if (!file) {
    addError("Unable to access " + file.name);
    return;
  }else if (file.size == 0) {
    addError("The file is empty.");
    return;
  }

  // Find the type of the file
  switch(file.type){
    case 'text/csv':
    case 'application/vnd.ms-excel':
      CSVInput(file);
      break;

    default:
      addError("The file is not a known file type.")
      console.warn("The file is of type `" + file.type + "` which is not compatible. ");
  }
}

function CSVInput(fileObject) {
  var reader = new FileReader();
  
  reader.abort = function (evt){
    addError("File read aborted.");
  }; // "abort" files on abort.
  reader.onerror = function (evt){
    addError("File read error: " + evt.target.error.name);
  }; // "onerror" fires if something goes awry.

  reader.onloadend = function (evt){
    let compat = false;

    for(let converter of availlable_converters){
      if (converter.dataIsCompatible(evt.target.result)){
        document.getElementById("fileDropBoxMessage").appendChild(converter.download_link(evt.target.result));
        compat = true;
      }
    }

    if(!compat){
      addError("No converter availlable for your input.");
    }

  }  

  if (fileObject) { // Safety first.
    reader.readAsText(fileObject); // Asynchronously start a file read thread. Other supported read methods include readAsArrayBuffer() and readAsDataURL().
  }
}

function addError(theMessage){
  document.getElementById("fileDropBoxMessage").innerHTML += '<div class="error_message"><b>Error:</b> ' + theMessage + '</div>';
}
