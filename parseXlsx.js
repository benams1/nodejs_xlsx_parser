const xlsx2json = require('xlsx-json-js');
const path = require('path');
const fs = require('fs');
const handleError = (res)=>{
    res.status(400);
    res.json({status: -1, errMsg:`error to parse file`})
};
parser = (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error)
    }
    const xlsxPath = path.join('./uploads/'+file.filename);
    const nativeData = xlsx2json.parse(xlsxPath);
    if(nativeData === undefined)
        handleError(res);

    const jsonData = nativeData[0];

    if (jsonData === undefined)
        handleError(res);

    else {
        res.status(200);
        res.json({status: 1, data: jsonData.data});
    }
    try {
        fs.unlinkSync(xlsxPath);
        console.log('file removed properly');
    } catch(err) {
        console.error(err);
    }
};
module.exports = parser;
