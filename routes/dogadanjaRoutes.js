const express = require('express');
const router = express.Router();

const dogadanjaController = require('../controllers/dogadanjaController');

router.get('/', dogadanjaController.index);

module.exports = router;