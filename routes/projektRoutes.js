const express = require('express');
const router = express.Router();

const projektController = require('../controllers/projektController');

router.get('/', projektController.index);

module.exports = router;