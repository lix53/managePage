// 生成「黑玛项目管家 - 项目方案评审文档」
const path = require('path');
const fs = require('fs');
const docxPath = 'C:\\Program Files\\nodejs\\node_modules\\docx';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageNumber, VerticalAlign, PageBreak,
  TableOfContents
} = require(docxPath);

const FONT = '微软雅黑';
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };

// A4 纵向
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;

function p(text, opts = {}) {
  const lines = String(text).split('\n');
  return lines.map(line => new Paragraph({
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 340 },
    alignment: opts.align || AlignmentType.LEFT,
    indent: opts.indent ? { firstLine: 0, left: opts.indent } : undefined,
    children: [new TextRun({
      text: line,
      font: FONT,
      size: opts.size || 22,
      bold: opts.bold || false,
      color: opts.color || '000000',
      italics: opts.italics || false
    })]
  }));
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, font: FONT, size: 36, bold: true, color: '1F3864' })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: '2F5496' })]
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
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

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 40, after: 40, line: 320 },
    children: [new TextRun({ text, font: FONT, size: 22 })]
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun('')] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ========== 内容 ==========
const c = [];

// 封面
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 2400, after: 240 },
  children: [new TextRun({ text: '黑玛项目管家', font: FONT, size: 64, bold: true, color: '1F3864' })]
}));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 240 },
  children: [new TextRun({ text: '项目方案评审文档', font: FONT, size: 44, bold: true, color: '2F5496' })]
}));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 1200 },
  children: [new TextRun({ text: '工地推进管理小程序 · 设计与架构方案 V1.0', font: FONT, size: 24, color: '7F7F7F' })]
}));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 800, after: 80 },
  children: [new TextRun({ text: '编制：黑玛照明 项目组', font: FONT, size: 22, color: '404040' })]
}));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 80 },
  children: [new TextRun({ text: '配套文档：《需求说明书_V1.0.docx》《报价对照表与验收清单_V1.0.docx》', font: FONT, size: 20, color: '7F7F7F' })]
}));
c.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 80, after: 80 },
  children: [new TextRun({ text: '日期：2026 年 5 月', font: FONT, size: 20, color: '7F7F7F' })]
}));

c.push(pageBreak());

// ========== 修订记录 ==========
c.push(h1('修订记录'));
c.push(makeTable(
  ['版本', '日期', '修订人', '修订说明'],
  [
    ['V1.0', '2026-05-27', '项目组', '初版，含需求摘要、架构设计、技术选型、数据模型、实施计划'],
  ],
  [1400, 2200, 1800, CONTENT_W - 1400 - 2200 - 1800]
));

c.push(h1('参与评审人员'));
c.push(makeTable(
  ['角色', '姓名', '部门', '评审职责'],
  [
    ['决策方', '李辉煌', '老板', '方案最终拍板'],
    ['决策方', '易阳丽', '老板娘', '采购/回款流程审核'],
    ['核心使用方', '郭巧英', '跟单/财务/仓库', '发货/回款流程审核'],
    ['核心使用方', '毛鑫星', '设计部', '设计/复核流程审核'],
    ['核心使用方', '郑豪', '工程部', '工地端体验审核'],
    ['核心使用方', '严静', '新媒体部', '素材库流程审核'],
    ['编写方', '项目组', '—', '方案设计与撰写']
  ],
  [1600, 1400, 1800, CONTENT_W - 1600 - 1400 - 1800]
));

c.push(pageBreak());

// ========== 一、需求摘要 ==========
c.push(h1('一、需求摘要'));
c.push(h2('1.1 项目背景'));
c.push(...p('黑玛照明是一家专注于商业照明设计与工程交付的公司，现阶段团队约 11 人，已进入"老板亲自喊干"向"部门负责人 + 标准流程"过渡的关键阶段。当前工地推进主要依赖微信群和口头沟通，存在信息分散、责任边界不清、问题难闭环、回款易遗漏、案例素材沉淀困难等问题。'));
c.push(...p('为解决以上痛点，公司决定开发一套适合自身业务的项目推进小程序——"黑玛项目管家"，覆盖从项目立项到验收回款的全流程。'));

