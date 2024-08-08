const { exec } = require('child_process');
const path = require('path');
const ADMIN=require('../../models/google_admin.js')
exports.exportCSV = async(req, res) => {
    const adminId=req.params.adminId
    let admindata=await ADMIN.findById(adminId);
  const nurseryId = admindata.nursery._id; // Assume the nursery ID is passed as a query parameter
    console.log(nurseryId)
  if (!nurseryId) {
    return res.status(400).send('Nursery ID is required');
  }

  exec(`python3 analytics/getcsv.py ${nurseryId}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).send('Internal Server Error');
    }

    const filePath = path.join(__dirname, '../../analytics/mongodb_data.csv');
    res.download(filePath, 'mongodb_data.csv', (err) => {
      if (err) {
        console.error(`Error sending CSV file: ${err}`);
        return res.status(500).send('Internal Server Error');
      }
    });
  });
};
