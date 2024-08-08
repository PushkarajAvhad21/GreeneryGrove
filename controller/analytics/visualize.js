const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();
const Order = require('../../models/order');
const path = require('path');
const fs = require('fs');

exports.visualizeSalesByPlant = async (req, res) => {
    try {
        const id=req.params.nurseryId;
        const orders = await Order.find({'items.nursery':id}).populate('items.itemId').exec();
        console.log(orders)
        for(let i=0;i<orders.length;i++){
            let val=orders[i];
            let items=val.items;
           for(let j=0;j<items.length;j++){
            if(items[j].nursery!=id){
                items.splice(j,1);
            }
           }
        }
        // const orders = await Order.find().populate('items.itemId').exec();
        const plantData = [];
        orders.forEach(order => {
            order.items.forEach(item => {
                plantData.push({
                    itemId: item.itemId._id.toString(),
                    quantity: item.quantity,
                    price: item.price,
                    createdAt: order.createdAt
                });
            });
        });

        const pythonProcess = spawn('python', ['./analytics/visualize.py', JSON.stringify(plantData)]);
        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                res.status(500).send(`Python script closed with error code ${code}`);
            } else {
                try {
                    const parsedResult = JSON.parse(result);
                    const imagePath = path.join(__dirname, '../../analytics/sales_last_30_days.png');
                    if (fs.existsSync(imagePath)) {
                        res.download(imagePath, 'sales_last_30_days.png', (err) => {
                            if (err) {
                                console.error('Error sending the file:', err);
                                res.status(500).send('Error sending the file');
                            }
                        });
                    } else {
                        res.status(404).send('Visualization not found');
                    }
                } catch (err) {
                    console.error('Error parsing result from Python script:', err);
                    res.status(500).send('Error parsing result from Python script');
                }
            }
        });

    } catch (error) {
        console.error(`Server Error: ${error.toString()}`);
        res.status(500).send(`Server Error: ${error.toString()}`);
    }
};
