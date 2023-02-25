let isImgLoaded = false;
let attemps = 10;
let first = true;

function buildTemplate(unit1, unit2, unit3) {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <label for="customRange3" class="form-label">Quality</label>
    <input type="range" class="form-range" min="1" max="100" step="1" id="customRange3" value="${attemps}">

    <div class="speed-item">
      <p id="bits"><span>Speed In ${unit1}: </span></p>
    </div>
    <div class="speed-item">
      <p id="kbs"><span>Speed In ${unit2}: </span></p>
    </div>
    <div class="speed-item">
      <p id="mbs"><span>Speed In ${unit3}: </span></p>
    </div>
    <div class="buttons">
      <button type="button" class="btn btn-secondary">Test!</button>
      <button class="btn btn-bd-primary">${btnText}</button>
    </div>
  `;

  const btnConv = container.querySelector(".btn-bd-primary");
  btnConv.addEventListener("click", convert);

  const btnTest = container.querySelector(".btn-secondary");
  btnTest.addEventListener("click", test);

  const input = container.querySelector("input");
  input.addEventListener("change", changeHandler);
}

// convert
let btnText = "Convert to bytes";
let units = {
  1: "Bits",
  2: "Kbs",
  3: "Mbs",
};

let speeds = {};

buildTemplate(units[1], units[2], units[3]);

function convert() {
  if (!isImgLoaded) return;
  if (btnText === "Convert to bytes") {
    units = {
      1: "Bytes",
      2: "KiBs",
      3: "MiBs",
    };
    btnText = "Convert to bits";
    buildTemplate(units[1], units[2], units[3]);
    calcSpeed();
  } else {
    units = {
      1: "Bits",
      2: "Kbs",
      3: "Mbs",
    };
    btnText = "Convert to bytes";
    buildTemplate(units[1], units[2], units[3]);
    calcSpeed();
  }
}

// calc speed
let startTime, endTime;
let imageSizes = 0;
const imageLink = "https://source.unsplash.com/random?topics=nature";
let counterLoadings = 0;

function loadImages() {
  for (let i = 1; i <= attemps; i++) {
    const image = new Image();
    image.src = imageLink;
    image.addEventListener("load", loadHandler);
  }
}

async function loadHandler(e) {
  const response = await fetch(imageLink);
  imageSizes += +response.headers.get("Content-length");

  console.log(counterLoadings);
  console.log("loaded");
  if (++counterLoadings < attemps) return;
  console.log("All");

  isImgLoaded = true;
  first = true;
  endTime = new Date().getTime();

  document.querySelectorAll(".spinner-border").forEach((item) => item.remove());
  calcSpeed();
}

function calcSpeed() {
  const bitOutput = document.getElementById("bits");
  const kboutput = document.getElementById("kbs");
  const mboutput = document.getElementById("mbs");

  const timeDuration = (endTime - startTime) / 1000;

  if (units[1] === "Bits") {
    const loadedBits = imageSizes * 8;
    speeds[1] = (loadedBits / timeDuration).toFixed(3);
    speeds[2] = (speeds[1] / 1000).toFixed(3);
    speeds[3] = (speeds[2] / 1000).toFixed(3);
  } else {
    speeds[1] = (imageSizes / timeDuration).toFixed(3);
    speeds[2] = (speeds[1] / 1024).toFixed(3);
    speeds[3] = (speeds[2] / 1024).toFixed(3);
  }

  bitOutput.innerHTML += speeds[1];
  kboutput.innerHTML += speeds[2];
  mboutput.innerHTML += speeds[3];
}

function changeHandler(e) {
  if (!first) return;
  attemps = e.target.value;
}

function test() {
  if (!first) return;

  btnText = "Convert to bytes";
  units = {
    1: "Bits",
    2: "Kbs",
    3: "Mbs",
  };
  speeds = {};
  buildTemplate(units[1], units[2], units[3]);
  const spinner = `<div class="spinner-border" role="status"></div>`;
  document.querySelectorAll("p").forEach((p) => (p.innerHTML += spinner));

  counterLoadings = 0;
  first = false;
  isImgLoaded = false;
  startTime = new Date().getTime();
  imageSizes = 0;
  loadImages();
}
