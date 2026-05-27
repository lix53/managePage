// 生成「黑玛项目管家 - 开发公司报价对照表 + 验收清单」
const path = require('path');
const fs = require('fs');
const docxPath = 'C:\\Program Files\\nodejs\\node_modules\\docx';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageNumber, PageOrientation, VerticalAlign,
  PageBreak
} = require(docxPath);

// ========== 通用样式 ==========
const FONT = '微软雅黑';
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };

// 页面：A4 横向 (用横向更利于宽表)
const PAGE_W = 11906;  // A4 短边
const PAGE_H = 16838;  // A4 长边
const MARGIN = 1080;
const CONTENT_W = PAGE_H - MARGIN * 2; // 横向时内容宽 = 长边 - 边距

// ========== 工具函数 ==========
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 320 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text,
      font: FONT,
      size: opts.size || 22,
      bold: opts.bold || false,
      color: opts.color || '000000'
    })],
    ...(opts.heading ? { heading: opts.heading } : {})
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, font: FONT, size: 36, bold: true, color: '1F3864' })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: '2F5496' })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: '4472C4' })]
  });
}

function cell(text, opts = {}) {
  const lines = String(text).split('\n');
  const children = lines.map(line => new Paragraph({
    spacing: { before: 20, after: 20, line: 280 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text: line,
      font: FONT,
      size: opts.size || 20,
      bold: opts.bold || false,
      color: opts.color || '000000'
    })]
  }));
  return new TableCell({
    borders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    children
  });
}

function makeTable(headers, rows, widths, headerFill = '1F3864') {
  const headerCells = headers.map((h, i) => cell(h, {
    width: widths[i], bold: true, color: 'FFFFFF', fill: headerFill, align: AlignmentType.CENTER
  }));
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((c, i) => {
      if (typeof c === 'object' && c !== null && 'text' in c) {
        return cell(c.text, { width: widths[i], fill: c.fill, bold: c.bold, color: c.color, align: c.align });
      }
      return cell(c, {
        width: widths[i],
        fill: ri % 2 === 1 ? 'F2F2F2' : undefined
      });
    })
  }));
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...dataRows]
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun('')] });
}

// ========== 内容 ==========

const docChildren = [];

// 封面标题
docChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 80 },
  children: [new TextRun({ text: '黑玛项目管家', font: FONT, size: 52, bold: true, color: '1F3864' })]
}));
docChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 80 },
  children: [new TextRun({ text: '开发公司报价对照表 + 验收清单', font: FONT, size: 36, bold: true, color: '2F5496' })]
}));
docChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 240 },
  children: [new TextRun({ text: 'V1.0  |  对外议价 & 验收专用', font: FONT, size: 22, color: '7F7F7F' })]
}));

// 说明
docChildren.push(makeTable(
  ['项目', '说明'],
  [
    ['编制方', '黑玛照明（甲方）'],
    ['用途', '与开发公司议价、签合同、阶段验收使用'],
    ['配套文档', '《需求说明书_V1.0.docx》（业务需求，本表为商务+验收抓手）'],
    ['使用方法', '①询价时让乙方对"必做项"逐项报价  ②签合同时把"验收标准"写进合同附件  ③付款节点严格按照"里程碑"控制'],
    ['核心原则', '能砍则砍，先跑 MVP；能云不自建；能买现成不重造']
  ],
  [2200, CONTENT_W - 2200]
));

// ========== 一、商务建议 ==========
docChildren.push(h1('一、商务建议（先看这一页再谈价）'));
docChildren.push(p('开发公司报价口径差异极大，建议按以下方式控制：', { size: 22 }));
docChildren.push(p('1. 拒绝"按人天打包总价"，要求"按功能模块清单逐项报价"；', { size: 22 }));
docChildren.push(p('2. 必做项报价 + 建议项报价分开列，方便砍预算；', { size: 22 }));
docChildren.push(p('3. 优先选有"微信小程序 + 云开发 CloudBase"经验的团队，可节省 30%~50% 工期；', { size: 22 }));
docChildren.push(p('4. 付款节点必须挂钩里程碑验收，禁止"一次性付清"或"开发完一次性 90%"；', { size: 22 }));
docChildren.push(p('5. 合同里写明：源代码归甲方所有、提供数据库结构文档、提供运维交接文档、3 个月免费 bug 维护。', { size: 22 }));

