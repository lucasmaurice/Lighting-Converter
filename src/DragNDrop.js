import { WYGToDepence, DepenceToWYG } from './Converter.js';

let availlable_converters = [
  DepenceToWYG,
  WYGToDepence
]

export function handleFiles(theFiles){
  resetError();

  // Check if the drag and drop has work
  if (!theFiles) {
    setError("At least one selected file is invalid - do not select any folders.");
    return;
  }

  for(let file of theFiles){

    // Check the dropped file
    if (!file) {
      addError("Unable to access " + file.name);
      return;
    }else if (file.size == 0) {
      addError(file.name + " is empty.");
      return;
    }

    // Find the type of the file
    switch(file.type){
      case 'text/csv':
      case 'application/vnd.ms-excel':
        CSVInput(file);
        break;

      default:
        addError(file.name + " is not a known file type.")
        console.warn(file.name + " is of type `" + file.type + "` which is not compatible. ");
    }

  }

}

function CSVInput(fileObject) {
  var reader = new FileReader();

  fileObject.name_only = fileObject.name.split(".csv")[0];

  reader.abort = function (evt){
    addError("File read aborted for " + fileObject.name_only + ".");
  }; // "abort" files on abort.
  reader.onerror = function (evt){
    addError("File read error for " + fileObject.name_only + ": " + evt.target.error.name);
  }; // "onerror" fires if something goes awry.

  reader.onloadend = function (evt){
    let compat = false;

    for(let converter of availlable_converters){
      if (converter.dataIsCompatible(evt.target.result)){
        document.getElementById("fileDropBoxMessage").appendChild(document.createElement('br'));
        document.getElementById("fileDropBoxMessage").appendChild(converter.download_link(evt.target.result, fileObject.name_only));
        compat = true;
      }
    }

    if(!compat){
      addError("No converter availlable for " + fileObject.name_only + ".");
    }

  }  

  if (fileObject) { // Safety first.
    reader.readAsText(fileObject); // Asynchronously start a file read thread. Other supported read methods include readAsArrayBuffer() and readAsDataURL().
  }
}

function addError(theMessage){
  document.getElementById("fileDropBoxMessage").innerHTML += '<div class="error_message"><b>Error:</b> ' + theMessage + '</div>';
}

function setError(theMessage){
  document.getElementById("fileDropBoxMessage").innerHTML = '<div class="error_message"><b>Error:</b> ' + theMessage + '</div>';
}

function resetError(){
  document.getElementById("fileDropBoxMessage").innerHTML = "";
}