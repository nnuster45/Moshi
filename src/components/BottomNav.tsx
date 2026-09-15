import React from 'react';
import { CheckSquare, Users, Folder, User } from 'lucide-react';

interface BottomNavProps {
  onNavigateToList: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onNavigateToList }) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="flex md:hidden flex-none border-t border-[#E2E8EA] bg-white pt-2 pb-[calc(6px+env(safe-area-inset-bottom,0px))]"
    >
      <button
        id="btn-nav-pending"
        type="button"
        onClick={onNavigateToList}
        className="flex-1 flex flex-col items-center gap-[3px] text-[10.5px] text-[#0C6FA8] font-bold"
      >
        <CheckSquare className="w-5 h-5 text-[#0C6FA8]" />
        <span>รอตรวจสอบ</span>
      </button>

      <button
        id="btn-nav-team"
        type="button"
        className="flex-1 flex flex-col items-center gap-[3px] text-[10.5px] text-[#97A4AA]"
      >
        <Users className="w-5 h-5 text-[#97A4AA]" />
        <span>งานของทีม</span>
      </button>

      <button
        id="btn-nav-coll"
        type="button"
        className="flex-1 flex flex-col items-center gap-[3px] text-[10.5px] text-[#97A4AA]"
      >
        <Folder className="w-5 h-5 text-[#97A4AA]" />
        <span>คอลเลกชัน</span>
      </button>

      <button
        id="btn-nav-profile"
        type="button"
        className="flex-1 flex flex-col items-center gap-[3px] text-[10.5px] text-[#97A4AA]"
      >
        <User className="w-5 h-5 text-[#97A4AA]" />
        <span>ฉัน</span>
      </button>
    </nav>
  );
};
