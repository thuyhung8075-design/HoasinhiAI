import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, User, verifyPassword } from './server/db.ts';
import { generateArtIdeas, reviewStudentArtwork } from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for drawing uploads (base64)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to get authenticated user from Authorization header
export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  const user = db.getUserFromToken(token);
  if (!user) {
    res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
    return;
  }
  req.user = user;
  req.token = token;
  next();
}

function teacherOnlyMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'teacher') {
    res.status(403).json({ error: 'Chỉ giáo viên mới có quyền thực hiện thao tác này.' });
    return;
  }
  next();
}

// ==========================================
// AUTH ROUTES
// ==========================================

// Teacher & General Login (with password)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Vui lòng nhập tên tài khoản và mật khẩu.' });
    return;
  }

  const cleanUsername = String(username).toLowerCase().trim();
  let user = db.findUserByUsername(cleanUsername);
  if (!user && (cleanUsername === 'dothanhthuy' || cleanUsername === 'giaovien' || cleanUsername === 'cothuy')) {
    user = db.findTeacher();
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Mật khẩu giáo viên không đúng. Vui lòng thử lại!' });
    return;
  }

  const token = db.createSession(user.id);
  const { passwordHash, ...userProfile } = user;
  res.json({ token, user: userProfile });
});

// Student Passwordless Login (Học sinh vào không cần mật khẩu)
app.post('/api/auth/student-login', (req: Request, res: Response) => {
  const { name, grade, className, avatar, studentId } = req.body;
  let user: User | undefined;

  if (studentId) {
    user = db.findUserById(String(studentId));
  } else if (name && String(name).trim()) {
    user = db.findOrCreateStudent({
      name: String(name).trim(),
      grade: Number(grade) || 3,
      className: className ? String(className).trim() : `Lớp ${Number(grade) || 3}`,
      avatar: avatar ? String(avatar) : '🎨',
    });
  } else {
    // Default to sample student Minh Anh
    user = db.findUserById('student_minh_anh') || (db.getAllStudents()[0] as User);
  }

  if (!user) {
    res.status(400).json({ error: 'Không thể đăng nhập học sinh.' });
    return;
  }

  const token = db.createSession(user.id);
  const { passwordHash, ...userProfile } = user;
  res.json({ token, user: userProfile });
});

// Get quick list of students for easy 1-click select
app.get('/api/auth/public-students', (_req: Request, res: Response) => {
  const students = db.getAllStudents();
  res.json({ students });
});

// Register student account
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, password, name, grade, className, avatar } = req.body;
  if (!username || !password || !name) {
    res.status(400).json({ error: 'Vui lòng điền đầy đủ tên đăng nhập, mật khẩu và họ tên.' });
    return;
  }

  // Enforce student role for self-registration (Teacher accounts can never self-register)
  const result = db.createStudent({
    username,
    password,
    name,
    grade: Number(grade) || 1,
    className: className || '1A',
    avatar: avatar || '🎨',
  });

  if (!result.success || !result.user) {
    res.status(400).json({ error: result.error || 'Đăng ký không thành công.' });
    return;
  }

  const token = db.createSession(result.user.id);
  const { passwordHash, ...userProfile } = result.user;
  res.json({ token, user: userProfile });
});

// Get current user profile
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  const { passwordHash, ...userProfile } = req.user;
  res.json({ user: userProfile });
});

// Logout
app.post('/api/auth/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (req.token) {
    db.revokeSession(req.token);
  }
  res.json({ success: true, message: 'Đã đăng xuất an toàn.' });
});

// Teacher creates student account
app.post(
  '/api/auth/teacher/create-student',
  authMiddleware,
  teacherOnlyMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const { username, password, name, grade, className, avatar } = req.body;
    if (!username || !password || !name) {
      res.status(400).json({ error: 'Thiếu thông tin học sinh cần tạo.' });
      return;
    }
    const result = db.createStudent({
      username,
      password,
      name,
      grade: Number(grade) || 1,
      className: className || '1A',
      avatar: avatar || '🎨',
    });

    if (!result.success || !result.user) {
      res.status(400).json({ error: result.error });
      return;
    }

    const { passwordHash, ...userProfile } = result.user;
    res.json({ success: true, user: userProfile });
  }
);

// Teacher lists students
app.get(
  '/api/auth/teacher/students',
  authMiddleware,
  teacherOnlyMiddleware,
  (_req: AuthenticatedRequest, res: Response) => {
    const students = db.getAllStudents();
    res.json({ students });
  }
);

// ==========================================
// GEMINI AI ROUTES
// ==========================================

