const destinations = [
  {
    place: "Switzerland Alps",
    title: "SAINT",
    title2: "ANTONIEN",
    description:
      "Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.",
    image: "https://assets.codepen.io/3685267/timed-cards-1.jpg",
  },
  {
    place: "Japan Alps",
    title: "NAGANO",
    title2: "PREFECTURE",
    description:
      "Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country's best powder.",
    image: "https://assets.codepen.io/3685267/timed-cards-2.jpg",
  },
  {
    place: "Sahara Desert - Morocco",
    title: "MARRAKECH",
    title2: "MERZOUGA",
    description:
      "The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.",
    image: "https://assets.codepen.io/3685267/timed-cards-3.jpg",
  },
  {
    place: "Sierra Nevada - USA",
    title: "YOSEMITE",
    title2: "NATIONAL PARK",
    description:
      "Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.",
    image: "https://assets.codepen.io/3685267/timed-cards-4.jpg",
  },
  {
    place: "Tarifa - Spain",
    title: "LOS LANCES",
    title2: "BEACH",
    description:
      "Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach's long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.",
    image: "https://assets.codepen.io/3685267/timed-cards-5.jpg",
  },
  {
    place: "Cappadocia - Turkey",
    title: "GÖREME",
    title2: "VALLEY",
    description:
      "Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.",
    image: "https://assets.codepen.io/3685267/timed-cards-6.jpg",
  },
];

const byId = (id) => document.getElementById(id);
const cardStage = byId("card-stage");
const slideNumbers = byId("slide-numbers");
const progressTrackBackground = document.querySelector(
  ".progress-track-background"
);

const cardsMarkup = destinations
  .map(
    (item, index) => `
    <article class="slideshow-card" id="card${index}">
      <img class="slideshow-card-media" src="${item.image}" alt="${item.place}" loading="lazy" />
    </article>`
  )
  .join("");

const cardContentMarkup = destinations
  .map(
    (item, index) => `
    <div class="card-content" id="card-content-${index}">
      <div class="content-start"></div>
      <div class="content-place">${item.place}</div>
      <div class="content-title-1">${item.title}</div>
      <div class="content-title-2">${item.title2}</div>
    </div>`
  )
  .join("");

cardStage.innerHTML = `${cardsMarkup}${cardContentMarkup}`;

const slideNumberMarkup = destinations
  .map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`)
  .join("");
slideNumbers.innerHTML = slideNumberMarkup;

const ease = "sine.inOut";
let order = destinations.map((_, index) => index);
let detailsEven = true;
let offsetTop = 200;
let offsetLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 40;
let numberSize = 50;

const getTrackWidth = () => progressTrackBackground?.offsetWidth ?? 500;
const getCard = (index) => `#card${index}`;
const getCardContent = (index) => `#card-content-${index}`;
const getSliderItem = (index) => `#slide-item-${index}`;

const updateDetailsPanel = (selector, content) => {
  const root = document.querySelector(selector);
  if (!root) return;

  root.querySelector(".location-text").textContent = content.place;
  root.querySelector(".title-line--primary").textContent = content.title;
  root.querySelector(".title-line--secondary").textContent = content.title2;
  root.querySelector(".description").textContent = content.description;
};

const setInitialDetails = () => {
  updateDetailsPanel("#details-even", destinations[0]);
  updateDetailsPanel("#details-odd", destinations[1] ?? destinations[0]);
};

const animate = (target, duration, properties) =>
  new Promise((resolve) => {
    gsap.to(target, {
      ...properties,
      duration,
      onComplete: resolve,
    });
  });

