const express=require('express')
const router=express.Router();
const {createNursery,insertOne,getAll,viewall,takenurseryinput}=require("../controller/nursery.js")
const exportController = require('../controller/analytics/getcsv.js');
const exportController1 = require('../controller/analytics/predictSales.js');
const exportController2 = require('../controller/analytics/visualize.js');
const exportController3 = require('../controller/analytics/getsalescsv.js');

router.get('/:adminId/export-csv', exportController.exportCSV);

router.get('/:adminId/nursery/:nurseryId/predict-sales', exportController1.analyzeSalesByPlant);
router.get('/:adminId/nursery/:nurseryId/visualize', exportController2.visualizeSalesByPlant);
router.get('/:adminId/nursery/:nurseryId/dcsv', exportController3.downloadSalesByPlant);
router.route("/:adminId/nursery/takeinpu").get(takenurseryinput)
router.route("/:adminId/nursery/:nurseryId").get(viewall)
router.route("/:adminId/nursery/takeinput").post(createNursery)
router.route("/:adminId/nursery/insert").post(insertOne)
router.route("/:adminId/nursery/:nurseryId/insert").post(insertOne)
router.route("/:adminId/nursery/:nurseryId/getall").get(getAll)
module.exports=router