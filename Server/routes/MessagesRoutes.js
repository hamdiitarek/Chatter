import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controller/MessagesController.js";
import multer from "multer";

const messagesRoutes = Router();

// Configure Multer with file storage and filename generation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/files"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    // Allow only image and PDF files
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  }
});

messagesRoutes.post("/get-messages", verifyToken, getMessages);

messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

// Error handling middleware
messagesRoutes.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default messagesRoutes;