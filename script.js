const canvas = document.getElementById("seed-canvas");
const context = canvas.getContext("2d");
const shuffleButton = document.getElementById("shuffle-button");

const specimens = [
  {
    name: "Lumen Fern",
    description: "A fern with silver ribs that unfurl during warm rain and fold at the sound of bells.",
    glow: "Soft jade",
    scent: "Pepper leaf",
    soil: "Basalt dust",
    hue: 145
  },
  {
    name: "Aurora Bean",
    description: "A climbing sprout that paints small ribbons of color across nearby walls after midnight.",
    glow: "Rose gold",
    scent: "Burnt citrus",
    soil: "Loam and mica",
    hue: 24
  },
  {
    name: "Blue Hour Lily",
    description: "A water plant that opens for exactly seven minutes while the sky forgets its color.",
    glow: "Cold blue",
    scent: "Rain slate",
    soil: "Shallow glass",
    hue: 213
  },
  {
    name: "Whispergrain",
    description: "A grass that records footsteps as pale rings and releases them as soft clicks at dawn.",
    glow: "Amber",
    scent: "Dry honey",
    soil: "Chalk ridge",
    hue: 43
  }
];

let width = 0;
let height = 0;
let seeds = [];
let featuredIndex = 0;
let colorHue = specimens[0].hue;
const seedGrid = document.getElementById("seed-grid");
const searchInput = document.getElementById("search-input");
const noResults = document.getElementById("no-results");
const notesForm = document.getElementById("notes-form");
const notesList = document.getElementById("notes-list");
const noteInput = document.getElementById("note-input");
let activeFilter = "";

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createSeeds();
}

function createSeeds() {
  const seedCount = Math.min(90, Math.max(34, Math.floor(width / 18)));
  seeds = Array.from({ length: seedCount }, function (_, index) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 3.6,
      speed: 0.14 + Math.random() * 0.34,
      phase: Math.random() * Math.PI * 2,
      orbit: 8 + Math.random() * 42,
      delay: index * 0.018
    };
  });
}

function draw(time) {
  const seconds = time * 0.001;
  context.clearRect(0, 0, width, height);

  seeds.forEach(function (seed) {
    const drift = Math.sin(seconds * seed.speed + seed.phase) * seed.orbit;
    const rise = (seconds * seed.speed * 26 + seed.delay * 300) % (height + 120);
    const x = seed.x + drift;
    const y = height + 60 - rise;
    const glow = 0.46 + Math.sin(seconds + seed.phase) * 0.2;

    context.beginPath();
    context.fillStyle = `hsla(${colorHue}, 72%, 72%, ${glow})`;
    context.shadowColor = `hsla(${colorHue}, 86%, 64%, 0.72)`;
    context.shadowBlur = 18;
    context.ellipse(x, y, seed.radius * 0.82, seed.radius * 1.6, seed.phase, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    if (seed.radius > 3) {
      context.beginPath();
      context.strokeStyle = `hsla(${colorHue}, 66%, 82%, 0.12)`;
      context.moveTo(x, y);
      context.lineTo(x + drift * 0.7, y + 38);
      context.stroke();
    }
  });

  requestAnimationFrame(draw);
}

function filterSpecimens(query) {
  const lowerQuery = query.toLowerCase().trim();
  return specimens.filter(function (specimen) {
    return [specimen.name, specimen.description, specimen.glow, specimen.scent, specimen.soil].some(function (value) {
      return value.toLowerCase().includes(lowerQuery);
    });
  });
}

function createSpecimenCard(specimen, index) {
  const article = document.createElement("article");
  article.className = "seed-card";
  article.dataset.index = index;
  if (index === featuredIndex) {
    article.classList.add("seed-card--active");
  }

  const swatch = document.createElement("span");
  swatch.className = `seed-swatch seed-swatch--${index % 3}`;
  article.appendChild(swatch);

  const title = document.createElement("h3");
  title.textContent = specimen.name;
  article.appendChild(title);

  const description = document.createElement("p");
  description.textContent = specimen.description;
  article.appendChild(description);

  article.addEventListener("click", function () {
    featuredIndex = Number(article.dataset.index);
    updateFeaturedSpecimen();
    renderSeedCards(filterSpecimens(activeFilter));
  });

  return article;
}

function renderSeedCards(list) {
  seedGrid.innerHTML = "";
  if (list.length === 0) {
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;
  const fragment = document.createDocumentFragment();
  list.forEach(function (specimen) {
    fragment.appendChild(createSpecimenCard(specimen, specimens.indexOf(specimen)));
  });
  seedGrid.appendChild(fragment);
}

function updateFeaturedSpecimen() {
  const specimen = specimens[featuredIndex];
  document.getElementById("featured-name").textContent = specimen.name;
  document.getElementById("featured-description").textContent = specimen.description;
  document.getElementById("featured-glow").textContent = specimen.glow;
  document.getElementById("featured-scent").textContent = specimen.scent;
  document.getElementById("featured-soil").textContent = specimen.soil;
  colorHue = specimen.hue;
  renderSeedCards(filterSpecimens(activeFilter));
}

shuffleButton.addEventListener("click", function () {
  featuredIndex = (featuredIndex + 1) % specimens.length;
  updateFeaturedSpecimen();
  createSeeds();
});

searchInput.addEventListener("input", function (event) {
  activeFilter = event.target.value;
  renderSeedCards(filterSpecimens(activeFilter));
});

notesForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const note = noteInput.value.trim();
  if (!note) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = note;
  notesList.appendChild(item);
  noteInput.value = "";
  noteInput.focus();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(draw);
updateFeaturedSpecimen();
