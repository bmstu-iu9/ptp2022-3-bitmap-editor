let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d');
ctx.fillStyle = "white";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseX, mouseY;
let isDrawing = false;

let exportBtn = document.querySelector('.export-btn');

function drawLine(ctx, x_from, y_from, x_to, y_to) {
    ctx.moveTo(x_from, y_from);
    ctx.lineTo(x_to, y_to);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = "3";
    ctx.stroke();
}

function canvasMousemoveListen(event) {
    if (isDrawing) {
        drawLine(ctx, mouseX, mouseY, event.offsetX, event.offsetY);
    } else {
        isDrawing = true;
    }
    if (event.offsetX >= canvas.width - 100) {
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imgData.data);
        canvas.width += 500;
        ctx.putImageData(imgData, 0, 0);
    }
    if (event.offsetY >= canvas.height - 100) {
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.height += 500;
        ctx.putImageData(imgData, 0, 0);
    }
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    ctx.fillRect(mouseX, mouseY, 1, 1);
}

function canvasMousedownListen() {
    this.addEventListener("mousemove", canvasMousemoveListen);
}

function canvasMouseupListen() {
    this.removeEventListener("mousemove", canvasMousemoveListen);
    isDrawing = false;
}

function exportImage() {
    let file = {
        name: "image",
        ext: "jpeg",
    };
    let isOK = confirm("Загрузить изображение " + file.name + "." + file.ext + "?");
    if (isOK) {
        exportBtn.setAttribute("href", canvas.toDataURL(file.name+"/"+file.ext));
        exportBtn.setAttribute("download", file.name + "." +file.ext);
    }
}

function main() {

    canvas.addEventListener("mousedown", canvasMousedownListen);
    canvas.addEventListener("mouseup", canvasMouseupListen)
    exportBtn.addEventListener("click", exportImage);
}




window.onload = main;

