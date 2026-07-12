import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = "E:/study/研究生/赵蓓老师/portfolio-elevator/作品集网页需求对接PRD.pptx";
const WORK = "C:/Users/vick/AppData/Local/Temp/codex-presentations/manual-portfolio-prd/elevator-portfolio-prd/tmp";
const PREVIEW_DIR = `${WORK}/preview`;
const QA_DIR = `${WORK}/qa`;
const W = 1280;
const H = 720;
const C = {
  bg: "#050506",
  panel: "#111216",
  text: "#F4F1E8",
  muted: "#A9A39A",
  dim: "#69645D",
  gold: "#D7B56D",
  line: "#393A3E",
  green: "#7CF3B2",
};

const slidesMeta = [
  "进入页",
  "项目目标与评审范围",
  "导览行与信息架构",
  "总体设计：空间、动线、节奏",
  "核心交互流程",
  "分板块：产品",
  "分板块：内容",
  "分板块：策划",
  "分板块：其他惊喜",
  "返回、切换与状态 icon",
  "尾部结尾设计",
  "下一步待确认",
];

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addText(slide, text, x, y, w, h, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: style.fontSize ?? 18,
    color: style.color ?? C.text,
    bold: style.bold ?? false,
    alignment: style.alignment ?? "left",
  };
  return shape;
}

function addBox(slide, x, y, w, h, fill, line = C.line) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: "rounded-md",
  });
}

function addFooter(slide, index) {
  addText(slide, "Elevator Portfolio PRD", 64, 670, 280, 24, { fontSize: 13, color: C.dim });
  addText(slide, String(index + 1).padStart(2, "0"), 1160, 670, 56, 24, {
    fontSize: 13,
    color: C.gold,
    alignment: "right",
    bold: true,
  });
}

function addHeader(slide, index, title) {
  addText(slide, slidesMeta[index], 64, 42, 360, 24, { fontSize: 14, color: C.gold, bold: true });
  addText(slide, title, 64, 74, 960, 54, { fontSize: 38, color: C.text, bold: true });
  addFooter(slide, index);
}

function addPill(slide, label, x, y, w, active = false) {
  addBox(slide, x, y, w, 34, active ? "#2A2416" : "#121316", active ? C.gold : C.line);
  addText(slide, label, x + 12, y + 7, w - 24, 20, {
    fontSize: 15,
    color: active ? C.gold : C.muted,
    alignment: "center",
    bold: active,
  });
}

function addNavRail(slide, active = 0) {
  ["产品", "内容", "策划", "惊喜"].forEach((label, i) => {
    const y = 214 + i * 70;
    addBox(slide, 1168, y, 52, 52, i === active ? "#2A2416" : "#0B0C0E", i === active ? C.gold : C.line);
    addText(slide, String(i + 1).padStart(2, "0"), 1177, y + 7, 34, 18, {
      fontSize: 13,
      color: C.gold,
      alignment: "center",
      bold: true,
    });
    addText(slide, label, 1177, y + 27, 34, 18, { fontSize: 13, color: C.text, alignment: "center" });
  });
}

function addElevatorMock(slide, x, y, w, h, floor = "01F", label = "产品") {
  addBox(slide, x, y, w, h, "#08090B", "#282A2E");
  addBox(slide, x + 26, y + 28, w - 52, h - 56, "#1D1F24", "#494B50");
  addBox(slide, x + 48, y + 54, w - 96, 44, "#070808", "#24262A");
  addText(slide, floor, x + 68, y + 65, 70, 20, { fontSize: 16, color: C.gold, bold: true });
  addText(slide, "UP", x + w - 132, y + 65, 58, 20, { fontSize: 16, color: C.green, alignment: "right", bold: true });
  addBox(slide, x + 48, y + 118, (w - 96) / 2, h - 218, "#40434A", "#5E6168");
  addBox(slide, x + 48 + (w - 96) / 2, y + 118, (w - 96) / 2, h - 218, "#34373E", "#5E6168");
  addBox(slide, x + 80, y + 160, w - 160, 150, "#0F1214", "#3E3420");
  addText(slide, label, x + 96, y + 194, w - 192, 58, { fontSize: 42, color: C.gold, alignment: "center", bold: true });
  addText(slide, "作品图片 / 过程证据 / 核心能力", x + 96, y + 256, w - 192, 28, {
    fontSize: 16,
    color: C.muted,
    alignment: "center",
  });
  addText(slide, "SAFE ASCENT", x + 64, y + h - 78, 130, 20, { fontSize: 12, color: C.dim });
}

