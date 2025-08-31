import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import db from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Debug: Check if Cloudinary is configured properly
console.log('Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API key exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API secret exists:', !!process.env.CLOUDINARY_API_SECRET);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload scan endpoint (Technicians only)
router.post('/upload', authenticateToken, requireRole('technician'), upload.single('scanImage'), async (req, res) => {
  try {
    const { patientName, patientId, scanType, region } = req.body;

    if (!patientName || !patientId || !scanType || !region || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Uploading file to Cloudinary:', {
      patientName,
      patientId,
      scanType,
      region,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'oralvis-scans',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );
      
      uploadStream.end(req.file.buffer);
    });

    // Save to database
    db.run(
      `INSERT INTO scans (patient_name, patient_id, scan_type, region, image_url, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patientName, patientId, scanType, region, uploadResult.secure_url, req.user.id],
      function(err) {
        if (err) {
          console.error('Database insert error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        console.log('Scan saved to database with ID:', this.lastID);
        
        res.json({
          message: 'Scan uploaded successfully',
          scanId: this.lastID,
          imageUrl: uploadResult.secure_url
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// Get all scans endpoint (Dentists only)
router.get('/', authenticateToken, requireRole('dentist'), (req, res) => {
  db.all(`
    SELECT s.*, u.name as technician_name 
    FROM scans s 
    JOIN users u ON s.uploaded_by = u.id 
    ORDER BY s.upload_date DESC
  `, (err, scans) => {
    if (err) {
      console.error('Database fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Fetched', scans.length, 'scans for dentist');
    res.json(scans);
  });
});

// Get single scan by ID (Both roles can access)
router.get('/:id', authenticateToken, (req, res) => {
  const scanId = req.params.id;
  
  db.get(`
    SELECT s.*, u.name as technician_name 
    FROM scans s 
    JOIN users u ON s.uploaded_by = u.id 
    WHERE s.id = ?
  `, [scanId], (err, scan) => {
    if (err) {
      console.error('Database fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    res.json(scan);
  });
});

// Delete scan endpoint (Technicians only - can delete their own scans)
router.delete('/:id', authenticateToken, requireRole('technician'), (req, res) => {
  const scanId = req.params.id;
  
  // First check if the scan exists and belongs to the current user
  db.get(
    'SELECT * FROM scans WHERE id = ? AND uploaded_by = ?',
    [scanId, req.user.id],
    (err, scan) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!scan) {
        return res.status(404).json({ error: 'Scan not found or you do not have permission to delete it' });
      }
      
      // Delete the scan
      db.run(
        'DELETE FROM scans WHERE id = ?',
        [scanId],
        function(err) {
          if (err) {
            console.error('Database delete error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({ message: 'Scan deleted successfully' });
        }
      );
    }
  );
});

export default router;