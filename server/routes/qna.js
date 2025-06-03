const qna = require('../controller/qna.controller')
const router = require('express').Router();

router.get('/:sessionId/qna-get', qna.qnaget);
router.get('/sessions/:email', qna.getSessionsByUser);
router.delete("/:sessionId/delete-session", qna.deleteQna);
module.exports = router;    