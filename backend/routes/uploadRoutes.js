import express from "express";
import multer from "multer";
import { uploadToCloudnaly } from "../utils/cloudnaly.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const fileUrl = await uploadToCloudnaly(req.file);
    res.json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
