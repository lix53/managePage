// 模拟数据：用户、项目、节点、问题、发货、签到、素材
// 实际接入云开发后，这里替换为云函数调用即可

export const ROLES = {
  BOSS: { key: 'boss', name: '老板' },
  BOSS_WIFE: { key: 'boss_wife', name: '老板娘' },
  FOLLOW: { key: 'follow', name: '跟单/财务' },
  DESIGN_LEAD: { key: 'design_lead', name: '设计负责人' },
  DESIGNER: { key: 'designer', name: '设计师' },
  ENGINEER_LEAD: { key: 'engineer_lead', name: '工程负责人' },
  ENGINEER: { key: 'engineer', name: '施工人员' },
  MEDIA: { key: 'media', name: '新媒体' }
}

export const USERS = [
  { id: 'u01', name: '李辉煌', role: 'boss', dept: '老板', phone: '138****0001' },
  { id: 'u02', name: '易阳丽', role: 'boss_wife', dept: '老板娘', phone: '138****0002' },
  { id: 'u03', name: '郭巧英', role: 'follow', dept: '跟单/财务', phone: '138****0003' },
  { id: 'u04', name: '毛鑫星', role: 'design_lead', dept: '设计部', phone: '138****0004' },
  { id: 'u05', name: '杨宇', role: 'designer', dept: '设计部', phone: '138****0005' },
  { id: 'u06', name: '杨心倩', role: 'designer', dept: '设计部', phone: '138****0006' },
  { id: 'u07', name: '郑豪', role: 'engineer_lead', dept: '工程部', phone: '138****0007' },
  { id: 'u08', name: '罗爽', role: 'engineer', dept: '工程部', phone: '138****0008' },
  { id: 'u09', name: '王威', role: 'engineer', dept: '工程部', phone: '138****0009' },
  { id: 'u10', name: '严静', role: 'media', dept: '新媒体部', phone: '138****0010' },
  { id: 'u11', name: '王靖羽', role: 'media', dept: '新媒体部', phone: '138****0011' }
]

// 14 状态机
export const PROJECT_STATUS = [
  { key: 'material', name: '待资料收集', color: 'gray' },
  { key: 'design_wait', name: '待设计', color: 'gray' },
  { key: 'design_doing', name: '设计中', color: 'blue' },
  { key: 'list', name: '待清单', color: 'blue' },
  { key: 'purchase', name: '待采购/备货', color: 'blue' },
  { key: 'ship', name: '待发货', color: 'orange' },
  { key: 'enter', name: '待进场', color: 'orange' },
  { key: 'working', name: '施工中', color: 'orange' },
  { key: 'debug', name: '待调试', color: 'orange' },
  { key: 'accept', name: '待验收', color: 'orange' },
  { key: 'payment', name: '待回款', color: 'red' },
  { key: 'done', name: '已完成', color: 'green' },
  { key: 'after', name: '售后中', color: 'green' },
  { key: 'closed', name: '已关闭', color: 'gray' }
]

export const NODE_TEMPLATE = [
  { key: 'material', name: '资料收集', owner: 'u03', desc: '平面图、现场照片、视频、尺寸、层高、吊顶、客户需求' },
  { key: 'design', name: '设计任务', owner: 'u05', desc: '灯光方案、点位图、灯具清单、安装说明、重点区域说明' },
  { key: 'review', name: '内部复核', owner: 'u04', desc: '设计师提交后由毛鑫星复核' },
  { key: 'list', name: '清单确认', owner: 'u04', desc: '型号、功率、色温、光束角、数量、位置、属性' },
  { key: 'purchase', name: '采购备货', owner: 'u02', desc: '记录采购、到货、缺货、替代型号' },
  { key: 'ship', name: '发货', owner: 'u03', desc: '核对清单、上传打包照、物流单号' },
  { key: 'enter', name: '施工进场', owner: 'u07', desc: '到场30分钟内完成签到+施工条件说明' },
  { key: 'working', name: '施工过程', owner: 'u07', desc: '定位、开孔、布线、安装、通电测试照片' },
  { key: 'debug', name: '调试验收', owner: 'u07', desc: '调试前后照片、重点区域效果、客户反馈' },
  { key: 'payment', name: '回款', owner: 'u02', desc: '应收、已收、未收、尾款提醒' },
  { key: 'review_close', name: '复盘归档', owner: 'u01', desc: '利润、返工、问题、售后、案例素材' }
]

