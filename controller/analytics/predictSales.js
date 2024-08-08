const mongoose = require('mongoose');
const { spawn } = require('child_process');
const Order = require('../../models/order');

exports.analyzeSalesByPlant = async (req, res) => {
    try {
        const id=req.params.nurseryId;
        const orders = await Order.find({'items.nursery':id}).populate('items.itemId').exec();
        // const orders = await Order.find().populate('items.itemId').exec();
        for(let i=0;i<orders.length;i++){
            let val=orders[i];
            let items=val.items;
           for(let j=0;j<items.length;j++){
            if(items[j].nursery!=id){
                items.splice(j,1);
            }
           }
        }
        console.log(orders)

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

        const pythonProcess = spawn('python', ['./analytics/predictsales.py', JSON.stringify(plantData)]);
        let hasResponded = false;

        pythonProcess.stdout.on('data', (data) => {
            if (!hasResponded) {
                try {
                    const result = JSON.parse(data.toString());
                    res.status(200).json(result);
                    hasResponded = true;
                } catch (err) {
                    if (!hasResponded) {
                        console.error('Error parsing data from Python script:', err);
                        res.status(500).send('Error parsing data from Python script');
                        hasResponded = true;
                    }
                }
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            if (!hasResponded) {
                console.error(`Error processing data in Python script: ${data.toString()}`);
                res.status(500).send(`Error processing data in Python script: ${data.toString()}`);
                hasResponded = true;
            }
        });

        pythonProcess.on('close', (code) => {
            if (!hasResponded && code !== 0) {
                console.error(`Python script closed with error code ${code}`);
                res.status(500).send(`Python script closed with error code ${code}`);
                hasResponded = true;
            }
        });

    } catch (error) {
        if (!hasResponded) {
            console.error(`Server Error: ${error.toString()}`);
            res.status(500).send(`Server Error: ${error.toString()}`);
            hasResponded = true;
        }
    }
};