docChildren.push(h2('1.1 推荐付款节点（建议写入合同）'));
docChildren.push(makeTable(
  ['节点', '比例', '触发条件', '甲方控制点'],
  [
    ['合同签订', '20%', '合同签订 + 原型确认', '原型必须经过老板+郭巧英+毛鑫星+郑豪签字'],
    ['MVP 提测', '30%', '必做功能全部交付内测', '按"验收清单"逐项打勾，超过 90% 通过才付'],
    ['内部试跑通过', '30%', '10 个真实项目跑完一轮', '严静、郑豪等一线人员签字确认易用性'],
    ['正式上线 30 天', '15%', '上线满 30 天无 P0 bug', '老板使用看板满意'],
    ['质保期满', '5%', '上线满 3 个月', '尾款留作"反悔保证金"']
  ],
  [2400, 1200, 4400, CONTENT_W - 2400 - 1200 - 4400]
));

docChildren.push(h2('1.2 预算参考区间（仅供砍价参考，不代表市场价）'));
docChildren.push(makeTable(
  ['方案', '技术栈', '预估周期', '参考费用区间', '说明'],
  [
    [{ text: '方案A：云开发外包（推荐）', bold: true, fill: 'E7F0FA' },
     { text: '微信小程序 + CloudBase', fill: 'E7F0FA' },
     { text: '4~6 周', fill: 'E7F0FA' },
     { text: '3 万 ~ 6 万', fill: 'E7F0FA', bold: true },
     { text: '无需自建服务器，运维成本极低', fill: 'E7F0FA' }],
    ['方案B：常规外包', '小程序 + Java/Node + MySQL + 云服务器', '8~12 周', '8 万 ~ 15 万', '需自付服务器、备案、运维'],
    ['方案C：找成熟SaaS改造', '现成工程管理SaaS定制', '2~4 周', '年费 1 万 ~ 3 万', '不灵活，行业匹配度低'],
    ['方案D：兼职/独立开发者', '小程序 + 云开发', '6~10 周', '2 万 ~ 4 万', '便宜但风险大，需有人会技术对接']
  ],
  [2400, 3200, 1400, 2400, CONTENT_W - 2400 - 3200 - 1400 - 2400]
));

// ========== 二、功能模块报价对照表 ==========
docChildren.push(new Paragraph({ children: [new PageBreak()] }));
docChildren.push(h1('二、功能模块报价对照表（必做项）'));
docChildren.push(p('说明：把本表作为附件交给乙方，让其在"乙方报价(元)"列逐项填写；空白行不允许，否则视为放弃报价。', { size: 22, color: '7F7F7F' }));

const moduleHeaders = ['编号', '模块', '关键功能点', '工作量评估(人天)', '乙方报价(元)', '甲方备注'];
const moduleWidths = [800, 2200, 6000, 1600, 1600, CONTENT_W - 800 - 2200 - 6000 - 1600 - 1600];

docChildren.push(h3('A. 基础与权限'));
docChildren.push(makeTable(moduleHeaders, [
  ['A1', '微信登录 + 手机号绑定', '微信授权登录、手机号一键绑定、首次填姓名/部门', '1.5', '', ''],
  ['A2', '角色权限体系', '8 种角色（老板/老板娘/跟单/设计负责人/设计师/工程负责人/施工/新媒体）、权限菜单按角色显示', '3', '', ''],
  ['A3', '员工管理', '管理员可新增/禁用员工、调整角色和部门、关键操作留日志', '2', '', '']
], moduleWidths));

docChildren.push(h3('B. 项目核心'));
docChildren.push(makeTable(moduleHeaders, [
  ['B1', '项目新建/编辑', '基础信息+付款+人员+预计时间，含批量分配负责人', '2', '', ''],
  ['B2', '项目列表+筛选', '按状态/负责人/类型/是否超期筛选，支持搜索', '2', '', ''],
  ['B3', '项目详情聚合页', 'tab：基础/节点/文件/问题/发货/回款/素材', '3', '', '老板最常看的页面'],
  ['B4', '14 状态节点流转', '资料→设计→清单→采购→发货→施工→调试→验收→回款→复盘，每节点含负责人/截止/上传/确认', '5', '', '系统灵魂'],
  ['B5', '节点超期判定', '过期自动标红+触发提醒', '1.5', '', '']
], moduleWidths));

