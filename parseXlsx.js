const xlsx2json = require('xlsx-json-js');
const path = require('path');
const fs = require('fs');
const handleError = (res,message)=>{
    res.status(400);
    res.json({status: -1, errMsg:message})
};

const unlinkFile = (path) => {
    try {
        fs.unlinkSync(path);
        console.log('file removed properly');
    } catch(err) {
        console.error(err);
    }
};


parser = (req, res, next) => {
    console.log('parseXlsx.parser request received at: ',Date.now());
    const {file} = req;
    if (!file) {
        console.log('parseXlsx.parses file is undefined');
        return handleError(res, 'missing file')
    }
    const xlsxPath = path.join('./uploads/'+file.filename);
    let nativeData;
    try{
        nativeData = xlsx2json.parse(xlsxPath);
    }
    catch(err){
        console.error(err.stack);
        unlinkFile(xlsxPath);
        return handleError(res,'file extension error');
    }
    const jsonData = nativeData[0];
    if (!jsonData){
        console.log('parseXlsx.parser file structure error');
        unlinkFile(xlsxPath);
        return handleError(res,'empty sheets');
    }
    else {
        console.log('parseXlsx.parser file parsed successfully');
        res.status(200);
        res.json({status: 1, data: jsonData.data});
    }
    unlinkFile(xlsxPath);
};
module.exports = parser;
