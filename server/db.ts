import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'student' | 'teacher';
  grade?: number;
  className?: string;
  avatar?: string;
  createdAt: string;
}

export interface CompositionPlan {
  foreground: string; // Phía trước
  midground: string;   // Phía giữa
  background: string;  // Phía sau
}

export interface ArtCritique {
  interestingThings: string;
  composition: string;
  colors: string;
  creativeDetails: string;
  suggestions: string[];
  encouragement: string;
  topicName?: string;
  imageThumbnail?: string;
  createdAt: string;
}

export interface TeacherFeedbackItem {
  id: string;
  teacherId: string;
  teacherName: string;
  comment: string;
  createdAt: string;
}

export interface NotebookItem {
  id: string;
  userId: string;
  studentName: string;
  studentGrade: number;
  studentClass: string;
  title: string;
  grade: number;
  topicName: string;
  topicId?: string;
  mainContent: string;
  charactersAndObjects: string;
  activitiesAndDetails: string;
  composition: CompositionPlan;
  colorSuggestions: string;
  creativeSpark: string;
  materialSuggestions: string;
  studentNotes: string;
  status: 'Ý tưởng mới' | 'Đang phát triển' | 'Đã hoàn thành';
  savedCritique?: ArtCritique | null;
  sharedWithTeacher: boolean;
  teacherFeedbacks: TeacherFeedbackItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  grade: number;
  topics: string[];
  targetClass: string;
  instructions: string;
  deadline?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  notebookItems: NotebookItem[];
  assignments: Assignment[];
  sessions: Record<string, { userId: string; expiresAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'art_db.json');

function hashPassword(password: string): string {
  const salt = 'hoasini_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function getInitialData(): DatabaseSchema {
  const teacherId = 'teacher_do_thanh_thuy';
  const student1Id = 'student_minh_anh';
  const student2Id = 'student_bao_nam';
  const student3Id = 'student_linh_dan';

  const now = new Date().toISOString();

  return {
    users: [
      {
        id: teacherId,
        username: 'dothanhthuy',
        passwordHash: hashPassword('123456'),
        name: 'Cô Đỗ Thanh Thuý',
        role: 'teacher',
        className: 'Trường TH & THCS Vân Hà',
        avatar: '👩‍🏫',
        createdAt: now,
      },
      {
        id: student1Id,
        username: 'hocsinh1',
        passwordHash: hashPassword('123456'),
        name: 'Nguyễn Minh Anh',
        role: 'student',
        grade: 3,
        className: '3A',
        avatar: '🎨',
        createdAt: now,
      },
      {
        id: student2Id,
        username: 'hocsinh2',
        passwordHash: hashPassword('123456'),
        name: 'Trần Bảo Nam',
        role: 'student',
        grade: 5,
        className: '5B',
        avatar: '🚀',
        createdAt: now,
      },
      {
        id: student3Id,
        username: 'hocsinh3',
        passwordHash: hashPassword('123456'),
        name: 'Lê Linh Đan',
        role: 'student',
        grade: 1,
        className: '1B',
        avatar: '🌸',
        createdAt: now,
      },
    ],
    assignments: [
      {
        id: 'asg_1',
        teacherId,
        teacherName: 'Cô Đỗ Thanh Thuý',
        title: 'Tri ân thầy cô nhân ngày Nhà giáo',
        grade: 3,
        topics: ['Biết ơn thầy cô', 'Màu sắc em yêu'],
        targetClass: 'Toàn khối 3',
        instructions: 'Các con hãy chọn một kỷ niệm thật đẹp với thầy cô, dùng những gam màu tươi sáng ấm áp để thể hiện tấm lòng biết ơn nhé!',
        deadline: '2026-11-20',
        createdAt: now,
      },
      {
        id: 'asg_2',
        teacherId,
        teacherName: 'Cô Đỗ Thanh Thuý',
        title: 'Thế giới hòa bình trong mắt em',
        grade: 5,
        topics: ['Vì một thế giới hòa bình', 'Việt Nam đất nước, con người'],
        targetClass: 'Lớp 5B',
        instructions: 'Hãy gửi gắm thông điệp bảo vệ trẻ em, hòa bình thế giới hoặc nét đẹp hiền hòa của quê hương Việt Nam.',
        deadline: '2026-11-25',
        createdAt: now,
      },
      {
        id: 'asg_3',
        teacherId,
        teacherName: 'Cô Đỗ Thanh Thuý',
        title: 'Những chấm màu diệu kỳ',
        grade: 1,
        topics: ['Sáng tạo từ những chấm màu', 'Màu cơ bản trong Mĩ thuật'],
        targetClass: 'Lớp 1B',
        instructions: 'Bé hãy chấm thật nhiều đốm màu đỏ, vàng, lam để tạo thành một đàn bướm hoặc vườn hoa rực rỡ nhé!',
        deadline: '2026-11-18',
        createdAt: now,
      },
    ],
    notebookItems: [
      {
        id: 'item_sample_1',
        userId: student1Id,
        studentName: 'Nguyễn Minh Anh',
        studentGrade: 3,
        studentClass: '3A',
        title: 'Cơn mưa hoa hướng dương tri ân cô giáo',
        grade: 3,
        topicName: 'Biết ơn thầy cô',
        topicId: 'k3-4',
        mainContent: 'Bức tranh vẽ cô giáo đang mỉm cười hiền từ, xung quanh là các bạn nhỏ cùng thả những bông hoa hướng dương vàng rực rỡ.',
        charactersAndObjects: 'Cô giáo mặc áo dài xanh ngọc bích, 3 bạn nhỏ cầm thiệp và hoa hướng dương, bàn giáo viên có lọ hoa.',
        activitiesAndDetails: 'Một bạn đang dâng tặng hoa, hai bạn đứng vẫy tay hân hoan, trên bảng đen có dòng chữ nắn nót: "Kính chúc cô luôn vui tươi".',
        composition: {
          foreground: 'Hai bạn nhỏ dâng hoa và chiếc bàn giáo viên có khăn trải thêu ren.',
          midground: 'Cô giáo nở nụ cười tươi tắn ở vị trí trung tâm, đón nhận bó hoa.',
          background: 'Bảng lớp màu xanh lục đậm, cửa sổ nhìn ra tán bàng xanh mướt và bầu trời nắng ấm.'
        },
        colorSuggestions: 'Màu vàng hướng dương rực rỡ kết hợp xanh ngọc bích và cam ấm tạo cảm giác thân thương, chan hòa ánh sáng.',
        creativeSpark: 'Những cánh hoa hướng dương như đang bay nhẹ nhàng trong không khí như một cơn mưa hoa diệu kỳ.',
        materialSuggestions: 'Màu sáp dầu phối hợp bút chì màu để nhấn chi tiết tà áo và khuôn mặt.',
        studentNotes: 'Em muốn vẽ thêm con mèo tam thể của trường đang nằm sưởi nắng bên bậu cửa sổ nữa!',
        status: 'Đang phát triển',
        savedCritique: null,
        sharedWithTeacher: true,
        teacherFeedbacks: [
          {
            id: 'fb_1',
            teacherId,
            teacherName: 'Cô Đỗ Thanh Thuý',
            comment: 'Ý tưởng của Minh Anh rất xúc động và tươi sáng! Con nhớ phối nền phía sau thật êm để làm nổi bật tà áo dài xanh ngọc nhé.',
            createdAt: now,
          }
        ],
        createdAt: now,
        updatedAt: now,
      }
    ],
    sessions: {},
  };
}

class ArtDatabase {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.migrateToTeacherThuy();
      } catch (err) {
        console.error('Error reading db.json, reinitializing:', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
  }

  private migrateToTeacherThuy(): void {
    let changed = false;
    let teacher = this.data.users.find((u) => u.role === 'teacher');
    if (!teacher) {
      teacher = {
        id: 'teacher_do_thanh_thuy',
        username: 'dothanhthuy',
        passwordHash: hashPassword('123456'),
        name: 'Cô Đỗ Thanh Thuý',
        role: 'teacher',
        className: 'Trường TH & THCS Vân Hà',
        avatar: '👩‍🏫',
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(teacher);
      changed = true;
    } else if (teacher.name !== 'Cô Đỗ Thanh Thuý') {
      teacher.name = 'Cô Đỗ Thanh Thuý';
      teacher.className = 'Trường TH & THCS Vân Hà';
      teacher.username = 'dothanhthuy';
      changed = true;
    }

    // Update teacher feedbacks and assignments
    this.data.assignments.forEach((asg) => {
      if (asg.teacherName !== 'Cô Đỗ Thanh Thuý') {
        asg.teacherName = 'Cô Đỗ Thanh Thuý';
        changed = true;
      }
    });

    this.data.notebookItems.forEach((nb) => {
      nb.teacherFeedbacks.forEach((fb) => {
        if (fb.teacherName !== 'Cô Đỗ Thanh Thuý') {
          fb.teacherName = 'Cô Đỗ Thanh Thuý';
          changed = true;
        }
      });
    });

    if (changed) {
      this.save();
    }
  }

  private save(): void {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // Auth & User operations
  findUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());
  }

  findTeacher(): User | undefined {
    return this.data.users.find((u) => u.role === 'teacher');
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  // Student instant login (no password needed)
  findOrCreateStudent(params: {
    name: string;
    grade?: number;
    className?: string;
    avatar?: string;
  }): User {
    const trimmedName = params.name.trim();
    // Search existing student with exact or similar name
    let existing = this.data.users.find(
      (u) => u.role === 'student' && u.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      if (params.grade) existing.grade = params.grade;
      if (params.className) existing.className = params.className;
      this.save();
      return existing;
    }

    // Generate cute username
    const slug = trimmedName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    const finalUsername = (slug || 'hocsinh') + '_' + Math.floor(100 + Math.random() * 900);

    const newUser: User = {
      id: 'student_' + crypto.randomUUID(),
      username: finalUsername,
      passwordHash: hashPassword('hocsinh_nopass'),
      name: trimmedName,
      role: 'student',
      grade: params.grade || 3,
      className: params.className?.trim() || `Lớp ${params.grade || 3}`,
      avatar: params.avatar || '🎨',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  createStudent(params: {
    username: string;
    password?: string;
    name: string;
    grade: number;
    className: string;
    avatar?: string;
  }): { success: boolean; user?: User; error?: string } {
    if (this.findUserByUsername(params.username)) {
      return { success: false, error: 'Tên tài khoản này đã được sử dụng.' };
    }
    const newUser: User = {
      id: 'student_' + crypto.randomUUID(),
      username: params.username.toLowerCase().trim(),
      passwordHash: hashPassword(params.password || 'hocsinh_nopass'),
      name: params.name.trim(),
      role: 'student',
      grade: params.grade,
      className: params.className.trim(),
      avatar: params.avatar || '🎨',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return { success: true, user: newUser };
  }

  createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions[token] = { userId, expiresAt };
    this.save();
    return token;
  }

  getUserFromToken(token: string): User | undefined {
    const session = this.data.sessions[token];
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return undefined;
    }
    return this.findUserById(session.userId);
  }

  revokeSession(token: string): void {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // Notebook operations
  getStudentNotebook(userId: string): NotebookItem[] {
    return this.data.notebookItems
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getNotebookItemById(id: string): NotebookItem | undefined {
    return this.data.notebookItems.find((item) => item.id === id);
  }

  saveNotebookItem(userId: string, user: User, itemData: Partial<NotebookItem>): NotebookItem {
    const now = new Date().toISOString();
    const existingIndex = itemData.id ? this.data.notebookItems.findIndex((it) => it.id === itemData.id) : -1;

    if (existingIndex >= 0) {
      const existing = this.data.notebookItems[existingIndex];
      // Security check: only the owner can update
      if (existing.userId !== userId) {
        throw new Error('Bạn không có quyền chỉnh sửa sổ tay này.');
      }
      const updated: NotebookItem = {
        ...existing,
        title: itemData.title ?? existing.title,
        grade: itemData.grade ?? existing.grade,
        topicName: itemData.topicName ?? existing.topicName,
        topicId: itemData.topicId ?? existing.topicId,
        mainContent: itemData.mainContent ?? existing.mainContent,
        charactersAndObjects: itemData.charactersAndObjects ?? existing.charactersAndObjects,
        activitiesAndDetails: itemData.activitiesAndDetails ?? existing.activitiesAndDetails,
        composition: itemData.composition ?? existing.composition,
        colorSuggestions: itemData.colorSuggestions ?? existing.colorSuggestions,
        creativeSpark: itemData.creativeSpark ?? existing.creativeSpark,
        materialSuggestions: itemData.materialSuggestions ?? existing.materialSuggestions,
        studentNotes: itemData.studentNotes ?? existing.studentNotes,
        status: itemData.status ?? existing.status,
        savedCritique: itemData.savedCritique !== undefined ? itemData.savedCritique : existing.savedCritique,
        sharedWithTeacher: itemData.sharedWithTeacher !== undefined ? itemData.sharedWithTeacher : existing.sharedWithTeacher,
        updatedAt: now,
      };
      this.data.notebookItems[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      // Create new
      const newItem: NotebookItem = {
        id: 'nb_' + crypto.randomUUID(),
        userId,
        studentName: user.name,
        studentGrade: user.grade || 1,
        studentClass: user.className || '1A',
        title: itemData.title || 'Ý tưởng mĩ thuật mới',
        grade: itemData.grade || user.grade || 1,
        topicName: itemData.topicName || 'Chủ đề Mĩ thuật',
        topicId: itemData.topicId,
        mainContent: itemData.mainContent || '',
        charactersAndObjects: itemData.charactersAndObjects || '',
        activitiesAndDetails: itemData.activitiesAndDetails || '',
        composition: itemData.composition || { foreground: '', midground: '', background: '' },
        colorSuggestions: itemData.colorSuggestions || '',
        creativeSpark: itemData.creativeSpark || '',
        materialSuggestions: itemData.materialSuggestions || '',
        studentNotes: itemData.studentNotes || '',
        status: itemData.status || 'Ý tưởng mới',
        savedCritique: itemData.savedCritique || null,
        sharedWithTeacher: itemData.sharedWithTeacher ?? true,
        teacherFeedbacks: [],
        createdAt: now,
        updatedAt: now,
      };
      this.data.notebookItems.push(newItem);
      this.save();
      return newItem;
    }
  }

  deleteNotebookItem(userId: string, id: string): boolean {
    const index = this.data.notebookItems.findIndex((it) => it.id === id);
    if (index === -1) return false;
    if (this.data.notebookItems[index].userId !== userId) {
      throw new Error('Bạn không có quyền xóa sản phẩm này.');
    }
    this.data.notebookItems.splice(index, 1);
    this.save();
    return true;
  }

  // Teacher operations
  getSharedNotebookItems(): NotebookItem[] {
    return this.data.notebookItems
      .filter((it) => it.sharedWithTeacher)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  addTeacherFeedback(teacher: User, itemId: string, comment: string): NotebookItem {
    const item = this.getNotebookItemById(itemId);
    if (!item) {
      throw new Error('Không tìm thấy sản phẩm của học sinh.');
    }
    const feedback: TeacherFeedbackItem = {
      id: 'fb_' + crypto.randomUUID(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    item.teacherFeedbacks.push(feedback);
    item.updatedAt = new Date().toISOString();
    this.save();
    return item;
  }

  // Assignment operations
  getAssignments(grade?: number): Assignment[] {
    let list = this.data.assignments;
    if (grade) {
      list = list.filter((a) => a.grade === grade);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createAssignment(teacher: User, data: {
    title: string;
    grade: number;
    topics: string[];
    targetClass: string;
    instructions: string;
    deadline?: string;
  }): Assignment {
    const newAsg: Assignment = {
      id: 'asg_' + crypto.randomUUID(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      title: data.title.trim(),
      grade: data.grade,
      topics: data.topics,
      targetClass: data.targetClass.trim(),
      instructions: data.instructions.trim(),
      deadline: data.deadline,
      createdAt: new Date().toISOString(),
    };
    this.data.assignments.push(newAsg);
    this.save();
    return newAsg;
  }

  deleteAssignment(teacherId: string, assignmentId: string): boolean {
    const index = this.data.assignments.findIndex((a) => a.id === assignmentId);
    if (index === -1) return false;
    this.data.assignments.splice(index, 1);
    this.save();
    return true;
  }

  getAllStudents(): Omit<User, 'passwordHash'>[] {
    return this.data.users
      .filter((u) => u.role === 'student')
      .map(({ passwordHash, ...rest }) => rest);
  }
}

export const db = new ArtDatabase();
