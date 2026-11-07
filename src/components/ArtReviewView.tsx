import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiReviewArtwork, apiSaveNotebookItem } from '../services/api';
import { ArtReviewResult } from '../types';
import { getTopicsForGrade } from '../data/curriculum';
import {
  UploadCloud,
  Search,
  Sparkles,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  BookmarkCheck,
  RefreshCw,
  Heart,
  Palette,
  Layers,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';

interface ArtReviewViewProps {
  onNavigateToNotebook: () => void;
  onOpenLogin: () => void;
}

// Sample sample drawing for instant 1-click testing
const SAMPLE_DRAWING = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23fef3c7"/><circle cx="100" cy="90" r="50" fill="%23f59e0b"/><path d="M 0 320 Q 150 260 300 310 T 600 290 L 600 400 L 0 400 Z" fill="%2384cc16"/><rect x="220" y="210" width="160" height="120" fill="%23f97316" rx="6"/><polygon points="200,210 300,130 400,210" fill="%23dc2626"/><rect x="275" y="260" width="50" height="70" fill="%2378350f" rx="3"/><circle cx="480" cy="230" r="45" fill="%2322c55e"/><rect x="470" y="265" width="20" height="75" fill="%23854d0e"/><circle cx="480" cy="210" r="8" fill="%23ef4444"/><circle cx="505" cy="240" r="7" fill="%23ef4444"/><circle cx="455" cy="235" r="7" fill="%23ef4444"/></svg>`;

export const ArtReviewView: React.FC<ArtReviewViewProps> = ({
  onNavigateToNotebook,
  onOpenLogin,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedGrade, setSelectedGrade] = useState<number>(user?.grade || 3);
  const [topicName, setTopicName] = useState<string>('Biết ơn thầy cô');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [studentDescription, setStudentDescription] = useState<string>('');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<ArtReviewResult | null>(null);
  const [isSavingToNotebook, setIsSavingToNotebook] = useState<boolean>(false);

  const gradeTopics = getTopicsForGrade(selectedGrade);

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh (jpg, png, webp)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setBase64Data(result);
      setMimeType(file.type);
      setReviewResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleDrawing = () => {
    setPreviewUrl(SAMPLE_DRAWING);
    setBase64Data(SAMPLE_DRAWING);
    setMimeType('image/svg+xml');
    setTopicName('Cảnh đẹp quê hương');
    setStudentDescription('Tranh em vẽ ngôi nhà ngói đỏ bên cạnh cây táo chín xum xuê dưới ánh mặt trời rực rỡ.');
    setReviewResult(null);
    showToast('Đã chọn bức tranh minh họa mẫu để soi thử!', 'info');
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setBase64Data(null);
    setReviewResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReview = async () => {
    if (!base64Data) {
      showToast('Bé hãy chọn hoặc chụp ảnh bức tranh của mình trước nhé!', 'error');
      return;
    }

    const finalTopic = customTopic.trim() || topicName;

    setIsLoading(true);
    try {
      const res = await apiReviewArtwork({
        imageBase64: base64Data,
        mimeType,
        topicName: finalTopic,
        grade: selectedGrade,
        studentDescription: studentDescription.trim() || undefined,
      });

      setReviewResult(res);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast('Cô Trợ lý AI đã soi tranh xong rồi! Hãy cùng xem lời nhận xét nhé!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Chưa thể phân tích tranh, bé thử lại với ảnh rõ nét hơn nhé!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCritiqueToNotebook = async () => {
    if (!user) {
      showToast('Bé đăng nhập để lưu lời nhận xét vào sổ tay nhé!', 'info');
      onOpenLogin();
      return;
    }
    if (!reviewResult) return;

    const finalTopic = customTopic.trim() || topicName;

    setIsSavingToNotebook(true);
    try {
      await apiSaveNotebookItem({
        title: `Nhận xét tranh: ${finalTopic}`,
        grade: selectedGrade,
        topicName: finalTopic,
        mainContent: reviewResult.interestingThings,
        charactersAndObjects: reviewResult.creativeDetails,
        activitiesAndDetails: '',
        composition: {
          foreground: reviewResult.composition,
          midground: '',
          background: '',
        },
        colorSuggestions: reviewResult.colors,
        creativeSpark: reviewResult.creativeDetails,
        materialSuggestions: 'Đã thực hành hoàn thiện',
        studentNotes: studentDescription || 'Bức tranh do em vẽ và chụp ảnh soi cùng AI',
        status: 'Đã hoàn thành',
        sharedWithTeacher: true,
        savedCritique: {
          interestingThings: reviewResult.interestingThings,
          composition: reviewResult.composition,
          colors: reviewResult.colors,
          creativeDetails: reviewResult.creativeDetails,
          suggestions: reviewResult.suggestions,
          encouragement: reviewResult.encouragement,
          topicName: finalTopic,
          createdAt: new Date().toISOString(),
        },
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast('Tuyệt vời! Đã lưu tranh và lời nhận xét vào Sổ tay sáng tạo!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu nhận xét, bé thử lại nhé!', 'error');
    } finally {
      setIsSavingToNotebook(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-400 via-blue-400 to-sky-300 rounded-3xl p-6 sm:p-8 text-sky-950 shadow-md border-3 border-sky-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-black text-sky-900">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>GÓC SOI TRANH YÊU THƯƠNG</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Nunito']">
            Cùng soi tranh và lắng nghe lời khích lệ
          </h1>
          <p className="text-sm sm:text-base font-bold text-sky-900 max-w-2xl leading-relaxed">
            Chụp hoặc tải ảnh bức tranh em đã vẽ lên. AI sẽ quan sát những gì thực sự nhìn thấy trong
            tranh, tìm ra những điểm sáng tạo đáng yêu và gửi tặng em lời khuyên bổ ích!
          </p>
        </div>
        <div className="w-20 h-20 bg-white/90 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">
          🔍
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: UPLOAD & INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border-3 border-sky-200 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-600" />
              <span>Bước 1: Chọn ảnh tranh của bé</span>
            </h2>

            {/* Upload Area */}
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-6 text-center cursor-pointer transition-all bg-sky-50/50 hover:bg-sky-50 flex flex-col items-center justify-center gap-3 min-h-[220px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-sky-950 block">
                    Bấm vào đây để tải ảnh hoặc chụp ảnh tranh
                  </span>
                  <span className="text-xs font-semibold text-slate-500 mt-1 block">
                    Hỗ trợ định dạng PNG, JPG, JPEG (chụp phẳng, đủ sáng)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-sky-200 group">
                <img
                  src={previewUrl}
                  alt="Tranh của bé"
                  className="w-full max-h-[300px] object-contain bg-slate-900/5"
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition shadow-md"
                  aria-label="Đổi ảnh khác"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-2.5 bg-sky-50 text-[11px] font-bold text-sky-800 text-center border-t border-sky-200">
                  ✨ Ảnh tranh đã sẵn sàng để soi!
                </div>
              </div>
            )}

            {/* Quick Sample Button */}
            {!previewUrl && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleUseSampleDrawing}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 underline inline-flex items-center gap-1"
                >
                  <span>🖼️ Chưa có sẵn ảnh? Bấm vào đây để dùng tranh mẫu thử nghiệm</span>
                </button>
              </div>
            )}

            {/* Grade Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Khối lớp của bé
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setSelectedGrade(g);
                      const topics = getTopicsForGrade(g);
                      if (topics.length > 0) setTopicName(topics[0].name);
                    }}
                    className={`py-2 rounded-xl text-xs font-black transition ${
                      selectedGrade === g
                        ? 'bg-sky-400 text-sky-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Chủ đề bức tranh
              </label>
              <select
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-bold bg-white text-slate-800 transition"
              >
                {gradeTopics.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.order}. {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Or custom topic */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Hoặc tên chủ đề tự do (nếu khác):
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Ví dụ: Chú khủng long con đi dã ngoại..."
                className="w-full px-3.5 py-2 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-semibold"
              />
            </div>

            {/* Student note */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Lời nhắn của em về bức tranh (tùy chọn)
              </label>
              <textarea
                rows={2}
                value={studentDescription}
                onChange={(e) => setStudentDescription(e.target.value)}
                placeholder="Em muốn kể gì về bức tranh này với cô Trợ lý AI không?"
                className="w-full px-3.5 py-2 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:outline-none text-xs font-semibold leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isLoading || !previewUrl}
              onClick={handleReview}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-400 to-sky-400 hover:from-sky-500 hover:to-blue-500 text-sky-950 font-black text-base shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Cô Trợ lý AI đang ngắm tranh thật kỹ...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Cùng soi tranh ngay!</span>
                </>
              )}
            </button>
          </div>

          {/* Ethics & Safety Note */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 text-xs text-sky-900 space-y-1">
            <div className="font-black flex items-center gap-1.5 text-sky-950">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Tiêu chí sư phạm yêu thương:</span>
            </div>
            <p className="leading-relaxed">
              Website không xếp loại hay chấm điểm số tranh vẽ. AI luôn lắng nghe, tôn trọng nét vẽ
              ngây thơ và khuyến khích niềm đam mê nghệ thuật của bé!
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI REVIEW RESULTS */}
        <div className="lg:col-span-7">
          {reviewResult ? (
            <div className="bg-white rounded-3xl border-3 border-sky-300 p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-sky-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-2xl">
                    🌟
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-['Nunito']">
                      Lời nhận xét tranh vẽ từ AI
                    </h3>
                    <p className="text-xs font-bold text-sky-800">
                      Chủ đề: {customTopic || topicName} • Lớp {selectedGrade}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCritiqueToNotebook}
                  disabled={isSavingToNotebook}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{isSavingToNotebook ? 'Đang lưu...' : 'Lưu vào Sổ tay'}</span>
                </button>
              </div>

              {/* 1. Điều thú vị trong tranh */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                  <span>🎨</span>
                  <span>Điều thú vị trong tranh:</span>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-relaxed pl-6">
                  {reviewResult.interestingThings}
                </p>
              </div>

              {/* 2. Bố cục của em & 3. Màu sắc của em */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-1">
                  <div className="flex items-center gap-2 text-sky-950 font-black text-sm">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>Bố cục của em:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    {reviewResult.composition}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-1">
                  <div className="flex items-center gap-2 text-orange-950 font-black text-sm">
                    <Palette className="w-4 h-4 text-orange-600" />
                    <span>Màu sắc của em:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    {reviewResult.colors}
                  </p>
                </div>
              </div>

              {/* 4. Chi tiết sáng tạo */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Chi tiết sáng tạo nổi bật:</span>
                </div>
                <p className="text-xs font-bold text-purple-900 leading-relaxed pl-6">
                  {reviewResult.creativeDetails}
                </p>
              </div>

              {/* 5. Gợi ý để tranh thú vị hơn */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Gợi ý nhẹ nhàng để tranh thú vị hơn:</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs font-semibold text-slate-700">
                  {reviewResult.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-black">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Lời động viên */}
              <div className="p-5 bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 rounded-2xl border-2 border-pink-300 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-950 font-black text-sm">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
                  <span>Lời động viên gửi tới họa sĩ nhí:</span>
                </div>
                <p className="text-sm font-bold text-rose-900 leading-relaxed italic pl-6">
                  “{reviewResult.encouragement}”
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-3 border-dashed border-slate-200 p-10 text-center space-y-4 min-h-[380px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-sky-50 flex items-center justify-center text-4xl">
                🎨
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  Chưa có nhận xét nào được hiển thị
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Bé hãy chọn hoặc chụp ảnh bức tranh ở cột bên trái, rồi nhấn nút{' '}
                  <span className="font-extrabold text-sky-700">“Cùng soi tranh ngay”</span> để nghe cô
                  Trợ lý AI chia sẻ nhé!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
