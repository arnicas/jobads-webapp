let router = require('express').Router();
let multer = require('multer');
let PDFParser = require("pdf2json");
let https = require('https');

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
    let path =  '/api/ads/search/' + encodeURI(req.body.text);
    console.log('> ads/search/'+encodeURI(req.body.text));
    https.get({
        hostname: 'jobads-textminer.herokuapp.com',
        path: path,
        agent: false  // create a new agent just for this one request
    }, (apiRes) => {// Continuously update stream with data
        console.log(' : '+apiRes.statusCode);
        if(apiRes.statusCode = 200) {
            let body = '';
            apiRes.on('data', function(d) {
                body += d;
            });
            apiRes.on('end', function() {
                // Data reception is done
                let parsedApiRes = JSON.parse(body);
                res.json({status: 200, res: parsedApiRes});
            });
        } else {
            res.json({status: apiRes.statusCode});
        }
    }).on('error', (e) => {
        console.log(e);
    });
});


module.exports = router;