// 当前时间基准
const NOW = new Date('2026-05-27T10:00:00').getTime()
const days = (n) => new Date(NOW + n * 86400000).toISOString()

export const PROJECTS = [
  {
    id: 'p001',
    code: 'HM2026-001',
    name: '橙堡精品酒店大堂照明',
    customer: { name: '橙堡酒店', phone: '139****1001', address: '深圳市福田区车公庙XX路88号' },
    type: '酒店',
    contractAmount: 285000,
    receivedAmount: 100000,
    paymentMethod: '30-60-10',
    managers: { sales: 'u01', design: 'u04', follow: 'u03', engineer: 'u07', media: 'u10' },
    status: 'working',
    expectStartDate: days(-5),
    expectFinishDate: days(7),
    createdAt: days(-20),
    overdue: false
  },
  {
    id: 'p002',
    code: 'HM2026-002',
    name: '梧桐里咖啡馆灯光改造',
    customer: { name: '梧桐里咖啡', phone: '139****1002', address: '深圳市南山区华侨城创意园' },
    type: '餐饮',
    contractAmount: 68000,
    receivedAmount: 20000,
    paymentMethod: '30-60-10',
    managers: { sales: 'u02', design: 'u05', follow: 'u03', engineer: 'u07', media: 'u10' },
    status: 'accept',
    expectStartDate: days(-12),
    expectFinishDate: days(-2),
    createdAt: days(-30),
    overdue: true
  },
  {
    id: 'p003',
    code: 'HM2026-003',
    name: '中信总部办公区灯光',
    customer: { name: '中信集团', phone: '139****1003', address: '深圳市福田区中信广场' },
    type: '办公',
    contractAmount: 520000,
    receivedAmount: 156000,
    paymentMethod: '30-60-10',
    managers: { sales: 'u01', design: 'u04', follow: 'u03', engineer: 'u07', media: 'u10' },
    status: 'design_doing',
    expectStartDate: days(15),
    expectFinishDate: days(45),
    createdAt: days(-10),
    overdue: false
  },
  {
    id: 'p004',
    code: 'HM2026-004',
    name: '欢乐里购物中心中庭照明',
    customer: { name: '欢乐里商管', phone: '139****1004', address: '深圳市宝安区欢乐里' },
    type: '商业空间',
    contractAmount: 880000,
    receivedAmount: 880000,
    paymentMethod: '全款',
    managers: { sales: 'u01', design: 'u04', follow: 'u03', engineer: 'u07', media: 'u10' },
    status: 'done',
    expectStartDate: days(-60),
    expectFinishDate: days(-15),
    createdAt: days(-90),
    overdue: false
  },
  {
    id: 'p005',
    code: 'HM2026-005',
    name: '云栖私厨包房灯光',
    customer: { name: '云栖餐饮', phone: '139****1005', address: '深圳市罗湖区KK ONE' },
    type: '餐饮',
    contractAmount: 42000,
    receivedAmount: 0,
    paymentMethod: '50-50',
    managers: { sales: 'u02', design: 'u06', follow: 'u03', engineer: 'u07', media: 'u11' },
    status: 'material',
    expectStartDate: days(20),
    expectFinishDate: days(40),
    createdAt: days(-2),
    overdue: false
  },
  {
    id: 'p006',
    code: 'HM2026-006',
    name: '星澜湾会所主灯定制',
    customer: { name: '星澜湾物业', phone: '139****1006', address: '深圳市南山区蛇口' },
    type: '商业空间',
    contractAmount: 168000,
    receivedAmount: 50400,
    paymentMethod: '30-60-10',
    managers: { sales: 'u01', design: 'u04', follow: 'u03', engineer: 'u07', media: 'u10' },
    status: 'ship',
    expectStartDate: days(3),
    expectFinishDate: days(25),
    createdAt: days(-15),
    overdue: false
  }
]

