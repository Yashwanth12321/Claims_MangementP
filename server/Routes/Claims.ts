import express from 'express'
const router = express.Router();

import Claim from "../Schema/Claims"
import auth from '../middlewares/Auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');

    // Create the 'uploads' folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/allclaimsnumber", async (req:any, res:any) => {
  const claims=await Claim.find()
  console.log(claims)
  const len=claims.length
  res.json({ len });
})

router.post('/', upload.single('document'), auth(['patient']), async (req, res) => {
  try {
  

    const { name, email, claimAmount, description } = req.body;
    
    // Move the uploaded file into the user's specific folder *after* multer uploads it
    const userUploadPath = path.join(__dirname, '../uploads', email);
    if (!fs.existsSync(userUploadPath)) {
      fs.mkdirSync(userUploadPath, { recursive: true });
    }

    let filePath = '';
    if (req.file) {
      const newFilePath = path.join(userUploadPath, req.file.filename);
      fs.renameSync(req.file.path, newFilePath);
      filePath = `uploads/${email}/${req.file.filename}`;
    }

    const claim = new Claim({
      name,
      id:uuid(),
      email,
      claimAmount,
      description,
      document: filePath,
      status: 'Pending',
      submissionDate: new Date(),
      approvedAmount: 0,
      insurerComments: '',
      reviewedBy: '',
      reviewedDate: null
    });

    await claim.save();
    res.status(201).json({ claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
router.get('/', auth(['patient']), async (req:any, res:any) => {
  
    const email =req.user.email
    const claims=await Claim.find({email})    
    console.log(claims)
  res.json({ claims });
});


// Get all claims
router.get('/all', auth(['insurer']), async (req:any, res:any) => {
  const claims = await Claim.find();
  res.json({ claims });
});

// Get a claim by ID
router.get('/:id', auth(['insurer']), async (req:any, res:any) => {
  const claim = await Claim.findOne({_id:req.params.id});
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  console.log(claim)
  res.json({ claim });
});

// Update a claim
router.put('/:id', auth(['insurer']), async (req:any, res:any) => {
  const { status, approvedAmount, insurerComments } = req.body;
  const updatedClaim = await Claim.findOneAndUpdate({_id:req.params.id}, { status, approvedAmount, insurerComments }, { new: true });
  res.json({ updatedClaim });
});

router.delete('/all', auth(['insurer']), async (req:any, res:any) => {
  await Claim.deleteMany({});
  res.json({ message: 'All claims deleted' });
});

export default router;

