const analyse = require('../controller/main.controller')
const router = require('express').Router();

router.post('/analyze', analyse.mainFunction);
// router.post('/save', analyse.save);
// router.get('/history', analyse.history);


module.exports = router;