// Generate 3 unique art ideas
app.post('/api/ideas/generate', async (req: Request, res: Response) => {
  try {
    const { grade, topicName, studentWish, previousTitles } = req.body;
    if (!grade || !topicName) {
      res.status(400).json({ error: 'Vui lòng chọn khối lớp và chủ đề Mĩ thuật.' });
      return;
    }

    const numGrade = Number(grade);
    if (![1, 2, 3, 4, 5].includes(numGrade)) {
      res.status(400).json({ error: 'Khối lớp không hợp lệ. Vui lòng chọn khối từ 1 đến 5.' });
      return;
    }

    // Sanitize and limit student wish to 500 chars (Quy tắc sư phạm & an toàn dữ liệu)
    const sanitizedWish = studentWish ? String(studentWish).slice(0, 500).trim() : undefined;
    const sanitizedTopic = String(topicName).slice(0, 150).trim();

    const result = await generateArtIdeas({
      grade: numGrade,
      topicName: sanitizedTopic,
      studentWish: sanitizedWish,
      previousTitles: Array.isArray(previousTitles) ? previousTitles.slice(0, 30) : undefined,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error generating art ideas:', error);
    const msg = error?.message || '';
    if (error?.code === 'MISSING_GEMINI_API_KEY' || msg.includes('MISSING_GEMINI_API_KEY')) {
      res.status(503).json({
        error:
          'Chưa cấu hình khóa bí mật GEMINI_API_KEY. Vui lòng vào Google AI Studio > Settings > Secrets, tạo secret có tên GEMINI_API_KEY với API key của bạn để kích hoạt Trợ lý ý tưởng AI thật.',
        code: 'MISSING_GEMINI_API_KEY',
      });
      return;
    }

    res.status(500).json({
      error: msg || 'Không thể tạo ý tưởng từ AI lúc này. Vui lòng thử lại!',
    });
  }
});

// Review student artwork image (Soi tranh)
app.post('/api/art/review', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, topicName, grade, studentDescription } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'Vui lòng chọn ảnh bức tranh cần soi.' });
      return;
    }

    const result = await reviewStudentArtwork({
      imageBase64: String(imageBase64),
      mimeType: String(mimeType || 'image/jpeg'),
      topicName: topicName ? String(topicName) : undefined,
      grade: grade ? Number(grade) : undefined,
      studentDescription: studentDescription ? String(studentDescription) : undefined,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error reviewing artwork:', error);
    res.status(500).json({
      error: error.message || 'Không thể phân tích tranh lúc này. Vui lòng kiểm tra lại ảnh và thử lại!',
    });
  }
});

// ==========================================
// SỔ TAY SÁNG TẠO (NOTEBOOK) ROUTES
// ==========================================

// Get student's notebook items
app.get('/api/notebook', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  const items = db.getStudentNotebook(req.user.id);
  res.json({ items });
});

// Create or update notebook item
app.post('/api/notebook', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  try {
    const saved = db.saveNotebookItem(req.user.id, req.user, req.body);
    res.json({ success: true, item: saved });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Không thể lưu ý tưởng.' });
  }
});

// Update single item
app.put('/api/notebook/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  try {
    const saved = db.saveNotebookItem(req.user.id, req.user, {
      ...req.body,
      id: req.params.id,
    });
    res.json({ success: true, item: saved });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Không thể cập nhật ý tưởng.' });
  }
});

// Delete notebook item
app.delete('/api/notebook/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  try {
    const deleted = db.deleteNotebookItem(req.user.id, req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Không tìm thấy mục cần xóa.' });
      return;
    }
    res.json({ success: true, message: 'Đã xóa ý tưởng thành công.' });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Không thể xóa ý tưởng.' });
  }
});

// ==========================================
// ASSIGNMENT (NHIỆM VỤ MĨ THUẬT) ROUTES
// ==========================================

// Get assignments
app.get('/api/assignments', (req: Request, res: Response) => {
  const grade = req.query.grade ? Number(req.query.grade) : undefined;
  const list = db.getAssignments(grade);
  res.json({ assignments: list });
});

// Create assignment (Teacher only)
app.post(
  '/api/assignments',
  authMiddleware,
  teacherOnlyMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, grade, topics, targetClass, instructions, deadline } = req.body;
      if (!title || !grade || !topics || !instructions) {
        res.status(400).json({ error: 'Vui lòng nhập đầy đủ tiêu đề, khối lớp, chủ đề và hướng dẫn.' });
        return;
      }
      const newAsg = db.createAssignment(req.user!, {
        title,
        grade: Number(grade),
        topics: Array.isArray(topics) ? topics : [topics],
        targetClass: targetClass || 'Toàn trường',
        instructions,
        deadline,
      });
      res.json({ success: true, assignment: newAsg });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete assignment (Teacher only)
app.delete(
  '/api/assignments/:id',
  authMiddleware,
  teacherOnlyMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const deleted = db.deleteAssignment(req.user!.id, req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Không tìm thấy nhiệm vụ cần xóa.' });
      return;
    }
    res.json({ success: true, message: 'Đã xóa nhiệm vụ thành công.' });
  }
);

// ==========================================
// GÓC GIÁO VIÊN (TEACHER'S CORNER) ROUTES
// ==========================================

// Get all shared student submissions
app.get(
  '/api/teacher/submissions',
  authMiddleware,
  teacherOnlyMiddleware,
  (_req: AuthenticatedRequest, res: Response) => {
    const items = db.getSharedNotebookItems();
    res.json({ submissions: items });
  }
);

// Teacher adds feedback to student's work
app.post(
  '/api/teacher/feedback',
  authMiddleware,
  teacherOnlyMiddleware,
  (req: AuthenticatedRequest, res: Response) => {
    const { itemId, comment } = req.body;
    if (!itemId || !comment) {
      res.status(400).json({ error: 'Vui lòng nhập nội dung nhận xét.' });
      return;
    }
    try {
      const updated = db.addTeacherFeedback(req.user!, itemId, comment);
      res.json({ success: true, item: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

// System status
app.get('/api/system/status', (_req: Request, res: Response) => {
  res.json({
    appName: 'Họa Sĩ Nhí AI – Góc Sáng Tạo Mĩ Thuật',
    status: 'online',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    currentTime: new Date().toISOString(),
  });
});

// ==========================================
// VITE INTEGRATION / STATIC ASSETS
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎨 Họa Sĩ Nhí AI server đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
