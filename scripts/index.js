import {SELECTORS} from '/scripts/selectors.js';

import {Select, Pen, Comment} from '/scripts/actions.js';
import {Shapes} from '/scripts/shapes.js';

//======Canceling default browser actions===============

document.getElementById(SELECTORS.ROOT.id).addEventListener('wheel', event => {
    event.preventDefault();
})

window.oncontextmenu = function (ev) {
    return false;     // cancel default menu
}

//=========================================================


export const canvas = new fabric.Canvas(SELECTORS.CANVAS.id, {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    skipOffScreen: false,
    selection: false,
});

canvas.on('mouse:up', (event) => {
    console.log(canvas.getActiveObjects().length);
    if (canvas.getActiveObjects().length > 0) {
        canvas.getActiveObjects().forEach(obj => {
            obj.bringToFront();
            console.log(canvas.getObjects(), obj);
        });
    }
})

//================CUSTOM canvas==============

canvas.selectionColor = 'rgba(38, 129, 240, 0.2)';
canvas.selectionBorderColor = '#2681f0';
canvas.selectionLineWidth = 3;
canvas.selectionDashArray = [10, 15];

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

//==============================================

/*
let rect = new fabric.Circle({
    left: 200,
    top: 200,
    fill: 'red',
    radius: 100,
});

let rect2 = new fabric.Rect({
    left: 900,
    top: 200,
    fill: 'red',
    width: 200,
    height: 200,
});

let txt = new fabric.Text('hello world!', {
    left: 500,
    top: 400,
});

let ellipse = new fabric.Ellipse({
    left: 500,
    top: 500,
    rx: 100,
    ry: 10,
    radius: 400,
    fill: 'yellow',
});

canvas.add(rect);
canvas.add(rect2);
canvas.add(txt);
canvas.add(ellipse);
*/

//===============GRID===============

//TODO: бесконечная фоновая сетка

//==============ACTIONS=================

let modeObjects = {};
let activeModeBtn;

let toolbarBtns = document.getElementsByClassName(SELECTORS.TOOLBAR.btnClass);
for (let toolbarBtn of toolbarBtns) {
    modeObjects[toolbarBtn.dataset.mode] = function (toolbarBtn) {
        switch (toolbarBtn.dataset.mode) {
            case 'SELECT':
                return new Select(toolbarBtn);
            case 'PEN':
                return new Pen(toolbarBtn);
            case 'COMMENT':
                return new Comment(toolbarBtn);
            case 'SHAPES' :
                return new Shapes(toolbarBtn);
        }
    }(toolbarBtn);
    if (toolbarBtn.classList.contains(SELECTORS.TOOLBAR.activeBtnClass)) {
        activeModeBtn = toolbarBtn;
        modeObjects[toolbarBtn.dataset.mode].draw();
    }
    toolbarBtn.addEventListener('click', evt => {
        if (activeModeBtn.dataset.mode !== toolbarBtn.dataset.mode) {
            activeModeBtn.classList.remove(SELECTORS.TOOLBAR.activeBtnClass);
            modeObjects[activeModeBtn.dataset.mode].exit();
            activeModeBtn = toolbarBtn;
            activeModeBtn.classList.add(SELECTORS.TOOLBAR.activeBtnClass);
            modeObjects[activeModeBtn.dataset.mode].draw();
        }
    })
}

console.log(modeObjects);

//================STEP BACK================

window.addEventListener('keydown', (evt) => {
    if (evt.ctrlKey && (evt.key === 'z' || evt.key === 'я')) {
        canvas.remove(canvas.item(canvas.size() - 1));
    }
})

let stepBackBtn = document.getElementById(SELECTORS.STEP.stepBackBtn);
stepBackBtn.addEventListener('click', () => {
    canvas.remove(canvas.item(canvas.size() - 1));
    if (canvas.size() === 0) {
        stepBackBtn.disabled = true;
    }
});

canvas.on("after:render", () => {
    if (canvas.size() > 0) {
        stepBackBtn.disabled = false;
    }
})

//======================================

canvas.on('mouse:move', () => {
    canvas.getObjects().forEach(el => {
        if (!el.selectable) {
            el.hoverCursor = 'default';
        } else {
            el.hoverCursor = 'move';
        }
    })
})

//===============EXPORT=================

let exportLink = document.getElementById(SELECTORS.EXPORTLINK.id);

exportLink.style.cursor = 'pointer';


exportLink.onclick = () => {
    exportLink.setAttribute('href', canvas.toDataURL());
    exportLink.setAttribute('download', 'image.png');
}

//======================================

