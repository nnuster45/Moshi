import React, { useState, useEffect, useRef } from 'react';

interface CommentDialogProps {
  isOpen: boolean;
  variantTag: string;
  initialComment: string;
  onSave: (comment: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  isOpen,
  variantTag,
  initialComment,
  onSave,
  onDelete,
  onClose,
}) => {
  const [text, setText] = useState(initialComment);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialComment);
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialComment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Veil Backdrop */}
      <div
        id="comment-dialog-veil"
        onClick={onClose}
        className="fixed inset-0 bg-[#0F1E25]/35 z-40 transition-opacity duration-200"
      />

      {/* Modal Dialog */}
      <div
        id="comment-dialog-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comment-dialog-title"
        className="fixed z-50 bg-white flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,calc(100%-40px))] rounded-[16px] shadow-[0_26px_60px_rgba(15,30,37,0.26)] max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-full max-sm:rounded-t-[18px] max-sm:rounded-b-none"
      >
        <h3
          id="comment-dialog-title"
          className="m-0 px-5 pt-[17px] pb-3 text-[15px] font-bold text-[#0F1E25]"
        >
          คอมเมนต์ของ {variantTag}
        </h3>

        <textarea
          ref={textareaRef}
          id="comment-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์สิ่งที่ต้องแก้ของลายนี้ เช่น ปรับขนาดโลโก้ลง 10%, เปลี่ยนเฉดสีฟ้าให้อ่อนลง..."
          className="mx-5 border border-[#0C6FA8] rounded-[11px] p-[12px_13px] text-[15.5px] leading-[1.55] min-h-[120px] text-[#0F1E25] bg-white resize-none outline-none placeholder-[#B4C0C5]"
        />

        <div className="flex items-center gap-2.5 px-5 py-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
          <button
            id="comment-cancel-button"
            type="button"
            onClick={onClose}
            className="h-[46px] rounded-[11px] bg-white text-[#61757D] border border-[#E2E8EA] font-semibold flex-[0_0_100px] flex items-center justify-center hover:bg-[#F7F9FA] transition-colors"
          >
            ยกเลิก
          </button>

          {initialComment && (
            <button
              id="comment-delete-button"
              type="button"
              onClick={onDelete}
              className="h-[46px] rounded-[11px] bg-white text-[#E0502B] border border-[#E2E8EA] font-semibold flex-[0_0_78px] flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              ลบ
            </button>
          )}

          <button
            id="comment-save-button"
            type="button"
            onClick={() => onSave(text.trim())}
            className="h-[46px] rounded-[11px] bg-[#0C6FA8] text-white text-[15px] font-bold flex-1 flex items-center justify-center hover:bg-[#095b8a] transition-colors shadow-sm"
          >
            บันทึก
          </button>
        </div>
      </div>
    </>
  );
};