docChildren.push(h3('C. 工地现场端（手机使用，体验最关键）'));
docChildren.push(makeTable(moduleHeaders, [
  ['C1', '工地签到', 'GPS 定位+现场照片+施工条件 30 秒内完成', '2.5', '', '决定一线人员是否愿意用'],
  ['C2', '照片上传+水印', '自动压缩、自动加时间/地点/人员水印', '2', '', '必做，留痕证据'],
  ['C3', '施工节点进度', '开孔/布线/通电/调试/完工逐项打卡+照片', '2', '', ''],
  ['C4', '问题单创建', '一键拍照报问题、类型/责任/截止/处理结果', '3', '', ''],
  ['C5', '问题单闭环跟踪', '指派→处理→待确认→关闭，必须有确认人', '2', '', '']
], moduleWidths));

docChildren.push(h3('D. 设计/清单/采购'));
docChildren.push(makeTable(moduleHeaders, [
  ['D1', '设计任务派发', '负责人分配、上传图纸清单', '2', '', ''],
  ['D2', '毛鑫星复核机制', '设计师提交→复核通过/驳回带意见', '2', '', '强制流程，禁绕过'],
  ['D3', '灯具清单录入', '型号/功率/色温/光束角/数量/位置，支持 Excel 导入', '3', '', '建议支持复制粘贴'],
  ['D4', '采购备货状态', '待采购/已下单/部分到货/缺货/替代型号', '2', '', '']
], moduleWidths));

docChildren.push(h3('E. 发货/回款'));
docChildren.push(makeTable(moduleHeaders, [
  ['E1', '发货单创建+核对', '清单/配件/物流/打包照', '2.5', '', ''],
  ['E2', '物流跟踪', '物流单号 + 司机电话 + 客户签收照', '1.5', '', ''],
  ['E3', '回款记录', '应收/已收/未收/付款节点/超期原因', '2', '', ''],
  ['E4', '尾款自动提醒', '到节点未收款，推订阅消息给老板娘+郭巧英', '1.5', '', '']
], moduleWidths));

docChildren.push(h3('F. 老板看板'));
docChildren.push(makeTable(moduleHeaders, [
  ['F1', '老板首页 8 卡片', '进行中/今日待办/超期/未闭环/待发货/待验收/待回款金额/人员责任', '4', '', '3 分钟看清全公司'],
  ['F2', '红点+排序', '超期项红色高亮，按严重程度排序', '1', '', '']
], moduleWidths));

docChildren.push(h3('G. 提醒系统'));
docChildren.push(makeTable(moduleHeaders, [
  ['G1', '微信订阅消息', '7 类场景：设计超期/发货未更新/施工未签到/问题超期/完工未验收/验收未回款/完工素材', '3', '', '一次授权长期'],
  ['G2', '企微群机器人(可选)', '关键提醒同步推到企微群', '1', '', '低成本高效果']
], moduleWidths));

docChildren.push(new Paragraph({ children: [new PageBreak()] }));
docChildren.push(h1('三、功能模块报价对照表（建议项）'));
docChildren.push(p('建议项允许第二期再做，但合同里要预留接口/数据结构兼容性。', { size: 22, color: '7F7F7F' }));

docChildren.push(makeTable(moduleHeaders, [
  ['S1', '新媒体素材库', '按项目归档照片视频，标记发布状态', '3', '', '严静专属，建议一期含'],
  ['S2', '简单报表', '项目/财务/设计/工程/发货/新媒体六类统计', '4', '', ''],
  ['S3', '项目复盘记录', '利润/返工/问题/案例', '2', '', ''],
  ['S4', '数据导出 Excel', '项目、问题、回款列表导出', '2', '', '老板周会用']
], moduleWidths));

docChildren.push(h1('四、明确不做项（防止乙方拿这些抬价）'));
docChildren.push(makeTable(
  ['编号', '功能', '原因'],
  [
    ['X1', '复杂库存系统', '11 人公司无独立仓库岗，先用清单'],
    ['X2', '工资/绩效/考勤', '与项目管理无关，HR 工具替代'],
    ['X3', '复杂 OA 审批流', '审批多用微信群口头即可'],
    ['X4', '客户下单 / CRM', '客户量小，无需另建系统'],
    ['X5', '供应商管理', '供应商少，Excel 够用'],
    ['X6', 'AI 自动方案/AI 复盘', '一期不做，二期评估'],
    ['X7', '复杂权限矩阵', '8 个角色固定即可，不做自定义']
  ],
  [800, 2400, CONTENT_W - 800 - 2400]
));

