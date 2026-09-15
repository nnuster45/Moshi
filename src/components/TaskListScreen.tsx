import React from 'react';
import { ChevronRight, CheckCircle2, AlertCircle, Shirt } from 'lucide-react';
import { ReviewTask, CompletedReview, TaskTab } from '../types';
import { BottomNav } from './BottomNav';

interface TaskListScreenProps {
  task: ReviewTask;
  isTaskSent: boolean;
  activeTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
  onSelectTaskToReview: () => void;
  completedReviews: CompletedReview[];
  onViewCompletedDetails?: (item: CompletedReview) => void;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({
  task,
  isTaskSent,
  activeTab,
  onTabChange,
  onSelectTaskToReview,
  completedReviews,
}) => {
  const pendingCount = isTaskSent ? 0 : 1;

  return (
    <section id="scr-list" className="flex-1 min-h-0 flex flex-col bg-white">
      {/* Top Header */}
      <div
        id="list-header"
        className="flex-none flex items-center gap-3 px-[22px] py-[14px] border-b border-[#EDF1F2] pt-[calc(14px+env(safe-area-inset-top,0px))] max-sm:px-4 max-sm:py-3"
      >
        <div className="min-w-0">
          <b className="block text-[17px] font-bold leading-[1.3] text-[#0F1E25] truncate">
            ตรวจอาร์ตเวิร์ก
          </b>
          <span className="block text-[12.5px] text-[#97A4AA] mt-[2px] truncate">
            Nu · Merchandising
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        id="list-tabs"
        role="tablist"
        className="flex-none flex gap-[9px] px-[22px] py-3 border-b border-[#EDF1F2] overflow-x-auto max-sm:px-4 max-sm:py-2.5"
      >
        <button
          id="tab-todo"
          role="tab"
          type="button"
          aria-selected={activeTab === 'todo'}
          onClick={() => onTabChange('todo')}
          className={`flex-none flex items-center gap-2 h-9 px-[15px] rounded-full text-[14px] whitespace-nowrap transition-colors ${
            activeTab === 'todo'
              ? 'bg-[#0F1E25] border border-[#0F1E25] text-white font-semibold'
              : 'bg-white border border-[#E2E8EA] text-[#33474F] hover:bg-[#F7F9FA]'
          }`}
        >
          <span>รอตรวจสอบ</span>
          <span className="font-mono-code text-[12px] opacity-75">
            {pendingCount}
          </span>
        </button>

        <button
          id="tab-done"
          role="tab"
          type="button"
          aria-selected={activeTab === 'done'}
          onClick={() => onTabChange('done')}
          className={`flex-none flex items-center gap-2 h-9 px-[15px] rounded-full text-[14px] whitespace-nowrap transition-colors ${
            activeTab === 'done'
              ? 'bg-[#0F1E25] border border-[#0F1E25] text-white font-semibold'
              : 'bg-white border border-[#E2E8EA] text-[#33474F] hover:bg-[#F7F9FA]'
          }`}
        >
          <span>ตรวจสอบแล้ว</span>
          <span className="font-mono-code text-[12px] opacity-75">
            {completedReviews.length}
          </span>
        </button>
      </div>

      {/* Table Column Headers (Desktop) */}
      <div
        id="table-column-headers"
        className="hidden md:grid grid-cols-[86px_minmax(0,1fr)_150px_120px_118px_20px] gap-[18px] px-[22px] py-[11px] bg-[#F7F9FA] border-b border-[#E2E8EA] text-[11px] text-[#97A4AA] font-semibold uppercase tracking-wider"
      >
        <span>ภาพ</span>
        <span>อาร์ตเวิร์ก</span>
        <span>คอลเลกชัน</span>
        <span>ผู้ออกแบบ</span>
        <span>{activeTab === 'todo' ? 'ส่งเข้ามา' : 'ผลการตรวจ'}</span>
        <span />
      </div>

      {/* Rows Container */}
      <div id="list-rows-container" className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'todo' && (
          <>
            {!isTaskSent ? (
              <button
                id={`task-row-${task.id}`}
                type="button"
                onClick={onSelectTaskToReview}
                className="w-full text-left grid grid-cols-[70px_minmax(0,1fr)_20px] md:grid-cols-[86px_minmax(0,1fr)_150px_120px_118px_20px] gap-3 md:gap-[18px] items-center px-4 md:px-[22px] py-3 md:py-[14px] border-b border-[#EDF1F2] hover:bg-[#F7F9FA] transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                <span className="w-[70px] h-[50px] md:w-[86px] md:h-[56px] rounded-[8px] bg-[#EDF1F2] overflow-hidden flex items-center justify-center p-1 border border-[#E2E8EA]/60">
                  <img
                    src={task.pages[0].src}
                    alt={task.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </span>

                {/* Artwork Name & Subtitle */}
                <div className="min-w-0">
                  <span className="block text-[15px] font-bold text-[#0F1E25] group-hover:text-[#0C6FA8] transition-colors truncate">
                    {task.name}
                  </span>
                  <span className="block text-[12.5px] text-[#61757D] mt-[3px] truncate">
                    {task.pages.length} ลาย · รอบที่ {task.round}
                  </span>
                </div>

                {/* Collection (Desktop) */}
                <span className="hidden md:block font-mono-code text-[12.5px] text-[#61757D] truncate">
                  {task.coll}
                </span>

                {/* Designer (Desktop) */}
                <span className="hidden md:block text-[14px] text-[#33474F] truncate">
                  {task.designer}
                </span>

                {/* Submitted Timestamp (Desktop) */}
                <span className="hidden md:block font-mono-code text-[12.5px] text-[#61757D] truncate">
                  {task.when}
                </span>

                {/* Chevron */}
                <span className="text-[#C6D1D5] group-hover:text-[#0C6FA8] group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            ) : (
              <div
                id="empty-todo-state"
                className="flex flex-col items-center justify-center text-center p-12 text-[#61757D]"
              >
                <div className="w-14 h-14 rounded-full bg-[#EDF1F2] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7 text-[#2E7A56]" />
                </div>
                <h4 className="text-[16px] font-bold text-[#0F1E25]">
                  ไม่มีงานรอตรวจสอบในขณะนี้
                </h4>
                <p className="text-[13px] text-[#97A4AA] mt-1 max-w-sm">
                  คุณได้ส่งผลการตรวจอาร์ตเวิร์กเรียบร้อยแล้ว ตรวจสอบประวัติได้ในแท็บ
                  "ตรวจสอบแล้ว"
                </p>
                <button
                  id="btn-goto-done-tab"
                  type="button"
                  onClick={() => onTabChange('done')}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#0C6FA8] text-white text-xs font-semibold hover:bg-[#095b8a] transition-colors"
                >
                  ดูรายการที่ตรวจแล้ว
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'done' && (
          <div id="done-list-rows" className="divide-y divide-[#EDF1F2]">
            {completedReviews.map((item) => {
              const isFix = item.result === 'ขอแก้';
              return (
                <div
                  key={item.id}
                  id={`done-row-${item.id}`}
                  className="grid grid-cols-[70px_minmax(0,1fr)_20px] md:grid-cols-[86px_minmax(0,1fr)_150px_120px_118px_20px] gap-3 md:gap-[18px] items-center px-4 md:px-[22px] py-3 md:py-[14px] hover:bg-[#F7F9FA] transition-colors"
                >
                  {/* Thumbnail */}
                  <span className="w-[70px] h-[50px] md:w-[86px] md:h-[56px] rounded-[8px] bg-[#EDF1F2] overflow-hidden flex items-center justify-center p-1 border border-[#E2E8EA]/60">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Shirt className="w-6 h-6 text-[#97A4AA]" />
                    )}
                  </span>

                  {/* Name & Summary */}
                  <div className="min-w-0">
                    <span className="block text-[15px] font-bold text-[#0F1E25] truncate">
                      {item.name}
                    </span>
                    <span className="block text-[12.5px] text-[#61757D] mt-[3px] truncate">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isFix ? 'text-[#E0502B]' : 'text-[#2E7A56]'
                        }`}
                      >
                        {isFix ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {item.result}
                      </span>{' '}
                      · {item.when}
                    </span>
                  </div>

                  {/* Collection (Desktop) */}
                  <span className="hidden md:block font-mono-code text-[12.5px] text-[#61757D] truncate">
                    {item.coll}
                  </span>

                  {/* Designer (Desktop) */}
                  <span className="hidden md:block text-[14px] text-[#33474F] truncate">
                    {item.designer}
                  </span>

                  {/* Result pill (Desktop) */}
                  <div className="hidden md:flex items-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isFix
                          ? 'bg-[#FBF1E8] text-[#E0502B] border border-[#E0502B]/30'
                          : 'bg-[#EEF5F1] text-[#2E7A56] border border-[#2E7A56]/30'
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>

                  {/* Spacer */}
                  <span />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onNavigateToList={() => onTabChange('todo')} />
    </section>
  );
};
