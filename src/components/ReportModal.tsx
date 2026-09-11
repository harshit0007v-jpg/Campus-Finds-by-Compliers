import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemType, ItemCategory, CampusArea } from '../types';
import { CATEGORY_SAMPLE_TEMPLATES } from '../mockData';
import { ImageSelector } from './ImageSelector';
import { 
  X, 
  Upload, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Image as ImageIcon,
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  Mail
} from 'lucide-react';

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'ID & Cards',
  'Wallets & Bags',
  'Keys',
  'Accessories',
  'Books & Study',
  'Clothing',
  'Bottles & Containers',
  'Other',
];

const AREAS: CampusArea[] = [
  'Library',
  'Block 34',
  'Cafeteria',
  'Hostel',
  'Academic Block',
  'Sports Complex',
  'Student Center',
  'Computer Labs',
];

export const ReportModal: React.FC = () => {
  const { 
    reportModalOpen, 
    setReportModalOpen, 
    reportInitialType, 
    addNewReport,
    setSelectedItem,
    user,
    updateUserEmail
  } = useApp();

  const [type, setType] = useState<ItemType>(reportInitialType);
  const [email, setEmail] = useState(() => user.email || 'harshit0007v@gmail.com');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [area, setArea] = useState<CampusArea>('Library');
  const [locationDetail, setLocationDetail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Hidden anti-theft verification info
  const [questionPrompt, setQuestionPrompt] = useState('What unique scratch, sticker, or engraving is on this item?');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [secretNotes, setSecretNotes] = useState('');

  // Submission success state
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  if (!reportModalOpen) return null;

  const handleApplyCategoryTemplate = (tpl: typeof CATEGORY_SAMPLE_TEMPLATES[0]) => {
    setCategory(tpl.category);
    setArea(tpl.defaultLocation as CampusArea);
    setQuestionPrompt(tpl.suggestedQuestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const sanitizedEmail = email.trim() || user.email || 'harshit0007v@gmail.com';
    updateUserEmail(sanitizedEmail);

    const newItem = addNewReport({
      type,
      title: title.trim(),
      category,
      area,
      locationDetail: locationDetail.trim() || `${area} Ground Floor`,
      date,
      time,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      finderEmail: type === 'found' ? sanitizedEmail : undefined,
      reporterEmail: sanitizedEmail,
      hiddenDetails: {
        questionPrompt: questionPrompt.trim() || 'Describe any secret identifier or specific pocket contents:',
        correctAnswer: correctAnswer.trim() || 'No specific answer entered',
        serialOrSecretNotes: secretNotes.trim(),
      },
    });

    setSubmittedCaseId(newItem.id);
  };

  const handleClose = () => {
    setReportModalOpen(false);
    setSubmittedCaseId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {submittedCaseId ? 'Report Published!' : 'File a Campus Report'}
            </h2>
            <p className="text-xs text-slate-500">
              {submittedCaseId ? 'Your item is now live in the system' : 'Report lost or found personal belongings on campus'}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Submission View */}
        {submittedCaseId ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Report Successfully Logged</span>
              <h3 className="text-2xl font-black text-slate-900 font-mono">
                Case #{submittedCaseId}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our AI matching pipeline is actively analyzing new and existing campus reports. Private verification details have been secured in our anti-cheat vault.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-semibold text-slate-800">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className={`font-bold uppercase ${type === 'lost' ? 'text-rose-600' : 'text-indigo-600'}`}>
                  {type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800">{area} ({locationDetail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hidden Security Question:</span>
                <span className="text-emerald-700 font-medium">Secured in Vault 🔒</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
              >
                Done & View Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Quick Category Starter Templates */}
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quick Category Helper (Select to configure suggested prompts):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_SAMPLE_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyCategoryTemplate(tpl)}
                    className="text-[11px] bg-white hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
                  >
                    + {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Toggle: Lost or Found */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Report Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    type === 'lost'
                      ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${type === 'lost' ? 'bg-rose-600' : 'bg-slate-300'}`} />
                  I Lost An Item
                </button>
                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    type === 'found'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${type === 'found' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  I Found An Item
                </button>
              </div>
            </div>

            {/* Image Selector & Gallery */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Item Photo <span className="text-slate-400 font-normal">(AI Visual Matcher)</span>
                </label>
                <span className="text-[11px] text-indigo-600 font-medium">Device Gallery • Stock Gallery • Drag & Drop</span>
              </div>
              <ImageSelector 
                imageUrl={imageUrl} 
                onChange={setImageUrl} 
                suggestedCategory={category} 
              />
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Navy Blue Backpack, Scientific Calculator, Student Card..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ItemCategory)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campus Area & Location Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Area <span className="text-rose-500">*</span>
                </label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value as CampusArea)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Location Detail
                </label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={e => setLocationDetail(e.target.value)}
                  placeholder="e.g. 2nd Floor study carrel #14"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approximate Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Public Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Description <span className="text-rose-500">*</span>
                <span className="text-slate-400 font-normal ml-1">(Visible to campus community)</span>
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe visible general features (color, brand, make). Do NOT include secret numbers or stickers here!"
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* User / Finder Email Identification */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{type === 'found' ? "Finder's Email Address" : "User / Owner Email Address"}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-indigo-600 font-semibold px-2 py-0.5 bg-indigo-100/60 rounded-full">
                  {type === 'found' ? "Finder Contact" : "Case Contact"}
                </span>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
              />
              <p className="text-[11px] text-slate-500">
                {type === 'found' 
                  ? "As the finder, your email will be recorded with this case so the legitimate owner and Block 33 Lost & Found officers can reach you or verify custody handover."
                  : "Your email will be used for automated AI match notifications and secure recovery verification."}
              </p>
            </div>

            {/* CRITICAL ANTI-CHEATING SECTION: HIDDEN IDENTIFYING DETAILS */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Anti-Cheat Vault: Private Identifying Details
                  </h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    <strong>IMPORTANT:</strong> This information is strictly encrypted and <strong>NEVER displayed publicly</strong>. It is formulated into a verification question to prove authentic ownership when someone claims this item.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Verification Question Prompt:
                </label>
                <input
                  type="text"
                  value={questionPrompt}
                  onChange={e => setQuestionPrompt(e.target.value)}
                  placeholder="e.g. What sticker is inside the left slider, or what photo is in the wallet?"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Secret Correct Answer (Known only to real owner):
                </label>
                <input
                  type="text"
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(e.target.value)}
                  placeholder="e.g. Silver sticker with initials AC-24, or Polaroid of puppy"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-amber-800 mb-1">
                  Optional Serial Number / Custody Note (Internal Security only):
                </label>
                <input
                  type="text"
                  value={secretNotes}
                  onChange={e => setSecretNotes(e.target.value)}
                  placeholder="e.g. Serial #9821, $20 bill in sleeve"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Report & Generate Case ID</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
