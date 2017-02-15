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
// POST /api/ja/search
// Process text query
//
router.post('/ja/search/', (req, res) => {
    let path =  '/api/ads/search/' + encodeURI(req.body.text);
    console.log('> ads/search/'+encodeURI(req.body.text));
    https.get({
        hostname: 'jobads-textminer.herokuapp.com',
        path: path,
        agent: false  // create a new agent just for this one request
    }, (apiRes) => {// Continuously update stream with data
        console.log(' : '+apiRes.statusCode);
        if(apiRes.statusCode == 200) {
            let body = '';
            apiRes.on('data', function(d) {
                body += d;
            });
            apiRes.on('end', function() {
                // Data reception is done
                let parsedApiRes = "";
                try {
                    parsedApiRes = JSON.parse(body);
                    res.json({status: 200, res: parsedApiRes});
                } catch (e) {
                    console.log(e);
                    res.json({status: 500});
                }
            });
        } else {
            res.json({status: apiRes.statusCode});
        }
    }).on('error', (e) => {
        console.log(e);
    });
});

//
// POST /api/ja/coords/search
// Process text query
//
router.post('/ja/coords/search/', (req, res) => {
    let path =  '/api/ads/coords/search/' + encodeURI(req.body.text);
    console.log('> ads/coords/search/'+encodeURI(req.body.text));
    https.get({
        hostname: 'jobads-textminer.herokuapp.com',
        path: path,
        agent: false  // create a new agent just for this one request
    }, (apiRes) => {// Continuously update stream with data
        console.log(' : '+apiRes.statusCode);
        if(apiRes.statusCode == 200) {
            let body = '';
            apiRes.on('data', function(d) {
                body += d;
            });
            apiRes.on('end', function() {
                // Data reception is done
                let parsedApiRes = "";
                try {
                    parsedApiRes = JSON.parse(body);
                    res.json({status: 200, res: parsedApiRes});
                } catch (e) {
                    console.log(e);
                    res.json({status: 500});
                }
            });
        } else {
            res.json({status: apiRes.statusCode});
        }
    }).on('error', (e) => {
        console.log(e);
    });
});

//
// POST /api/ja/get_basic_info
// Process simple query
//
router.post('/ja/get_basic_info', (req, res) => {
    let path =  '/api/ads/get_basic_info';
    var postData = JSON.stringify(req.body);
    let options = {
        hostname: 'jobads-textminer.herokuapp.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        agent: false,
    };
    console.log('> ads/get_basic_info', postData);
    let apiReq = https.request(options, (apiRes) => {// Continuously update stream with data
        console.log(' : '+apiRes.statusCode);
        if(apiRes.statusCode == 200) {
            let body = '';
            apiRes.on('data', function(d) {
                body += d;
            });
            apiRes.on('end', function() {
                // Data reception is done
                let parsedApiRes = "";
                try {
                    parsedApiRes = JSON.parse(body);
                    res.json({status: 200, res: parsedApiRes});
                } catch (e) {
                    console.log(e);
                    res.json({status: 500});
                }
            });
        } else {
            res.json({status: apiRes.statusCode});
        }
    });
    
    apiReq.on('error', (e) => {
        console.log(e);
    });

    apiReq.write(postData);
    apiReq.end();
});


module.exports = router;