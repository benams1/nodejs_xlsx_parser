const Express = require('express');
const multer = require('multer');
const bodyParser= require('body-parser');
const parser  = require('./parseXlsx');
const PORT = process.env.PORT || 5000;
const app = new Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.post('/parse/xlsx', upload.single('file'),parser);
app.all('*',(req,res)=>{
    res.status(404).send('page not found')
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
