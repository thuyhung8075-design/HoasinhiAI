import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { IdeaAssistantView } from './components/IdeaAssistantView';
import { ArtReviewView } from './components/ArtReviewView';
import { NotebookView } from './components/NotebookView';
import { TeacherCornerView } from './components/TeacherCornerView';
import { LoginModal } from './components/LoginModal';
import { apiGetSystemStatus } from './services/api';
import { Heart, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Prefill state when navigating from Home to Ideas
  const [prefilledGrade, setPrefilledGrade] = useState<number | undefined>(undefined);
  const [prefilledTopic, setPrefilledTopic] = useState<string | undefined>(undefined);

  const [systemInfo, setSystemInfo] = useState<{
    hasGeminiKey: boolean;
    status: string;
  } | null>(null);

  useEffect(() => {
    apiGetSystemStatus()
      .then((res) => {
        setSystemInfo({
          hasGeminiKey: res.hasGeminiKey,
          status: res.status,
        });
      })
      .catch((err) => {
        console.warn('System check failed:', err);
      });
  }, []);

  const handleNavigate = (tab: ActiveTab, prefill?: { grade?: number; topicName?: string }) => {
    if (prefill) {
      if (prefill.grade) setPrefilledGrade(prefill.grade);
      if (prefill.topicName) setPrefilledTopic(prefill.topicName);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab, prefill) => handleNavigate(tab, prefill)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeaAssistantView
            initialGrade={prefilledGrade}
            initialTopicName={prefilledTopic}
            onNavigateToNotebook={() => handleNavigate('notebook')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'review' && (
          <ArtReviewView
            onNavigateToNotebook={() => handleNavigate('notebook')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'notebook' && (
          <NotebookView
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onNavigateToAssistant={() => handleNavigate('ideas')}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherCornerView onOpenLogin={() => setIsLoginModalOpen(true)} />
        )}
      </main>

      {/* Login & Register Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Footer chia thành 2 vế với nền xanh lá cây nhẹ hơn chuyển dần sang vàng sáng */}
      <footer className="mt-auto bg-gradient-to-r from-emerald-600 via-green-500 to-yellow-300 border-t-4 border-yellow-400 py-6 px-4 sm:px-8 shadow-xl text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Vế trái: Ảnh bảng màu + Hoạ sĩ nhí AI + mô tả nền tảng */}
          <div className="flex items-center gap-3.5 text-left max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-yellow-300 flex items-center justify-center text-3xl shadow-md shrink-0">
              🎨
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              <span className="text-yellow-200 font-black">Họa sĩ nhí AI:</span> Nền tảng hỗ trợ sáng tạo môn Mĩ thuật tiểu học dành cho học sinh từ lớp 1-5. Tích hợp AI tạo ý tưởng và nhận xét tranh thân thiện mang tính khích lệ lứa tuổi học đường.
            </p>
          </div>

          {/* Vế phải: Khung 2 dòng gồm Lời tri ân + biểu tượng trái tim cùng vào trong khung (nhỏ gọn) */}
          <div className="flex items-center justify-start md:justify-end max-w-xl self-stretch md:self-auto">
            <div
              className="w-full md:w-auto bg-white/95 text-[#143d2b] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-600/30 shadow-xs text-center"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <p
                className="font-bold italic text-[12px] sm:text-[13px] leading-tight"
                style={{ fontFamily: "Georgia, serif", fontWeight: "bold" }}
              >
                Được xây dựng với tình yêu dành cho học sinh
              </p>
              <p className="font-bold italic text-[12px] sm:text-[13px] leading-tight flex items-center justify-center gap-1 flex-wrap mt-0.5">
                <span style={{ fontFamily: "Georgia, serif" }}>
                  của cô giáo Mĩ thuật Đỗ Thanh Thuý Trường TH & THCS Vân Hà
                </span>
                <span className="text-rose-600 not-italic inline-block text-sm animate-bounce-subtle">❤️</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