docChildren.push(h1('五、商务总价汇总表'));
docChildren.push(makeTable(
  ['类别', '小计(元)', '占比', '甲方备注'],
  [
    ['必做项 A~G 合计', '', '约 75%', '议价空间小'],
    ['建议项 S 合计', '', '约 15%', '可砍可分期'],
    ['项目管理/原型/测试/部署', '', '约 10%', '通常乙方会包含，需明确'],
    [{ text: '总计', bold: true, fill: 'FFF2CC' }, { text: '', bold: true, fill: 'FFF2CC' }, { text: '100%', bold: true, fill: 'FFF2CC' }, { text: '不含微信认证 300 元/年、CloudBase 费用约 50~200 元/月', fill: 'FFF2CC' }]
  ],
  [3200, 2400, 1800, CONTENT_W - 3200 - 2400 - 1800]
));

// ========== 六、验收清单 ==========
docChildren.push(new Paragraph({ children: [new PageBreak()] }));
docChildren.push(h1('六、验收清单（合同附件，逐项打勾）'));
docChildren.push(p('使用方法：每项验收人在"通过/不通过"打勾签字，通过率≥95% 才可付下一阶段款。', { size: 22, color: '7F7F7F' }));

const acceptHeaders = ['编号', '验收项', '验收标准', '验收人', '通过', '不通过', '备注'];
const acceptWidths = [700, 2400, 5200, 1400, 700, 700, CONTENT_W - 700 - 2400 - 5200 - 1400 - 700 - 700];

docChildren.push(h2('6.1 老板验收（李辉煌）'));
docChildren.push(makeTable(acceptHeaders, [
  ['L1', '看板 3 分钟原则', '打开首页 3 分钟内看清：进行中/超期/未闭环/待回款金额/人员任务', '李辉煌', '☐', '☐', ''],
  ['L2', '超期高亮', '所有超期项目/任务在看板红色显示', '李辉煌', '☐', '☐', ''],
  ['L3', '一键穿透', '从看板任一卡片点进可直达项目详情', '李辉煌', '☐', '☐', ''],
  ['L4', '人员责任视图', '能看到每个员工未完成任务、超期任务、问题单数量', '李辉煌', '☐', '☐', '']
], acceptWidths));

docChildren.push(h2('6.2 跟单/财务/仓库验收（郭巧英）'));
docChildren.push(makeTable(acceptHeaders, [
  ['G1', '发货单创建', '能查看待发货项目、创建发货单、上传打包照、填物流单号', '郭巧英', '☐', '☐', ''],
  ['G2', '补退货记录', '能标记补货/退货并上传照片留痕', '郭巧英', '☐', '☐', ''],
  ['G3', '回款记录', '能记录已收金额、未收金额、付款节点', '郭巧英', '☐', '☐', ''],
  ['G4', '超期提醒收到', '验收 N 天后未回款，能收到订阅消息提醒', '郭巧英', '☐', '☐', '']
], acceptWidths));

docChildren.push(h2('6.3 设计部验收（毛鑫星）'));
docChildren.push(makeTable(acceptHeaders, [
  ['D1', '任务接收', '设计师能在小程序接收任务、看到截止时间', '毛鑫星', '☐', '☐', ''],
  ['D2', '图纸清单上传', '能上传 jpg/pdf/Excel，单文件 ≥20M', '毛鑫星', '☐', '☐', ''],
  ['D3', '复核机制', '设计师无法直接确认完成，必须经负责人复核', '毛鑫星', '☐', '☐', ''],
  ['D4', '设计变更记录', '变更原因/内容/确认人留痕', '毛鑫星', '☐', '☐', '']
], acceptWidths));

docChildren.push(h2('6.4 工程部验收（郑豪）'));
docChildren.push(makeTable(acceptHeaders, [
  ['E1', '30 秒签到', '施工人员到场可在 30 秒内完成签到+定位+照片', '郑豪', '☐', '☐', '核心体验'],
  ['E2', '施工条件上报', '签到后能填写施工条件、风险、材料是否到齐', '郑豪', '☐', '☐', ''],
  ['E3', '问题单 30 秒提交', '一线人员能 30 秒内拍照报问题', '郑豪', '☐', '☐', ''],
  ['E4', '问题闭环', '问题从发起到关闭全程可追溯，未确认不可关闭', '郑豪', '☐', '☐', ''],
  ['E5', '施工节点打卡', '开孔/布线/通电/调试每节点可上传照片', '郑豪', '☐', '☐', '']
], acceptWidths));

