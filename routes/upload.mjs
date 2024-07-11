import multer from "multer";
import * as path from "path";
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
const upload = multer({ storage:storage ,fileFilter:fileFilter})

function attachRoutes(app){
    app.post('/uploader',upload.single('image'),(req,res)=>{
        if(!req.file){
            return res.status(400).json({ message: "Not allowed only png jpg jpeg are allowed to upload" });        
        }
        const { deviceId} = req.body;
        res.send('Uploaded');
    })
}

export {attachRoutes}