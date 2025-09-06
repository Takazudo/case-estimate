/**
 * Adobe Illustrator script to convert AI files to SVG
 * Save this as convert-ai-to-svg.jsx
 * Run in Illustrator: File > Scripts > Other Script... and select this file
 */

function convertAItoSVG() {
    var sourceFolder = Folder.selectDialog("Select folder with AI files");
    if (!sourceFolder) {
        alert("No folder selected");
        return;
    }
    
    var outputFolder = Folder.selectDialog("Select output folder for SVG files");
    if (!outputFolder) {
        alert("No output folder selected");
        return;
    }
    
    var aiFiles = sourceFolder.getFiles("*.ai");
    
    if (aiFiles.length === 0) {
        alert("No AI files found in the selected folder");
        return;
    }
    
    var svgOptions = new ExportOptionsSVG();
    svgOptions.embedRasterImages = true;
    svgOptions.embedAllFonts = true;
    svgOptions.fontSubsetting = SVGFontSubsetting.ALLGLYPHS;
    svgOptions.compressed = false;
    svgOptions.coordinatePrecision = 3;
    svgOptions.documentEncoding = SVGDocumentEncoding.UTF8;
    svgOptions.DTD = SVGDTDVersion.SVG1_1;
    svgOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
    svgOptions.fontType = SVGFontType.OUTLINEFONT;
    
    var successCount = 0;
    var failedFiles = [];
    
    for (var i = 0; i < aiFiles.length; i++) {
        try {
            var doc = app.open(aiFiles[i]);
            var fileName = aiFiles[i].name.replace(/\.ai$/i, "");
            var svgFile = new File(outputFolder + "/" + fileName + ".svg");
            
            doc.exportFile(svgFile, ExportType.SVG, svgOptions);
            doc.close(SaveOptions.DONOTSAVECHANGES);
            
            successCount++;
        } catch (e) {
            failedFiles.push(aiFiles[i].name + " - Error: " + e.toString());
        }
    }
    
    var message = "Conversion complete!\n";
    message += "Successfully converted: " + successCount + " files\n";
    
    if (failedFiles.length > 0) {
        message += "\nFailed files:\n" + failedFiles.join("\n");
    }
    
    alert(message);
}

convertAItoSVG();