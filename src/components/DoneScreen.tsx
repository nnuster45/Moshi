import React from 'react';
import { Check, Edit3 } from 'lucide-react';
import { ReviewTask } from '../types';

interface DoneScreenProps {
  task: ReviewTask;
  onBackToList: () => void;
}

export const DoneScreen: React.FC<DoneScreenProps> = ({
  task,
  onBackToList,
}) => {
  const fixCount = task.pages.filter(
    (p) => p.strokes.length > 0 || Boolean(p.comment)
  ).length;
  const isFix = fixCount > 0;

  return (
    <section id="scr-done" className="flex-1 min-h-0 flex flex-col bg-white">
      {/* Header */}
      <div
        id="done-header"
        className="flex-none flex items-center gap-3 px-[22px] py-[14px] border-b border-[#EDF1F2] pt-[calc(14px+env(safe-area-inset-top,0px))] max-sm:px-4 max-sm:py-3"
      >
        <div className="min-w-0">
          <b className="block text-[17px] font-bold text-[#0F1E25] truncate">
            ส่งผลกลับแล้ว
          </b>
          <span
            id="d-sub"
            className="block text-[12.5px] text-[#97A4AA] mt-[2px] truncate"
          >
            {task.name}
          </span>
        </div>
      </div>

      {/* Done Content Center */}
      <div
        id="done-content-box"
        className="flex-1 flex flex-col items-center justify-center gap-3.5 px-8 text-center"
      >
        {/* Circle Status Badge */}
        <div
          id="tick"
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-transform ${
            isFix
              ? 'bg-[#FBF1E8] text-[#E0502B]'
              : 'bg-[#EEF5F1] text-[#2E7A56]'
          }`}
        >
          {isFix ? (
            <Edit3 className="w-8 h-8 stroke-[2.3]" />
          ) : (
            <Check className="w-9 h-9 stroke-[2.6]" />
          )}
        </div>

        <h2 id="dh" className="text-[21px] m-0 font-bold text-[#0F1E25]">
          {isFix ? 'ส่งกลับให้แก้แล้ว' : 'อนุมัติทั้งหมดแล้ว'}
        </h2>

        {/* Summary tag chips */}
        <div
          id="dsum"
          className="flex gap-2.5 flex-wrap justify-center mt-0.5 max-w-md"
        >
          {task.pages.map((p) => {
            const hasFix = p.strokes.length > 0 || Boolean(p.comment);
            return (
              <span
                key={p.id}
                id={`summary-chip-${p.id}`}
                className={`text-[13px] border rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                  hasFix
                    ? 'border-[#E0502B]/30 text-[#E0502B] bg-[#FBF1E8]/50'
                    : 'border-[#2E7A56]/30 text-[#2E7A56] bg-[#EEF5F1]/50'
                }`}
              >
                {p.tag} · {hasFix ? 'ขอแก้' : 'ผ่าน'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="flex gap-2.5 p-4 md:p-5 max-w-[420px] mx-auto w-full pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
        <button
          id="again"
          type="button"
          onClick={onBackToList}
          className="h-[46px] rounded-[11px] bg-white text-[#61757D] border border-[#E2E8EA] font-semibold flex-1 flex items-center justify-center hover:bg-[#F7F9FA] transition-colors shadow-sm"
        >
          กลับไปที่รายการ
        </button>
      </div>
    </section>
  );
};
