const express = require('express');
const router = express.Router();

const adminRouter = require('../controllers/admin');

router.post('/polls/questions', adminRouter.createSurvey);

module.exports = router;