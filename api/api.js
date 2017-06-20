let router = require('express').Router();
let multer = require('multer');
let PDFParser = require("pdf2json");
let https = require('https');

let upload = multer({limits: {fileSize: 2000000}});

let postJson = (path, req, res) => {
    var postData = JSON.stringify(req.body);
    let options = {
        hostname: 'jobmatch-api.herokuapp.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        agent: false,
    };
    let apiReq = https.request(options, (apiRes) => {// Continuously update stream with data
        console.log('> '+path+' : '+apiRes.statusCode);
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
            console.log(postData);
            res.json({status: apiRes.statusCode});
        }
    });
    
    apiReq.on('error', (e) => {
        console.log(e);
    });

    apiReq.write(postData);
    apiReq.end();
}

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
        postJson('/api/skills/extract/cv', {body:{text_content: pdfParsed}}, res);
    });

    pdfParser.parseBuffer(req.file.buffer);

});

//
// POST /api/ja/search
// Process text query
//
router.post('/ja/search/', (req, res) => {
    postJson('/api/ads/search', req, res);
});

//
// POST /api/ja/skills/similar
// Process text query
//
router.post('/ja/skills/similar', (req, res) => {
    postJson('/api/skills/similar', req, res);
});

//
// POST /api/ja/coords/search
// Process text query
//
router.post('/ja/coords/search/', (req, res) => {
    postJson('/api/ads/coords/search', req, res);
});

//
// POST /api/ja/get_basic_info
// Process simple query
//
router.post('/ja/get_basic_info', (req, res) => {
    postJson('/api/ads/get_basic_info', req, res);
});

//
// GET /api/ja/get/<id>
// Process simple query
//
router.get('/ja/get/:id', (req, res) => {
    let options = {
        hostname: 'jobmatch-api.herokuapp.com',
        path: '/api/ads/get/'+req.params.id,
        method: 'GET',
        agent: false,
    };
    let apiReq = https.request(options, (apiRes) => {
        console.log('> /api/ads/get/'+req.params.id+' : '+apiRes.statusCode);
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
            console.log(req.params.id);
            res.json({status: apiRes.statusCode});
        }
    });
    
    apiReq.on('error', (e) => {
        console.log(e);
    });
    apiReq.end();
});


module.exports = router;