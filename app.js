const app = document.querySelector("#app");
const railButtons = [...document.querySelectorAll(".rail-dot")];
const sections = [...document.querySelectorAll(".snap-section")];
const photoCards = [...document.querySelectorAll(".photo-card")];
const carouselPrev = document.querySelector(".carousel-btn.prev");
const carouselNext = document.querySelector(".carousel-btn.next");
const routeWorlds = Object.fromEntries(
  [...document.querySelectorAll(".route-world")].map((world) => [world.dataset.route, world]),
);

let photoIndex = 0;
let activeRoute = null;
let routeIndex = 0;
let routeWheelLock = false;

const photoStates = ["active", "next", "far", "prev"];

const routes = {
  product: {
    rail: "product",
    pages: [
      {
        eyebrow: "PRODUCT ROUTE / 01",
        title: "产品能力总览",
        sub: "从调研、MVP 到产品测试",
        body: "百度自然语言处理部产品运营经历，叠加数字媒体技术和智能传播背景，让我能把用户问题、产品流程和内容表达放在同一张图里看。",
        stair: "right-bottom",
      },
      {
        eyebrow: "PRODUCT ROUTE / 02",
        title: "市场调研",
        sub: "用竞品和数据找到产品机会",
        body: "在百度对4家竞品公司进行市场调研，总结营销策略和人工翻译付费方案，参与优化专家翻译付费方案，环比销量增加近75%。",
        stair: "left-top",
      },
      {
        eyebrow: "PRODUCT ROUTE / 03",
        title: "MVP 与 SOP",
        sub: "让想法可以跑通流程",
        body: "协助产品经理完成 MVP 交互设计开发，跑通工作流程，并完成 SOP 文档撰写，把功能想法转化为可执行步骤。",
        stair: "right-bottom",
      },
      {
        eyebrow: "PRODUCT ROUTE / 04",
        title: "产品测试",
        sub: "组织真实用户反馈",
        body: "在公司内独立组织产品测试，触及人群700+，同时对企业客户、译员和用户持续沟通，跟进困惑和反馈。",
        stair: "left-top",
      },
      {
        eyebrow: "PRODUCT ROUTE / 05",
        title: "事实核查平台",
        sub: "独立开发 AI 产品原型",
        body: "独立开发“jayaa假牙事实核查平台”，基于 Google Reverse Image Search 和 Gemini 多模态能力，提供事实核查、报告产出、案例展示和深度伪造识别手册。",
        stair: "right-bottom",
      },
      {
        eyebrow: "PRODUCT ROUTE / 06",
        title: "产品方向总结",
        sub: "技术、内容和用户意识的交叉点",
        body: "我的产品路径不是单纯画原型，而是从调研、交互、AI 工具、内容说明和测试反馈一起推进，适合需要复合表达能力的产品岗位。",
        stair: "platform",
      },
    ],
  },
  content: {
    rail: "content",
    pages: [
      {
        eyebrow: "CONTENT LIFT / 01",
        title: "内容能力总览",
        sub: "从省级媒体到校园融媒体",
        body: "内蒙古日报实习记者、北京语言大学党委宣传部新闻中心学生主任兼助管经历，让我同时做过采访、拍摄、文案、平台运营和视觉物料。",
      },
      {
        eyebrow: "CONTENT LIFT / 02",
        title: "采访与发布",
        sub: "在真实媒体平台完成内容生产",
        body: "在内蒙古日报社实习期间完成采访、拍摄、视频制作、文案撰写，在省级媒体平台发布30+作品。",
      },
      {
        eyebrow: "CONTENT LIFT / 03",
        title: "融媒体运营",
        sub: "运营两微一抖，做增长和内容节奏",
        body: "主管融媒体设计部门，运营学校官方抖音、微博、微信公众号、视频号；运营期间微博粉丝量同比增长120%。",
      },
      {
        eyebrow: "CONTENT LIFT / 04",
        title: "视频与视觉",
        sub: "把内容做成能被看见的视觉产品",
        body: "制作海报、视频、推送，完成脚本撰写、拍摄剪辑等工作；抖音平台制作发布23条视频，累计播放量破千万。",
      },
      {
        eyebrow: "CONTENT LIFT / 05",
        title: "话题策划",
        sub: "让校园内容走出校园",
        body: "与其他高校共同打造多次话题，累计播放破亿；世界文化节话题荣登热搜第三，并协同对接新华社、新京报、中国教育网等社会媒体。",
      },
      {
        eyebrow: "CONTENT LIFT / 06",
        title: "内容方向总结",
        sub: "我能从选题做到发布，也能从视觉做到复盘",
        body: "谢谢你看完这些仍在进化的内容作品。后续这里会接入视频、图文、海报和其他视觉产品的真实截图。",
        celebrate: true,
      },
    ],
  },
  strategy: {
    rail: "strategy",
    pages: [
      {
        eyebrow: "CLIMBING ROUTE / 01",
        title: "策划能力总览",
        sub: "从活动现场到传播机制",
        body: "我做过主持人大赛、校庆晚会、校园赛事和公益活动，也参与过融媒体话题策划，策划能力来自真实现场和真实执行。",
      },
      {
        eyebrow: "CLIMBING ROUTE / 02",
        title: "活动策划",
        sub: "把人、流程和现场组织起来",
        body: "组织策划北京语言大学第五届中外学生主持人大赛，邀请中传教授、原深圳卫视主持人到场担任评委。",
      },
      {
        eyebrow: "CLIMBING ROUTE / 03",
        title: "大型晚会统筹",
        sub: "在复杂现场里保持节奏",
        body: "作为北京语言大学六十周年校庆晚会导演组成员，负责宣传物料审核、暖场视频和线上宣传视频制作，并现场统筹大小屏、舞台监督、灯光音响等舞美部门。",
      },
      {
        eyebrow: "CLIMBING ROUTE / 04",
        title: "赛事与赞助",
        sub: "把想法落到资源和执行",
        body: "近期完成校园匹克球赛的组织与举办，并拉取厂商提供约6000元赞助，体现活动策划、资源沟通和落地执行能力。",
      },
      {
        eyebrow: "CLIMBING ROUTE / 05",
        title: "公益与组织",
        sub: "在长期项目中承担负责人角色",
        body: "曾任北京益公公益基金会青励公益北京工作站站长，组织叁宿电影院系列活动，累计志愿200h+。",
      },
      {
        eyebrow: "CLIMBING ROUTE / 06",
        title: "策划方向总结",
        sub: "阳光万里，回看一路攀登",
        body: "我的策划经验不是只写方案，而是在现场、物料、传播和资源中不断协调，最终让活动真的发生。",
        summit: true,
      },
    ],
  },
  surprise: {
    rail: "surprise",
    pages: [
      {
        eyebrow: "GEEK ROUTE / 01",
        title: "其他惊喜总览",
        sub: "一辆持续前进的技能货车",
        body: "这里收集那些不完全属于产品、内容、策划，但能证明学习速度、工具意识、技术底子和现场补位能力的经历。",
        lane: 0,
      },
      {
        eyebrow: "GEEK ROUTE / 02",
        title: "AI 工具",
        sub: "把工具变成真实生产力",
        body: "熟练掌握 AI 工作流搭建、Prompt 提示词工程、Stable Diffusion 等 AI 绘画工具，并能进行部分大模型本地化部署。",
        lane: -118,
      },
      {
        eyebrow: "GEEK ROUTE / 03",
        title: "编程与原型",
        sub: "能把想法做成可运行的 MVP",
        body: "掌握 Python、C/C++、HTML、SQL，熟练使用 Figma 原型设计，可自主开发以原型设计和 vibe-coding 支持的 MVP。",
        lane: 0,
      },
      {
        eyebrow: "GEEK ROUTE / 04",
        title: "竞赛科研",
        sub: "从数据爬取到调查报告",
        body: "挑战杯项目负责人，组织国内外欺骗性信息辟谣新闻的上万级别批量数据爬取、内容编码、数据分析和调查报告撰写。",
        lane: 118,
      },
      {
        eyebrow: "GEEK ROUTE / 05",
        title: "桌游与小红书",
        sub: "把兴趣做成内容和产品参与",
        body: "曾于桌游出版社兼职，完成上百条小红书内容制作，并参与5款桌游的设计、编辑、校对和翻译工作。",
        lane: 0,
      },
      {
        eyebrow: "GEEK ROUTE / 06",
        title: "主持与表达",
        sub: "把台前表达带入协作现场",
        body: "主持校内外活动20余场，近期受邀作为世界智能产业博览会 BoHack 黑客松决赛现场主持人；表达、临场和组织能力可以迁移到业务沟通中。",
        lane: -118,
      },
    ],
  },
};

