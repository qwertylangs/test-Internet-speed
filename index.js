let isImgLoaded = false;

function buildTemplate(unit1, unit2, unit3) {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <div class="speed-item">
      <p id="bits"><span>Speed In ${unit1}: </span></p>
    </div>
    <div class="speed-item">
      <p id="kbs"><span>Speed In ${unit2}: </span></p>
    </div>
    <div class="speed-item">
      <p id="mbs"><span>Speed In ${unit3}: </span></p>
    </div>
  `;
  const spinner = `<div class="spinner-border" role="status"></div>`;
  if (!isImgLoaded)
    container.querySelectorAll("p").forEach((p) => (p.innerHTML += spinner));

  const btn = document.createElement("button");
  btn.classList.add("btn");
  // btn.classList.add("btn-primary");
  btn.classList.add("btn-bd-primary");
  btn.textContent = btnText;
  btn.addEventListener("click", convert);

  container.append(btn);
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
let imageSize;
const image = new Image();

const imageLink = "https://source.unsplash.com/random?topics=nature";

image.addEventListener("load", async (e) => {
  isImgLoaded = true;
  document.querySelectorAll(".spinner-border").forEach((item) => item.remove());

  endTime = new Date().getTime();
  console.log(endTime - startTime);
  const response = await fetch(imageLink);
  imageSize = response.headers.get("Content-length");
  calcSpeed();
});

function calcSpeed() {
  const bitOutput = document.getElementById("bits");
  const kboutput = document.getElementById("kbs");
  const mboutput = document.getElementById("mbs");

  const timeDuration = (endTime - startTime) / 1000;

  if (units[1] === "Bits") {
    const loadedBits = imageSize * 8;
    speeds[1] = (loadedBits / timeDuration).toFixed(3);
    speeds[2] = (speeds[1] / 1000).toFixed(3);
    speeds[3] = (speeds[2] / 1000).toFixed(3);
  } else {
    speeds[1] = (imageSize / timeDuration).toFixed(3);
    speeds[2] = (speeds[1] / 1024).toFixed(3);
    speeds[3] = (speeds[2] / 1024).toFixed(3);
  }

  bitOutput.innerHTML += speeds[1];
  kboutput.innerHTML += speeds[2];
  mboutput.innerHTML += speeds[3];
}

function init() {
  startTime = new Date().getTime();
  image.src = imageLink;
}

window.onload = init;
