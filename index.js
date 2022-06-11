const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const multer = require('multer');
var fs = require('fs');
var path = require("path");

const app = express();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const mimetype = file.mimetype
        let subfix = mimetype.substring(file.mimetype.lastIndexOf('/') + 1)
        cb(null, "PGONE-MEDIA" + '-' + Date.now() + '.' + subfix)
    }
})

var upload = multer({ storage: storage })

app.use('/media', express.static('uploads'));

app.post("/media/upload", upload.any(), function (req, res) {
    var files = req.files;
    if (files) {
        res.send({
            statusCode: res.statusCode,
            result: {
                media: files
            }
        })
    }
});

// enable files upload

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);