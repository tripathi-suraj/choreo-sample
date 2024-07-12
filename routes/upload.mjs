import multer from "multer";
import * as path from "path";
import * as fs from "fs";

const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb (null, true)
    } else {
        cb (null, false)
    }
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate a unique file name
    }
});
const upload = multer({ storage:storage ,fileFilter:fileFilter});
var i=0;
function attachRoutes(app){
    console.log(process.vars);
    app.post('/uploader',upload.single('image'),(req,res)=>{
        /*if(req.headers.apikey !== "e1bd2282-f444-4893-b704-239d036110e4"){
            return res.status(403).json({status:0, message: "Provide Valid Apikey" });
        }*/
        if(i==5){
            i=0;
            return res.status(503).send('<h1>503 Internal Server Error</h1>'); 
        }
        if(!req.file){
            return res.status(400).json({ status:0, message: "Not allowed only png jpg jpeg are allowed to upload" });        
        }
        i++;
        res.send({status:1,message:'File Uploaded Succesfully'});
    })

    app.get('/cleanfolder',(req,res)=>{
        if(req.headers.apikey !== "kill-e1bd2282-f444-4893-b704-239d036110e4"){
            return res.status(403).json({status:0, message: "Provide Valid Apikey" });
        }
        let message= process.autokill ? 'Auto Kill Started': 'Auto Kill Stopped';
        process.autokill = ! process.autokill;
        res.send({status:1,message:message});
    })

    app.get('/getfiles',(req,res)=>{
        fs.readFileSync()
    })
}

export {attachRoutes}