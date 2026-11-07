import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Search,
  BookOpen,
  GraduationCap,
  LogIn,
  LogOut,
  Home,
} from 'lucide-react';

export type ActiveTab = 'home' | 'ideas' | 'review' | 'notebook' | 'teacher';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenLogin }) => {
  const { user, isTeacher, logout } = useAuth();

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
  };

  // Cùng một kiểu dáng màu sắc cho tất cả các nút điều hướng (cùng một màu)
  const getButtonClass = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    return `px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
      isActive
        ? 'bg-yellow-400 text-emerald-950 font-black ring-2 ring-white shadow-md scale-102 border border-yellow-300'
        : 'bg-white/90 hover:bg-white text-emerald-950 font-bold border border-white/70 shadow-2xs hover:scale-102'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-600 via-green-500 to-yellow-300 border-b-4 border-yellow-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        {/* Layout responsive: Trên màn hình lớn là 1 hàng ngang, trên màn hình nhỏ chia 2 hàng gọn gàng nhưng tất cả các nút luôn HIỆN TRỰC TIẾP trên thanh điều hướng */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          
          {/* Hàng 1 (Mobile) / Cột Trái (Desktop): Logo & Tài khoản */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Brand: "Góc sáng tạo Mĩ thuật Tiểu học" đặt dưới dòng "HỌA SĨ NHÍ AI" */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0 border-2 border-yellow-300">
                <span className="text-2xl sm:text-3xl">🎨</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Patrick_Hand'] text-xl sm:text-2xl lg:text-3xl font-black text-amber-200 tracking-wide drop-shadow-xs leading-none">
                  HỌA SĨ NHÍ AI
                </span>
                <span className="text-[10px] sm:text-xs font-black text-emerald-950 tracking-normal mt-0.5 bg-yellow-300/95 px-2 py-0.5 rounded-full inline-block shadow-2xs border border-white/60 self-start">
                  Góc sáng tạo Mĩ thuật Tiểu học
                </span>
              </div>
            </div>

            {/* Mobile Account / Login Button */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 bg-white pl-2 pr-1.5 py-1 rounded-xl border border-yellow-300 shadow-sm text-xs">
                  <span className="text-base">{user.avatar || (user.role === 'teacher' ? '👩‍🏫' : '🎨')}</span>
                  <div className="text-left leading-tight max-w-[100px]">
                    <div className="font-black text-slate-900 truncate">{user.name}</div>
                    <div className="text-[9px] font-bold text-emerald-800">
                      {user.role === 'teacher' ? 'Cô giáo' : (user.className || `Khối ${user.grade}`)}
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    title="Đăng xuất"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="px-2.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-xs shadow-sm transition flex items-center gap-1 border border-white active:scale-98"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-900" />
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>
          </div>

          {/* Hàng 2 (Mobile) / Trung tâm (Desktop): Tất cả các nút điều hướng THU NHỎ, CÙNG MỘT MÀU và HIỆN TRỰC TIẾP */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {/* Nút 1: Trang chủ */}
            <button
              onClick={() => handleNavClick('home')}
              className={getButtonClass('home')}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Trang chủ</span>
            </button>

            {/* Nút 2: Trợ lý ý tưởng AI */}
            <button
              onClick={() => handleNavClick('ideas')}
              className={getButtonClass('ideas')}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <span className="whitespace-nowrap">Trợ lý ý tưởng AI</span>
            </button>

            {/* Nút 3: Soi tranh */}
            <button
              onClick={() => handleNavClick('review')}
              className={getButtonClass('review')}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
              <span className="whitespace-nowrap">Soi tranh</span>
            </button>

            {/* Nút 4: Sổ tay sáng tạo */}
            <button
              onClick={() => handleNavClick('notebook')}
              className={getButtonClass('notebook')}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span className="whitespace-nowrap">Sổ tay sáng tạo</span>
            </button>

            {/* Nút 5: Góc giáo viên (Hiển thị khi Cô Đỗ Thanh Thuý đăng nhập) */}
            {isTeacher && (
              <button
                onClick={() => handleNavClick('teacher')}
                className={getButtonClass('teacher')}
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                <span className="whitespace-nowrap">Góc giáo viên</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            )}
          </nav>

          {/* Desktop User Account / Single Login Button on the far right */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-white pl-2.5 pr-1.5 py-1 rounded-xl border-2 border-yellow-300 shadow-md">
                <span className="text-xl">{user.avatar || (user.role === 'teacher' ? '👩‍🏫' : '🎨')}</span>
                <div className="text-left text-xs leading-tight">
                  <div className="font-black text-slate-900 line-clamp-1">{user.name}</div>
                  <div className="text-[10px] font-bold text-emerald-800">
                    {user.role === 'teacher' ? 'Giáo viên Mĩ thuật' : (user.className || `Khối ${user.grade}`)}
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  title="Đăng xuất"
                  className="ml-1 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 border border-white active:scale-98"
              >
                <LogIn className="w-4 h-4 text-emerald-900" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
