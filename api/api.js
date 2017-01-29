var router = require('express').Router();

//
// POST /api/cv
// Treat CV
//
// Post parameters:
//   first_name: first name of the new customer
//   last_name: last name of the new customer
//   birthdate: birthdate of the new customer
//
router.post('/cv-upload', (req, res) => {
    console.log('req.files');
});

module.exports = router;