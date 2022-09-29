import {SELECTORS} from "./selectors.js";
import {canvas} from "./index.js"

let zoom = {
    cur: 1,
    k: 0.999,
    max: 6,
    min: 0.05,
    changeTimeout: 15,
}

const scalePlus = document.getElementById(SELECTORS.SCALE.plus);
const scaleMinus = document.getElementById(SELECTORS.SCALE.minus);
const scalePercentValue = document.getElementById(SELECTORS.SCALE.percentValue);

zoomCanvasToPoint({x: canvas.width / 2, y: canvas.height / 2});

function zoomCanvasToPoint(point) {
    if (point === undefined) {
        let vptCoords = canvas.vptCoords;
        point = {
            x: (vptCoords.br.x + vptCoords.tl.x) / 2,
            y: (vptCoords.br.y + vptCoords.tl.y) / 2,
        }
    }
    scalePercentValue.textContent = `${Math.round(zoom.cur * 100)}`;
    canvas.zoomToPoint(new fabric.Point(point.x, point.y), zoom.cur);
}

function roundPlusPercent(percent) {
    percent = Math.round(percent);
    percent++;
    if (percent < 50) {
        while (percent % 5 !== 0) {
            percent++;
        }
    } else if (percent < 200) {
        while (percent % 25 !== 0) {
            percent++;
        }
    } else {
        while (percent % 50 !== 0) {
            percent++;
        }
    }
    return Math.min(percent, zoom.max * 100);
}

function roundMinusPercent(percent) {
    percent = Math.round(percent);
    percent--;
    if (percent > 200) {
        while (percent % 50 !== 0) {
            percent--;
        }
    } else if (percent > 50) {
        while (percent % 25 !== 0) {
            percent--;
        }
    } else {
        while (percent % 5 !== 0) {
            percent--;
        }
    }
    return Math.max(percent, zoom.min * 100);
}

scalePlus.addEventListener('click', event => {
    scaleMinus.disabled = false;
    zoom.cur = Math.round(zoom.cur * 100) / 100;
    let newPercent = roundPlusPercent(zoom.cur * 100);
    if (newPercent / 100 === zoom.max) {
        scalePlus.disabled = true;
    }
    if (zoom.cur !== zoom.max) {
        let intervalId = setInterval(() => {
            zoom.cur = Math.min(zoom.max, newPercent / 100, zoom.cur + 0.01);
            zoomCanvasToPoint();
            if (Math.round(zoom.cur * 100) >= newPercent) {
                clearInterval(intervalId);
            }
        }, zoom.changeTimeout);
    }
})

scaleMinus.addEventListener('click', event => {
    scalePlus.disabled = false;
    zoom.cur = Math.round(zoom.cur * 100) / 100;
    let newPercent = roundMinusPercent(zoom.cur * 100);
    if (newPercent / 100 === zoom.min) {
        scaleMinus.disabled = true;
    }
    if (zoom.cur !== zoom.min) {
        let intervalId = setInterval(() => {
            zoom.cur = Math.max(zoom.min, newPercent / 100, zoom.cur - 0.01);
            zoomCanvasToPoint();
            if (Math.round(zoom.cur * 100) <= newPercent) {
                clearInterval(intervalId);
            }
        }, zoom.changeTimeout);
    }
})


canvas.on('mouse:wheel', event => {
    let evt = event.e;
    zoom.cur = canvas.getZoom();
    if (evt.deltaY > 0 && zoom.cur > zoom.min) {
        scalePlus.disabled = false;
        zoom.cur = Math.max(zoom.cur * zoom.k ** evt.deltaY, zoom.min);
    }
    if (evt.deltaY < 0 && zoom.cur < zoom.max) {
        scaleMinus.disabled = false;
        zoom.cur = Math.min(zoom.cur * zoom.k ** evt.deltaY, zoom.max);
    }
    if (zoom.cur === zoom.max) {
        scalePlus.disabled = true;
    } else if (zoom.cur === zoom.min) {
        scaleMinus.disabled = true;
    }

    zoomCanvasToPoint({x: evt.offsetX, y: evt.offsetY});
});