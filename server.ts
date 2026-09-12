import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  reorderDevelopers,
  getSiteSettings,
  updateSiteSettings
} from './server/db.js';
import {
  verifyPassword,
  generateToken,
  validateToken,
  requireAuth
} from './server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('الملفات المدعومة هي: JPG, PNG, WEBP, SVG فقط'));
    }
  }
});

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve uploads explicitly
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (!password || !verifyPassword(password)) {
      return res.status(401).json({
        success: false,
        error: 'كلمة المرور غير صحيحة'
      });
    }
    const token = generateToken();
    return res.json({ success: true, token });
  });

  // Auth: Verify token
  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const isValid = validateToken(token);
    res.json({ valid: isValid });
  });

  // Developers: Get list
  app.get('/api/developers', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const isAdmin = validateToken(token);

    // Only admins see hidden developers
    const developers = getDevelopers(!isAdmin);
    res.json(developers);
  });

  // Developers: Get single
  app.get('/api/developers/:id', (req, res) => {
    const dev = getDeveloperById(req.params.id);
    if (!dev) {
      return res.status(404).json({ error: 'المطور غير موجود' });
    }
    res.json(dev);
  });

  // Developers: Create (Admin only)
  app.post('/api/developers', requireAuth, (req, res) => {
    try {
      const {
        name,
        role,
        bio,
        quote,
        image_url,
        github_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        email,
        website_url,
        sort_order,
        is_visible
      } = req.body;

      if (!name || !role) {
        return res.status(400).json({ error: 'الاسم والمسمى الوظيفي مطلوبان' });
      }

      const newDev = createDeveloper({
        name,
        role,
        bio: bio || '',
        quote: quote || '',
        image_url: image_url || '/uploads/default-avatar.svg',
        github_url: github_url || '',
        linkedin_url: linkedin_url || '',
        facebook_url: facebook_url || '',
        instagram_url: instagram_url || '',
        email: email || '',
        website_url: website_url || '',
        sort_order: typeof sort_order === 'number' ? sort_order : 99,
        is_visible: is_visible !== undefined ? Boolean(is_visible) : true
      });

      res.status(201).json(newDev);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Developers: Update (Admin only)
  app.put('/api/developers/:id', requireAuth, (req, res) => {
    try {
      const updated = updateDeveloper(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'المطور غير موجود' });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Developers: Delete (Admin only)
  app.delete('/api/developers/:id', requireAuth, (req, res) => {
    try {
      const dev = getDeveloperById(req.params.id);
      const success = deleteDeveloper(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'المطور غير موجود' });
      }

      // Cleanup image if it was a local upload
      if (dev?.image_url && dev.image_url.startsWith('/uploads/dev-')) {
        const filePath = path.join(process.cwd(), 'public', dev.image_url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Error deleting developer image:', err);
          }
        }
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Developers: Reorder (Admin only)
  app.post('/api/developers/reorder', requireAuth, (req, res) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: 'قائمة المعرفات مطلوبة' });
      }
      const updated = reorderDevelopers(orderedIds);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Site Settings: Get
  app.get('/api/settings', (_req, res) => {
    const settings = getSiteSettings();
    res.json(settings);
  });

  // Site Settings: Update (Admin only)
  app.put('/api/settings', requireAuth, (req, res) => {
    try {
      const updated = updateSiteSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Media: Upload (Admin only)
  app.post('/api/upload', requireAuth, (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `خطأ في رفع الملف: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'لم يتم تحديد أي ملف' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    });
  });

  // Media: List all uploaded files (Admin only)
  app.get('/api/media', requireAuth, (_req, res) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        return res.json([]);
      }
      const files = fs.readdirSync(UPLOADS_DIR);
      const mediaList = files
        .filter(file => !file.startsWith('.'))
        .map(file => {
          const filePath = path.join(UPLOADS_DIR, file);
          const stat = fs.statSync(filePath);
          return {
            name: file,
            url: `/uploads/${file}`,
            size: stat.size,
            created_at: stat.birthtime.toISOString()
          };
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      res.json(mediaList);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Media: Delete an uploaded file (Admin only)
  app.delete('/api/media/:filename', requireAuth, (req, res) => {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true });
      }
      res.status(404).json({ error: 'الملف غير موجود' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware / SPA fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
