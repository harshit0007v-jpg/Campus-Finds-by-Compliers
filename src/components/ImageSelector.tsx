import React, { useState, useRef } from 'react';
import { 
  ImageIcon, 
  Upload, 
  Images, 
  Trash2, 
  X, 
  Check, 
  Sparkles, 
  Link as LinkIcon, 
  FolderOpen,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { compressAndResizeImage } from '../utils/imageUtils';
import { CAMPUS_STOCK_GALLERY, GalleryPreset } from '../data/campusGallery';

interface ImageSelectorProps {
  imageUrl: string;
  onChange: (url: string) => void;
  suggestedCategory?: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  imageUrl, 
  onChange,
  suggestedCategory 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [imageSourceType, setImageSourceType] = useState<'device' | 'stock' | 'url' | null>(
    imageUrl ? (imageUrl.startsWith('data:') ? 'device' : 'url') : null
  );

  // Trigger device photo gallery file input
  const handleOpenDeviceGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (JPEG, PNG, WEBP, etc.)');
      return;
    }

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressAndResizeImage(file);
      onChange(compressedDataUrl);
      setImageSourceType('device');
    } catch (err) {
      console.error('Failed to process gallery image:', err);
      alert('Could not process this image. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Stock Gallery selection
  const handleSelectFromStock = (preset: GalleryPreset) => {
    onChange(preset.imageUrl);
    setImageSourceType('stock');
    setShowGalleryModal(false);
  };

  // URL application
  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setImageSourceType('url');
      setShowUrlInput(false);
      setUrlDraft('');
    }
  };

  const handleClearImage = () => {
    onChange('');
    setImageSourceType(null);
  };

  const categories = ['All', 'Electronics', 'ID & Cards', 'Wallets & Bags', 'Keys', 'Bottles & Containers', 'Study & Books', 'Clothing & Accessories'];

  const filteredStock = galleryFilter === 'All'
    ? CAMPUS_STOCK_GALLERY
    : CAMPUS_STOCK_GALLERY.filter(item => item.category === galleryFilter);

  return (
    <div className="space-y-3">
      {/* Hidden system file picker for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Image Container */}
      {!imageUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01]' 
              : 'border-slate-300 hover:border-indigo-300 bg-slate-50/60'
          }`}
        >
          {isProcessing ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Loading photo from gallery...</p>
              <p className="text-[11px] text-slate-400">Optimizing for fast campus matching</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <ImageIcon className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Add Item Photograph
                </h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                  Choose a picture from your device gallery or browse our campus stock collection for instant AI visual matching.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleOpenDeviceGallery}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Choose from Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGalleryModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200 shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Images className="w-4 h-4 text-indigo-600" />
                  <span>Campus Stock Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Link URL</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                Drag and drop photo here • Supports JPG, PNG, WEBP, HEIC
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Selected Image Preview Display */
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-slate-200 overflow-hidden shrink-0 relative border border-slate-300 shadow-inner group">
              <img 
                src={imageUrl} 
                alt="Selected Item" 
                className="w-full h-full object-cover"
                onError={() => {
                  alert('Unable to load this image URL. Please choose another.');
                  handleClearImage();
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenDeviceGallery}
                  title="Change from Gallery"
                  className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  title="Remove Image"
                  className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info & Change controls */}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {imageSourceType === 'device' ? 'Photo Loaded from Gallery' : imageSourceType === 'stock' ? 'Selected from Campus Gallery' : 'Image URL Connected'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">
                AI visual matching is enabled for this photograph to correlate with reported loss/find cases.
              </p>

              {/* Action Buttons to Switch / Replace */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenDeviceGallery}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choose Another from Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGalleryModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <Images className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Stock Gallery</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible URL Input Field */}
      {showUrlInput && !imageUrl && (
        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 flex gap-2 animate-in fade-in">
          <input
            type="url"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            placeholder="Paste public image link (e.g. https://...)"
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Campus Stock Photo Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Images className="w-4 h-4 text-indigo-600" />
                  <span>Campus Item Gallery</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select a representative photo for your lost or found report
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    galleryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
              {filteredStock.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromStock(item)}
                  className="group relative rounded-xl border border-slate-200 hover:border-indigo-400 overflow-hidden bg-white shadow-2xs hover:shadow-md cursor-pointer transition flex flex-col"
                >
                  <div className="aspect-square w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="bg-white/90 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Select Photo
                      </span>
                    </div>
                  </div>
                  <div className="p-2 text-left">
                    <h5 className="font-semibold text-slate-800 text-[11px] truncate group-hover:text-indigo-600">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer with Direct Device Gallery Upload Option */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Have your own picture?
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowGalleryModal(false);
                  handleOpenDeviceGallery();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Upload from Device Gallery</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
