# Lighting Patch Converter [![License: CC BY 4.0](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png)](http://www.wtfpl.net/)


This application allows you to cross convert different patch outputs from WYSIWYG (cast software) and Depence2 (Synchronorm) in conjunction with MA2 Lighting software.

## How to use the converter
The converter is very easy to use and doesn't require any install on your computer. It also just runs on your local machine and nothing is uploaded on the internet.
Since it's just a webapp, it will work on Windows, Mac and Linux machines, and it has been tested on chrome.

Access the Web App here: [Lighting-Patch-Converter](https://lucasmaurice.github.io/Lighting-Patch-Converter/)

### Depence to WYSIWYG csv (for MA2 patching)
This converter takes the export from the fixture manager in Depence2 and converts it in a WYSIWYG csv output format in order to be used with the [WYG2MA](https://www.mschoeffmann.com/tools/wyg2gma-converter/) application.
It allows you to quickly patch your depence project into MA2 and move fixtures to match the 3D world.

Very usefull for small projects when you are not using any third party CAD software and directly start in D2.

**NOTE:**
Make sure to select the comma "," as a separator when exporting from depence as it usually selects ";" as the default choice and will result in errors.

### WYSIWYG to Depence2
As you might be aware, WYSIWYG just implemented MVR import and 3D export with textures in the latest R46 release. This opens up possibilities for better integration with third party visualizer however, the MVR export for fixtures is schedulled for R47.

Meanwhile, you can use this converter which takes the csv output from the all data table in WYSIWYG (same procedure as WYG2MA if you are familiar with it) and converts it into a MA2 xml patch format in order to import, place and patch fixtures almost automatically in Depence2.

Once processed, just import it in Depence2 in *File>Import>Import Patch from grand MA* and match the corresponding fixtures with modes and voila! 

**NOTE:**
Make sure to be in **metric** mode in WYSIWYG before exporting the CSV as it will result in errors if otherwise.

You could also decide to use WYG2MA to create MA2 macros, patch your board and then export the patch into Depence2. However, using this method is longer especially if you just want to quickly insert fixtures and render a still frame without connecting a board.

Also, there is an issue introduced by the MA2 software on the rotation of the *Y axis* (Z axis in Depence2) when importing fixtures, they are all mirrored 180deg. But if you use this converter and bypass the MA2 software the fixtures rotation is accurate and no additional action is required.

## Credits
Special thanks to MATTHIAS SCHÖFFMANN for his awesome [WYG2MA](https://www.mschoeffmann.com/tools/wyg2gma-converter/) application!

## Support me
[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/justesonic)

