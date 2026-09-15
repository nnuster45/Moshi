export type StrokePoint = [number, number]; // [xNorm, yNorm] between 0 and 1
export type Stroke = StrokePoint[];

export interface ArtworkPage {
  id: string;
  tag: string;
  file: string;
  src: string;
  strokes: Stroke[];
  comment: string;
  pass: boolean;
}

export interface ReviewTask {
  id: string;
  name: string;
  coll: string;
  designer: string;
  round: number;
  when: string;
  pages: ArtworkPage[];
}

export interface CompletedReview {
  id: string;
  name: string;
  coll: string;
  designer: string;
  when: string;
  result: 'ผ่าน' | 'ขอแก้';
  img?: string;
  pageSummaries?: { tag: string; result: 'ผ่าน' | 'ขอแก้' }[];
}

export type ScreenType = 'list' | 'review' | 'done';
export type TaskTab = 'todo' | 'done';
export type VariantState = 'pass' | 'fix' | 'none';
