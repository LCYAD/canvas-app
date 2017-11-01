var colorBlock = document.getElementById('color-block');
var colorBlockContext = colorBlock.getContext('2d');
var blockWidth = colorBlock.width;
var blockHeight = colorBlock.height;

var colorStrip = document.getElementById('color-strip');
var colorStripContext = colorStrip.getContext('2d');
var stripWidth= colorStrip.width;
var stripHeight = colorStrip.height;

var colorLabel = document.getElementById('color-label');

var x = 0;
var y = 0;
var drag = false;
var rgbaColor = 'rgba(255,0,0,1)';

colorBlockContext.rect(0, 0, blockWidth, blockHeight);
fillGradient();

colorStripContext.rect(0, 0, width2, stripHeight);
var colorStripGrid = colorStripContext.createLinearGradient(0, 0, width2, 0);
colorStripGrid.addColorStop(0, 'rgba(255, 0, 0, 1)');
colorStripGrid.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
colorStripGrid.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
colorStripGrid.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
colorStripGrid.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
colorStripGrid.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
colorStripGrid.addColorStop(1, 'rgba(255, 0, 0, 1)');
colorStripContext.fillStyle = colorStripGrid;
colorStripContext.fill();

function click(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = colorStripContext.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  fillGradient();
}

function fillGradient() {
  colorBlockContext.fillStyle = rgbaColor;
  colorBlockContext.fillRect(0, 0, blockWidth, blockHeight);

  var grdWhite = colorStripContext.createLinearGradient(0, 0, blockWidth, 0);
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
  colorBlockContext.fillStyle = grdWhite;
  colorBlockContext.fillRect(0, 0, blockWidth, blockHeight);

  var grdBlack = colorStripContext.createLinearGradient(0, 0, 0, blockHeight);
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
  colorBlockContext.fillStyle = grdBlack;
  colorBlockContext.fillRect(0, 0, blockWidth, blockHeight);
}

function mousedown(e) {
  drag = true;
  changeColor(e);
}

function mousemove(e) {
  if (drag) {
    changeColor(e);
  }
}

function mouseup(e) {
  drag = false;
}

function changeColor(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = colorBlockContext.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  colorLabel.style.backgroundColor = rgbaColor;
}

colorStrip.addEventListener("click", click, false);
colorBlock.addEventListener("mousedown", mousedown, false);
colorBlock.addEventListener("mouseup", mouseup, false);
colorBlock.addEventListener("mousemove", mousemove, false);