function setPhoto(index) {
  photoIndex = (index + photoCards.length) % photoCards.length;
  photoCards.forEach((card, i) => {
    card.classList.remove(...photoStates);
    const relative = (i - photoIndex + photoCards.length) % photoCards.length;
    card.classList.add(photoStates[relative] || "far");
  });
}

function syncRail(id) {
  railButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === id);
  });
}

function scrollToId(id) {
  const target = document.querySelector(`#${id}`);
  if (!target) return;
  activeRoute = routeWorlds[id]?.classList.contains("active") ? id : null;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  syncRail(id);
}

function renderRouteNav(routeName) {
  const world = routeWorlds[routeName];
  const nav = world.querySelector(".route-page-nav");
  nav.replaceChildren(
    ...routes[routeName].pages.map((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(index + 1).padStart(2, "0");
      button.classList.toggle("active", index === routeIndex);
      button.addEventListener("click", () => setRoutePage(routeName, index));
      return button;
    }),
  );
}

function setProductState(world, page) {
  const copy = world.querySelector(".route-copy");
  world.style.setProperty("--step", routeIndex);
  copy.classList.remove("right");
  copy.classList.toggle("low", page.stair === "platform");
  world.classList.toggle("at-summit", page.stair === "platform");
  window.updateProductScene?.(routeIndex);
}

