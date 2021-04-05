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

  static download_link(input_text, fileName){
    let content = this.convert(input_text);

    let a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: this.mimeType }));
    a.setAttribute('download', fileName + "_" + this.fileName);
    a.innerText = "Download " + fileName + "_" + this.fileName;

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
  static converterName = "Depence2ToWYG";
  static fileName = this.converterName + ".csv";
  
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

export class WYGToDepence extends CSV_Converter{
  static converterName = "WYGToDepence2";
  static fileName = this.converterName + ".xml";

  static required_properties = [
    "Spot",
    "Type",
    "Fixture Options",
    "Patch Universe",
    "Patch Address",
    "# of Data Channels",
    "X",
    "Y",
    "Z",
    "RotX",
    "RotY",
    "RotZ",
  ];

  static convert(input_text){
    let in_data = this.parse(input_text);
    let out_data = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="styles/fixture+layer+layers@csv.xsl" alternate="yes"?>
<MA xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.malighting.de/grandma2/xml/MA" xsi:schemaLocation="http://schemas.malighting.de/grandma2/xml/MA http://schemas.malighting.de/grandma2/xml/3.9.60/MA.xsd" major_vers="3" minor_vers="9" stream_vers="60">
  <Info datetime="2021-04-05T13:33:41" showfile="easy patch pour Sonic" />
  <Layer index="1" name="Lighting Converter">`;
    
    let index = 0;
    for(const fixture of in_data){
      index ++;
      let address = Number(fixture["Patch Universe"] - 1)*512 + Number(fixture["Patch Address"]);

      out_data += `
    <Fixture index="` + index + `" name="` + fixture["Type"] + " " + index + `" fixture_id="` + fixture["Spot"] + `">
      <FixtureType name="` + fixture["Type"] + " " + fixture["Fixture Options"] +`">
        <No>3</No>
      </FixtureType>
      <SubFixture index="0">
        <Patch>
          <Address>` + address + `</Address>
        </Patch>
        <AbsolutePosition>
          <Location x="` + fixture["X"].split("m")[0] + `" y="` + fixture["Y"].split("m")[0] + `" z="` + fixture["Z"].split("m")[0] + `" />
          <Rotation x="` + fixture["RotX"] + `" y="` + (Number(fixture["RotY"]) + 180) + `" z="` + fixture["RotZ"] + `" />
          <Scaling x="1" y="1" z="1" />
        </AbsolutePosition>`;
      
      for(let channel_index = 0; channel_index < Number(fixture["# of Data Channels"]); channel_index++){
        out_data += `\n        <Channel index="` + channel_index + `" />`;
      }
      out_data += `
      </SubFixture>
    </Fixture>`;
      index ++;
    }
    out_data += `
  </Layer>
</MA>\n`;
    return out_data;
  }
}
