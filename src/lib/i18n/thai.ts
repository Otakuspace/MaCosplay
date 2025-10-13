// Thai language translations for brainstorm application
export const thaiTranslations = {
  // Page titles and headers
  pageTitle: 'บอร์ดระดมสมอง - MaCosplay',
  pageDescription: 'บอร์ดระดมความคิดสำหรับคำขอคุณสมบัติของ MaCosplay',
  brainstormBoard: '🧠 บอร์ดระดมสมอง',
  subtitle: 'แบ่งปันไอเดียและโหวตคุณสมบัติใหม่ๆ สำหรับ MaCosplay',

  // View modes
  cardView: 'มุมมองการ์ด',
  graphView: 'มุมมองกราฟ',
  flowchartView: 'มุมมองแผนผังขั้นตอน',

  // Buttons and actions
  addFeatureRequest: 'เพิ่มคำขอคุณสมบัติ',
  addFirstFeatureRequest: 'เพิ่มคำขอคุณสมบัติแรก',
  showDetails: 'แสดงรายละเอียด',
  hideDetails: 'ซ่อนรายละเอียด',
  delete: 'ลบ',
  cancel: 'ยกเลิก',
  submit: 'ส่ง',
  submitFeatureRequest: 'ส่งคำขอคุณสมบัติ',
  add: 'เพิ่ม',
  vote: 'โหวต',

  // Status filters
  all: 'ทั้งหมด',
  requested: 'ขอแล้ว',
  'in-review': 'กำลังพิจารณา',
  inReview: 'กำลังพิจารณา',
  approved: 'อนุมัติแล้ว',
  'in-progress': 'กำลังดำเนินการ',
  inProgress: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  rejected: 'ปฏิเสธ',
  status: 'สถานะ',

  // Categories
  ui: 'UI/ดีไซน์',
  feature: 'คุณสมบัติใหม่',
  improvement: 'การปรับปรุง',
  bug: 'แก้ไขบัก',
  other: 'อื่นๆ',

  // Priorities
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
  critical: 'วิกฤต',

  // Form labels and placeholders
  title: 'หัวข้อ',
  titlePlaceholder: 'หัวข้อที่สั้นและอธิบายคำขอคุณสมบัติของคุณ',
  description: 'คำอธิบาย',
  descriptionPlaceholder: 'ให้ข้อมูลรายละเอียดเกี่ยวกับคำขอคุณสมบัติของคุณ...',
  category: 'หมวดหมู่',
  priority: 'ความสำคัญ',
  author: 'ชื่อของคุณ',
  authorPlaceholder: 'ใส่ชื่อหรือชื่อผู้ใช้ของคุณ',
  tags: 'แท็ก',
  tagsPlaceholder: 'เพิ่มแท็ก (กด Enter)',
  tagsHelp: 'แท็กช่วยในการจัดหมวดหมู่และกรองคำขอคุณสมบัติ',

  // Validation messages
  titleRequired: 'จำเป็นต้องมีหัวข้อ',
  descriptionRequired: 'จำเป็นต้องมีคำอธิบาย',
  authorRequired: 'จำเป็นต้องมีชื่อผู้เขียน',

  // Empty states and messages
  noFeatureRequests: 'ยังไม่มีคำขอคุณสมบัติ',
  beFirst: 'เป็นคนแรกที่แบ่งปันไอเดียสำหรับ MaCosplay!',
  loading: 'กำลังโหลด...',
  loadingData: 'กำลังโหลดข้อมูล...',
  saving: 'กำลังบันทึก...',
  processing: 'กำลังดำเนินการ...',

  // Error messages
  failedToLoad: 'โหลดคุณสมบัติไม่สำเร็จ',
  errorLoading: 'เกิดข้อผิดพลาดในการโหลดคุณสมบัติ',
  failedToAdd: 'เพิ่มคำขอคุณสมบัติไม่สำเร็จ',
  errorAdding: 'เกิดข้อผิดพลาดในการเพิ่มคำขอคุณสมบัติ',
  failedToUpdate: 'อัปเดตคำขอคุณสมบัติไม่สำเร็จ',
  errorUpdating: 'เกิดข้อผิดพลาดในการอัปเดตคำขอคุณสมบัติ',
  failedToDelete: 'ลบคำขอคุณสมบัติไม่สำเร็จ',
  errorDeleting: 'เกิดข้อผิดพลาดในการลบคำขอคุณสมบัติ',
  networkError: 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย',
  unexpectedError: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',

  // Confirmation messages
  deleteConfirmation: 'คุณแน่ใจหรือไม่ว่าต้องการลบคำขอคุณสมบัตินี้?',

  // Details
  createdAt: 'สร้างเมื่อ',
  updatedAt: 'อัปเดตเมื่อ',
  allTags: 'แท็กทั้งหมด',
  by: 'โดย',
  votes: 'โหวต',
  charactersCount: 'ตัวอักษร',

  // Form modal
  addNewFeatureRequest: 'เพิ่มคำขอคุณสมบัติใหม่',
  required: '*',

  // Graph view specific
  graphTitle: 'แผนผังความสัมพันธ์คุณสมบัติ',
  graphDescription: 'แสดงความสัมพันธ์และการไหลของคำขอคุณสมบัติ',
  dependencies: 'การพึ่งพา',
  relatedFeatures: 'คุณสมบัติที่เกี่ยวข้อง',
  workflow: 'ขั้นตอนการทำงาน',
  zoomIn: 'ขยายเข้า',
  zoomOut: 'ขยายออก',
  resetZoom: 'รีเซ็ตการซูม',
  fitToScreen: 'พอดีหน้าจอ',

  // Category icons and descriptions
  categoryIcons: {
    ui: '🎨',
    feature: '✨',
    improvement: '📈',
    bug: '🐛',
    other: '💡'
  },

  // Priority colors and icons
  priorityIcons: {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴'
  },

  // Authentication and Login
  login: 'เข้าสู่ระบบ',
  register: 'ลงทะเบียน',
  email: 'อีเมล',
  password: 'รหัสผ่าน',
  confirmPassword: 'ยืนยันรหัสผ่าน',
  name: 'ชื่อ',
  emailPlaceholder: 'ใส่อีเมล',
  passwordPlaceholder: 'ใส่รหัสผ่าน',
  namePlaceholder: 'ใส่ชื่อของคุณ',
  forgotPassword: 'ลืมรหัสผ่าน',
  loginWithFacebook: 'เข้าสู่ระบบด้วย Facebook',
  loginWithEmail: 'เข้าสู่ระบบด้วยอีเมล',
  orLoginWith: 'หรือเข้าสู่ระบบด้วย',
  alreadyHaveAccount: 'มีบัญชีแล้ว?',
  dontHaveAccount: 'ยังไม่มีบัญชี?',
  createAccount: 'สร้างบัญชี',
  registrationSuccess: 'ลงทะเบียนสำเร็จ โปรดยืนยันอีเมล',
  invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  passwordsDoNotMatch: 'รหัสผ่านไม่ตรงกัน',
  emailRequired: 'จำเป็นต้องมีอีเมล',
  passwordRequired: 'จำเป็นต้องมีรหัสผ่าน',
  nameRequired: 'จำเป็นต้องมีชื่อ',
  loginOptions: 'ตัวเลือกการเข้าสู่ระบบ',
  chooseLoginMethod: 'เลือกวิธีการเข้าสู่ระบบ'
};

export type TranslationKey = keyof typeof thaiTranslations;