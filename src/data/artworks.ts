import { ReviewTask, CompletedReview } from '../types';

export const ARTWORK_IMAGES = {
  white: '/images/kitty_white_tee.jpg',
  black: '/images/kitty_black_tee.jpg',
};

export const INITIAL_TASK: ReviewTask = {
  id: 'task-118',
  name: 'เสื้อยืดคอปก 118',
  coll: 'Coll. Hangyudon',
  designer: 'Earp',
  round: 1,
  when: '12 ก.ย. 10:20',
  pages: [
    {
      id: 'p-white',
      tag: 'ลายขาว',
      file: 'KittyTee_118_WH.ai',
      src: ARTWORK_IMAGES.white,
      strokes: [],
      comment: '',
      pass: false,
    },
    {
      id: 'p-black',
      tag: 'ลายดำ',
      file: 'KittyTee_118_BK.ai',
      src: ARTWORK_IMAGES.black,
      strokes: [],
      comment: '',
      pass: false,
    },
  ],
};

export const INITIAL_COMPLETED_REVIEWS: CompletedReview[] = [
];
