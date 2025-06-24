const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');
app.use(cookieParser());


const app = express();
const PORT = 3000;

// Load IMEI data
const imeiDataPath = './data/imeis.json';
let imeiDB = fs.existsSync(imeiDataPath)
  ? JSON.parse(fs.readFileSync(imeiDataPath, 'utf-8'))
  : [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/welcome.html'));
});

// Multer setup for police report upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Simulated admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1234';

// ========== ROUTES ==========

// Admin Login (simple, no JWT/session yet)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.cookie('admin', 'true', { httpOnly: true });
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});
// Protect admin dashboard

app.get('/admin-dashboard.html', (req, res, next) => {
  if (req.cookies.admin === 'true') {
    next();
  } else {
    res.redirect('/admin-login.html');
  }
});

//Logout route
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin');
  res.json({ message: 'Logged out' });
});



// Get all reported IMEIs
app.get('/api/imeis', (_, res) => {
  res.json(imeiDB);
});

// Report stolen IMEI
app.post('/api/report', (req, res) => {
  const { imei } = req.body;
  if (!/^\d{15}$/.test(imei)) return res.status(400).json({ message: 'Invalid IMEI' });

  const existing = imeiDB.find(item => item.imei === imei);
  if (existing) return res.status(409).json({ message: 'Already reported' });

  imeiDB.push({ imei, status: 'stolen' });
  saveIMEIData();
  res.json({ message: 'Reported successfully' });
});

// Request removal with police report
app.post('/api/request-removal', upload.single('report'), (req, res) => {
  const { imei } = req.body;
  const reportPath = req.file?.path;

  if (!/^\d{15}$/.test(imei) || !reportPath) {
    return res.status(400).json({ message: 'Invalid data or missing report' });
  }

  const record = imeiDB.find(item => item.imei === imei);
  if (!record) return res.status(404).json({ message: 'IMEI not found' });

  record.status = 'pending_removal';
  record.report = reportPath;
  saveIMEIData();
  res.json({ message: 'Removal requested. Pending admin approval.' });
});

// Admin approves removal
app.post('/api/admin/approve-removal', (req, res) => {
  const { imei } = req.body;
  imeiDB = imeiDB.filter(item => item.imei !== imei);
  saveIMEIData();
  res.json({ message: 'IMEI removed successfully' });
});

// Admin deletes IMEI
app.post('/api/admin/delete', (req, res) => {
  const { imei } = req.body;
  imeiDB = imeiDB.filter(item => item.imei !== imei);
  saveIMEIData();
  res.json({ message: 'IMEI deleted' });
});

// Save data helper
function saveIMEIData() {
  fs.writeFileSync(imeiDataPath, JSON.stringify(imeiDB, null, 2));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  const cookieParser = require('cookie-parser');

});
