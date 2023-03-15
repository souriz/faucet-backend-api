const express = require('express');

const info = require('./info');
const txs = require('./txs');

const router = express.Router();


router.use('/info', info);
router.use('/action', txs);


module.exports = router;
