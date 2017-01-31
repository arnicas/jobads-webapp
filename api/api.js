let router = require('express').Router();
let multer = require('multer');
let PDFParser = require("pdf2json");

let upload = multer({limits: {fileSize: 2000000}});

//
// POST /api/cv-upload
// Process CV
//
router.post('/cv-upload', upload.single('file'), (req, res) => {

    let pdfParser = new PDFParser(this,1);

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        //console.log(JSON.stringify(pdfData));
        let pdfParsed = pdfParser.getRawTextContent();
        res.json({text: pdfParsed});
    });

    pdfParser.parseBuffer(req.file.buffer);

});

//
// POST /api/text-query
// Process text query
//
router.post('/text-query', (req, res) => {
    console.log(req.body);
    res.json({text: req.body.text});
});


module.exports = router;