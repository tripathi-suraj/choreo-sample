export const apikeymiddleware=(req,res,next)=>{
    if(!req.headers.apikey){
        return res.status(403).json({status:0, message: "Please provide Apikey" });
    }
    if(req.headers.apikey !== "e1bd2282-f444-4893-b704-239d036110e4"){
            return res.status(403).json({status:0, message: "Provide Valid Apikey" });
    }
    next();
}