function setContentState(world, page) {
  world.classList.remove("open");
  world.classList.remove("moving");
  void world.offsetWidth;
  world.classList.add("moving");
  world.classList.toggle("celebrate", Boolean(page.celebrate));
  world.style.setProperty("--route-step", routeIndex);
  world.querySelector(".elevator-floor").textContent = `${String(routeIndex + 1).padStart(2, "0")}F`;
  world.querySelector(".elevator-work-title").textContent = page.title;
  window.setTimeout(() => world.classList.add("open"), 260);
}

function setStrategyState(world, page) {
  world.classList.toggle("summit", Boolean(page.summit));
  world.style.setProperty("--route-step", routeIndex);
}


function setSurpriseState(world, page) {
  world.style.setProperty("--route-step", routeIndex);
  world.style.setProperty("--truck-x", `${page.lane ?? 0}px`);
  window.updateSurpriseScene?.({
    page: routeIndex,
    lane: Math.round((page.lane ?? 0) / 118),
  });
}

function setRoutePage(routeName, index) {
  const route = routes[routeName];
  const world = routeWorlds[routeName];
  routeIndex = Math.max(0, Math.min(route.pages.length - 1, index));
  const page = route.pages[routeIndex];
  const copy = world.querySelector(".route-copy");

  copy.animate(
    [
      { opacity: 0.35, transform: "translateY(16px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  copy.innerHTML = `
    <p class="kicker">${page.eyebrow}</p>
    <h2>${page.title}</h2>
    <h3>${page.sub}</h3>
    <p>${page.body}</p>
  `;

  if (routeName === "product") setProductState(world, page);
  if (routeName === "content") setContentState(world, page);
  if (routeName === "strategy") setStrategyState(world, page);
  if (routeName === "surprise") setSurpriseState(world, page);

  renderRouteNav(routeName);
  syncRail(route.rail);
}

function enterRoute(routeName) {
  Object.values(routeWorlds).forEach((world) => world.classList.remove("active", "open", "celebrate", "summit"));
  const world = routeWorlds[routeName];
  activeRoute = routeName;
  routeIndex = 0;
  world.classList.add("active");
  setRoutePage(routeName, 0);
  window.setTimeout(() => scrollToId(routeName), 30);
}

function leaveRoute() {
  activeRoute = null;
  scrollToId("gateway");
}

carouselPrev.addEventListener("click", () => setPhoto(photoIndex - 1));
carouselNext.addEventListener("click", () => setPhoto(photoIndex + 1));

railButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    if (routes[target]) enterRoute(target);
    else scrollToId(target);
  });
});

document.querySelectorAll(".site-header [data-target], .hero-scroll[data-target]").forEach((button) => {
  button.addEventListener("click", () => scrollToId(button.dataset.target));
});

document.querySelectorAll("[data-route]").forEach((button) => {
  if (button.classList.contains("route-world")) return;
  button.addEventListener("click", () => enterRoute(button.dataset.route));
});


Object.entries(routeWorlds).forEach(([routeName, world]) => {
  world.querySelector(".back-gateway").addEventListener("click", leaveRoute);
  world.querySelector(".prev-page").addEventListener("click", () => setRoutePage(routeName, routeIndex - 1));
  world.querySelector(".next-page").addEventListener("click", () => setRoutePage(routeName, routeIndex + 1));
  renderRouteNav(routeName);
});

app.addEventListener(
  "wheel",
  (event) => {
    if (!activeRoute) return;
    event.preventDefault();
    if (routeWheelLock) return;
    routeWheelLock = true;
    setRoutePage(activeRoute, routeIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => {
      routeWheelLock = false;
    }, 780);
  },
  { passive: false },
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible || activeRoute) return;
    syncRail(visible.target.id);
  },
  { root: app, threshold: [0.56, 0.72] },
);

sections.forEach((section) => observer.observe(section));

window.addEventListener("keydown", (event) => {
  if (!activeRoute) return;
  if (event.key === "ArrowDown" || event.key === "PageDown") setRoutePage(activeRoute, routeIndex + 1);
  if (event.key === "ArrowUp" || event.key === "PageUp") setRoutePage(activeRoute, routeIndex - 1);
  if (event.key === "Escape") leaveRoute();
});

setPhoto(0);
