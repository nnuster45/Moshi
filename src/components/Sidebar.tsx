import React from 'react';
import { Layers, Folder, User, CheckSquare } from 'lucide-react';
import { ScreenType } from '../types';

interface SidebarProps {
  todoCount: number;
  currentScreen: ScreenType;
  onNavigateToList: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  todoCount,
  onNavigateToList,
}) => {
  return (
    <aside
      id="main-sidebar"
      className="hidden md:flex w-[224px] flex-none border-r border-[#E2E8EA] bg-white flex-col pt-[env(safe-area-inset-top,0px)]"
    >
      {/* Brand Logo */}
      <div id="sidebar-logo" className="px-5 pt-[18px] pb-[14px]">
        <b className="block text-[17px] font-bold tracking-tight text-[#0F1E25]">
          MM Track
        </b>
        <span className="block text-[11.5px] text-[#97A4AA] mt-[1px]">
          Moshi Moshi Retail
        </span>
      </div>

      {/* Group label */}
      <div
        id="sidebar-section-title"
        className="px-5 pt-3 pb-[5px] text-[10.5px] tracking-[0.07em] text-[#97A4AA] font-semibold uppercase"
      >
        งาน
      </div>

      {/* Nav links */}
      <nav id="sidebar-nav" className="flex flex-col space-y-[2px] px-[10px]">
        <button
          id="nav-overview"
          type="button"
          onClick={onNavigateToList}
          className="flex items-center gap-2 px-[11px] py-[9px] rounded-[9px] text-[14px] text-[#33474F] hover:bg-[#F7F9FA] transition-colors text-left"
        >
          <Layers className="w-4 h-4 text-[#61757D]" />
          <span>ภาพรวม</span>
        </button>

        <button
          id="nav-pending"
          type="button"
          onClick={onNavigateToList}
          className="flex items-center gap-2 px-[11px] py-[9px] rounded-[9px] text-[14px] font-semibold bg-[#0C6FA8] text-white transition-colors text-left"
        >
          <CheckSquare className="w-4 h-4 text-white" />
          <span>รอตรวจสอบ</span>
          <span className="ml-auto font-mono-code text-[12px] opacity-90 px-1.5 py-0.5 rounded-full bg-white/20">
            {todoCount}
          </span>
        </button>

        <button
          id="nav-team-tasks"
          type="button"
          className="flex items-center gap-2 px-[11px] py-[9px] rounded-[9px] text-[14px] text-[#33474F] hover:bg-[#F7F9FA] transition-colors text-left"
        >
          <User className="w-4 h-4 text-[#61757D]" />
          <span>งานของทีม</span>
          <span className="ml-auto font-mono-code text-[12px] text-[#97A4AA]">
            23
          </span>
        </button>

        <button
          id="nav-collections"
          type="button"
          className="flex items-center gap-2 px-[11px] py-[9px] rounded-[9px] text-[14px] text-[#33474F] hover:bg-[#F7F9FA] transition-colors text-left"
        >
          <Folder className="w-4 h-4 text-[#61757D]" />
          <span>คอลเลกชัน</span>
          <span className="ml-auto font-mono-code text-[12px] text-[#97A4AA]">
            4
          </span>
        </button>
      </nav>

      {/* User profile footer */}
      <div
        id="sidebar-user-footer"
        className="mt-auto flex items-center gap-2.5 px-[18px] py-[14px] border-t border-[#EDF1F2]"
      >
        <i className="w-8 h-8 rounded-full bg-[#6A4A9C] text-white not-italic text-[13px] font-bold flex items-center justify-center flex-none">
          N
        </i>
        <div className="min-w-0">
          <b className="block text-[13.5px] font-semibold text-[#0F1E25] truncate">
            Nu
          </b>
          <span className="block text-[11.5px] text-[#97A4AA] truncate">
            Merchandising
          </span>
        </div>
      </div>
    </aside>
  );
};
