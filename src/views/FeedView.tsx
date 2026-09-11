import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CampusItem, ItemCategory, CampusArea, ItemType } from '../types';
import { ItemCard } from '../components/ItemCard';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Tag, 
  MapPin, 
  Calendar, 
  RotateCcw,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface FeedViewProps {
  feedType: 'lost' | 'found' | 'all';
}

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All',
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

const AREAS: ('All' | CampusArea)[] = [
  'All',
  'Library',
  'Block 34',
  'Cafeteria',
  'Hostel',
  'Academic Block',
  'Sports Complex',
  'Student Center',
  'Computer Labs',
];

export const FeedView: React.FC<FeedViewProps> = ({ feedType }) => {
  const { 
    items, 
    searchQuery, 
    setSearchQuery, 
    selectedAreaFilter, 
    setSelectedAreaFilter,
    setReportModalOpen,
    setReportInitialType 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ItemCategory>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'match'>('recent');

  // Filter logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (feedType !== 'all' && item.type !== feedType) return false;

      // Area filter
      if (selectedAreaFilter !== 'All' && item.area !== selectedAreaFilter) return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Status filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesLocation = item.locationDetail.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesLocation && !matchesId && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      }
      // 'recent' by date and time
      return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
    });
  }, [items, feedType, selectedAreaFilter, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedAreaFilter('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setSortBy('recent');
  };

  const title = feedType === 'lost' 
    ? 'Lost Items Feed' 
    : feedType === 'found' 
      ? 'Found Items Feed' 
      : 'All Campus Reports';

  const subtitle = feedType === 'lost'
    ? 'Browse items reported missing by students and faculty. See something you found? Report it or claim.'
    : feedType === 'found'
      ? 'Items turned in across campus or secured at the Lost & Found office. Click "View Details" to verify ownership.'
      : 'Comprehensive live database of campus personal belongings.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-3 h-3 rounded-full ${feedType === 'lost' ? 'bg-rose-500' : 'bg-indigo-600'}`} />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredItems.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">{subtitle}</p>
        </div>

        <button
          onClick={() => {
            setReportInitialType(feedType === 'found' ? 'found' : 'lost');
            setReportModalOpen(true);
          }}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report {feedType === 'found' ? 'Found' : 'Lost'} Item</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${feedType === 'lost' ? 'lost' : feedType === 'found' ? 'found' : ''} items by keyword, case ID, building, brand...`}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'recent' | 'match')}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="recent">Recently Reported</option>
              <option value="match">Highest AI Match</option>
            </select>

            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" /> Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as 'All' | ItemCategory)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Campus Area
            </label>
            <select
              value={selectedAreaFilter}
              onChange={e => setSelectedAreaFilter(e.target.value as 'All' | CampusArea)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" /> Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="potential_match">Potential Match</option>
              <option value="deposited">Deposited at Office</option>
              <option value="verified">Verified Ownership</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No Matching Reports Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any items matching your selected criteria. Try changing filters or file a new report.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