const init = () => {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;

  offsetTop = height - 430;
  offsetLeft = width - 830;

  gsap.set("#pagination", {
    top: offsetTop + 330,
    left: offsetLeft,
    y: 200,
    opacity: 0,
    zIndex: 60,
  });

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .location-text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-line--primary`, { y: 100 });
  gsap.set(`${detailsInactive} .title-line--secondary`, { y: 100 });
  gsap.set(`${detailsInactive} .description`, { y: 50 });
  gsap.set(`${detailsInactive} .action-row`, { y: 60 });

  gsap.set(".progress-fill", {
    width: (getTrackWidth() / order.length) * (active + 1),
  });

  rest.forEach((index, position) => {
    const xBase = offsetLeft + 400 + position * (cardWidth + gap);

    gsap.set(getCard(index), {
      x: xBase,
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });

    gsap.set(getCardContent(index), {
      x: xBase,
      zIndex: 40,
      y: offsetTop + cardHeight - 100,
    });

    gsap.set(getSliderItem(index), { x: (position + 1) * numberSize });
  });

  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.6;

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => loop(), 500);
    },
  });

  rest.forEach((index, position) => {
    const xTarget = offsetLeft + position * (cardWidth + gap);

    gsap.to(getCard(index), {
      x: xTarget,
      zIndex: 30,
      ease,
      delay: startDelay + 0.05 * position,
    });

    gsap.to(getCardContent(index), {
      x: xTarget,
      zIndex: 40,
      ease,
      delay: startDelay + 0.05 * position,
    });
  });

  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
};

const step = () =>
  new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    updateDetailsPanel(detailsActive, destinations[order[0]]);

    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });

    gsap.to(`${detailsActive} .location-text`, {
      y: 0,
      delay: 0.1,
      duration: 0.7,
      ease,
    });

    gsap.to(`${detailsActive} .title-line--primary`, {
      y: 0,
      delay: 0.15,
      duration: 0.7,
      ease,
    });

    gsap.to(`${detailsActive} .title-line--secondary`, {
      y: 0,
      delay: 0.15,
      duration: 0.7,
      ease,
    });

    gsap.to(`${detailsActive} .description`, {
      y: 0,
      delay: 0.3,
      duration: 0.4,
      ease,
    });

    gsap.to(`${detailsActive} .action-row`, {
      y: 0,
      delay: 0.35,
      duration: 0.4,
      ease,
      onComplete: resolve,
    });

    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const previous = rest[rest.length - 1];

    gsap.set(getCard(previous), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    gsap.to(getCard(previous), { scale: 1.5, ease });

    gsap.to(getCardContent(active), {
      y: offsetTop + cardHeight - 10,
      opacity: 0,
      duration: 0.3,
      ease,
    });

    gsap.to(getSliderItem(active), { x: 0, ease });
    gsap.to(getSliderItem(previous), { x: -numberSize, ease });
    gsap.to(".progress-fill", {
      width: (getTrackWidth() / order.length) * (active + 1),
      ease,
    });

    gsap.to(getCard(active), {
      x: 0,
      y: 0,
      ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);

        gsap.set(getCard(previous), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
          scale: 1,
        });

        gsap.set(getCardContent(previous), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          zIndex: 40,
        });

        gsap.set(getSliderItem(previous), { x: rest.length * numberSize });

        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .location-text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-line--primary`, { y: 100 });
        gsap.set(`${detailsInactive} .title-line--secondary`, { y: 100 });
        gsap.set(`${detailsInactive} .description`, { y: 50 });
        gsap.set(`${detailsInactive} .action-row`, { y: 60 });
      },
    });

    rest.forEach((index, position) => {
      if (index === previous) return;

      const xTarget = offsetLeft + position * (cardWidth + gap);

      gsap.set(getCard(index), { zIndex: 30 });
      gsap.to(getCard(index), {
        x: xTarget,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        ease,
        delay: 0.1 * (position + 1),
      });

      gsap.to(getCardContent(index), {
        x: xTarget,
        y: offsetTop + cardHeight - 100,
        opacity: 1,
        zIndex: 40,
        ease,
        delay: 0.1 * (position + 1),
      });

      gsap.to(getSliderItem(index), { x: (position + 1) * numberSize, ease });
    });
  });

const loop = async () => {
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, {
    x: window.innerWidth,
    delay: 0.3,
  });
  gsap.set(".indicator", { x: -window.innerWidth });
  await step();
  loop();
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const loadImages = () => Promise.all(destinations.map(({ image }) => loadImage(image)));

const start = async () => {
  try {
    setInitialDetails();
    await loadImages();
    init();
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
};

start();
