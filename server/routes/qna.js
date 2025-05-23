const qna = require('../controller/qna.controller')
const router = require('express').Router();

router.get('/:sessionId/qna-get', qna.qnaget);
router.get('/sessions/:email', qna.getSessionsByUser);

module.exports = router;    