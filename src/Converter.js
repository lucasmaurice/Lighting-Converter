class Converter {
  constructor(input_text) {
    if (this.constructor === Converter) {
      throw new TypeError('Abstract class "Converter" cannot be instantiated directly');
    }
  }

  static get mimeType(){ throw new Error('You must set this var'); }
  
  static get converterName(){ throw new Error('You must set this var'); }

  static get fileName(){ throw new Error('You must set this var'); }

  static parse(input_text) {
    throw new Error('You must implement this function');
  }

  static dataIsCompatible(input_text) {
    throw new Error('You must implement this function');
  }

  static convert(input_text){
    throw new Error('You must implement this function');
  }

  static download_link(input_text){
    let content = this.convert(input_text);

    let a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: this.mimeType }));
    a.setAttribute('download', this.fileName);
    a.innerText = "Download " + this.fileName

    return a;
  }
}

class CSV_Converter extends Converter{
  static mimeType = "text/csv;encoding:utf-8";
  
  static get required_properties(){ throw new Error('You must set this var'); }

  static get fileName(){
    return this.converterName + ".csv";
  }

  static parse(input_text){
    return d3.csv.parse(input_text);
  }

  static dataIsCompatible(input_text){
    let typical_line = this.parse(input_text)[0];

    let isCompatible = true;
    let missings = [];

    for(const property of this.required_properties){
      if(!(property in typical_line)){
        missings.push(property);
        isCompatible = false;
      }
    }

    if(!isCompatible){
      console.warn("All these properties are missing for " + this.converterName + " conversion:", missings);
    }

    return isCompatible;
  }
}

export class DepenceToWYG extends CSV_Converter{
  static converterName = "DepenceToWYG";

  static required_properties = [
    "Fixture ID",
    "DMX Line",
    "DMX Address",
    "Name",
    "X Pos",
    "Y Pos",
    "Z Pos",
    "X Rotation",
    "Y Rotation",
    "Z Rotation",
  ];

  static convert(input_text){
    let in_data = this.parse(input_text);
    let out_data = 
      "Spot,"+
      "Patch,"+
      "Type,"+
      "X,"+
      "Y,"+
      "Z,"+
      "RotX,"+
      "RotY,"+
      "RotZ,"+
      'Position,'+
      'Channel,'+
      'Layer,'+
      'Purpose,'+
      'Focus,'+
      'Color,'+
      'Gobo\n';

    for(const fixture of in_data){
      out_data += 
        fixture["Fixture ID"] + "," +
        fixture["DMX Line"] + '.' + fixture["DMX Address"] + "," +
        fixture["Name"] + "," +
        fixture["X Pos"] / 100 + 'm,' +
        fixture["Z Pos"] / 100 + 'm,' +
        fixture["Y Pos"] / 100 + 'm,' +
        fixture["X Rotation"] + "," +
        fixture["Z Rotation"] + "," +
        fixture["Y Rotation"] + 
        "," +"," +"," +"," +"," +"," +"," +"\n"
    }

    return out_data;
  }
}
