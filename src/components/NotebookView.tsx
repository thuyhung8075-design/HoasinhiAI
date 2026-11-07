import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NotebookItem, CompositionPlan } from '../types';
import {
  apiGetNotebook,
  apiSaveNotebookItem,
  apiUpdateNotebookItem,
  apiDeleteNotebookItem,
} from '../services/api';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  X,
  MessageSquare,
  Palette,
  AlertTriangle,
  LogIn,
} from 'lucide-react';
import { getTopicsForGrade } from '../data/curriculum';

interface NotebookViewProps {
  onOpenLogin: () => void;
  onNavigateToAssistant: () => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  onOpenLogin,
  onNavigateToAssistant,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState<NotebookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [viewingItem, setViewingItem] = useState<NotebookItem | null>(null);
  const [editingItem, setEditingItem] = useState<NotebookItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for creating/editing
  const [formTitle, setFormTitle] = useState('');
  const [formGrade, setFormGrade] = useState<number>(user?.grade || 3);
  const [formTopic, setFormTopic] = useState('Biết ơn thầy cô');
  const [formMainContent, setFormMainContent] = useState('');
  const [formCharacters, setFormCharacters] = useState('');
  const [formForeground, setFormForeground] = useState('');
  const [formMidground, setFormMidground] = useState('');
  const [formBackground, setFormBackground] = useState('');
  const [formColors, setFormColors] = useState('');
  const [formSpark, setFormSpark] = useState('');
  const [formMaterials, setFormMaterials] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'Ý tưởng mới' | 'Đang phát triển' | 'Đã hoàn thành'>(
    'Ý tưởng mới'
  );
  const [formShared, setFormShared] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load notebook data from server
  const loadItems = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await apiGetNotebook();
      setItems(res.items || []);
    } catch (err: any) {
      showToast(err.message || 'Không thể tải sổ tay sáng tạo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  // Open edit modal
  const handleOpenEdit = (item: NotebookItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormGrade(item.grade);
    setFormTopic(item.topicName);
    setFormMainContent(item.mainContent);
    setFormCharacters(item.charactersAndObjects);
    setFormForeground(item.composition?.foreground || '');
    setFormMidground(item.composition?.midground || '');
    setFormBackground(item.composition?.background || '');
    setFormColors(item.colorSuggestions);
    setFormSpark(item.creativeSpark);
    setFormMaterials(item.materialSuggestions);
    setFormNotes(item.studentNotes);
    setFormStatus(item.status);
    setFormShared(item.sharedWithTeacher);
  };

  // Open create new modal
  const handleOpenCreateNew = () => {
    setEditingItem(null);
    setIsCreatingNew(true);
    setFormTitle('');
    const defaultGrade = user?.grade || 3;
    setFormGrade(defaultGrade);
    const topics = getTopicsForGrade(defaultGrade);
    setFormTopic(topics[0]?.name || 'Chủ đề Mĩ thuật');
    setFormMainContent('');
    setFormCharacters('');
    setFormForeground('');
    setFormMidground('');
    setFormBackground('');
    setFormColors('');
    setFormSpark('');
    setFormMaterials('');
    setFormNotes('');
    setFormStatus('Ý tưởng mới');
    setFormShared(true);
  };

  // Save changes or create new
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Bé hãy đặt tên cho ý tưởng nhé!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<NotebookItem> = {
        title: formTitle.trim(),
        grade: formGrade,
        topicName: formTopic,
        mainContent: formMainContent.trim(),
        charactersAndObjects: formCharacters.trim(),
        composition: {
          foreground: formForeground.trim(),
          midground: formMidground.trim(),
          background: formBackground.trim(),
        },
        colorSuggestions: formColors.trim(),
        creativeSpark: formSpark.trim(),
        materialSuggestions: formMaterials.trim(),
        studentNotes: formNotes.trim(),
        status: formStatus,
        sharedWithTeacher: formShared,
      };

      if (editingItem) {
        await apiUpdateNotebookItem(editingItem.id, payload);
        showToast('Đã cập nhật ý tưởng trong sổ tay thành công!', 'success');
      } else {
        await apiSaveNotebookItem(payload);
        showToast('Đã thêm ý tưởng mới vào sổ tay của bé!', 'success');
      }

      setEditingItem(null);
      setIsCreatingNew(false);
      await loadItems();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu ý tưởng.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await apiDeleteNotebookItem(deletingId);
      showToast('Đã xóa ý tưởng khỏi sổ tay.', 'info');
      setDeletingId(null);
      await loadItems();
    } catch (err: any) {
      showToast(err.message || 'Không thể xóa ý tưởng.', 'error');
    }
  };

  // Filtered items
  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.studentNotes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = filterGrade === 'all' || it.grade === filterGrade;
    const matchesStatus = filterStatus === 'all' || it.status === filterStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  if (!user) {
    return (
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-10 text-center max-w-xl mx-auto my-12 shadow-sm space-y-5">
        <div className="w-20 h-20 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner">
          📖
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 font-['Nunito']">
            Sổ tay sáng tạo cá nhân của bé
          </h2>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed">
            Để bảo mật quyền riêng tư của từng bạn nhỏ, bé hãy đăng nhập để mở sổ tay sáng tạo riêng,
            xem lại các ý tưởng đã lưu và lời nhận xét từ cô giáo nhé!
          </p>
        </div>
        <button
          onClick={onOpenLogin}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black text-base shadow-md transition inline-flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Đăng nhập để mở Sổ tay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 rounded-3xl p-6 sm:p-8 text-emerald-950 shadow-md border-3 border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-black text-emerald-900">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>SỔ TAY SÁNG TẠO MĨ THUẬT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Nunito']">
            Bộ sưu tập ý tưởng của {user.name}
          </h1>
          <p className="text-sm sm:text-base font-bold text-emerald-900 max-w-2xl leading-relaxed">
            Nơi cất giữ những ý tưởng diệu kỳ, ghi chú tâm huyết và các lời nhận xét ấm áp từ thầy
            cô. Dữ liệu được lưu trữ an toàn trên máy chủ của trường!
          </p>
        </div>

        <button
          onClick={handleOpenCreateNew}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md transition flex items-center gap-2 shrink-0 border-2 border-emerald-200 active:scale-98"
        >
          <Plus className="w-5 h-5 text-emerald-600" />
          <span>Tạo ý tưởng mới</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-3xl border-3 border-emerald-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên ý tưởng, chủ đề hoặc ghi chú..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 focus:outline-none text-xs font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Grade filter */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <span>Khối:</span>
            <select
              value={filterGrade}
              onChange={(e) =>
                setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs focus:outline-none"
            >
              <option value="all">Tất cả khối</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <span>Trạng thái:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Ý tưởng mới">Ý tưởng mới</option>
              <option value="Đang phát triển">Đang phát triển</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-bold text-sm">
          Đang mở sổ tay sáng tạo của bé...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border-3 border-dashed border-emerald-200 p-12 text-center space-y-4">
          <div className="text-4xl">🌱</div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">Sổ tay hiện đang trống</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Bé chưa lưu ý tưởng nào. Hãy dùng chức năng “Trợ lý ý tưởng” hoặc bấm “Tạo ý tưởng mới”
              ở phía trên để ghi lại những nét vẽ diệu kỳ nhé!
            </p>
          </div>
          <button
            onClick={onNavigateToAssistant}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Khám phá ý tưởng ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-3 border-slate-200 hover:border-emerald-300 p-6 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Lớp {item.grade}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                        item.status === 'Đã hoàn thành'
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : item.status === 'Đang phát triển'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.sharedWithTeacher && (
                    <span
                      title="Đã chia sẻ với giáo viên"
                      className="text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-bold"
                    >
                      👩‍🏫 Chia sẻ
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-amber-800">
                  Chủ đề: {item.topicName}
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-semibold">
                  {item.mainContent}
                </p>

                {item.studentNotes && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950">
                    <span className="font-bold text-amber-900 block mb-0.5">📌 Ghi chú của em:</span>
                    <span className="line-clamp-2 italic">{item.studentNotes}</span>
                  </div>
                )}

                {/* Teacher comments indicator */}
                {item.teacherFeedbacks && item.teacherFeedbacks.length > 0 && (
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 font-semibold flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-purple-900 block">
                        Cô Đỗ Thanh Thuý nhận xét:
                      </span>
                      <span className="line-clamp-2 italic">
                        "{item.teacherFeedbacks[item.teacherFeedbacks.length - 1].comment}"
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingItem(item)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs transition flex items-center justify-center gap-1 border border-emerald-300"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                    title="Xóa ý tưởng"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-300 to-teal-300 p-5 flex items-center justify-between border-b-2 border-emerald-400">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-lg font-black text-emerald-950 font-['Nunito']">
                    Chi tiết ý tưởng mĩ thuật
                  </h3>
                  <p className="text-xs font-bold text-emerald-900">
                    Lớp {viewingItem.grade} • Chủ đề: {viewingItem.topicName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <h2 className="text-xl font-black text-slate-900">{viewingItem.title}</h2>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-slate-800 leading-relaxed">
                <span className="font-black text-amber-950 block mb-1">📖 Nội dung chính:</span>
                {viewingItem.mainContent}
              </div>

              {viewingItem.charactersAndObjects && (
                <div className="text-xs space-y-1">
                  <span className="font-black text-slate-900">👥 Nhân vật & cảnh vật:</span>
                  <p className="text-slate-600 font-semibold">{viewingItem.charactersAndObjects}</p>
                </div>
              )}

              {/* Composition */}
              {viewingItem.composition && (
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-1">
                  <span className="font-black text-sky-950 block mb-1">
                    Gợi ý bố cục không gian:
                  </span>
                  <div className="space-y-1 text-slate-700 font-semibold">
                    {viewingItem.composition.foreground && (
                      <div>
                        <span className="font-bold text-sky-800">• Phía trước:</span>{' '}
                        {viewingItem.composition.foreground}
                      </div>
                    )}
                    {viewingItem.composition.midground && (
                      <div>
                        <span className="font-bold text-sky-800">• Phía giữa:</span>{' '}
                        {viewingItem.composition.midground}
                      </div>
                    )}
                    {viewingItem.composition.background && (
                      <div>
                        <span className="font-bold text-sky-800">• Phía sau:</span>{' '}
                        {viewingItem.composition.background}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewingItem.colorSuggestions && (
                <div className="text-xs space-y-1">
                  <span className="font-black text-slate-900">🎨 Màu sắc:</span>
                  <p className="text-slate-600 font-semibold">{viewingItem.colorSuggestions}</p>
                </div>
              )}

              {viewingItem.creativeSpark && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold">
                  ✨ Chi tiết sáng tạo riêng: {viewingItem.creativeSpark}
                </div>
              )}

              {viewingItem.studentNotes && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-semibold">
                  📌 Ghi chú riêng của bé: {viewingItem.studentNotes}
                </div>
              )}

              {/* Saved Critique */}
              {viewingItem.savedCritique && (
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                  <span className="font-black text-sky-950 block">
                    🔍 Lời nhận xét Soi tranh từ AI:
                  </span>
                  <div className="text-slate-700 font-semibold space-y-1">
                    <div>
                      <b>Điều thú vị:</b> {viewingItem.savedCritique.interestingThings}
                    </div>
                    <div>
                      <b>Lời động viên:</b> "{viewingItem.savedCritique.encouragement}"
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher Feedbacks */}
              {viewingItem.teacherFeedbacks && viewingItem.teacherFeedbacks.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-2">
                  <span className="font-black text-purple-950 block">
                    👩‍🏫 Lời nhận xét từ thầy cô:
                  </span>
                  {viewingItem.teacherFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3 bg-white rounded-xl border border-purple-200 space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-purple-900">
                        <span>{fb.teacherName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="italic text-slate-700 font-semibold leading-relaxed">
                        “{fb.comment}”
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setViewingItem(null);
                  handleOpenEdit(viewingItem);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-xs transition"
              >
                Chỉnh sửa ý tưởng
              </button>
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(editingItem || isCreatingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-300 to-teal-300 p-5 flex items-center justify-between border-b-2 border-emerald-400">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editingItem ? '✏️' : '✨'}</span>
                <div>
                  <h3 className="text-lg font-black text-emerald-950 font-['Nunito']">
                    {editingItem ? 'Chỉnh sửa ý tưởng' : 'Tạo ý tưởng mới tự do'}
                  </h3>
                  <p className="text-xs font-bold text-emerald-900">
                    Bé có thể thoải mái thêm thắt các chi tiết ngộ nghĩnh
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreatingNew(false);
                }}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      setFormGrade(g);
                      const topics = getTopicsForGrade(g);
                      if (topics.length > 0) setFormTopic(topics[0].name);
                    }}
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
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Chủ đề Mĩ thuật
                  </label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                  >
                    {getTopicsForGrade(formGrade).map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.order}. {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Tên ý tưởng bức tranh *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Chuyến bay vào vũ trụ bánh kẹo"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Nội dung chính của bức tranh
                </label>
                <textarea
                  rows={2}
                  value={formMainContent}
                  onChange={(e) => setFormMainContent(e.target.value)}
                  placeholder="Miêu tả bức tranh của bé..."
                  className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold leading-relaxed"
                />
              </div>

              {/* Bố cục 3 lớp */}
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs">
                <span className="font-black text-sky-950 block">Gợi ý bố cục không gian:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formForeground}
                    onChange={(e) => setFormForeground(e.target.value)}
                    placeholder="Phía trước (tiền cảnh)..."
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={formMidground}
                    onChange={(e) => setFormMidground(e.target.value)}
                    placeholder="Phía giữa (trung cảnh)..."
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={formBackground}
                    onChange={(e) => setFormBackground(e.target.value)}
                    placeholder="Phía sau (hậu cảnh)..."
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Màu sắc gợi ý
                  </label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Ví dụ: Vàng chanh, xanh lá non, hồng..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Chất liệu vẽ
                  </label>
                  <input
                    type="text"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    placeholder="Ví dụ: Sáp dầu, màu chì, xé dán..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Nét riêng sáng tạo
                </label>
                <input
                  type="text"
                  value={formSpark}
                  onChange={(e) => setFormSpark(e.target.value)}
                  placeholder="Một chi tiết ngộ nghĩnh riêng của bé..."
                  className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Ghi chú riêng của bé
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Bé muốn lưu ý thêm điều gì cho bản thân..."
                  className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Trạng thái tiến độ
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Ý tưởng mới">Ý tưởng mới</option>
                    <option value="Đang phát triển">Đang phát triển</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-xs font-bold text-purple-950">
                    Chia sẻ với cô giáo Mĩ thuật
                  </span>
                  <input
                    type="checkbox"
                    checked={formShared}
                    onChange={(e) => setFormShared(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreatingNew(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-emerald-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu vào Sổ tay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-4 border-rose-200 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 rounded-full mx-auto flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Bé có chắc muốn xóa không?</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                Ý tưởng này sẽ được gỡ khỏi Sổ tay sáng tạo và không thể khôi phục lại.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Giữ lại
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
