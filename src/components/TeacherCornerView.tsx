import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NotebookItem, Assignment, UserProfile } from '../types';
import {
  apiTeacherGetSubmissions,
  apiTeacherAddFeedback,
  apiGetAssignments,
  apiCreateAssignment,
  apiDeleteAssignment,
  apiTeacherCreateStudent,
  apiTeacherGetStudents,
} from '../services/api';
import {
  GraduationCap,
  ClipboardList,
  Plus,
  Send,
  MessageSquare,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Palette,
  Eye,
  Trash2,
  UserPlus,
  Users,
  Calendar,
  Lock,
  Sparkles,
  BookOpen,
  X,
} from 'lucide-react';
import { CURRICULUM_TOPICS, getTopicsForGrade } from '../data/curriculum';

interface TeacherCornerViewProps {
  onOpenLogin: () => void;
}

export const TeacherCornerView: React.FC<TeacherCornerViewProps> = ({ onOpenLogin }) => {
  const { user, isTeacher, quickLogin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments' | 'students'>(
    'submissions'
  );

  // Submissions data & filters
  const [submissions, setSubmissions] = useState<NotebookItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected submission to review & comment
  const [selectedSubmission, setSelectedSubmission] = useState<NotebookItem | null>(null);
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [isSendingComment, setIsSendingComment] = useState<boolean>(false);

  // Assignments data
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgGrade, setAsgGrade] = useState<number>(3);
  const [asgSelectedTopics, setAsgSelectedTopics] = useState<string[]>([]);
  const [asgTargetClass, setAsgTargetClass] = useState('Toàn khối 3');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgDeadline, setAsgDeadline] = useState('');
  const [isSubmittingAsg, setIsSubmittingAsg] = useState(false);

  // Students list & creation
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('123456');
  const [newStudentGrade, setNewStudentGrade] = useState<number>(3);
  const [newStudentClass, setNewStudentClass] = useState('3A');
  const [newStudentAvatar, setNewStudentAvatar] = useState('🎨');
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  // Load Submissions
  const loadSubmissions = async () => {
    if (!isTeacher) return;
    setIsLoadingSubmissions(true);
    try {
      const res = await apiTeacherGetSubmissions();
      setSubmissions(res.submissions || []);
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải bài của học sinh.', 'error');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Load Assignments
  const loadAssignments = async () => {
    setIsLoadingAssignments(true);
    try {
      const res = await apiGetAssignments();
      setAssignments(res.assignments || []);
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải danh sách nhiệm vụ.', 'error');
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  // Load Students
  const loadStudents = async () => {
    if (!isTeacher) return;
    setIsLoadingStudents(true);
    try {
      const res = await apiTeacherGetStudents();
      setStudents(res.students || []);
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải danh sách học sinh.', 'error');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (isTeacher) {
      loadSubmissions();
      loadAssignments();
      loadStudents();
    }
  }, [isTeacher]);

  // When assignment grade changes, reset selected topics
  useEffect(() => {
    const topics = getTopicsForGrade(asgGrade);
    if (topics.length > 0) {
      setAsgSelectedTopics([topics[0].name]);
      setAsgTargetClass(`Toàn khối ${asgGrade}`);
    }
  }, [asgGrade]);

  // Handle send teacher comment
  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !teacherComment.trim()) {
      showToast('Vui lòng nhập nội dung nhận xét cho học sinh.', 'error');
      return;
    }

    setIsSendingComment(true);
    try {
      const res = await apiTeacherAddFeedback({
        itemId: selectedSubmission.id,
        comment: teacherComment.trim(),
      });

      showToast(`Đã gửi nhận xét cho học sinh ${selectedSubmission.studentName}!`, 'success');
      setTeacherComment('');
      setSelectedSubmission(res.item);
      await loadSubmissions();
    } catch (err: any) {
      showToast(err.message || 'Không thể gửi nhận xét.', 'error');
    } finally {
      setIsSendingComment(false);
    }
  };

  // Handle Create Assignment
  const handleCreateAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim() || asgSelectedTopics.length === 0 || !asgInstructions.trim()) {
      showToast('Vui lòng điền đầy đủ tiêu đề, chọn chủ đề và hướng dẫn.', 'error');
      return;
    }

    setIsSubmittingAsg(true);
    try {
      await apiCreateAssignment({
        title: asgTitle.trim(),
        grade: asgGrade,
        topics: asgSelectedTopics,
        targetClass: asgTargetClass.trim() || `Khối ${asgGrade}`,
        instructions: asgInstructions.trim(),
        deadline: asgDeadline || undefined,
      });

      showToast('Đã tạo nhiệm vụ Mĩ thuật thành công!', 'success');
      setIsCreatingAssignment(false);
      setAsgTitle('');
      setAsgInstructions('');
      setAsgDeadline('');
      await loadAssignments();
    } catch (err: any) {
      showToast(err.message || 'Không thể tạo nhiệm vụ.', 'error');
    } finally {
      setIsSubmittingAsg(false);
    }
  };

  // Handle Delete Assignment
  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Thầy/Cô có chắc chắn muốn xóa nhiệm vụ này không?')) return;
    try {
      await apiDeleteAssignment(id);
      showToast('Đã xóa nhiệm vụ.', 'info');
      await loadAssignments();
    } catch (err: any) {
      showToast(err.message || 'Không thể xóa nhiệm vụ.', 'error');
    }
  };

  // Handle Create Student Account
  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentUsername.trim() || !newStudentPassword.trim()) {
      showToast('Vui lòng điền đủ họ tên, tên tài khoản và mật khẩu.', 'error');
      return;
    }

    setIsSubmittingStudent(true);
    try {
      await apiTeacherCreateStudent({
        name: newStudentName.trim(),
        username: newStudentUsername.trim(),
        password: newStudentPassword.trim(),
        grade: newStudentGrade,
        className: newStudentClass.trim(),
        avatar: newStudentAvatar,
      });

      showToast(`Đã cấp tài khoản cho học sinh ${newStudentName}!`, 'success');
      setIsCreatingStudent(false);
      setNewStudentName('');
      setNewStudentUsername('');
      await loadStudents();
    } catch (err: any) {
      showToast(err.message || 'Lỗi cấp tài khoản cho học sinh.', 'error');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // If user is not logged in as teacher
  if (!isTeacher) {
    return (
      <div className="bg-white rounded-3xl border-4 border-purple-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm space-y-6">
        <div className="w-20 h-20 bg-purple-100 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner">
          👩‍🏫
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-black">
            <Lock className="w-3.5 h-3.5" />
            <span>KHU VỰC DÀNH CHO GIÁO VIÊN</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-['Nunito']">
            Góc Giáo Viên Mĩ Thuật
          </h2>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed">
            Khu vực này dành riêng cho thầy cô giáo để giao bài tập theo khối lớp, theo dõi các sản
            phẩm học sinh chia sẻ và gửi lời nhận xét hướng dẫn.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => quickLogin('teacher')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>👩‍🏫 Đăng nhập với vai trò Giáo viên</span>
          </button>
          <button
            onClick={onOpenLogin}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
          >
            Đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    );
  }

  // Filtered submissions
  const filteredSubmissions = submissions.filter((it) => {
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.topicName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = filterGrade === 'all' || it.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || it.status === filterStatus;
    const matchesClass = filterClass === 'all' || it.studentClass === filterClass;

    return matchesSearch && matchesGrade && matchesStatus && matchesClass;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg border-3 border-purple-400 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-black text-purple-100">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>GÓC GIÁO VIÊN MĨ THUẬT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Nunito']">
            Xin chào {user?.name || 'Cô Đỗ Thanh Thuý'}!
          </h1>
          <p className="text-sm sm:text-base font-bold text-purple-100 max-w-2xl leading-relaxed">
            Quản trị nhiệm vụ Mĩ thuật theo chương trình tiểu học, xem sản phẩm các em học sinh chia
            sẻ và gửi những lời động viên ân cần.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('assignments');
              setIsCreatingAssignment(true);
            }}
            className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Giao nhiệm vụ mới</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('students');
              setIsCreatingStudent(true);
            }}
            className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition flex items-center gap-1.5 border border-white/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cấp tài khoản học sinh</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap p-2 bg-white rounded-2xl border-2 border-purple-200 gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'submissions'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Sản phẩm học sinh chia sẻ ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Nhiệm vụ Mĩ thuật đã giao ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeTab === 'students'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách học sinh ({students.length})</span>
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS (SẢN PHẨM HỌC SINH) */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl border-3 border-purple-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên học sinh, ý tưởng, chủ đề..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto text-xs font-bold text-slate-700">
              <span>Lớp:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="all">Tất cả lớp</option>
                <option value="1B">Lớp 1B</option>
                <option value="3A">Lớp 3A</option>
                <option value="5B">Lớp 5B</option>
              </select>

              <span>Khối:</span>
              <select
                value={filterGrade}
                onChange={(e) =>
                  setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="all">Tất cả khối</option>
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>
                    Khối {g}
                  </option>
                ))}
              </select>

              <span>Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="all">Tất cả</option>
                <option value="Ý tưởng mới">Ý tưởng mới</option>
                <option value="Đang phát triển">Đang phát triển</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Submissions Grid */}
          {isLoadingSubmissions ? (
            <div className="text-center py-10 font-bold text-slate-500 text-sm">
              Đang tải danh sách bài của học sinh...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl border-3 border-dashed border-purple-200 p-10 text-center space-y-2">
              <p className="font-black text-slate-800 text-base">
                Không tìm thấy sản phẩm nào phù hợp bộ lọc.
              </p>
              <p className="text-xs text-slate-500">
                Khi học sinh chọn "Chia sẻ với thầy cô", bài vẽ sẽ tự động xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border-3 border-purple-200 hover:border-purple-400 p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Student info header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold">
                          🎨
                        </span>
                        <div>
                          <div className="font-black text-slate-900 text-sm">{sub.studentName}</div>
                          <div className="text-[11px] font-bold text-purple-700">
                            {sub.studentClass || `Khối ${sub.studentGrade}`}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          sub.status === 'Đã hoàn thành'
                            ? 'bg-blue-100 text-blue-900 border-blue-200'
                            : 'bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-amber-800">
                      Chủ đề: {sub.topicName}
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2">
                      {sub.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-semibold">
                      {sub.mainContent}
                    </p>

                    {sub.studentNotes && (
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950">
                        <span className="font-bold text-amber-900 block text-[10px]">
                          Ghi chú của học sinh:
                        </span>
                        <span className="italic line-clamp-2">{sub.studentNotes}</span>
                      </div>
                    )}

                    {sub.teacherFeedbacks && sub.teacherFeedbacks.length > 0 && (
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Đã có {sub.teacherFeedbacks.length} nhận xét của cô</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(sub.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Xem & Nhận xét</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS (NHIỆM VỤ MĨ THUẬT) */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Danh sách nhiệm vụ Mĩ thuật đang giao
            </h2>
            <button
              onClick={() => setIsCreatingAssignment(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nhiệm vụ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white rounded-3xl border-3 border-purple-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-200">
                      Khối {asg.grade} • {asg.targetClass}
                    </span>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{asg.title}</h3>

                  <div className="flex flex-wrap gap-1.5">
                    {asg.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        🎨 {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {asg.instructions}
                  </p>

                  {asg.deadline && (
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      Hạn hoàn thành: {asg.deadline}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-purple-800">
                  Người giao: {asg.teacherName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS MANAGEMENT (QUẢN LÝ HỌC SINH) */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Danh sách tài khoản học sinh</h2>
              <p className="text-xs text-slate-500 font-semibold">
                Giáo viên có quyền cấp tài khoản nhanh cho học sinh để các em dễ dàng đăng nhập
              </p>
            </div>
            <button
              onClick={() => setIsCreatingStudent(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition flex items-center gap-1 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cấp tài khoản mới</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-3 border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="p-3.5">Học sinh</th>
                    <th className="p-3.5">Lớp</th>
                    <th className="p-3.5">Khối</th>
                    <th className="p-3.5">Tên đăng nhập</th>
                    <th className="p-3.5">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5 flex items-center gap-2">
                        <span className="text-xl">{st.avatar || '🎨'}</span>
                        <span className="font-bold text-slate-900">{st.name}</span>
                      </td>
                      <td className="p-3.5 font-bold text-purple-700">{st.className}</td>
                      <td className="p-3.5">Khối {st.grade}</td>
                      <td className="p-3.5 font-mono text-slate-500">{st.username}</td>
                      <td className="p-3.5 text-slate-400">
                        {new Date(st.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW & FEEDBACK ON SUBMISSION */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-['Nunito']">
                  Nhận xét sản phẩm của {selectedSubmission.studentName}
                </h3>
                <p className="text-xs text-purple-200 font-bold">
                  {selectedSubmission.studentClass || `Lớp ${selectedSubmission.studentGrade}`} • Chủ
                  đề: {selectedSubmission.topicName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <h2 className="text-xl font-black text-slate-900">{selectedSubmission.title}</h2>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-slate-800 leading-relaxed">
                <span className="font-black text-amber-950 block mb-1">Nội dung ý tưởng:</span>
                {selectedSubmission.mainContent}
              </div>

              {selectedSubmission.studentNotes && (
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs font-semibold text-sky-950">
                  <span className="font-black text-sky-900 block mb-0.5">
                    Ghi chú của học sinh:
                  </span>
                  {selectedSubmission.studentNotes}
                </div>
              )}

              {/* Feedbacks list */}
              {selectedSubmission.teacherFeedbacks &&
                selectedSubmission.teacherFeedbacks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-purple-950 block">
                      Các nhận xét trước đây:
                    </span>
                    {selectedSubmission.teacherFeedbacks.map((fb) => (
                      <div
                        key={fb.id}
                        className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-purple-900">
                          <span>{fb.teacherName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="italic text-slate-700 font-semibold">“{fb.comment}”</p>
                      </div>
                    ))}
                  </div>
                )}

              {/* Feedback Form */}
              <form onSubmit={handleSendFeedback} className="space-y-3 pt-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Gửi lời nhận xét & động viên mới
                </label>
                <textarea
                  rows={3}
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  placeholder="Ví dụ: Cô rất khen ngợi ý tưởng của con! Con chú ý phối màu nền phía sau tươi sáng để làm nổi bật nhân vật chính nhé..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-purple-400 text-xs font-semibold leading-relaxed"
                  required
                />
                <button
                  type="submit"
                  disabled={isSendingComment}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingComment ? 'Đang gửi...' : 'Gửi nhận xét cho học sinh'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASSIGNMENT */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-black font-['Nunito']">Giao nhiệm vụ Mĩ thuật mới</h3>
              <button
                onClick={() => setIsCreatingAssignment(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateAssignmentSubmit}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Tiêu đề nhiệm vụ *
                </label>
                <input
                  type="text"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="Ví dụ: Tri ân thầy cô nhân ngày 20-11"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-purple-400 font-bold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={asgGrade}
                    onChange={(e) => setAsgGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Giao cho lớp *
                  </label>
                  <input
                    type="text"
                    value={asgTargetClass}
                    onChange={(e) => setAsgTargetClass(e.target.value)}
                    placeholder="Ví dụ: Toàn khối 3 hoặc Lớp 3A"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Chọn chủ đề Mĩ thuật trong chương trình *
                </label>
                <select
                  value={asgSelectedTopics[0] || ''}
                  onChange={(e) => setAsgSelectedTopics([e.target.value])}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                >
                  {getTopicsForGrade(asgGrade).map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.order}. {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mục tiêu & Hướng dẫn học sinh *
                </label>
                <textarea
                  rows={3}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Yêu cầu cần đạt, gợi ý thêm về chất liệu, cảm xúc..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-purple-400 text-xs font-semibold leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Hạn hoàn thành (tùy chọn)
                </label>
                <input
                  type="date"
                  value={asgDeadline}
                  onChange={(e) => setAsgDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingAssignment(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAsg}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md"
                >
                  {isSubmittingAsg ? 'Đang tạo...' : 'Giao nhiệm vụ ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE STUDENT */}
      {isCreatingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-black font-['Nunito']">Cấp tài khoản học sinh mới</h3>
              <button
                onClick={() => setIsCreatingStudent(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        Khối {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Lớp học</label>
                  <input
                    type="text"
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    placeholder="Ví dụ: 3A"
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Tên tài khoản (viết liền không dấu) *
                </label>
                <input
                  type="text"
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  placeholder="Ví dụ: tuankiet3a"
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Mật khẩu khởi tạo *
                </label>
                <input
                  type="text"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingStudent(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStudent}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md"
                >
                  {isSubmittingStudent ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
