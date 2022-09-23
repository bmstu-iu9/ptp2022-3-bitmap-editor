import {canvas} from "./index.js";
import {SELECTORS} from "./selectors.js";

export class Mode {
    constructor(btn) {
        this.btn = btn;
        this.mode = btn.dataset.mode;

        this.params = document.getElementById(SELECTORS.PARAMS.id);
    }

}

export class Select extends Mode {
    constructor(btn) {
        super(btn);
    }

    renderParams() {
        this.params.innerHTML = ``;
    }

    draw() {
        this.renderParams();
        canvas.selection = true;
    }

    exit() {
        canvas.selection = false;
    }
}

export class Pen extends Mode {
    constructor(btn) {
        super(btn);
        this.handlers = {
            altKeyDown: this.altKeyPressed.bind(this),
            altKeyUp: this.altKeyUnPressed.bind(this),
            unSelect: this.unSelectPath,
            formInput: ()=>{this.applyProps()},
        };

        this.penPanel = document.getElementById(SELECTORS.TOOLBAR.penPanel.id);
    }

    altKeyPressed(evt) {
        if (evt.altKey) {
            canvas.isDrawingMode = false;
        }
    }

    altKeyUnPressed(evt) {
        if (!evt.altKey) {
            canvas.isDrawingMode = true;
        }
    }

    unSelectPath() {
        let lastPath = canvas.item(canvas.size() - 1);
        lastPath.selectable = false;
        lastPath.hoverCursor = '';
    }

    renderParams() {
        this.params.innerHTML =
            `<p>
                <label for="color">Цвет:</label>
                <input type="color" name="" id="color" value="#000000">
            </p>
            <p>
                <label for="width">Толщина:</label>
                <input type="range" name="" id="width" value="5" min="1" max="150">
            </p>
            <p>
                <label for="shadow-color">Цвет тени:</label>
                <input type="color" name="" id="shadow-color" value="#000000">
            </p>
            <p>
                <label for="shadow-blur">Ширина тени:</label>
                <input type="range" name="" id="shadow-blur" value="0" min="0" max="100">
            </p>`;
    }

    applyProps() {
        let color = document.getElementById('color');
        let width = document.getElementById('width');
        let shadowColor = document.getElementById('shadow-color');
        let shadowBlur = document.getElementById('shadow-blur');

        canvas.freeDrawingBrush.width = parseInt(width.value, 10);
        canvas.freeDrawingBrush.color = color.value;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(shadowBlur.value, 10),
            color: shadowColor.value,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
        });
    }

    switchClassMode(btn) {
        switch (btn.dataset.mode) {
            case 'PENCIL':
                return new fabric.PencilBrush(canvas);
            case 'SPRAY':
                return new fabric.SprayBrush(canvas);
            case 'CIRCLES':
                return new fabric.CircleBrush(canvas);
        }
    }

    draw() {
        canvas.isDrawingMode = true;
        this.renderParams();

        this.penPanel.style.display = 'flex';
        let activeBtn;
        let penBtns = document.getElementsByClassName(SELECTORS.TOOLBAR.penPanel.btnClass);
        for (let penBtn of penBtns) {
            if (penBtn.classList.contains(SELECTORS.TOOLBAR.penPanel.activeBtnClass)) {
                canvas.freeDrawingBrush = this.switchClassMode(penBtn);
                activeBtn = penBtn;
            }
            penBtn.addEventListener('click', (evt) => {
                activeBtn.classList.remove(SELECTORS.TOOLBAR.penPanel.activeBtnClass);
                canvas.freeDrawingBrush = this.switchClassMode(penBtn);
                activeBtn = penBtn;
                activeBtn.classList.add(SELECTORS.TOOLBAR.penPanel.activeBtnClass);
                this.applyProps();
            })
        }

        this.applyProps();
        this.params.addEventListener('input', this.handlers.formInput);
        window.addEventListener('keydown', this.handlers.altKeyDown);
        window.addEventListener('keyup', this.handlers.altKeyUp);
        canvas.on('path:created', this.handlers.unSelect);
    }

    exit() {
        this.params.innerHTML = ``;
        this.penPanel.style.display = 'none';
        canvas.isDrawingMode = false;
        this.params.removeEventListener('input', this.handlers.formInput)
        window.removeEventListener('keydown', this.handlers.altKeyDown);
        window.removeEventListener('keyup', this.handlers.altKeyUp);
        canvas.off('path:created', this.handlers.unSelect);
    }
}

export class Comment extends Mode {
    constructor(btn) {
        super(btn);
        this.selectableObjects = [];
        this.handlers = {
            mousedown: this.downHandler.bind(this),
            textFormBtn:this.renderText.bind(this),
        }
    }

    downHandler(event) {
        let evt = event.e;
    }


    renderParams() {
        this.params.innerHTML =
            `<p>
                <label for="text">Текст:</label>
                <input type="text" id="text">
            </p>
            <p>
                <label for="font-color">Цвет шрифта:</label>
                <input type="color" id="font-color" value="#000000">
            </p>
            <p>
                <label for="font-size">Размер шрифта:</label>
                <input type="range" id="font-size" value="25" min="5" max="80">
            </p>
            <p>
                <input type="button" value="Ввод" id="text-form-btn">
            </p>`;
    }

    renderText() {
        let text = document.getElementById('text');
        let fontColor = document.getElementById('font-color');
        let fontSize = document.getElementById('font-size');

        if (text.value !== '') {
            let textObj = new fabric.IText(text.value, {
                left: (canvas.vptCoords.tr.x + canvas.vptCoords.tl.x) / 2,
                top: (canvas.vptCoords.tr.y + canvas.vptCoords.br.y) / 2,
                fill: fontColor.value,
                fontSize: parseInt(fontSize.value, 10),
            })

            canvas.add(textObj);
        }
    }

    draw() {
        this.renderParams();
        this.textFormBtn = document.getElementById('text-form-btn');
        this.textFormBtn.addEventListener('click', this.handlers.textFormBtn);
        canvas.getObjects().forEach(obj => {
            if (obj.selectable === true) {
                this.selectableObjects.push(obj);
                obj.selectable = false;
            }
        });


        canvas.on('mouse:down', this.handlers.mousedown);
    }

    exit() {
        this.params.innerHTML = ``;
        canvas.off('mouse:down', this.handlers.mousedown);
        this.textFormBtn.removeEventListener('click', this.handlers.textFormBtn)
        this.selectableObjects.forEach(obj => {
            obj.selectable = true;
        })
    }
}
