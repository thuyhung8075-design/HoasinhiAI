import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Assignment } from '../types';
import { apiGetAssignments } from '../services/api';
import { ActiveTab } from './Navbar';
import {
  Sparkles,
  Search,
  BookOpen,
  Calendar,
  ArrowRight,
  GraduationCap,
  Heart,
  Palette,
  Lightbulb,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { CURRICULUM_TOPICS, getTopicsForGrade } from '../data/curriculum';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab, prefill?: { grade?: number; topicName?: string }) => void;
  onOpenLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenLogin }) => {
  const { user, isStudent } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedGradeTab, setSelectedGradeTab] = useState<number>(user?.grade || 3);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  useEffect(() => {
    const loadAssignments = async () => {
      setIsLoadingAssignments(true);
      try {
        const res = await apiGetAssignments(user?.grade);
        setAssignments(res.assignments || []);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setIsLoadingAssignments(false);
      }
    };
    loadAssignments();
  }, [user]);

  const activeGradeTopics = getTopicsForGrade(selectedGradeTab);

  return (
    <div className="space-y-10 sm:space-y-12 pb-3 sm:pb-4">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-sky-100 border-4 border-amber-200/80 p-6 sm:p-10 shadow-lg">
        {/* Floating decorative elements */}
        <div className="absolute top-3 right-6 text-3xl sm:text-4xl select-none animate-bounce-subtle opacity-90">
          ✨
        </div>
        <div className="absolute bottom-4 left-6 text-2xl sm:text-3xl select-none opacity-80">
          🌟
        </div>
        <div className="absolute top-1/2 right-1/4 text-xl sm:text-2xl select-none opacity-40">
          🎨
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-300/80 text-amber-950 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>GÓC SÁNG TẠO MĨ THUẬT TIỂU HỌC</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-950 leading-tight font-['Nunito']">
              Chào mừng các họa sĩ nhí đến với{' '}
              <span className="text-orange-600 underline decoration-amber-300 decoration-wavy">
                thế giới sáng tạo!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 font-bold leading-relaxed max-w-2xl">
              “Mỗi bạn nhỏ đều có những ý tưởng tuyệt vời. Hãy khám phá, tưởng tượng và tạo nên bức
              tranh của riêng mình!”
            </p>
          </div>

          {/* Child painting illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-tr from-amber-200 to-sky-200 border-4 border-white shadow-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                {/* SVG Visual Illustration of Young Painter */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-44 h-44 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Easel */}
                  <path d="M70 180 L95 60 L105 60 L130 180" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
                  <path d="M100 60 L100 180" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                  <path d="M60 140 L140 140" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
                  {/* Canvas */}
                  <rect x="55" y="70" width="90" height="70" rx="8" fill="#ffffff" stroke="#f59e0b" strokeWidth="4" />
                  {/* Rainbow on canvas */}
                  <path d="M65 130 A 35 35 0 0 1 135 130" stroke="#f43f5e" strokeWidth="5" fill="none" />
                  <path d="M72 130 A 28 28 0 0 1 128 130" stroke="#fbbf24" strokeWidth="5" fill="none" />
                  <path d="M79 130 A 21 21 0 0 1 121 130" stroke="#10b981" strokeWidth="5" fill="none" />
                  <circle cx="125" cy="88" r="8" fill="#f59e0b" />
                  {/* Paint Palette */}
                  <ellipse cx="145" cy="155" rx="22" ry="16" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
                  <circle cx="138" cy="150" r="3.5" fill="#ef4444" />
                  <circle cx="150" cy="148" r="3.5" fill="#3b82f6" />
                  <circle cx="156" cy="158" r="3.5" fill="#10b981" />
                  <circle cx="140" cy="160" r="3.5" fill="#f59e0b" />
                  {/* Paintbrush */}
                  <path d="M165 135 L145 155" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                  <path d="M145 155 L140 160" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" />
                </svg>

                <div className="mt-2 text-center">
                  <div className="text-base font-extrabold text-amber-950 font-['Patrick_Hand']">
                    Vẽ tranh là niềm vui bất tận
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    Sáng tạo không giới hạn • Khối 1 - 5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 MAJOR ACTION BUTTONS */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
            Hôm nay bé muốn bắt đầu sáng tạo từ đâu?
          </h2>
          <p
            className="text-slate-600"
            style={{ fontFamily: 'system-ui', fontWeight: 'bold', fontSize: '17.75px' }}
          >
            Chọn 1 trong 3 cánh cửa diệu kỳ bên dưới để khám phá ngay nhé!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Khám phá ý tưởng */}
          <div
            onClick={() => onNavigate('ideas')}
            className="group cursor-pointer bg-gradient-to-b from-amber-50 to-orange-100/70 border-4 border-amber-300 hover:border-orange-400 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                💡
              </div>
              <div>
                <span className="text-xs font-extrabold text-orange-700 uppercase tracking-wider block mb-1">
                  Bước 1: Khởi nguồn
                </span>
                <h3 className="text-2xl font-black text-amber-950 mb-2">
                  Khám phá ý tưởng
                </h3>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  Bé bí ý tưởng? Chọn khối lớp & chủ đề để nhận ngay 3 ý tưởng độc đáo, gợi ý bố cục,
                  màu sắc và chất liệu vẽ tranh!
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-amber-200/80 flex items-center justify-between">
              <span className="font-extrabold text-sm text-orange-800">Bắt đầu tìm ý tưởng</span>
              <div className="w-10 h-10 rounded-full bg-orange-400 text-amber-950 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Soi tranh của em */}
          <div
            onClick={() => onNavigate('review')}
            className="group cursor-pointer bg-gradient-to-b from-sky-50 to-blue-100/70 border-4 border-sky-300 hover:border-sky-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-400 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🔍
              </div>
              <div>
                <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wider block mb-1">
                  Bước 2: Lắng nghe
                </span>
                <h3 className="text-2xl font-black text-sky-950 mb-2">
                  Soi tranh của em
                </h3>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  Tải ảnh bức tranh bé đã vẽ lên. Cô Trợ lý AI sẽ ngắm nhìn thật kỹ, chỉ ra những
                  điểm độc đáo và gửi lời động viên ấm áp!
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-sky-200/80 flex items-center justify-between">
              <span className="font-extrabold text-sm text-sky-800">Cùng soi tranh ngay</span>
              <div className="w-10 h-10 rounded-full bg-sky-400 text-sky-950 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Mở sổ tay sáng tạo */}
          <div
            onClick={() => onNavigate('notebook')}
            className="group cursor-pointer bg-gradient-to-b from-emerald-50 to-teal-100/70 border-4 border-emerald-300 hover:border-emerald-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                📖
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
                  Bước 3: Lưu giữ
                </span>
                <h3 className="text-2xl font-black text-emerald-950 mb-2">
                  Mở sổ tay sáng tạo
                </h3>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  Nơi lưu lại các ý tưởng yêu thích, ghi chú riêng của bé, tiến độ hoàn thành và các
                  lời nhận xét khích lệ từ thầy cô!
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-200/80 flex items-center justify-between">
              <span className="font-extrabold text-sm text-emerald-800">Mở sổ tay xem lại</span>
              <div className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHỦ ĐỀ DÀNH CHO EM (Teacher Assignments) - TOÀN BỘ KHUNG VÀ CHỮ ĐƯỢC PHÓNG TO */}
      <section className="bg-white rounded-3xl border-4 border-amber-200/90 p-7 sm:p-10 lg:p-12 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-amber-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-3xl shadow-xs shrink-0">
              📌
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Chủ đề dành cho em
              </h2>
              <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
                Các nhiệm vụ và chủ đề giáo viên Mĩ thuật đang giao cho các lớp
              </p>
            </div>
          </div>

          {user && (
            <span className="self-start sm:self-auto px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-2xs">
              Đang xem lớp: {user.className || `Khối ${user.grade}`}
            </span>
          )}
        </div>

        {isLoadingAssignments ? (
          <div className="text-center py-10 text-slate-500 font-bold text-base">
            Đang tải danh sách chủ đề giáo viên giao...
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-10 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 p-8">
            <p className="text-base sm:text-lg font-black text-slate-800">
              Hiện tại chưa có nhiệm vụ mới cho lớp này.
            </p>
            <p className="text-sm sm:text-base text-slate-600 font-semibold mt-2">
              Bé hãy tự do khám phá các chủ đề trong mục "Trợ lý ý tưởng" nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-amber-50/60 hover:bg-amber-50 rounded-3xl border-3 border-amber-200 p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between space-y-5 hover:shadow-xl hover:-translate-y-1 min-h-[290px] sm:min-h-[320px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-black bg-purple-100 text-purple-900 border border-purple-200">
                      Khối {asg.grade} • {asg.targetClass}
                    </span>
                    {asg.deadline && (
                      <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Hạn: {asg.deadline}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {asg.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {asg.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-white text-orange-900 border border-amber-200 shadow-2xs"
                      >
                        🎨 {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-700 line-clamp-3 leading-relaxed">
                    {asg.instructions}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-purple-900">
                    Từ: {asg.teacherName}
                  </span>
                  <button
                    onClick={() =>
                      onNavigate('ideas', {
                        grade: asg.grade,
                        topicName: asg.topics[0],
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                  >
                    <span>Làm ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DANH MỤC CHỦ ĐỀ KHÁM PHÁ NHANH THEO KHỐI LỚP (KHUNG CAO HƠN, CÁC Ô BÊN TRONG CAO HƠN VÀ CHỮ TO HƠN) */}
      <section className="bg-gradient-to-r from-amber-50 via-white to-sky-50 rounded-3xl border-3 border-amber-200 p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              Chương trình Mĩ thuật theo khối lớp
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
              Đầy đủ danh mục chủ đề chính khóa từ Khối 1 đến Khối 5
            </p>
          </div>

          {/* Grade Selector Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGradeTab(g)}
                className={`px-5 py-2.5 rounded-2xl text-base font-black transition-all duration-150 ${
                  selectedGradeTab === g
                    ? 'bg-amber-400 text-amber-950 shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 hover:bg-amber-100 border-2 border-slate-200'
                }`}
              >
                Khối {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {activeGradeTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() =>
                onNavigate('ideas', {
                  grade: selectedGradeTab,
                  topicName: topic.name,
                })
              }
              className="group cursor-pointer bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 p-5 sm:p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between min-h-[240px] sm:min-h-[270px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                    Chủ đề {topic.order}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-amber-200/80 flex items-center justify-center text-base shadow-2xs">
                    ✏️
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-lg sm:text-xl mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                  {topic.name}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 line-clamp-3 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs sm:text-sm font-black text-amber-700 group-hover:text-amber-900">
                <span>Khám phá ý tưởng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MỤC CÓ KHUNG: KHÔNG GIAN SÁNG TẠO LÀNH MẠNH & TÔN TRỌNG NÉT VẼ TUỔI THƠ (KHOẢNG CÁCH THU HẸP GỌN GÀNG) */}
      <section
        className="!mt-3 sm:!mt-4 mb-1 sm:mb-2 bg-white/95 rounded-xl border border-emerald-400/80 px-4 py-2.5 sm:px-5 sm:py-3 shadow-2xs text-center mx-auto space-y-1 relative overflow-hidden flex flex-col justify-center items-center"
        style={{ width: '763px', maxWidth: '100%', minHeight: '140.613px', fontSize: '8px' }}
      >
        <div className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-yellow-300 border border-yellow-400 text-xs shadow-2xs mx-auto">
          🌱
        </div>
        <h3
          className="font-black text-emerald-950 tracking-normal leading-snug"
          style={{ fontSize: '17.5px' }}
        >
          Không gian sáng tạo lành mạnh &amp; Tôn trọng nét vẽ tuổi thơ
        </h3>
        <p
          className="font-semibold text-slate-600 leading-relaxed max-w-xl mx-auto"
          style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}
        >
          Họa Sĩ Nhí AI chỉ đưa ra gợi ý để các em tự do tưởng tượng, không vẽ thay và không áp đặt học sinh. Ứng dụng tôn trọng sự tự do sáng tạo riêng của từng bạn nhỏ.
        </p>
      </section>
    </div>
  );
};
