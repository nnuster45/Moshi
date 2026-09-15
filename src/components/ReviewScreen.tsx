import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Edit2, Undo2, Plus, Check } from 'lucide-react';
import { ReviewTask, ArtworkPage } from '../types';
import { CommentDialog } from './CommentDialog';

interface ReviewScreenProps {
  task: ReviewTask;
  onBackToList: () => void;
  onSubmitResult: (updatedTask: ReviewTask) => void;
}

// Artwork image aspect ratio: 1376x768 = ~1.791666
const AR = 1376 / 768;

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  task,
  onBackToList,
  onSubmitResult,
}) => {
  const [pages, setPages] = useState<ArtworkPage[]>(() =>
    task.pages.map((p) => ({
      ...p,
      strokes: Array.isArray(p.strokes) ? p.strokes : [],
    }))
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPenActive, setIsPenActive] = useState<boolean>(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);

  // Active in-progress stroke points
  const [activeStroke, setActiveStroke] = useState<[number, number][] | null>(null);
  const activeStrokeRef = useRef<[number, number][] | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [slideDeltaX, setSlideDeltaX] = useState<number>(0);
  const [isAnimatingSlide, setIsAnimatingSlide] = useState<boolean>(false);

  // Stage dimensions from ResizeObserver
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 500,
  });

  // Gestures ref for pan / swipe
  const gestureRef = useRef<{
    mode: 'pan' | 'swipe' | null;
    startX: number;
    startY: number;
    startOx: number;
    startOy: number;
    tapTime: number;
    tapX: number;
    tapY: number;
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    startOx: 0,
    startOy: 0,
    tapTime: 0,
    tapX: 0,
    tapY: 0,
  });

  // Track container size safely
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setStageSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate plate dimensions ensuring it fits comfortably on phone screens and desktop
  const paddingH = 28;
  const paddingV = 28;
  const maxAvailableWidth = Math.max(260, stageSize.width - paddingH);
  const maxAvailableHeight = Math.max(160, stageSize.height - paddingV);

  let plateWidth = maxAvailableWidth;
  let plateHeight = plateWidth / AR;

  if (plateHeight > maxAvailableHeight) {
    plateHeight = maxAvailableHeight;
    plateWidth = Math.round(plateHeight * AR);
  } else {
    plateWidth = Math.round(plateWidth);
    plateHeight = Math.round(plateHeight);
  }

  // Ensure positive values
  plateWidth = Math.max(260, plateWidth);
  plateHeight = Math.max(145, plateHeight);

  const currentPage = pages[activeIndex] || pages[0];
  const isMarked = (p: ArtworkPage) =>
    (Array.isArray(p.strokes) && p.strokes.length > 0) || Boolean(p.comment);

  const getPageState = (p: ArtworkPage): 'fix' | 'pass' | 'none' => {
    if (isMarked(p)) return 'fix';
    if (p.pass) return 'pass';
    return 'none';
  };

  const isAllReady = pages.every((p) => getPageState(p) !== 'none');
  const fixCount = pages.filter((p) => getPageState(p) === 'fix').length;

  // Handle Switch Variant
  const handleSelectPage = (index: number) => {
    setActiveIndex(index);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setSlideDeltaX(0);
    setActiveStroke(null);
    activeStrokeRef.current = null;
    isDrawingRef.current = false;
  };

  // Toggle Pen Tool
  const handleTogglePen = () => {
    setIsPenActive((prev) => {
      const next = !prev;
      if (!next) {
        setActiveStroke(null);
        activeStrokeRef.current = null;
        isDrawingRef.current = false;
      }
      return next;
    });
  };

  // Undo Latest Stroke
  const handleUndo = () => {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== activeIndex) return p;
        if (!p.strokes || p.strokes.length === 0) return p;
        const nextStrokes = p.strokes.slice(0, -1);
        return {
          ...p,
          strokes: nextStrokes,
        };
      })
    );
  };

  // Toggle Pass
  const handleTogglePass = () => {
    if (isMarked(currentPage)) return;
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== activeIndex) return p;
        return {
          ...p,
          pass: !p.pass,
        };
      })
    );
  };

  // Save Comment
  const handleSaveComment = (commentText: string) => {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== activeIndex) return p;
        return {
          ...p,
          comment: commentText,
          pass: commentText ? false : p.pass,
        };
      })
    );
    setIsCommentModalOpen(false);
  };

  // Delete Comment
  const handleDeleteComment = () => {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== activeIndex) return p;
        return {
          ...p,
          comment: '',
        };
      })
    );
    setIsCommentModalOpen(false);
  };

  // Submit Result
  const handleSubmit = () => {
    if (!isAllReady) return;
    onSubmitResult({
      ...task,
      pages,
    });
  };

  // Pointer Down (Draw, Pan, Swipe, Double Tap Zoom)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const plateElement = target.closest('[data-plate-index]') as HTMLElement | null;
    const now = Date.now();
    const g = gestureRef.current;

    const plateIdx = plateElement?.getAttribute('data-plate-index');
    const isCurrentPlate = plateIdx !== null && Number(plateIdx) === activeIndex;

    // Drawing Mode
    if (isPenActive && isCurrentPlate && plateElement) {
      const pr = plateElement.getBoundingClientRect();
      if (pr.width > 0 && pr.height > 0) {
        const nx = Math.max(0, Math.min(1, (e.clientX - pr.left) / pr.width));
        const ny = Math.max(0, Math.min(1, (e.clientY - pr.top) / pr.height));

        if (!isNaN(nx) && !isNaN(ny)) {
          const pt: [number, number] = [nx, ny];
          isDrawingRef.current = true;
          activeStrokeRef.current = [pt];
          setActiveStroke([pt]);

          // Safe pointer capture
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch (_) {
            // ignore non-critical pointer capture errors
          }
          return;
        }
      }
    }

    // Double tap detection to zoom (when not in pen mode)
    if (
      !isPenActive &&
      plateElement &&
      now - g.tapTime < 300 &&
      Math.abs(e.clientX - g.tapX) < 24 &&
      Math.abs(e.clientY - g.tapY) < 24
    ) {
      g.tapTime = 0;
      if (zoom === 1) {
        const pr = plateElement.getBoundingClientRect();
        setZoom(2.2);
        setPanOffset({
          x: (pr.left + pr.width / 2 - e.clientX) * 1.2,
          y: (pr.top + pr.height / 2 - e.clientY) * 1.2,
        });
      } else {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
      g.mode = null;
      return;
    }

    g.tapTime = now;
    g.tapX = e.clientX;
    g.tapY = e.clientY;
    g.startX = e.clientX;
    g.startY = e.clientY;
    g.startOx = panOffset.x;
    g.startOy = panOffset.y;

    if (zoom > 1) {
      g.mode = 'pan';
    } else {
      g.mode = 'swipe';
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {
      // ignore
    }
  };

  // Pointer Move (Drawing, Panning, Swiping)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Drawing active stroke
    if (isDrawingRef.current && activeStrokeRef.current) {
      const plateEl = document.querySelector(
        `[data-plate-index="${activeIndex}"]`
      ) as HTMLElement | null;
      if (plateEl) {
        const pr = plateEl.getBoundingClientRect();
        if (pr.width > 0 && pr.height > 0) {
          const nx = Math.max(0, Math.min(1, (e.clientX - pr.left) / pr.width));
          const ny = Math.max(0, Math.min(1, (e.clientY - pr.top) / pr.height));
          if (!isNaN(nx) && !isNaN(ny)) {
            const currentPoints = activeStrokeRef.current;
            const lastPoint = currentPoints[currentPoints.length - 1];
            // Only add if moved at least a tiny bit to avoid duplicate flooding
            if (
              !lastPoint ||
              Math.abs(lastPoint[0] - nx) > 0.002 ||
              Math.abs(lastPoint[1] - ny) > 0.002
            ) {
              currentPoints.push([nx, ny]);
              setActiveStroke([...currentPoints]);
            }
          }
        }
      }
      return;
    }

    // 2. Gesture mode (pan or swipe)
    const g = gestureRef.current;
    if (!g.mode) return;

    if (g.mode === 'pan') {
      setPanOffset({
        x: g.startOx + (e.clientX - g.startX),
        y: g.startOy + (e.clientY - g.startY),
      });
    } else if (g.mode === 'swipe') {
      let dx = e.clientX - g.startX;
      if (
        (activeIndex === 0 && dx > 0) ||
        (activeIndex === pages.length - 1 && dx < 0)
      ) {
        dx *= 0.3;
      }
      setSlideDeltaX(dx);
    }
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {
      // ignore
    }

    // Finish drawing stroke safely
    if (isDrawingRef.current) {
      const rawPoints = activeStrokeRef.current;
      isDrawingRef.current = false;
      activeStrokeRef.current = null;
      setActiveStroke(null);

      if (rawPoints && Array.isArray(rawPoints) && rawPoints.length > 0) {
        const safeStroke = rawPoints.filter(
          (pt) =>
            Array.isArray(pt) &&
            pt.length >= 2 &&
            typeof pt[0] === 'number' &&
            typeof pt[1] === 'number' &&
            !isNaN(pt[0]) &&
            !isNaN(pt[1])
        );

        if (safeStroke.length > 0) {
          setPages((prev) =>
            prev.map((p, i) => {
              if (i !== activeIndex) return p;
              const currentStrokes = Array.isArray(p.strokes) ? p.strokes : [];
              return {
                ...p,
                strokes: [...currentStrokes, safeStroke],
                pass: false,
              };
            })
          );
        }
      }
      return;
    }

    const g = gestureRef.current;
    if (!g.mode) return;

    if (g.mode === 'pan') {
      g.mode = null;
      return;
    }

    if (g.mode === 'swipe') {
      const dx = (e.clientX || g.startX) - g.startX;
      setIsAnimatingSlide(true);
      if (dx < -48 && activeIndex < pages.length - 1) {
        setActiveIndex((i) => i + 1);
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      } else if (dx > 48 && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
      setSlideDeltaX(0);
      setTimeout(() => setIsAnimatingSlide(false), 260);
    }

    g.mode = null;
  };

  return (
    <section id="scr-review" className="flex-1 min-h-0 flex flex-col bg-white">
      {/* Top Header */}
      <div
        id="review-header"
        className="flex-none flex items-center gap-3 px-[22px] py-[14px] border-b border-[#EDF1F2] pt-[calc(14px+env(safe-area-inset-top,0px))] max-sm:px-4 max-sm:py-3"
      >
        <button
          id="back"
          type="button"
          onClick={onBackToList}
          aria-label="กลับไปที่รายการ"
          className="w-[34px] h-[34px] flex-none rounded-[9px] border border-[#E2E8EA] flex items-center justify-center text-[#61757D] hover:bg-[#F7F9FA] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
        </button>

        <div className="min-w-0">
          <b
            id="h-title"
            className="block text-[17px] font-bold leading-[1.3] text-[#0F1E25] truncate"
          >
            {task.name}
          </b>
          <span
            id="h-sub"
            className="block text-[12.5px] text-[#97A4AA] mt-[2px] truncate"
          >
            {task.coll} · {task.designer} · รอบที่ {task.round}
          </span>
        </div>

        {/* Action Button */}
        <button
          id="go"
          type="button"
          disabled={!isAllReady}
          onClick={handleSubmit}
          className={`ml-auto flex-none h-10 px-5 rounded-[10px] text-[14.5px] font-bold flex items-center transition-all ${
            !isAllReady
              ? 'bg-[#F7F9FA] text-[#97A4AA] border border-[#E2E8EA] cursor-not-allowed opacity-75'
              : 'bg-[#0C6FA8] text-white hover:bg-[#095b8a] shadow-sm cursor-pointer'
          }`}
        >
          {!isAllReady
            ? 'ส่งผลกลับ'
            : fixCount > 0
            ? `ส่งผลกลับ · ขอแก้ ${fixCount} ลาย`
            : 'อนุมัติทั้งหมด'}
        </button>
      </div>

      {/* Variant Tabs Header */}
      <div
        id="tags"
        className="flex-none flex gap-[9px] px-[22px] py-3 border-b border-[#EDF1F2] overflow-x-auto max-sm:px-4 max-sm:py-2.5"
      >
        {pages.map((p, i) => {
          const st = getPageState(p);
          const isCurrent = i === activeIndex;
          return (
            <button
              key={p.id}
              id={`tag-variant-${p.id}`}
              type="button"
              aria-current={isCurrent ? 'true' : 'false'}
              onClick={() => handleSelectPage(i)}
              className={`flex-none flex items-center gap-2 h-[38px] px-[15px] rounded-full text-[14px] whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'bg-[#0F1E25] border border-[#0F1E25] text-white font-semibold'
                  : 'bg-white border border-[#E2E8EA] text-[#33474F] hover:bg-[#F7F9FA]'
              }`}
            >
              <span>{p.tag}</span>
              <span
                className={`text-[12px] font-semibold ${
                  isCurrent
                    ? st === 'pass'
                      ? 'text-[#7DD3A8]'
                      : st === 'fix'
                      ? 'text-[#F0A87A]'
                      : 'text-[#9BAAB1]'
                    : st === 'pass'
                    ? 'text-[#2E7A56]'
                    : st === 'fix'
                    ? 'text-[#E0502B]'
                    : 'text-[#97A4AA]'
                }`}
              >
                {st === 'pass' ? 'ผ่าน' : st === 'fix' ? 'ขอแก้' : 'ยังไม่ตรวจ'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Canvas Area */}
      <div
        ref={stageRef}
        id="stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
        className={`flex-1 min-h-0 bg-[#EDF1F2] relative overflow-hidden select-none ${
          isPenActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        {/* Slide Track */}
        <div
          id="track"
          style={{
            width: `${pages.length * 100}%`,
            transform: `translateX(calc(-${
              (activeIndex * 100) / pages.length
            }% + ${slideDeltaX}px))`,
          }}
          className={`flex h-full will-change-transform ${
            isAnimatingSlide
              ? 'transition-transform duration-[260ms] ease-[cubic-bezier(0.3,0.8,0.4,1)]'
              : ''
          }`}
        >
          {pages.map((p, i) => {
            const isPassedOnly = p.pass && !isMarked(p);
            const isCurrent = i === activeIndex;

            return (
              <div
                key={p.id}
                style={{ width: `${100 / pages.length}%` }}
                className="flex-none h-full flex items-center justify-center p-3"
              >
                {/* Plate */}
                <div
                  data-plate-index={i}
                  style={{
                    width: `${plateWidth}px`,
                    height: `${plateHeight}px`,
                    touchAction: 'none',
                    transform:
                      isCurrent && zoom !== 1
                        ? `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
                        : undefined,
                    transformOrigin: '50% 50%',
                  }}
                  className={`relative bg-white border border-[#E2E8EA] shadow-[0_3px_18px_rgba(15,30,37,0.1)] transition-transform duration-[220ms] ease-[cubic-bezier(0.3,0.8,0.4,1)] ${
                    isPenActive && isCurrent ? 'outline-2 outline-[#0C6FA8]' : ''
                  } ${isPassedOnly ? 'after:content-[""] after:absolute after:inset-0 after:bg-[#2E7A56]/[0.07] after:pointer-events-none' : ''}`}
                >
                  {/* Artwork Image */}
                  <img
                    src={p.src}
                    alt={p.tag}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-full object-contain select-none pointer-events-none"
                  />

                  {/* Red Pen Overlay SVG */}
                  <svg
                    viewBox={`0 0 ${plateWidth} ${plateHeight}`}
                    width={plateWidth}
                    height={plateHeight}
                    className="absolute inset-0 pointer-events-none overflow-visible"
                  >
                    {/* Committed Saved Strokes */}
                    {Array.isArray(p.strokes) &&
                      p.strokes.map((stroke, sIdx) => {
                        if (!Array.isArray(stroke) || stroke.length === 0) return null;
                        const validPoints = stroke.filter(
                          (pt) =>
                            Array.isArray(pt) &&
                            pt.length >= 2 &&
                            typeof pt[0] === 'number' &&
                            typeof pt[1] === 'number' &&
                            !isNaN(pt[0]) &&
                            !isNaN(pt[1])
                        );
                        if (validPoints.length === 0) return null;

                        if (validPoints.length === 1) {
                          const cx = validPoints[0][0] * plateWidth;
                          const cy = validPoints[0][1] * plateHeight;
                          return (
                            <circle
                              key={`dot-${sIdx}`}
                              cx={cx}
                              cy={cy}
                              r={3.5}
                              fill="#E0502B"
                            />
                          );
                        }

                        const pointsString = validPoints
                          .map(
                            ([x, y]) =>
                              `${(x * plateWidth).toFixed(1)},${(
                                y * plateHeight
                              ).toFixed(1)}`
                          )
                          .join(' ');

                        return (
                          <polyline
                            key={`stroke-${sIdx}`}
                            points={pointsString}
                            fill="none"
                            stroke="#E0502B"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        );
                      })}

                    {/* In-Progress Live Stroke */}
                    {isCurrent && activeStroke && activeStroke.length > 0 && (() => {
                      const validPoints = activeStroke.filter(
                        (pt) =>
                          Array.isArray(pt) &&
                          pt.length >= 2 &&
                          typeof pt[0] === 'number' &&
                          typeof pt[1] === 'number' &&
                          !isNaN(pt[0]) &&
                          !isNaN(pt[1])
                      );
                      if (validPoints.length === 0) return null;

                      if (validPoints.length === 1) {
                        return (
                          <circle
                            key="active-live-dot"
                            cx={validPoints[0][0] * plateWidth}
                            cy={validPoints[0][1] * plateHeight}
                            r={3.5}
                            fill="#E0502B"
                          />
                        );
                      }

                      const pointsString = validPoints
                        .map(
                          ([x, y]) =>
                            `${(x * plateWidth).toFixed(1)},${(
                              y * plateHeight
                            ).toFixed(1)}`
                        )
                        .join(' ');

                      return (
                        <polyline
                          key="active-live-stroke"
                          points={pointsString}
                          fill="none"
                          stroke="#E0502B"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    })()}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pass Stamp Badge */}
        {currentPage.pass && !isMarked(currentPage) && (
          <span
            id="stamp"
            className="absolute right-5 top-4 z-10 bg-[#2E7A56] text-white text-[12.5px] font-bold rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-1 animate-in fade-in zoom-in duration-150"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ผ่านแล้ว
          </span>
        )}
      </div>

      {/* Bottom Tool Bar */}
      <div
        id="review-toolbar"
        className="flex-none flex items-center gap-2.5 px-[22px] py-3 border-t border-[#EDF1F2] bg-white pb-[calc(12px+env(safe-area-inset-bottom,0px))] max-sm:px-3.5 max-sm:py-2.5 max-sm:flex-wrap"
      >
        {/* Draw Pen Tool */}
        <button
          id="pen"
          type="button"
          aria-pressed={isPenActive ? 'true' : 'false'}
          aria-label="วาดบนภาพ"
          onClick={handleTogglePen}
          title="วาดเส้นเพื่อชี้จุดแก้ไข"
          className={`w-[46px] h-[46px] flex-none rounded-[12px] border flex items-center justify-center transition-colors ${
            isPenActive
              ? 'bg-[#0F1E25] border-[#0F1E25] text-white'
              : 'bg-white border-[#E2E8EA] text-[#61757D] hover:bg-[#F7F9FA]'
          }`}
        >
          <Edit2 className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Undo Stroke Tool */}
        <button
          id="undo"
          type="button"
          disabled={!currentPage.strokes || currentPage.strokes.length === 0}
          aria-label="ลบเส้นล่าสุด"
          onClick={handleUndo}
          title="ลบเส้นวาดล่าสุด"
          className="w-[46px] h-[46px] flex-none rounded-[12px] border border-[#E2E8EA] bg-white flex items-center justify-center text-[#61757D] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#F7F9FA] transition-colors"
        >
          <Undo2 className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Comment Button */}
        <button
          id="add"
          type="button"
          onClick={() => setIsCommentModalOpen(true)}
          className={`flex-1 min-w-0 h-[46px] rounded-[12px] border flex items-center gap-2.5 px-4 text-[14.5px] transition-colors max-sm:order-3 max-sm:w-full max-sm:flex-[1_1_100%] ${
            currentPage.comment
              ? 'border-[#0F1E25] text-[#0F1E25] bg-white font-medium'
              : 'border-[#E2E8EA] text-[#61757D] bg-white hover:bg-[#F7F9FA]'
          }`}
        >
          <Plus className="w-5 h-5 flex-none stroke-[2]" />
          <span id="addtx" className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {currentPage.comment || 'เพิ่มคอมเมนต์'}
          </span>
        </button>

        {/* Pass Button */}
        <button
          id="passbtn"
          type="button"
          disabled={isMarked(currentPage)}
          aria-pressed={currentPage.pass ? 'true' : 'false'}
          onClick={handleTogglePass}
          className={`flex-none h-[46px] px-[18px] rounded-[12px] border flex items-center gap-2 text-[14.5px] font-semibold whitespace-nowrap transition-colors max-sm:ml-auto ${
            isMarked(currentPage)
              ? 'border-[#E2E8EA] text-[#97A4AA] bg-white opacity-55 cursor-not-allowed'
              : currentPage.pass
              ? 'border-[#2E7A56] bg-[#2E7A56] text-white shadow-sm'
              : 'border-[#E2E8EA] text-[#2E7A56] bg-white hover:bg-[#EEF5F1]'
          }`}
        >
          <Check className="w-[18px] h-[18px] stroke-[2.4]" />
          <span id="passtx">
            {currentPage.pass ? 'ผ่านแล้ว' : 'ผ่านลายนี้'}
          </span>
        </button>
      </div>

      {/* Comment Dialog Modal */}
      <CommentDialog
        isOpen={isCommentModalOpen}
        variantTag={currentPage.tag}
        initialComment={currentPage.comment}
        onSave={handleSaveComment}
        onDelete={handleDeleteComment}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </section>
  );
};
