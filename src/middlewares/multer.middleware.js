import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
   
export const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
      console.log(file.fieldname);
      if (file.fieldname === "avatar"  ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
})