function addSectionCard(slide, x, y, w, h, title, points) {
  addBox(slide, x, y, w, h, C.panel, "#33353A");
  addText(slide, title, x + 24, y + 22, w - 48, 30, { fontSize: 24, color: C.gold, bold: true });
  points.forEach((point, i) => {
    addText(slide, "• " + point, x + 24, y + 70 + i * 36, w - 48, 26, { fontSize: 18, color: C.text });
  });
}

function addIconSpec(slide, x, y, icon, title, desc) {
  addBox(slide, x, y, 92, 92, "#101113", "#3D3F44");
  addText(slide, icon, x + 18, y + 16, 56, 48, { fontSize: 34, color: C.gold, alignment: "center", bold: true });
  addText(slide, title, x + 112, y + 8, 220, 26, { fontSize: 22, color: C.text, bold: true });
  addText(slide, desc, x + 112, y + 42, 250, 46, { fontSize: 16, color: C.muted });
}

const presentation = Presentation.create({ slideSize: { width: W, height: H } });
function newSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  return slide;
}

{
  const slide = newSlide();
  addText(slide, "PORTFOLIO WEB PRD", 64, 54, 320, 28, { fontSize: 15, color: C.gold, bold: true });
  addText(slide, "上升履历", 64, 132, 420, 72, { fontSize: 58, color: C.text, bold: true });
  addText(slide, "电梯式交互作品集", 64, 214, 690, 68, { fontSize: 48, color: C.text, bold: true });
  addText(
    slide,
    "用于对接产品经理、品牌策略、新媒体运营三个求职方向的网页与 PPT 需求文档。核心隐喻：楼梯 / 电梯 / 攀岩，表达稳步上升、主动探索与持续抵达。",
    68,
    322,
    620,
    96,
    { fontSize: 22, color: C.muted },
  );
  addElevatorMock(slide, 830, 72, 330, 560, "00F", "进入");
  addPill(slide, "产品", 68, 478, 96, true);
  addPill(slide, "内容", 178, 478, 96);
  addPill(slide, "策划", 288, 478, 96);
  addPill(slide, "其他惊喜", 398, 478, 136);
  addFooter(slide, 0);
}

{
  const slide = newSlide();
  addHeader(slide, 1, "项目目标与评审范围");
  addSectionCard(slide, 64, 164, 360, 356, "目标用户", ["产品经理面试官", "品牌策略 / 市场策划面试官", "新媒体运营与内容团队负责人", "快速浏览作品集的 HR"]);
  addSectionCard(slide, 460, 164, 360, 356, "页面目标", ["3 分钟内理解求职方向与能力结构", "点击任意楼层能看见代表作品", "用交互记忆点降低作品集同质化", "留下可继续追问的项目证据"]);
  addSectionCard(slide, 856, 164, 300, 356, "本轮范围", ["进入页", "导览行", "四个分板块", "尾部结尾", "返回 / 切换 icon"]);
}