// 节点任务（部分项目示例）
export const PROJECT_NODES = [
  // 项目 p001 节点
  { id: 'n001', projectId: 'p001', nodeKey: 'material', nodeName: '资料收集', owner: 'u03', deadline: days(-18), status: 'done', files: 5, confirmedBy: 'u01' },
  { id: 'n002', projectId: 'p001', nodeKey: 'design', nodeName: '设计任务', owner: 'u05', deadline: days(-12), status: 'done', files: 8, confirmedBy: 'u04' },
  { id: 'n003', projectId: 'p001', nodeKey: 'review', nodeName: '内部复核', owner: 'u04', deadline: days(-10), status: 'done', files: 1, confirmedBy: 'u04' },
  { id: 'n004', projectId: 'p001', nodeKey: 'list', nodeName: '清单确认', owner: 'u04', deadline: days(-8), status: 'done', files: 1, confirmedBy: 'u01' },
  { id: 'n005', projectId: 'p001', nodeKey: 'purchase', nodeName: '采购备货', owner: 'u02', deadline: days(-6), status: 'done', files: 3, confirmedBy: 'u02' },
  { id: 'n006', projectId: 'p001', nodeKey: 'ship', nodeName: '发货', owner: 'u03', deadline: days(-5), status: 'done', files: 4, confirmedBy: 'u03' },
  { id: 'n007', projectId: 'p001', nodeKey: 'enter', nodeName: '施工进场', owner: 'u07', deadline: days(-4), status: 'done', files: 6, confirmedBy: 'u07' },
  { id: 'n008', projectId: 'p001', nodeKey: 'working', nodeName: '施工过程', owner: 'u07', deadline: days(2), status: 'doing', files: 12 },
  { id: 'n009', projectId: 'p001', nodeKey: 'debug', nodeName: '调试验收', owner: 'u07', deadline: days(5), status: 'todo', files: 0 },
  { id: 'n010', projectId: 'p001', nodeKey: 'payment', nodeName: '回款', owner: 'u02', deadline: days(10), status: 'todo', files: 0 },
  { id: 'n011', projectId: 'p001', nodeKey: 'review_close', nodeName: '复盘归档', owner: 'u01', deadline: days(15), status: 'todo', files: 0 },

  // 项目 p002 - 超期
  { id: 'n101', projectId: 'p002', nodeKey: 'material', nodeName: '资料收集', owner: 'u03', deadline: days(-28), status: 'done', files: 3, confirmedBy: 'u01' },
  { id: 'n102', projectId: 'p002', nodeKey: 'design', nodeName: '设计任务', owner: 'u05', deadline: days(-22), status: 'done', files: 5, confirmedBy: 'u04' },
  { id: 'n103', projectId: 'p002', nodeKey: 'review', nodeName: '内部复核', owner: 'u04', deadline: days(-20), status: 'done', files: 1, confirmedBy: 'u04' },
  { id: 'n104', projectId: 'p002', nodeKey: 'list', nodeName: '清单确认', owner: 'u04', deadline: days(-18), status: 'done', files: 1, confirmedBy: 'u01' },
  { id: 'n105', projectId: 'p002', nodeKey: 'purchase', nodeName: '采购备货', owner: 'u02', deadline: days(-15), status: 'done', files: 2, confirmedBy: 'u02' },
  { id: 'n106', projectId: 'p002', nodeKey: 'ship', nodeName: '发货', owner: 'u03', deadline: days(-13), status: 'done', files: 3, confirmedBy: 'u03' },
  { id: 'n107', projectId: 'p002', nodeKey: 'enter', nodeName: '施工进场', owner: 'u07', deadline: days(-12), status: 'done', files: 4, confirmedBy: 'u07' },
  { id: 'n108', projectId: 'p002', nodeKey: 'working', nodeName: '施工过程', owner: 'u07', deadline: days(-5), status: 'done', files: 9, confirmedBy: 'u07' },
  { id: 'n109', projectId: 'p002', nodeKey: 'debug', nodeName: '调试验收', owner: 'u07', deadline: days(-3), status: 'pending_confirm', files: 5 },
  { id: 'n110', projectId: 'p002', nodeKey: 'payment', nodeName: '回款', owner: 'u02', deadline: days(0), status: 'todo', files: 0 },
  { id: 'n111', projectId: 'p002', nodeKey: 'review_close', nodeName: '复盘归档', owner: 'u01', deadline: days(5), status: 'todo', files: 0 },

  // 项目 p003 - 设计中
  { id: 'n201', projectId: 'p003', nodeKey: 'material', nodeName: '资料收集', owner: 'u03', deadline: days(-8), status: 'done', files: 6, confirmedBy: 'u01' },
  { id: 'n202', projectId: 'p003', nodeKey: 'design', nodeName: '设计任务', owner: 'u05', deadline: days(-1), status: 'doing', files: 4 },
  { id: 'n203', projectId: 'p003', nodeKey: 'review', nodeName: '内部复核', owner: 'u04', deadline: days(2), status: 'todo', files: 0 },
  { id: 'n204', projectId: 'p003', nodeKey: 'list', nodeName: '清单确认', owner: 'u04', deadline: days(5), status: 'todo', files: 0 }
]

