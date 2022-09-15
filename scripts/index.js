import {SELECTORS} from '/scripts/selectors.js';

import {Move, Pen} from '/scripts/actions.js';

//======Canceling default browser actions===============

document.getElementById(SELECTORS.ROOT.id).addEventListener('wheel', event => {
    event.preventDefault();
})

window.oncontextmenu = function (ev) {
    return false;     // cancel default menu
}

//=========================================================


export const canvas = new fabric.Canvas(SELECTORS.CANVAS.id, {
    width: window.innerWidth,
    height: window.innerHeight,
    skipOffScreen: false,
    selection: false,
});

canvas.selectionColor = 'rgba(38, 129, 240, 0.2)';
canvas.selectionBorderColor = '#2681f0';
canvas.selectionLineWidth = 3;
canvas.selectionDashArray = [10, 15];

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

let rect = new fabric.Rect({
    left: 200,
    top: 200,
    fill: 'red',
    width: 200,
    height: 200,
});

let rect2 = new fabric.Rect({
    left: 900,
    top: 200,
    fill: 'red',
    width: 200,
    height: 200,
});

canvas.add(rect);
canvas.add(rect2);

//===============GRID===============

//TODO: бесконечная фоновая сетка

//==============ACTIONS=================

let action;

function switchClassMode(toolbarBtn) {
    switch (toolbarBtn.dataset.mode) {
        case 'MOVE':
            return new Move(toolbarBtn);
        case 'PEN':
            return new Pen(toolbarBtn);
    }
}

let toolbarBtns = document.getElementsByClassName(SELECTORS.TOOLBAR.btnClass);
for (let toolbarBtn of toolbarBtns) {
    if (toolbarBtn.classList.contains(SELECTORS.TOOLBAR.activeBtnClass)) {
        action = switchClassMode(toolbarBtn);
    }
    toolbarBtn.addEventListener('click', evt => {
        if (action.datasetMode !== toolbarBtn.dataset.mode) {
            action.toolbarBtn.classList.remove(SELECTORS.TOOLBAR.activeBtnClass);
            action.exit();
            action = switchClassMode(toolbarBtn);
            action.toolbarBtn.classList.add(SELECTORS.TOOLBAR.activeBtnClass);
        }
    })
}

//================STEP BACK================

window.addEventListener('keydown', (evt)=> {
    if (evt.ctrlKey && (evt.key === 'z' || evt.key === 'я')) {
        canvas.remove(canvas.item(canvas.size() - 1));
    }
})

//TODO: Добавить кнопку, стирающую последний нарисованный элемент. Добавить к ней слушатели.

//======================================




