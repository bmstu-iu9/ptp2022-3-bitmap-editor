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
    selection: false,
});

canvas.on('mouse:up', (event) => {
    if (canvas.getActiveObjects().length > 0) {
        canvas.getActiveObjects().forEach(obj => {
            canvas.bringToFront(obj);
        });
    }
});

//================CUSTOM canvas==============

canvas.selectionColor = 'rgba(38, 129, 240, 0.2)';
canvas.selectionBorderColor = '#2681f0';
canvas.selectionLineWidth = 3;
canvas.selectionDashArray = [10, 15];

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

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