// 问题单
export const ISSUES = [
  {
    id: 'i001', projectId: 'p001', projectName: '橙堡精品酒店大堂照明',
    title: '大堂主灯位3号点位偏移50cm',
    type: '现场尺寸不符',
    photos: 3,
    department: '工程部',
    owner: 'u07', assignee: 'u04',
    deadline: days(1), status: 'doing',
    createdAt: days(-1)
  },
  {
    id: 'i002', projectId: 'p001', projectName: '橙堡精品酒店大堂照明',
    title: '射灯3只外观磕碰',
    type: '灯具损坏',
    photos: 5,
    department: '跟单',
    owner: 'u07', assignee: 'u03',
    deadline: days(0), status: 'pending_confirm',
    createdAt: days(-2)
  },
  {
    id: 'i003', projectId: 'p002', projectName: '梧桐里咖啡馆灯光改造',
    title: '客户验收后增加吧台调光需求',
    type: '客户变更',
    photos: 2,
    department: '设计部',
    owner: 'u07', assignee: 'u04',
    deadline: days(-1), status: 'doing',
    createdAt: days(-3)
  },
  {
    id: 'i004', projectId: 'p003', projectName: '中信总部办公区灯光',
    title: '现场实测层高比图纸低15cm',
    type: '设计问题',
    photos: 4,
    department: '设计部',
    owner: 'u07', assignee: 'u04',
    deadline: days(2), status: 'todo',
    createdAt: days(0)
  },
  {
    id: 'i005', projectId: 'p001', projectName: '橙堡精品酒店大堂照明',
    title: '电源驱动型号需替代确认',
    type: '清单漏项',
    photos: 1,
    department: '设计部',
    owner: 'u07', assignee: 'u04',
    deadline: days(-3), status: 'todo',
    createdAt: days(-4)
  }
]

// 工地签到
export const CHECKINS = [
  { id: 'c001', projectId: 'p001', projectName: '橙堡精品酒店大堂照明', userId: 'u08', userName: '罗爽', time: days(-0.1), photos: 4, condition: '具备施工条件' },
  { id: 'c002', projectId: 'p001', projectName: '橙堡精品酒店大堂照明', userId: 'u09', userName: '王威', time: days(-0.15), photos: 3, condition: '材料部分未到' },
  { id: 'c003', projectId: 'p002', projectName: '梧桐里咖啡馆灯光改造', userId: 'u08', userName: '罗爽', time: days(-2), photos: 5, condition: '具备施工条件' }
]

// 发货
export const SHIPMENTS = [
  { id: 's001', projectId: 'p001', no: 'WL2026-0001', logisticsNo: 'SF1234567890', driver: '张师傅 138****5555', status: 'signed', date: days(-5) },
  { id: 's002', projectId: 'p006', no: 'WL2026-0002', logisticsNo: 'SF1234567891', driver: '李师傅 138****6666', status: 'shipping', date: days(0) }
]

// 素材
export const MEDIA_ASSETS = [
  { id: 'm001', projectId: 'p004', type: '完工', count: 28, status: 'published', updateAt: days(-12) },
  { id: 'm002', projectId: 'p004', type: '前后对比', count: 6, status: 'published', updateAt: days(-10) },
  { id: 'm003', projectId: 'p001', type: '施工过程', count: 15, status: 'unsorted', updateAt: days(0) },
  { id: 'm004', projectId: 'p002', type: '完工', count: 12, status: 'sorted', updateAt: days(-2) }
]

// 辅助查询函数
export const getUserById = (id) => USERS.find(u => u.id === id) || { name: '-', id }
export const getStatusInfo = (key) => PROJECT_STATUS.find(s => s.key === key) || { name: key, color: 'gray' }
export const getProjectById = (id) => PROJECTS.find(p => p.id === id)
export const getNodesByProject = (projectId) => PROJECT_NODES.filter(n => n.projectId === projectId)
export const getIssuesByProject = (projectId) => ISSUES.filter(i => i.projectId === projectId)
export const getShipmentsByProject = (projectId) => SHIPMENTS.filter(s => s.projectId === projectId)
export const getMediaByProject = (projectId) => MEDIA_ASSETS.filter(m => m.projectId === projectId)
