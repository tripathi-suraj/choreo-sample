import multer from "multer";
import path from "path";
import { dirname,join,extname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, (new Date()).toISOString() + '-' +  file.originalname)
    }
})
  
const fileFilter = (req, file, cb) => {
if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb (null, true)
} else {
    cb (null, false)
}
}

function attachRoutes(app){
    console.log(process.base);
    app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
    app.post('/uploader',(req,res)=>{
        if(!req.file){
            return res.status(400).json({ message: "Not allowed only png jpg jpeg are allowed to upload" });        
        }

        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(extname(req.file.originalname).toLowerCase());
        const mimeType = fileTypes.test(req.file.mimetype);
        if (!extname || !mimeType) {
            return res.status(400).json({ message: "Not allowed only png jpg jpeg are allowed to upload" });
        }
        const { deviceId} = req.body;
        res.send('Uploaded');
    })
}

export {attachRoutes}