const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/:adminId/export-csv', exportController.exportCSV);

module.exports = router;
