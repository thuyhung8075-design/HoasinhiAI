import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGetPublicStudents } from '../services/api';
import { UserProfile } from '../types';
import { X, Sparkles, GraduationCap, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'student' | 'teacher';
}

const AVATAR_OPTIONS = ['🎨', '🌸', '🚀', '🐱', '🦁', '🦄', '🐼', '🦊'];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'student',
}) => {
  const { login, loginStudent } = useAuth();
  const { showToast } = useToast();

  const [roleMode, setRoleMode] = useState<'student' | 'teacher'>(defaultMode);

  // Student mode state (NO PASSWORD REQUIRED)
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState<number>(3);
  const [studentClass, setStudentClass] = useState('3A');
  const [studentAvatar, setStudentAvatar] = useState('🎨');
  const [publicStudents, setPublicStudents] = useState<UserProfile[]>([]);

  // Teacher mode state
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiGetPublicStudents()
        .then((res) => setPublicStudents(res.students || []))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Student instant login
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      showToast('Bé hãy nhập tên của mình vào nhé!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginStudent({
        name: studentName.trim(),
        grade: studentGrade,
        className: studentClass.trim() || `Lớp ${studentGrade}`,
        avatar: studentAvatar,
      });
      showToast(`Chào mừng bạn nhỏ ${studentName.trim()} đã vào góc sáng tạo!`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Lỗi đăng nhập học sinh', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStudentSelect = async (st: UserProfile) => {
    setIsSubmitting(true);
    try {
      await loginStudent({
        studentId: st.id,
        name: st.name,
        grade: st.grade,
        className: st.className,
      });
      showToast(`Chào mừng ${st.name} quay lại góc vẽ tranh!`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Lỗi đăng nhập học sinh', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Teacher login
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherPassword) {
      showToast('Vui lòng nhập mật khẩu giáo viên.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await login('dothanhthuy', teacherPassword);
      showToast('Đăng nhập thành công! Chào mừng Giáo viên vào Góc giáo viên.', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Mật khẩu giáo viên không đúng, vui lòng kiểm tra lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 p-5 flex items-center justify-between text-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-2xl border-2 border-amber-300">
              🎨
            </div>
            <div>
              <h3 className="text-xl font-black font-['Nunito']">Đăng nhập Họa Sĩ Nhí AI</h3>
              <p className="text-xs font-bold text-amber-900">
                Chọn vai trò của bạn để bước vào thế giới sắc màu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-xs"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Main Role Tabs */}
        <div className="grid grid-cols-2 p-2 bg-amber-50/70 border-b border-amber-200 gap-2">
          <button
            type="button"
            onClick={() => setRoleMode('student')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
              roleMode === 'student'
                ? 'bg-amber-400 text-amber-950 shadow-md border-2 border-amber-500 scale-101'
                : 'bg-white text-slate-700 hover:bg-amber-100 border border-slate-200'
            }`}
          >
            <span className="text-lg">🎨</span>
            <span>Em là Học sinh</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleMode('teacher')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
              roleMode === 'teacher'
                ? 'bg-purple-600 text-white shadow-md border-2 border-purple-700 scale-101'
                : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            <span className="text-lg">👩‍🏫</span>
            <span>Giáo viên</span>
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* ========================================= */}
          {/* TAB 1: HỌC SINH (KHÔNG CẦN MẬT KHẨU) */}
          {/* ========================================= */}
          {roleMode === 'student' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-xs text-emerald-950 font-bold leading-relaxed flex items-start gap-2.5">
                <span className="text-2xl shrink-0">✨</span>
                <div>
                  <span className="font-black text-emerald-900 block text-sm mb-0.5">
                    Học sinh không cần mật khẩu!
                  </span>
                  Bé chỉ cần chọn bạn có sẵn bên dưới hoặc gõ tên của mình là vào sáng tạo ngay nhé!
                </div>
              </div>

              {/* Quick Select Existing Student */}
              {publicStudents.length > 0 && (
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2">
                    Bấm vào tên bé để vào ngay (1 chạm):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {publicStudents.slice(0, 6).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleQuickStudentSelect(st)}
                        className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-200/80 border-2 border-amber-300 text-left transition hover:scale-102 flex flex-col justify-between"
                      >
                        <div className="text-2xl mb-1">{st.avatar || '🎨'}</div>
                        <div className="font-black text-slate-900 text-xs line-clamp-1">{st.name}</div>
                        <div className="text-[10px] font-bold text-amber-800">
                          {st.className || `Khối ${st.grade}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Or enter new student info */}
              <form onSubmit={handleStudentSubmit} className="pt-2 border-t border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-700">
                  Hoặc bé nhập tên mới nếu chưa có trong danh sách:
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Họ và tên của bé:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Anh Thư"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 font-bold text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                    <select
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((g) => (
                        <option key={g} value={g}>
                          Lớp {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tên lớp:</label>
                    <input
                      type="text"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      placeholder="Ví dụ: 3A, 4B"
                      className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Chọn hình đại diện yêu thích:
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStudentAvatar(item)}
                        className={`w-9 h-9 text-lg rounded-xl border-2 transition ${
                          studentAvatar === item
                            ? 'border-amber-500 bg-amber-100 scale-110 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Vào Góc Sáng Tạo Ngay</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 2: GIÁO VIÊN */}
          {/* ========================================= */}
          {roleMode === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 flex items-center gap-3">
                <span className="text-3xl">👩‍🏫</span>
                <div>
                  <div className="font-black text-purple-950 text-base">Giáo viên</div>
                  <div className="text-xs font-bold text-purple-700">
                    Giáo viên Mĩ thuật • Trường TH & THCS Vân Hà
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu đăng nhập giáo viên:
                </label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-400 font-bold text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm active:scale-98"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{isSubmitting ? 'Đang kiểm tra...' : 'Vào Góc Giáo Viên'}</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Quyền giáo viên: Giao nhiệm vụ, quản lý học sinh và gửi nhận xét bài vẽ.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
