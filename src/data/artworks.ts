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
  {
    id: 'done-002',
    name: 'แก้วร้อนเย็น 002',
    coll: 'Coll. Hangyudon',
    designer: 'Earp',
    when: '11 ก.ย. 16:20',
    result: 'ผ่าน',
    img: ARTWORK_IMAGES.white,
    pageSummaries: [
      { tag: 'ลายหลัก', result: 'ผ่าน' },
      { tag: 'ลายกล่อง', result: 'ผ่าน' },
    ],
  },
  {
    id: 'done-011',
    name: 'หมวก 011',
    coll: 'Coll. Hangyudon',
    designer: 'Goft',
    when: '10 ก.ย. 09:40',
    result: 'ขอแก้',
    img: ARTWORK_IMAGES.black,
    pageSummaries: [
      { tag: 'หน้าหมวก', result: 'ขอแก้' },
      { tag: 'ปีกหมวก', result: 'ผ่าน' },
    ],
  },
];
