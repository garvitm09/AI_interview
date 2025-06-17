const analyse = require('../controller/main.controller')
const router = require('express').Router();

router.post('/analyze', analyse.mainFunction);
router.post('/start-session', analyse.startInterviewSession);
router.post('/record-session', analyse.recordInterviewStep);
router.post('/check-session-name', analyse.checkSessionName);
router.post('/set-session-name', analyse.setSessionName);
router.get("/test-openrouter", analyse.testOpenRouter);

module.exports = router;