{
  const slide = newSlide();
  addHeader(slide, 2, "导览行与信息架构");
  addText(slide, "全局导览固定在右侧：默认窄态显示楼层与能力核心，悬浮时出现毛玻璃预览卡，点击后跳转对应楼层。", 64, 140, 850, 58, { fontSize: 21, color: C.muted });
  [
    ["01F 产品", "需求洞察 / 用户路径 / 原型表达", "适配产品经理岗位"],
    ["02F 内容", "选题策划 / 内容编辑 / 传播复盘", "适配新媒体运营岗位"],
    ["03F 策划", "品牌策略 / 活动机制 / 落地节奏", "适配品牌策略岗位"],
    ["04F 惊喜", "跨界学习 / 工具能力 / 体验审美", "增强记忆点"],
  ].forEach((col, i) => {
    const x = 64 + i * 274;
    addBox(slide, x, 248, 238, 270, "#101113", i === 0 ? C.gold : "#33353A");
    addText(slide, col[0], x + 22, 272, 190, 32, { fontSize: 25, color: C.gold, bold: true });
    addText(slide, col[1], x + 22, 328, 190, 78, { fontSize: 20, color: C.text });
    addText(slide, col[2], x + 22, 438, 190, 46, { fontSize: 16, color: C.muted });
  });
  addNavRail(slide, 0);
}

{
  const slide = newSlide();
  addHeader(slide, 3, "总体设计：空间、动线、节奏");
  addBox(slide, 64, 158, 438, 396, "#090A0B", "#33353A");
  addElevatorMock(slide, 116, 184, 300, 342, "01F", "产品");
  addBox(slide, 536, 158, 560, 396, "#111216", "#33353A");
  addText(slide, "右侧内容区", 576, 192, 260, 40, { fontSize: 32, color: C.text, bold: true });
  addText(slide, "每一屏承载一个主要能力主题：标题、项目一句话、过程证据、作品入口。文字不堆满，让电梯打开后的图片与证据成为记忆点。", 576, 260, 430, 108, { fontSize: 20, color: C.muted });
  addPill(slide, "左侧电梯 40%", 576, 416, 150, true);
  addPill(slide, "右侧叙事 60%", 742, 416, 150);
  addPill(slide, "右边缘楼层导览", 908, 416, 174);
  addNavRail(slide, 0);
}

{
  const slide = newSlide();
  addHeader(slide, 4, "核心交互流程");
  [
    ["1", "滚轮上滑", "页面向上翻页，电梯同步上升，两侧出现轻微运动模糊。"],
    ["2", "抵达楼层", "电梯停稳，楼层数字更新，门自动打开。"],
    ["3", "展示作品", "电梯内部出现作品图片、过程截图或代表成果。"],
    ["4", "悬浮导览", "屏幕毛玻璃化，弹出当前楼层梗概与核心能力。"],
    ["5", "点击跳转", "导览点击后快速定位，同时保持楼层状态一致。"],
  ].forEach((step, i) => {
    const x = 78 + i * 224;
    addBox(slide, x, 208, 178, 252, "#101113", i === 0 ? C.gold : "#33353A");
    addText(slide, step[0], x + 22, 226, 44, 44, { fontSize: 38, color: C.gold, bold: true });
    addText(slide, step[1], x + 22, 292, 130, 30, { fontSize: 24, color: C.text, bold: true });
    addText(slide, step[2], x + 22, 346, 132, 84, { fontSize: 16, color: C.muted });
  });
}

[
  ["产品", "产品经理方向", "把问题变成可执行的路径", ["项目背景与用户痛点", "需求拆解与优先级", "用户旅程 / 原型 / PRD", "结果、复盘与可追问证据"], ["需求洞察", "结构化表达", "推动落地"]],
  ["内容", "新媒体运营方向", "让信息被看见、被理解、被记住", ["账号定位与用户画像", "选题池与栏目规划", "图文 / 视频脚本 / 视觉稿", "数据复盘与下一轮优化"], ["选题策划", "内容生产", "传播复盘"]],
  ["策划", "品牌策略方向", "把品牌意图转化为行动方案", ["品牌目标与市场洞察", "核心策略与传播主张", "活动机制与触点设计", "执行节奏与风险预案"], ["品牌理解", "活动设计", "项目统筹"]],
  ["其他惊喜", "复合能力展示", "让面试官停一下的额外证据", ["跨学科项目与快速学习", "AI / 数据 / 工具使用能力", "个人创作与审美判断", "可现场演示的小交互"], ["学习速度", "工具意识", "体验审美"]],
].forEach((info, i) => {
  const slide = newSlide();
  addHeader(slide, 5 + i, `分板块：${info[0]}`);
  addElevatorMock(slide, 64, 156, 340, 426, `${String(i + 1).padStart(2, "0")}F`, info[0]);
  addText(slide, info[1], 462, 158, 300, 28, { fontSize: 18, color: C.gold, bold: true });
  addText(slide, info[2], 462, 198, 600, 76, { fontSize: 35, color: C.text, bold: true });
  addSectionCard(slide, 462, 318, 330, 220, "内容模块", info[3]);
  addSectionCard(slide, 826, 318, 270, 220, "核心能力", info[4]);
  addNavRail(slide, i);
});

