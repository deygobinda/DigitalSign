const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const backgroundColorPicker = document.getElementById("backgroundColorPicker");
const fontColorPicker = document.getElementById("fontColorPicker");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");
const fontSizeSelector = document.getElementById("fontSizeSelector");
const undoButton = document.getElementById("undoButton");
const lightModeButton = document.getElementById("lightModeButton");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let paths = [];

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

backgroundColorPicker.addEventListener("change", changeBackgroundColor);
fontColorPicker.addEventListener("change", changeFontColor);
clearButton.addEventListener("click", clearCanvas);
downloadButton.addEventListener("click", downloadSignature);
fontSizeSelector.addEventListener("change", changeFontSize);
undoButton.addEventListener("click", undoLastPath);
lightModeButton.addEventListener("click", toggleLightMode);

function getTouchCoordinates(e) {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    return {
      x: touch.clientX - canvas.getBoundingClientRect().left,
      y: touch.clientY - canvas.getBoundingClientRect().top,
    };
  }
  return null;
}

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  const { x, y } = e.type === "touchstart" ? getTouchCoordinates(e) : { x: e.offsetX, y: e.offsetY };
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  ctx.lineWidth = parseInt(fontSizeSelector.value);
  ctx.lineCap = "round";
  const { x, y } = e.type === "touchmove" ? getTouchCoordinates(e) : { x: e.offsetX, y: e.offsetY };
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  if (isDrawing) {
    ctx.stroke();
    ctx.closePath();
    isDrawing = false;
    paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }
}


function changeBackgroundColor(e) {
  ctx.fillStyle = e.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeFontColor(e) {
  ctx.strokeStyle = e.target.value;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadSignature() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "signature.png";
  link.click();
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineWidth = parseInt(fontSizeSelector.value);
  ctx.lineCap = "round";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
  if (isDrawing) {
    ctx.stroke();
    ctx.closePath();
    isDrawing = false;
    paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }
}

function changeFontSize(e) {
  ctx.lineWidth = parseInt(e.target.value);
}

function undoLastPath() {
  if (paths.length > 0) {
    paths.pop();
    ctx.putImageData(
      paths[paths.length - 1] ||
        ctx.createImageData(canvas.width, canvas.height),
      0,
      0
    );
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeButton.textContent = "Light Mode";
  } else {
    darkModeButton.textContent = "Dark Mode";
  }
}

function toggleLightMode() {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    lightModeButton.textContent = "Dark Mode";
  } else {
    lightModeButton.textContent = "Light Mode";
  }
}
