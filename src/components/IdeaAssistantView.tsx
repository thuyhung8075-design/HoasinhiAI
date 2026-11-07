import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGenerateIdeas, apiSaveNotebookItem } from '../services/api';
import {
  CURRICULUM_TOPICS,
  getTopicsForGrade,
  TopicItem,
} from '../data/curriculum';
import { GeneratedIdea, IdeaGenerationResult } from '../types';
import {
  Sparkles,
  Palette,
  Lightbulb,
  Brush,
  Layers,
  Heart,
  BookmarkCheck,
  RefreshCw,
  Edit3,
  HelpCircle,
  Check,
  CheckCircle2,
  X,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface IdeaAssistantViewProps {
  initialGrade?: number;
  initialTopicName?: string;
  onNavigateToNotebook: () => void;
  onOpenLogin: () => void;
}

export const IdeaAssistantView: React.FC<IdeaAssistantViewProps> = ({
  initialGrade,
  initialTopicName,
  onNavigateToNotebook,
  onOpenLogin,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedGrade, setSelectedGrade] = useState<number>(initialGrade || user?.grade || 1);
  const [availableTopics, setAvailableTopics] = useState<TopicItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [studentWish, setStudentWish] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<IdeaGenerationResult | null>(null);
  const [previousTitles, setPreviousTitles] = useState<string[]>([]);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  const [apiError, setApiError] = useState<{ message: string; isMissingKey: boolean } | null>(null);

  // Modal for editing & saving chosen idea
  const [editingIdea, setEditingIdea] = useState<GeneratedIdea | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSpark, setEditSpark] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [shareWithTeacher, setShareWithTeacher] = useState(true);

  // Update topics when grade changes
  useEffect(() => {
    const topics = getTopicsForGrade(selectedGrade);
    setAvailableTopics(topics);

    if (initialTopicName) {
      const match = topics.find(
        (t) => t.name.toLowerCase().trim() === initialTopicName.toLowerCase().trim()
      );
      if (match) {
        setSelectedTopic(match);
        return;
      }
    }

    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
    }
  }, [selectedGrade, initialTopicName]);

  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setResult(null);
    setApiError(null);
    setSelectedIdeaIndex(null);
    setPreviousTitles([]);
  };

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setResult(null);
    setApiError(null);
    setSelectedIdeaIndex(null);
  };

  const handleUsePrompt = (prompt: string) => {
    setStudentWish(prompt);
  };

  const handleGenerate = async (isRegenerating = false) => {
    if (!selectedTopic) {
      showToast('Bé hãy chọn một chủ đề Mĩ thuật trước nhé!', 'error');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    if (!isRegenerating) {
      setResult(null);
      setSelectedIdeaIndex(null);
    }

    try {
      const res = await apiGenerateIdeas({
        grade: selectedGrade,
        topicName: selectedTopic.name,
        studentWish: studentWish.trim() || undefined,
        previousTitles: isRegenerating ? previousTitles : undefined,
      });

      setResult(res);
      setApiError(null);
      setSelectedIdeaIndex(null);

      // Collect titles to avoid repeating
      if (res.ideas && res.ideas.length > 0) {
        const newTitles = res.ideas.map((i) => i.title);
        setPreviousTitles((prev) => [...prev, ...newTitles]);
      }

      showToast('Oa! 3 ý tưởng sáng tạo tuyệt vời đã sẵn sàng cho bé!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Không thể tạo ý tưởng, bé thử lại sau giây lát nhé!';
      const isMissingKey =
        msg.includes('GEMINI_API_KEY') ||
        msg.includes('khóa bí mật') ||
        msg.includes('MISSING_GEMINI_API_KEY');
      setApiError({ message: msg, isMissingKey });
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Chọn ý tưởng: Đánh dấu đang chọn và mở rộng thông báo
  const handleSelectIdea = (idea: GeneratedIdea, index: number) => {
    setSelectedIdeaIndex(index);
    showToast(`Bé đã chọn ý tưởng "${idea.title}". Bé có thể nhấn "Chỉnh sửa" hoặc "Lưu vào sổ tay" nhé!`, 'success');
  };

  // Open modal to customize and save
  const handleOpenSaveModal = (idea: GeneratedIdea) => {
    if (!user) {
      showToast('Bé hãy đăng nhập để chỉnh sửa và lưu ý tưởng vào sổ tay của mình nhé!', 'info');
      onOpenLogin();
      return;
    }

    setEditingIdea(idea);
    setEditTitle(idea.title);
    setEditContent(idea.mainContent);
    setEditSpark(idea.creativeSpark);
    setEditMaterial(idea.materialSuggestions);
    setEditNotes('');
  };

  // Lưu trực tiếp ý tưởng vào sổ tay
  const handleDirectSave = async (idea: GeneratedIdea) => {
    if (!user) {
      showToast('Bé hãy đăng nhập để lưu ý tưởng vào sổ tay của mình nhé!', 'info');
      onOpenLogin();
      return;
    }
    if (!selectedTopic) return;

    setIsSaving(true);
    try {
      await apiSaveNotebookItem({
        title: idea.title,
        grade: selectedGrade,
        topicName: selectedTopic.name,
        topicId: selectedTopic.id,
        mainContent: idea.mainContent,
        charactersAndObjects: idea.charactersAndObjects,
        activitiesAndDetails: idea.activitiesAndDetails,
        composition: idea.composition,
        colorSuggestions: idea.colorSuggestions,
        creativeSpark: idea.creativeSpark,
        materialSuggestions: idea.materialSuggestions,
        studentNotes: '',
        status: 'Ý tưởng mới',
        sharedWithTeacher: shareWithTeacher,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(`Đã lưu ý tưởng "${idea.title}" vào Sổ tay sáng tạo thành công!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu ý tưởng, bé thử lại nhé!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!editingIdea || !selectedTopic) return;

    setIsSaving(true);
    try {
      await apiSaveNotebookItem({
        title: editTitle.trim() || editingIdea.title,
        grade: selectedGrade,
        topicName: selectedTopic.name,
        topicId: selectedTopic.id,
        mainContent: editContent.trim() || editingIdea.mainContent,
        charactersAndObjects: editingIdea.charactersAndObjects,
        activitiesAndDetails: editingIdea.activitiesAndDetails,
        composition: editingIdea.composition,
        colorSuggestions: editingIdea.colorSuggestions,
        creativeSpark: editSpark.trim() || editingIdea.creativeSpark,
        materialSuggestions: editMaterial.trim() || editingIdea.materialSuggestions,
        studentNotes: editNotes.trim(),
        status: 'Ý tưởng mới',
        sharedWithTeacher: shareWithTeacher,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast('Đã lưu ý tưởng vào Sổ tay sáng tạo của bé thành công!', 'success');
      setEditingIdea(null);
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu ý tưởng, bé thử lại nhé!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-md border-3 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-black text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>TRỢ LÝ Ý TƯỞNG MĨ THUẬT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Nunito']">
            Cùng AI khơi nguồn sáng tạo tranh vẽ
          </h1>
          <p className="text-sm sm:text-base font-bold text-amber-900 max-w-2xl leading-relaxed">
            Chọn khối lớp, chủ đề bài học và nói cho AI biết mong muốn của em. Bé sẽ nhận được ngay 3
            ý tưởng độc đáo để tự tin cầm cọ vẽ!
          </p>
        </div>
        <div className="w-20 h-20 bg-white/90 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0">
          🎨
        </div>
      </div>

      {/* STEP 1: CHỌN KHỐI LỚP */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-sm shadow-xs">
            1
          </span>
          <h2 className="text-xl font-black text-slate-900">Chọn khối lớp của bé:</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((gradeNum) => (
            <button
              key={gradeNum}
              type="button"
              onClick={() => handleSelectGrade(gradeNum)}
              className={`p-4 rounded-2xl border-3 font-black text-center transition-all ${
                selectedGrade === gradeNum
                  ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-102'
                  : 'bg-amber-50/60 border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-100/50'
              }`}
            >
              <div className="text-2xl mb-1">
                {gradeNum === 1 && '🌱'}
                {gradeNum === 2 && '🌿'}
                {gradeNum === 3 && '🌻'}
                {gradeNum === 4 && '🚀'}
                {gradeNum === 5 && '🏆'}
              </div>
              <div className="text-base">Lớp {gradeNum}</div>
              <div className="text-[11px] font-bold opacity-80">
                {gradeNum === 1 && 'Nét vẽ mầm non'}
                {gradeNum === 2 && 'Màu sắc vui nhộn'}
                {gradeNum === 3 && 'Hoa văn & Bố cục'}
                {gradeNum === 4 && 'Không gian & Di sản'}
                {gradeNum === 5 && 'Sáng tạo & Thông điệp'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: CHỌN CHỦ ĐỀ */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-400 text-orange-950 font-black flex items-center justify-center text-sm shadow-xs">
              2
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Chọn chủ đề Mĩ thuật Lớp {selectedGrade}:
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-800">
            {availableTopics.length} chủ đề chính khóa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
          {availableTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleSelectTopic(topic)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                selectedTopic?.id === topic.id
                  ? 'bg-amber-100 border-amber-500 shadow-sm text-amber-950'
                  : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 hover:bg-amber-50/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-amber-800">
                  <span>Chủ đề {topic.order}</span>
                  {selectedTopic?.id === topic.id && <Check className="w-4 h-4 text-amber-700" />}
                </div>
                <div className="font-extrabold text-sm leading-snug">{topic.name}</div>
              </div>
            </button>
          ))}
        </div>

        {selectedTopic && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-fade-in">
            <div className="text-xs font-bold text-amber-900">
              <span className="font-black text-amber-950">Gợi ý chủ đề:</span> {selectedTopic.description}
            </div>

            {/* Quick sample chips */}
            <div className="pt-2 border-t border-amber-200/60">
              <span className="text-xs font-black text-slate-700 block mb-1.5">
                💡 Bé có thể chọn nhanh gợi ý mẫu dưới đây:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUsePrompt(p)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-200 text-xs font-bold text-slate-800 border border-amber-300 transition shadow-2xs hover:scale-102 text-left"
                  >
                    ✨ “{p}”
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3: MONG MUỐN CỦA BÉ */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-sky-400 text-sky-950 font-black flex items-center justify-center text-sm shadow-xs">
            3
          </span>
          <h2 className="text-xl font-black text-slate-900">
            Mong muốn của bé (hoặc để trống để AI bất ngờ gợi ý):
          </h2>
        </div>

        <div>
          <textarea
            rows={3}
            value={studentWish}
            onChange={(e) => setStudentWish(e.target.value)}
            placeholder="Ví dụ: Em muốn vẽ bạn nhỏ đang thả diều trên đê, có chú cún chạy theo, màu sắc vàng rực của hoàng hôn..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-semibold text-sm leading-relaxed transition"
          />
        </div>

        {/* Submit button & Error alert */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-500">
              AI sẽ tạo 3 ý tưởng hoàn toàn mới phù hợp chuẩn lứa tuổi Lớp {selectedGrade}
            </div>

            <button
              type="button"
              disabled={isLoading || !selectedTopic}
              onClick={() => handleGenerate(false)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-base shadow-lg transition active:scale-98 flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-950" />
                  <span>Bạn Họa sĩ AI đang tìm ý tưởng cho em...</span>
                </>
              ) : (
                <>
                  <Brush className="w-5 h-5 text-amber-950" />
                  <span>Giúp em tìm ý tưởng!</span>
                </>
              )}
            </button>
          </div>

          {/* Error Banner with helpful guidance */}
          {apiError && (
            <div className="p-5 rounded-2xl border-2 border-red-300 bg-red-50 text-red-950 space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 font-black shrink-0">
                  ⚠️
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-black text-sm text-red-900">
                    {apiError.isMissingKey
                      ? 'Cần thiết lập khóa bí mật GEMINI_API_KEY'
                      : 'Không thể kết nối với Trợ lý AI lúc này'}
                  </h4>
                  <p className="text-xs font-semibold text-red-800 leading-relaxed">
                    {apiError.message}
                  </p>

                  {apiError.isMissingKey && (
                    <div className="p-3.5 bg-white/90 rounded-xl border border-red-200 text-xs text-slate-800 space-y-1.5 mt-2">
                      <p className="font-bold text-red-900">👉 Hướng dẫn kích hoạt kết nối AI Gemini thật:</p>
                      <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-700">
                        <li>
                          Mở giao diện AI Studio của dự án này.
                        </li>
                        <li>
                          Vào mục <strong>Settings</strong> &gt; <strong>Secrets</strong>.
                        </li>
                        <li>
                          Thêm secret có tên <code className="bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-mono font-bold">GEMINI_API_KEY</code> và dán khóa API của bạn vào.
                        </li>
                        <li>
                          Sau khi lưu secret, nhấn nút <strong>"Thử lại ngay"</strong> bên dưới.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGenerate(false)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Thử lại ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESULT SECTION: 3 UNIQUE IDEAS */}
      {result && result.ideas && (
        <section className="space-y-6 animate-fade-in">
          {/* Friendly note from AI */}
          <div className="p-5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="font-black text-lg">Ý tưởng dành riêng cho họa sĩ nhí!</h3>
                <p className="text-sm font-semibold text-amber-900 mt-0.5 leading-relaxed">
                  {result.friendlyNote}
                </p>
                {result.guidingQuestions && result.guidingQuestions.length > 0 && (
                  <div className="mt-2 text-xs font-bold text-orange-950 bg-white/70 px-3 py-1.5 rounded-xl border border-orange-200">
                    ❓ Câu hỏi gợi ý cho bé: {result.guidingQuestions.join(' • ')}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleGenerate(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 transition flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Đổi 3 ý tưởng khác</span>
            </button>
          </div>

          {/* The 3 Idea Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {result.ideas.map((idea, index) => {
              const isSelected = selectedIdeaIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl border-3 transition-all duration-300 flex flex-col justify-between space-y-5 p-6 shadow-sm hover:shadow-xl ${
                    isSelected
                      ? 'border-amber-500 ring-4 ring-amber-200/80 bg-amber-50/20'
                      : 'border-amber-200 hover:border-orange-400'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-900 border border-orange-200">
                          Ý tưởng số {index + 1}
                        </span>
                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs">
                            ⭐ Đang chọn
                          </span>
                        )}
                      </div>
                      <span className="text-2xl select-none">
                        {index === 0 ? '🌟' : index === 1 ? '🎨' : '🚀'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {idea.title}
                    </h3>

                    {/* Main Content */}
                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs font-bold text-slate-700 leading-relaxed">
                      <span className="text-amber-900 font-black block mb-1">📖 Nội dung chính:</span>
                      {idea.mainContent}
                    </div>

                    {/* Characters & Objects */}
                    <div className="text-xs space-y-1">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <span>👥 Nhân vật, con vật, đồ vật:</span>
                      </span>
                      <p className="text-slate-600 font-semibold leading-relaxed">
                        {idea.charactersAndObjects}
                      </p>
                    </div>

                    {/* Activities */}
                    <div className="text-xs space-y-1">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <span>🎈 Hoạt động & chi tiết thú vị:</span>
                      </span>
                      <p className="text-slate-600 font-semibold leading-relaxed">
                        {idea.activitiesAndDetails}
                      </p>
                    </div>

                    {/* Composition (Phía trước, phía giữa, phía sau) */}
                    <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-200 text-[11px] space-y-1.5">
                      <span className="font-black text-sky-950 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        Gợi ý bố cục không gian:
                      </span>
                      <div className="text-slate-700 font-semibold leading-relaxed space-y-1">
                        <div>
                          <span className="font-bold text-sky-800">• Phía trước:</span>{' '}
                          {idea.composition.foreground}
                        </div>
                        <div>
                          <span className="font-bold text-sky-800">• Phía giữa:</span>{' '}
                          {idea.composition.midground}
                        </div>
                        <div>
                          <span className="font-bold text-sky-800">• Phía sau:</span>{' '}
                          {idea.composition.background}
                        </div>
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="text-xs space-y-1">
                      <span className="font-black text-slate-900 flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-amber-600" />
                        Gợi ý màu sắc:
                      </span>
                      <p className="text-slate-600 font-semibold leading-relaxed">
                        {idea.colorSuggestions}
                      </p>
                    </div>

                    {/* Creative Spark */}
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold leading-relaxed flex items-start gap-2">
                      <span className="text-base">✨</span>
                      <div>
                        <span className="font-black block text-emerald-900 mb-0.5">
                          Chi tiết sáng tạo độc đáo:
                        </span>
                        {idea.creativeSpark}
                      </div>
                    </div>

                    {/* Material */}
                    <div className="text-xs space-y-1">
                      <span className="font-black text-slate-900">🖌️ Gợi ý chất liệu phù hợp:</span>
                      <p className="text-slate-600 font-semibold">{idea.materialSuggestions}</p>
                    </div>

                    {/* Open-ended question */}
                    {idea.openEndedQuestion && (
                      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 font-bold leading-relaxed flex items-start gap-2">
                        <span className="text-base">💭</span>
                        <div>
                          <span className="font-black block text-purple-900 mb-0.5">
                            Câu hỏi gợi mở cho em:
                          </span>
                          {idea.openEndedQuestion}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons: Chọn ý tưởng, Chỉnh sửa, Lưu vào sổ tay */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Nút 1: Chọn ý tưởng */}
                      <button
                        type="button"
                        onClick={() => handleSelectIdea(idea, index)}
                        className={`py-2.5 px-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-xs'
                            : 'bg-white hover:bg-amber-100 text-slate-800 border-2 border-amber-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-amber-950' : 'text-amber-700'}`} />
                        <span>{isSelected ? 'Đã chọn' : 'Chọn ý tưởng'}</span>
                      </button>

                      {/* Nút 2: Chỉnh sửa */}
                      <button
                        type="button"
                        onClick={() => handleOpenSaveModal(idea)}
                        className="py-2.5 px-3 rounded-2xl bg-white hover:bg-sky-100 text-sky-900 font-black text-xs border-2 border-sky-300 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Edit3 className="w-4 h-4 text-sky-700" />
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>

                    {/* Nút 3: Lưu vào sổ tay */}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDirectSave(idea)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{isSaving ? 'Đang lưu...' : 'Lưu vào sổ tay'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODAL: CHỈNH SỬA & LƯU VÀO SỔ TAY */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative">
            <div className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 p-5 flex items-center justify-between border-b-2 border-amber-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-lg font-black text-amber-950">
                    Lưu ý tưởng vào Sổ tay sáng tạo
                  </h3>
                  <p className="text-xs font-bold text-amber-900">
                    Bé có thể chỉnh sửa lại tên tranh và thêm ghi chú riêng của mình
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingIdea(null)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveToNotebook} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Tên ý tưởng tranh (Bé có thể tự đặt tên mới)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Nội dung bức tranh
                </label>
                <textarea
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-semibold text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Chi tiết sáng tạo riêng của em
                </label>
                <input
                  type="text"
                  value={editSpark}
                  onChange={(e) => setEditSpark(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Ghi chú riêng của bé (Bé định vẽ lúc nào, tặng ai, dùng màu gì?)
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ví dụ: Em sẽ vẽ tặng mẹ vào ngày sinh nhật, em sẽ dùng sáp dầu tô thật đậm..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-semibold text-xs"
                />
              </div>

              {/* Share toggle */}
              <div className="flex items-center justify-between p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                <div className="text-xs">
                  <span className="font-extrabold text-purple-950 block">
                    Chia sẻ với thầy cô Mĩ thuật
                  </span>
                  <span className="text-[11px] font-semibold text-purple-800">
                    Để cô giáo xem và gửi lời động viên cho bé
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareWithTeacher}
                    onChange={(e) => setShareWithTeacher(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu vào Sổ tay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
