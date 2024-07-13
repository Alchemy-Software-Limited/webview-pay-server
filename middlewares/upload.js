const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");
var dir = "public";

const MAX_FILE_SIZE = 1024 * 1024 * 5

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req,file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var subDir;
            if(file.mimetype.startsWith("image/")) subDir = `${file.mimetype.split("/")[0]}s`
            if (!fs.existsSync(`${dir}/${subDir}`)) {
                fs.mkdirSync(`${dir}/${subDir}`);
            }
            callback(null, `${dir}/${subDir}`);
        },
        filename: function (req, file, callback) {
            callback(
                null,
                "/" +
                file.fieldname +
                "-File" +
                Date.now() +
                path.extname(file.originalname)
            );
        }
    }),
        limits: {
            fileSize: MAX_FILE_SIZE
        },
    fileFilter: (req, file, callback) => {
        // console.log('length: ', req.headers['content-length'])
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > MAX_FILE_SIZE) {
            return callback(new ApiError(httpStatus.FORBIDDEN, `File size limit exceeded ${MAX_FILE_SIZE/1024**2}MB.`));
        }
        // --


        callback(null, true);
    }
});

module.exports = upload;