docChildren.push(h2('6.5 新媒体验收（严静）'));
docChildren.push(makeTable(acceptHeaders, [
  ['M1', '可拍项目列表', '能看到所有进入施工阶段的项目', '严静', '☐', '☐', ''],
  ['M2', '素材上传', '能上传照片/视频并标记类型', '严静', '☐', '☐', ''],
  ['M3', '素材状态管理', '未整理/已整理/可发布/已发布 4 态切换', '严静', '☐', '☐', ''],
  ['M4', '完工触发提醒', '项目完工后自动提醒整理案例', '严静', '☐', '☐', '']
], acceptWidths));

docChildren.push(h2('6.6 通用技术验收'));
docChildren.push(makeTable(acceptHeaders, [
  ['T1', '响应速度', '主要页面打开 ≤2 秒，照片上传 ≤5 秒/张', '甲方技术对接人', '☐', '☐', ''],
  ['T2', '弱网可用', '4G/3G 信号下能完成签到和拍照', '甲方技术对接人', '☐', '☐', '工地常见情况'],
  ['T3', '数据安全', '所有 API 鉴权、照片不可外链盗取', '甲方技术对接人', '☐', '☐', ''],
  ['T4', '数据库结构文档', '乙方交付完整 ER 图 + 字段说明', '甲方技术对接人', '☐', '☐', '尾款条件'],
  ['T5', '源码交付', '完整源码 + 部署文档 + 运维交接', '甲方技术对接人', '☐', '☐', '尾款条件'],
  ['T6', '3 个月质保', '上线后 3 个月免费修复 bug', '甲方技术对接人', '☐', '☐', '合同必写']
], acceptWidths));

docChildren.push(h1('七、给乙方的硬性要求清单（合同必写）'));
docChildren.push(makeTable(
  ['编号', '要求', '说明'],
  [
    ['R1', '必须使用微信原生小程序或 uni-app', '禁止用 WebView 套壳，否则一线体验崩溃'],
    ['R2', '必须使用微信云开发 CloudBase 或同等 BaaS', '降低甲方运维成本，源码归甲方'],
    ['R3', '所有照片必须自动压缩到 1080P 内', '工地一天几十张，控制成本'],
    ['R4', '所有照片自动打水印（时间/位置/人员）', '留痕证据核心'],
    ['R5', '订阅消息模板必须使用"长期一次性"', '避免每次都要授权'],
    ['R6', '提供数据库结构文档 + 接口文档', '验收前提'],
    ['R7', '源代码 + 知识产权归甲方所有', '合同必写'],
    ['R8', '上线后 3 个月免费 bug 修复', '不含新增需求'],
    ['R9', '不得使用收费第三方组件（除非甲方同意）', '避免后期年费陷阱'],
    ['R10', '关键操作必须留操作日志', '问题追责依据']
  ],
  [700, 4000, CONTENT_W - 700 - 4000]
));

docChildren.push(h1('八、签字栏'));
docChildren.push(spacer());
docChildren.push(makeTable(
  ['角色', '签字', '日期', '联系电话'],
  [
    ['甲方代表（李辉煌）', '', '', ''],
    ['甲方技术对接人', '', '', ''],
    ['乙方项目经理', '', '', ''],
    ['乙方技术负责人', '', '', '']
  ],
  [3200, 4200, 2400, CONTENT_W - 3200 - 4200 - 2400]
));

docChildren.push(spacer());
docChildren.push(p('本文档为《需求说明书_V1.0.docx》的商务+验收附件，两份文档一并作为合同附件。', { size: 20, color: '7F7F7F', align: AlignmentType.CENTER }));

// ========== 生成文档 ==========
const doc = new Document({
  creator: '黑玛照明',
  title: '黑玛项目管家-开发公司报价对照表+验收清单',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_H, height: PAGE_W, orientation: PageOrientation.LANDSCAPE },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: '黑玛项目管家 · 报价 & 验收清单', font: FONT, size: 18, color: '7F7F7F' })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: '第 ', font: FONT, size: 18, color: '7F7F7F' }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: '7F7F7F' }),
            new TextRun({ text: ' 页 / 共 ', font: FONT, size: 18, color: '7F7F7F' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18, color: '7F7F7F' }),
            new TextRun({ text: ' 页', font: FONT, size: 18, color: '7F7F7F' })
          ]
        })]
      })
    },
    children: docChildren
  }]
});

const outPath = path.join(process.env.USERPROFILE, 'Desktop', '黑玛项目管家_报价对照表与验收清单_V1.0.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('OK:', outPath);
}).catch(e => { console.error(e); process.exit(1); });
