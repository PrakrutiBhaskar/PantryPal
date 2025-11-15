import multer from "multer";
import fs from "fs";

// Ensure folder exists
if (!fs.existsSync("uploads/profile")) {
  fs.mkdirSync("uploads/profile", { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/profile/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadProfile = multer({ storage });