{
  const slide = newSlide();
  addHeader(slide, 9, "返回、切换与状态 icon");
  addText(slide, "Icon 采用极简线性风格：暖金为可操作状态，灰白为普通状态，绿色只用于“安全到达 / 可继续浏览”的系统反馈。", 64, 140, 870, 54, { fontSize: 21, color: C.muted });
  addIconSpec(slide, 78, 238, "←", "返回上一层", "用于作品详情页返回楼层页；可配合 ESC 键。");
  addIconSpec(slide, 468, 238, "↕", "上下切换", "用于楼层间切换；滚轮与键盘方向键共用逻辑。");
  addIconSpec(slide, 858, 238, "☰", "导览展开", "用于移动端或窄屏展开楼层列表。");
  addIconSpec(slide, 78, 402, "□", "作品详情", "点击电梯内图片，进入作品过程与结果说明。");
  addIconSpec(slide, 468, 402, "✓", "已抵达", "电梯停稳、门打开、内容加载完成。");
  addIconSpec(slide, 858, 402, "×", "关闭预览", "关闭毛玻璃导览预览或作品详情层。");
}

{
  const slide = newSlide();
  addHeader(slide, 10, "尾部结尾设计");
  addBox(slide, 86, 170, 470, 380, "#0C0D0F", "#33353A");
  addText(slide, "抵达顶层", 126, 214, 300, 54, { fontSize: 42, color: C.gold, bold: true });
  addText(slide, "尾页不做传统“谢谢观看”，而是像电梯抵达顶层后的开放平台：给出简历下载、联系方式、作品合集入口和三个岗位方向的快速回看。", 126, 298, 340, 126, { fontSize: 20, color: C.muted });
  addPill(slide, "下载简历", 126, 468, 120, true);
  addPill(slide, "联系我", 262, 468, 110);
  addPill(slide, "回到 01F", 388, 468, 120);
  addSectionCard(slide, 620, 184, 430, 316, "尾页元素", ["一句定位：我适合怎样的问题场景", "三条岗位路径：产品 / 品牌 / 新媒体", "作品集下载与在线链接", "返回首页、返回上一层、重新浏览"]);
}

{
  const slide = newSlide();
  addHeader(slide, 11, "下一步待确认");
  addSectionCard(slide, 80, 166, 330, 368, "内容素材", ["每个板块 2-3 个代表项目", "每个项目 3 张以内核心图片", "过程截图、数据结果、复盘文字", "简历 PDF 与联系方式"]);
  addSectionCard(slide, 474, 166, 330, 368, "交互细节", ["电梯开门速度与滚动节奏", "导览悬浮卡的信息密度", "作品详情页是否弹层展示", "移动端是否保留电梯隐喻"]);
  addSectionCard(slide, 868, 166, 330, 368, "视觉确认", ["黑金酒店感的高级程度", "电梯安全感与运动模糊比例", "字体、留白、作品图裁切", "PPT 与网页是否同一套视觉语言"]);
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.mkdir(PREVIEW_DIR, { recursive: true });
await fs.mkdir(QA_DIR, { recursive: true });
for (const [index, slide] of presentation.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(QA_DIR, `${stem}.layout.json`), await layout.text());
}
await writeBlob(path.join(PREVIEW_DIR, "deck-montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
const inspect = await presentation.inspect({ kind: "slide,textbox,shape,layout", maxChars: 12000 });
await fs.writeFile(path.join(QA_DIR, "inspect.ndjson"), inspect.ndjson);
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(OUT);
console.log(OUT);
