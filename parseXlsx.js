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
    const {file} = req;
    if (!file) {
        return handleError(res, 'missing file')
    }
    const xlsxPath = path.join('./uploads/'+file.filename);
    let nativeData;
    try{
        nativeData = xlsx2json.parse(xlsxPath);
    }
    catch(err){
        unlinkFile(xlsxPath);
        return handleError(res,'file extension error');
    }
    const jsonData = nativeData[0];
    if (!jsonData){
        unlinkFile(xlsxPath);
        return handleError(res,'empty sheets');
    }
    else {
        res.status(200);
        res.json({status: 1, data: jsonData.data});
    }
    unlinkFile(xlsxPath);
};
module.exports = parser;
