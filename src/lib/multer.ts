import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, "public/uploads");
    },

    filename: (req:any, file:any, cb:any) => {
        
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({storage:storage})