c.push(h2('1.2 系统定位'));
c.push(makeTable(
  ['维度', '定位'],
  [
    ['核心定位', '商业照明项目推进系统 + 工地责任留痕系统 + 发货回款协同系统 + 项目素材归档系统'],
    ['不是什么', '不是复杂 OA、不是聊天工具、不是 CRM、不是库存系统'],
    ['用户规模', '内部 11 人；并发极低；项目年度规模数百级'],
    ['主要终端', '微信小程序（工地端 + 管理端共用）'],
    ['第一版周期', '4~6 周开发 + 2 周试跑 + 1 周优化']
  ],
  [2000, CONTENT_W - 2000]
));

c.push(h2('1.3 第一版核心目标'));
c.push(bullet('老板 3 分钟看清所有项目状态、卡点、超期、未闭环问题、待回款金额。'));
c.push(bullet('员工 30 秒内能完成工地签到、上传现场照片、提交问题。'));
c.push(bullet('每个项目节点都有负责人、截止时间、上传资料、确认人、状态。'));
c.push(bullet('所有现场问题都有照片、时间、位置、责任人和处理结果，可闭环追责。'));
c.push(bullet('每个项目完工后能自动沉淀为新媒体可发布的案例素材。'));

c.push(h2('1.4 第一版功能范围'));
c.push(makeTable(
  ['优先级', '功能清单'],
  [
    [{ text: '必须做（MVP）', bold: true, fill: 'C6EFCE' }, '登录与角色权限、项目新建/列表/详情、14 状态节点流转、工地签到、照片上传、问题反馈与闭环、发货记录、回款记录、老板看板、订阅消息提醒'],
    [{ text: '建议做', bold: true, fill: 'FFEB9C' }, '设计复核、超期提醒、新媒体素材库、简单报表、项目复盘记录、数据导出'],
    [{ text: '暂缓做', bold: true, fill: 'FFC7CE' }, '复杂库存、工资绩效、供应商系统、客户下单、复杂 CRM、AI 自动方案、复杂审批流']
  ],
  [2000, CONTENT_W - 2000]
));

c.push(pageBreak());

// ========== 二、整体架构 ==========
c.push(h1('二、整体架构设计'));

c.push(h2('2.1 架构总览'));
c.push(...p('采用"微信小程序 + 微信云开发 CloudBase"的 Serverless 架构，最大化降低运维成本，提升交付速度。'));

