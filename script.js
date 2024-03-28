const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const backgroundColorPicker = document.getElementById("backgroundColorPicker");
const fontColorPicker = document.getElementById("fontColorPicker");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");
const fontSizeSelector = document.getElementById("fontSizeSelector");
const undoButton = document.getElementById("undoButton");
const lightModeButton = document.getElementById("lightModeButton");

canvas.width = 800;
canvas.height = 400;

let isDrawing = false;
let paths = [];

canvas.addEventListener("mousedown", startDrawing); 
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

backgroundColorPicker.addEventListener("change", changeBackgroundColor);
fontColorPicker.addEventListener("change", changeFontColor);
clearButton.addEventListener("click", clearCanvas);
downloadButton.addEventListener("click", downloadSignature);
fontSizeSelector.addEventListener("change", changeFontSize);
undoButton.addEventListener("click", undoLastPath);
lightModeButton.addEventListener("click", toggleLightMode);

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!isDrawing) return;
  ctx.lineWidth = parseInt(fontSizeSelector.value);
  ctx.lineCap = "round";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  if (isDrawing) {
    ctx.stroke();
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
