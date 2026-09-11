import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusArea } from '../types';
import { ItemCard } from '../components/ItemCard';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CAMPUS_ZONES: {
  id: CampusArea;
  name: string;
  icon: string;
  floorInfo: string;
  description: string;
  dropOffPoint: string;
}[] = [
  {
    id: 'Block 33',
    name: 'Block 33 (Lost and Found Department)',
    icon: '🏢',
    floorInfo: 'Ground Floor • Central Lost & Found Registry • Custody Lockers',
    description: 'Central campus Lost & Found Department headquarters. Features safe deposit lockers, case ID verification, and staff QR handover services.',
    dropOffPoint: 'Lost & Found Department Front Desk, Block 33',
  },
  {
    id: 'Library',
    name: 'University Library',
    icon: '📚',
    floorInfo: 'Floors 1-4 • Quiet Study Pods • Computer Commons',
    description: 'High traffic study zone. Common items include headphones, laptops, USB flash drives, and notebooks.',
    dropOffPoint: 'Main Circulation Desk, 1st Floor',
  },
  {
    id: 'Block 34',
    name: 'Block 34 (Science & Engineering)',
    icon: '🔬',
    floorInfo: 'Lecture Halls 34-A to 34-F • Chemistry & Physics Labs',
    description: 'Science complex with auditorium lecture halls. Frequently holds lost insulated flasks, lab goggles, and calculators.',
    dropOffPoint: 'Dean of Sciences Reception Desk, Room 34-101',
  },
  {
    id: 'Cafeteria',
    name: 'Central Dining Commons',
    icon: '☕',
    floorInfo: 'Dining Hall • Coffee Bar • Outdoor Patio',
    description: 'High footfall during lunch hours. Common items include student ID cards, transit badges, keys, and wallets.',
    dropOffPoint: 'Dining Manager Office, Tray Return Hub',
  },
  {
    id: 'Hostel',
    name: 'Student Residence Halls (Hostel A & B)',
    icon: '🛏️',
    floorInfo: 'Dorms • Laundry Facilities • Recreational Lounge',
    description: 'Residential sectors. Common items include room keys, fitness trackers, chargers, and hoodies.',
    dropOffPoint: 'Hostel Warden Security Desk, Lobby A',
  },
  {
    id: 'Academic Block',
    name: 'Academic Hall 1 & 2',
    icon: '🏛️',
    floorInfo: 'Seminar Rooms • Faculty Offices • Tiered Auditoriums',
    description: 'Lecture centers for humanities, math, and business. Common items include graphing calculators, umbrellas, and glasses.',
    dropOffPoint: 'Academic Services Counter, Ground Floor',
  },
  {
    id: 'Sports Complex',
    name: 'Athletics & Gymnasium Pavilion',
    icon: '🎾',
    floorInfo: 'Indoor Courts • Fitness Center • Locker Rooms',
    description: 'Sports courts and training centers. Common items include car fobs, smartwatches, and gym bags.',
    dropOffPoint: 'Athletic Equipment Desk, Court Level',
  },
  {
    id: 'Student Center',
    name: 'Student Union Building',
    icon: '🎮',
    floorInfo: 'Club Hubs • Career Center • Bookstore',
    description: 'Hub for campus student clubs, hackathons, and gatherings.',
    dropOffPoint: 'Student Info Booth, Atrium',
  },
  {
    id: 'Computer Labs',
    name: 'IT & Computing Suites',
    icon: '💻',
    floorInfo: 'CS Labs 1-4 • VR Sandbox • Design Studio',
    description: 'Hardware and coding labs with shared workstations.',
    dropOffPoint: 'IT Helpdesk, Lab Wing Room 202',
  },
];

export const BrowseAreaView: React.FC = () => {
  const { items, selectedAreaFilter, setSelectedAreaFilter, setReportModalOpen } = useApp();

  const activeZone = CAMPUS_ZONES.find(z => z.id === selectedAreaFilter) || CAMPUS_ZONES[0];

  const zoneItems = items.filter(it => it.area === activeZone.id);
  const lostInZone = zoneItems.filter(it => it.type === 'lost').length;
  const foundInZone = zoneItems.filter(it => it.type === 'found').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Browse by Campus Area</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Select any building or campus sector to view localized lost reports, turned-in items, and nearest drop-off desks.
        </p>
      </div>

      {/* Campus Zone Selectors Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CAMPUS_ZONES.map(zone => {
          const isSelected = activeZone.id === zone.id;
          const totalInThisZone = items.filter(it => it.area === zone.id).length;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedAreaFilter(zone.id)}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{zone.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  {totalInThisZone} reports
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm truncate">{zone.id}</h4>
                <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {zone.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Zone Spotlight */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-xl bg-slate-50 border border-slate-200">{activeZone.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{activeZone.name}</h2>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                  Campus Sector: {activeZone.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeZone.floorInfo}</p>
            </div>
          </div>

          {/* Counts and Drop-off notice */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-xs font-bold text-rose-700 block">{lostInZone} Lost</span>
              <span className="text-[10px] text-rose-600">Pending</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
              <span className="text-xs font-bold text-indigo-700 block">{foundInZone} Found</span>
              <span className="text-[10px] text-indigo-600">Secured</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-semibold text-slate-700 block">Area Profile & History:</span>
            <p className="text-slate-600 leading-relaxed">{activeZone.description}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <span className="font-semibold text-amber-900 block flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              Nearest Drop-Off Desk:
            </span>
            <p className="text-amber-800 leading-relaxed font-medium">
              {activeZone.dropOffPoint}
            </p>
          </div>
        </div>

        {/* Filtered Items in this building */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Items Logged in {activeZone.id} ({zoneItems.length})
            </h3>
          </div>

          {zoneItems.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-xs text-slate-500">No active reports currently filed in {activeZone.id}.</p>
              <button
                onClick={() => setReportModalOpen(true)}
                className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                + File a report in this building
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {zoneItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