c.push(h3('架构分层示意'));
const archTable = new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [CONTENT_W],
  rows: [
    new TableRow({ children: [cell('【前端展示层】\n微信小程序（uni-app + Vue3 + uView UI）\n· 工地端：签到 / 拍照 / 问题 / 进度（极简交互）\n· 管理端：项目 / 看板 / 报表（功能完整）',
      { width: CONTENT_W, fill: 'DEEBF7', bold: true, align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('↓ HTTPS + 微信登录态',
      { width: CONTENT_W, align: AlignmentType.CENTER, color: '7F7F7F' })] }),
    new TableRow({ children: [cell('【业务逻辑层】\n微信云开发 CloudBase 云函数（Node.js）\n· 项目流程引擎  · 权限校验  · 业务规则  · 报表聚合',
      { width: CONTENT_W, fill: 'E2EFDA', bold: true, align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('↓ SDK 调用',
      { width: CONTENT_W, align: AlignmentType.CENTER, color: '7F7F7F' })] }),
    new TableRow({ children: [cell('【数据存储层】\n· 云数据库（MongoDB 风格 7 张表）\n· 云存储（照片/视频 + CDN）\n· 定时触发器（每日提醒 / 报表）',
      { width: CONTENT_W, fill: 'FFF2CC', bold: true, align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('↓ 触发',
      { width: CONTENT_W, align: AlignmentType.CENTER, color: '7F7F7F' })] }),
    new TableRow({ children: [cell('【通知与外部能力】\n· 微信订阅消息（超期提醒）\n· 企业微信群机器人（可选，关键通知同步）\n· 短信网关（可选）',
      { width: CONTENT_W, fill: 'FCE4D6', bold: true, align: AlignmentType.CENTER })] })
  ]
});
c.push(archTable);

c.push(h2('2.2 架构选型理由'));
c.push(makeTable(
  ['对比项', 'CloudBase 云开发（推荐）', '传统后端自建'],
  [
    ['服务器运维', '无需服务器，按量付费', '需购买服务器、备案、运维'],
    ['开发周期', '4~6 周', '8~12 周'],
    ['月度成本（11人）', '约 50~200 元/月', '约 500~2000 元/月'],
    ['微信生态集成', '原生支持（登录/订阅消息/支付）', '需自行对接'],
    ['图片/视频存储', '自带 CDN，免运维', '需自建 OSS 或购买'],
    ['扩展性', '满足未来 100 人内', '需架构师持续优化'],
    ['团队门槛', '前端工程师即可全栈', '需前端 + 后端 + 运维'],
    [{ text: '结论', bold: true, fill: 'FFF2CC' }, { text: '✓ 推荐方案', bold: true, fill: 'C6EFCE' }, { text: '✗ 杀鸡用牛刀', fill: 'FFC7CE' }]
  ],
  [2400, 4400, CONTENT_W - 2400 - 4400]
));

c.push(h2('2.3 部署拓扑'));
c.push(bullet('小程序代码：通过微信开发者工具发布到微信公众平台审核上线。'));
c.push(bullet('云函数 + 数据库：托管于腾讯云 CloudBase（华南广州区域）。'));
c.push(bullet('媒体文件：CloudBase 云存储，全球 CDN 加速分发。'));
c.push(bullet('管理后台（二期）：可使用 CloudBase 静态网站托管 + Vue3 + Ant Design Vue。'));

c.push(pageBreak());

// ========== 三、技术选型 ==========
c.push(h1('三、技术选型'));

c.push(makeTable(
  ['层次', '技术选型', '版本/规格', '选型理由'],
  [
    ['前端框架', 'uni-app + Vue3', 'uni-app 3.x', '一套代码兼容小程序 + H5 + App，未来扩展空间大'],
    ['UI 组件库', 'uView UI 2.0', '2.0+', '微信小程序生态最成熟的中后台风格 UI 库'],
    ['状态管理', 'Pinia', '2.x', '比 Vuex 更轻量，TS 友好'],
    ['后端 BaaS', '微信云开发 CloudBase', '最新版', '微信官方 + 腾讯云，Serverless 免运维'],
    ['数据库', '云数据库（MongoDB 风格）', 'CloudBase 内置', '文档型，便于灵活扩展字段'],
    ['对象存储', '云存储', 'CloudBase 内置', '免费配额 + CDN 加速'],
    ['消息推送', '微信订阅消息', '官方 API', '长期一次性订阅模板'],
    ['群机器人', '企业微信 Webhook（可选）', '—', '关键提醒同步到工作群'],
    ['代码托管', 'Gitee / 自建 Git', '—', '源码私有，便于交接'],
    ['CI/CD', '微信开发者工具上传', '—', 'MVP 阶段手动发布即可'],
    ['监控', 'CloudBase 自带控制台', '—', '足够 MVP 用'],
    ['辅助开发', 'CodeBuddy / Cursor', '—', 'AI 编程提速 30%~50%']
  ],
  [1600, 2400, 1400, CONTENT_W - 1600 - 2400 - 1400]
));

c.push(pageBreak());

// ========== 四、数据模型 ==========
c.push(h1('四、数据模型设计'));
c.push(...p('第一版共 7 张核心数据集合，遵循"先简后繁、字段可扩展"原则。'));

c.push(h2('4.1 数据集合总览'));
c.push(makeTable(
  ['编号', '集合名', '说明', '主要使用方'],
  [
    ['T1', 'users', '用户表，存储所有员工信息和角色', '全员'],
    ['T2', 'projects', '项目主表，14 状态机的载体', '老板、负责人'],
    ['T3', 'project_nodes', '项目节点任务表，流程引擎核心', '各部门负责人'],
    ['T4', 'issues', '问题单，闭环追责核心', '工程部 + 全员'],
    ['T5', 'shipments', '发货单', '郭巧英'],
    ['T6', 'site_checkins', '现场签到记录', '工程部'],
    ['T7', 'media_assets', '新媒体素材库', '严静']
  ],
  [800, 2200, CONTENT_W - 800 - 2200 - 2400, 2400]
));

c.push(h2('4.2 关键字段详细设计'));

c.push(h3('T2 · projects 项目表（核心）'));
c.push(makeTable(
  ['字段', '类型', '说明', '是否必填'],
  [
    ['_id', 'String', '系统自动生成', '✓'],
    ['code', 'String', '项目编号，自动生成（如 HM2026-001）', '✓'],
    ['name', 'String', '项目名称', '✓'],
    ['customer', 'Object', '客户信息：{name, phone, address}', '✓'],
    ['type', 'String', '项目类型（商业空间/办公/酒店/餐饮等）', '✓'],
    ['contractAmount', 'Number', '合同金额', '✓'],
    ['receivedAmount', 'Number', '已收金额', ''],
    ['paymentMethod', 'String', '付款方式（全款/30-60-10/分期等）', '✓'],
    ['managers', 'Object', '负责人：{sales, design, follow, engineer, media}', '✓'],
    ['status', 'String', '当前状态（14 种枚举）', '✓'],
    ['expectStartDate', 'Date', '预计进场时间', ''],
    ['expectFinishDate', 'Date', '预计完工时间', ''],
    ['createdBy', 'String', '创建人 openid', '✓'],
    ['createdAt', 'Date', '创建时间', '✓'],
    ['updatedAt', 'Date', '更新时间', '✓']
  ],
  [2200, 1400, CONTENT_W - 2200 - 1400 - 1200, 1200]
));

c.push(h3('T3 · project_nodes 项目节点表（流程引擎）'));
c.push(makeTable(
  ['字段', '类型', '说明'],
  [
    ['_id', 'String', '系统生成'],
    ['projectId', 'String', '所属项目 ID'],
    ['nodeKey', 'String', '节点 KEY（material/design/list/purchase/ship/work/debug/accept/payment/review）'],
    ['nodeName', 'String', '节点中文名'],
    ['owner', 'String', '负责人 openid'],
    ['deadline', 'Date', '截止时间'],
    ['status', 'String', 'todo / doing / pending_confirm / done / overdue'],
    ['files', 'Array', '上传资料 [{name, url, uploader, uploadedAt}]'],
    ['confirmedBy', 'String', '确认人 openid（关键卡控）'],
    ['confirmedAt', 'Date', '确认时间'],
    ['remark', 'String', '备注'],
    ['createdAt', 'Date', '创建时间']
  ],
  [2400, 1600, CONTENT_W - 2400 - 1600]
));

c.push(h3('T4 · issues 问题单（闭环核心）'));
c.push(makeTable(
  ['字段', '类型', '说明'],
  [
    ['_id', 'String', '系统生成'],
    ['projectId', 'String', '所属项目'],
    ['title', 'String', '问题标题'],
    ['type', 'String', '问题类型（设计/清单/发货/损坏/尺寸不符/客户变更/施工条件/安装错误/质量/售后/回款）'],
    ['photos', 'Array', '现场照片 URL 数组'],
    ['department', 'String', '责任部门'],
    ['owner', 'String', '责任人 openid'],
    ['assignee', 'String', '处理人 openid'],
    ['deadline', 'Date', '处理截止时间'],
    ['status', 'String', '待处理/处理中/待确认/已解决/已关闭/责任待判定'],
    ['solution', 'String', '处理方案'],
    ['result', 'String', '处理结果'],
    ['confirmedBy', 'String', '确认人（关键！未确认不可关闭）'],
    ['closedAt', 'Date', '关闭时间']
  ],
  [2400, 1600, CONTENT_W - 2400 - 1600]
));

c.push(h2('4.3 数据关系图（文字描述）'));
c.push(...p('users (1) ──── (N) projects [作为 managers 中的成员]'));
c.push(...p('projects (1) ──── (N) project_nodes  [10~14 个节点]'));
c.push(...p('projects (1) ──── (N) issues       [问题单可多个]'));
c.push(...p('projects (1) ──── (N) shipments    [发货可分批]'));
c.push(...p('projects (1) ──── (N) site_checkins [每天签到]'));
c.push(...p('projects (1) ──── (N) media_assets [素材分类]'));

c.push(pageBreak());

// ========== 五、核心流程 ==========
c.push(h1('五、核心业务流程设计'));

c.push(h2('5.1 项目主流程状态机（14 状态）'));
c.push(makeTable(
  ['状态', '触发条件', '下一步', '关键负责人'],
  [
    ['待资料收集', '项目新建后默认', '资料齐全 → 待设计', '销售/跟单'],
    ['待设计', '资料确认完成', '设计师领取 → 设计中', '设计部'],
    ['设计中', '设计师开始工作', '提交复核 → 待清单', '设计师'],
    ['待清单', '设计复核通过', '清单确认 → 待采购/备货', '设计部 + 跟单'],
    ['待采购/备货', '清单确认完成', '采购到货 → 待发货', '老板娘'],
    ['待发货', '备货完成', '物流发出 → 待进场', '郭巧英'],
    ['待进场', '货物到达 + 现场具备条件', '签到 → 施工中', '工程部'],
    ['施工中', '工程部到场', '安装完成 → 待调试', '工程部'],
    ['待调试', '安装完成', '调试完成 → 待验收', '工程部 + 设计部'],
    ['待验收', '调试完成', '验收通过 → 待回款', '老板/客户'],
    ['待回款', '验收完成', '尾款到账 → 已完成', '老板娘/郭巧英'],
    ['已完成', '全款到账', '质保期内 → 售后中', '系统自动'],
    ['售后中', '质保期内', '质保到期 → 已关闭', '工程部'],
    ['已关闭', '质保到期', '—', '系统自动']
  ],
  [1600, 3000, 2800, CONTENT_W - 1600 - 3000 - 2800]
));

c.push(h2('5.2 关键流程：工地签到 + 问题反馈'));
c.push(...p('这是第一版体验设计的重中之重，决定一线工人是否愿意使用本系统。'));
c.push(bullet('打开小程序 → 自动展示"我今天的工地任务"。'));
c.push(bullet('点击进入 → 一键签到（GPS 定位 + 现场照片 + 施工条件简单勾选）。'));
c.push(bullet('施工中遇到问题 → 拍照 → 选类型 → 描述 → 一键提交。'));
c.push(bullet('问题自动指派给负责人 + 同步到企微群 → 负责人响应。'));
c.push(bullet('处理完成 → 确认人审核 → 闭环关闭。'));
c.push(...p('体验目标：从打开小程序到完成签到 ≤ 30 秒；从发现问题到提交 ≤ 30 秒。', { bold: true, color: 'C00000' }));

c.push(h2('5.3 关键流程：设计复核'));
c.push(bullet('项目进入"设计中"状态 → 自动生成设计任务卡。'));
c.push(bullet('设计师（杨宇/杨心倩）上传图纸 → 提交复核（无法直接确认完成）。'));
c.push(bullet('毛鑫星收到提醒 → 审阅 → 通过 or 驳回（驳回须填修改意见）。'));
c.push(bullet('通过后 → 进入"待清单"状态。'));
c.push(bullet('整个设计变更过程留痕（变更原因、内容、确认人）。'));

c.push(h2('5.4 关键流程：发货核对'));
c.push(bullet('"待发货"状态 → 郭巧英收到提醒。'));
c.push(bullet('核对清单：型号、数量、配件、电源、控制器、支架、线材逐项打勾。'));
c.push(bullet('上传打包照片 + 物流单号 + 司机电话。'));
c.push(bullet('发货后自动提醒工程负责人 + 客户对接人。'));
c.push(bullet('客户签收后上传签收照片，节点完成。'));

c.push(pageBreak());

// ========== 六、页面清单 ==========
c.push(h1('六、页面清单与原型规划'));

c.push(h2('6.1 小程序页面清单（共 13 个核心页面）'));
c.push(makeTable(
  ['编号', '页面名称', '主要功能', '主要使用角色'],
  [
    ['P01', '首页/看板', '按角色显示：老板看全局，员工看我的任务', '全员'],
    ['P02', '项目列表', '按状态/负责人/类型/超期筛选', '全员'],
    ['P03', '项目详情', 'Tab：基础/节点/文件/问题/发货/回款/素材', '全员'],
    ['P04', '新增项目', '录入客户、金额、付款、负责人', '老板/老板娘/跟单'],
    ['P05', '节点任务页', '查看节点要求、上传资料、提交/确认', '各部门'],
    ['P06', '问题单列表 + 详情', '创建/指派/跟踪/闭环', '全员'],
    ['P07', '发货页', '清单核对、打包照、物流、补退货', '郭巧英'],
    ['P08', '现场签到页', '签到、施工条件、当日计划', '工程部'],
    ['P09', '回款页', '应收/已收/未收/跟进', '老板娘/郭巧英'],
    ['P10', '素材库页', '项目照片视频归档', '严静'],
    ['P11', '报表页', '六类简单统计', '老板/负责人'],
    ['P12', '人员与权限', '管理员设置员工/角色/部门', '管理员'],
    ['P13', '个人中心', '我的任务、消息、退出', '全员']
  ],
  [800, 2000, CONTENT_W - 800 - 2000 - 2400, 2400]
));

c.push(h2('6.2 角色首页差异'));
c.push(makeTable(
  ['角色', '首页核心卡片'],
  [
    ['老板', '8 大看板：进行中/今日待办/超期/未闭环/待发货/待验收/待回款金额/人员责任'],
    ['老板娘', '采购待办、待回款金额、超期未收款项目'],
    ['郭巧英', '待发货项目、待补货、待回款跟进'],
    ['毛鑫星', '待复核设计、设计部成员任务、超期任务'],
    ['设计师', '我的设计任务、待提交、被驳回'],
    ['郑豪', '今日工地任务、待派工、未闭环问题'],
    ['施工人员', '今日工地任务、待签到、未完成节点'],
    ['严静', '可拍项目、待整理素材、可发布素材']
  ],
  [1600, CONTENT_W - 1600]
));

c.push(pageBreak());

// ========== 七、提醒机制 ==========
c.push(h1('七、提醒机制设计'));
c.push(makeTable(
  ['场景', '触发规则', '通知方式', '接收人'],
  [
    ['设计任务超期', '过设定完成时间 → 立即提醒', '订阅消息 + 企微群', '设计负责人 + 老板'],
    ['发货未更新', '清单确认后 24h 未更新 → 提醒', '订阅消息', '郭巧英'],
    ['施工未签到', '当天有任务但 10:00 前未签到 → 提醒', '订阅消息 + 企微群', '工程负责人 + 施工'],
    ['问题单超期', '过 24h 未处理 → 提醒', '订阅消息 + 企微群', '责任人 + 负责人 + 老板'],
    ['完工未验收', '施工完成 72h 后未验收 → 提醒', '订阅消息', '工程负责人'],
    ['验收未回款', '验收 N 天后未回款 → 提醒', '订阅消息 + 企微群', '老板娘 + 郭巧英'],
    ['完工素材整理', '项目完工 → 提醒整理案例', '订阅消息', '严静']
  ],
  [1800, 3200, 2200, CONTENT_W - 1800 - 3200 - 2200]
));

c.push(pageBreak());

// ========== 八、实施计划 ==========
c.push(h1('八、实施计划'));
c.push(h2('8.1 整体里程碑'));
c.push(makeTable(
  ['阶段', '内容', '工期', '关键产出', '负责人'],
  [
    ['阶段0：准备', '注册小程序、开通 CloudBase、定 logo', '2 天', '账号、环境、logo', '老板/项目组'],
    ['阶段1：原型设计', '12 个页面原型、数据建模', '5 天', '原型 + ER 图（评审签字）', '项目组'],
    ['阶段2：MVP 开发', '必做功能全部交付内测', '3 周', '可测试小程序', '开发团队'],
    ['阶段3：内部试跑', '10 个真实项目跑通', '2 周', '问题清单 + 优化建议', '一线人员'],
    ['阶段4：第一轮优化', '修复试跑发现问题', '1 周', '优化版上线候选', '开发团队'],
    ['阶段5：全员上线', '正式上线 + 培训', '1 周', '上线公告 + 操作手册', '项目组'],
    ['阶段6：二期规划', '根据数据规划扩展功能', '—', '二期需求文档', '老板/项目组']
  ],
  [1400, 3000, 1000, CONTENT_W - 1400 - 3000 - 1000 - 1600, 1600]
));

c.push(h2('8.2 MVP 开发周排期建议'));
c.push(makeTable(
  ['周次', '开发内容', '里程碑'],
  [
    ['第 1 周', '登录、权限、用户管理、项目 CRUD、项目列表', '基础打通'],
    ['第 2 周', '14 状态节点引擎、节点任务页、图片上传、问题单', '核心流程打通'],
    ['第 3 周', '工地签到、施工进度、发货管理、回款记录', '业务闭环'],
    ['第 4 周', '老板看板、订阅消息、整体联调、内测', '提测']
  ],
  [1400, CONTENT_W - 1400 - 2200, 2200]
));

c.push(h2('8.3 设计资源与模板推荐'));
c.push(makeTable(
  ['类别', '工具/资源', '用途'],
  [
    ['原型设计', '即时设计 / MasterGo / Pixso', '画线框图、高保真'],
    ['UI 模板', 'uView UI 官方示例 + 即时设计模板市场', '套用现成中后台模板'],
    ['图标素材', 'iconfont 阿里图标库', '免费商用图标'],
    ['空状态插画', 'unDraw / 即梦 AI', '空数据页插画'],
    ['Logo 设计', '即梦 AI / Midjourney', '公司 logo / 应用图标'],
    ['AI 编程', 'CodeBuddy / Cursor / Trae', '代码生成、调试、重构'],
    ['v0.dev', 'v0.dev / Bolt.new', '管理后台原型快速生成']
  ],
  [1600, 2800, CONTENT_W - 1600 - 2800]
));

c.push(pageBreak());

// ========== 九、风险与对策 ==========
c.push(h1('九、风险识别与应对'));
c.push(makeTable(
  ['风险等级', '风险描述', '可能影响', '应对策略'],
  [
    [{ text: '高', fill: 'FFC7CE', bold: true, align: AlignmentType.CENTER }, '一线工人不愿意用，沦为登记表', '系统废掉', '强制：节点不在系统完成=未完成；问题不留痕=不追责'],
    [{ text: '高', fill: 'FFC7CE', bold: true, align: AlignmentType.CENTER }, '功能做太多，开发周期失控', '上线遥遥无期', '严格执行 MVP 范围，未列入的功能一律不做'],
    [{ text: '高', fill: 'FFC7CE', bold: true, align: AlignmentType.CENTER }, '老板不看系统数据，员工失去动力', '系统逐渐荒废', '老板承诺：周会只看系统，不看微信群截图'],
    [{ text: '中', fill: 'FFEB9C', bold: true, align: AlignmentType.CENTER }, '开发公司不懂照明业务，做成通用OA', '不符合实际', '开发前必须画原型给一线人员评审'],
    [{ text: '中', fill: 'FFEB9C', bold: true, align: AlignmentType.CENTER }, '工地网络差，照片上传失败', '签到困难', '客户端做断点续传 + 离线缓存'],
    [{ text: '中', fill: 'FFEB9C', bold: true, align: AlignmentType.CENTER }, '订阅消息授权率低', '提醒到达率低', '关键节点设计"自然引导授权"流程'],
    [{ text: '低', fill: 'C6EFCE', bold: true, align: AlignmentType.CENTER }, 'CloudBase 费用超预算', '成本上升', '设置每日告警，照片自动压缩控制存储'],
    [{ text: '低', fill: 'C6EFCE', bold: true, align: AlignmentType.CENTER }, '开发公司跑路', '源码丢失', '合同写明源码归属 + 每两周代码交付一次']
  ],
  [1200, 3000, 2200, CONTENT_W - 1200 - 3000 - 2200]
));

c.push(pageBreak());

// ========== 十、配套管理规则 ==========
c.push(h1('十、上线后的配套管理规则'));
c.push(...p('系统能不能用起来，关键不在开发，而在管理。建议上线时同步发布以下规则（写入员工手册）：'));
c.push(bullet('凡是工地问题，没有在系统里留痕的，后期不作为责任判定依据。'));
c.push(bullet('项目节点没有在系统里完成，不算项目完成。'));
c.push(bullet('发货、补货、退货必须上传照片和记录，否则不作为结算依据。'));
c.push(bullet('施工人员到场 30 分钟内必须完成签到和现场条件上传。'));
c.push(bullet('每周一管理会以系统数据为准，不再靠口头回忆。'));
c.push(bullet('系统第一月只抓使用习惯，不追求功能完美；先让所有人用起来。'));

c.push(spacer());
c.push(...p('—— 文档完 ——', { align: AlignmentType.CENTER, color: '7F7F7F', italics: true }));

// ========== 评审意见栏 ==========
c.push(pageBreak());
c.push(h1('附录：评审意见栏'));
c.push(...p('请各位评审人在下方填写意见，并在最后签字确认。'));
c.push(makeTable(
  ['评审人', '角色', '评审意见', '签字 / 日期'],
  [
    ['李辉煌', '老板', '', ''],
    ['易阳丽', '老板娘', '', ''],
    ['郭巧英', '跟单/财务', '', ''],
    ['毛鑫星', '设计部', '', ''],
    ['郑豪', '工程部', '', ''],
    ['严静', '新媒体部', '', '']
  ],
  [1400, 1600, CONTENT_W - 1400 - 1600 - 2400, 2400]
));

c.push(spacer());
c.push(...p('最终决议：☐ 通过  ☐ 修改后通过  ☐ 不通过', { size: 24, bold: true }));
c.push(...p('决策人签字：李辉煌                                日期：______________', { size: 22 }));

// ========== Document ==========
const doc = new Document({
  creator: '黑玛照明项目组',
  title: '黑玛项目管家-项目方案评审文档',
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: FONT, color: '1F3864' },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: '2F5496' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: '4472C4' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: '\u2022',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: '黑玛项目管家 · 项目方案评审文档 V1.0', font: FONT, size: 18, color: '7F7F7F' })]
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
    children: c
  }]
});

const outPath = path.join(process.env.USERPROFILE, 'Desktop', '黑玛项目管家_项目方案评审文档_V1.0.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('OK:', outPath);
}).catch(e => { console.error(e); process.exit(1); });
