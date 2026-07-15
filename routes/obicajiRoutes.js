const express = require('express');
const router = express.Router();

const obicajiController = require('../controllers/obicajiController');

router.get('/', obicajiController.index);
router.get('/:id', obicajiController.show);

module.exports = router;