import {SELECTORS} from "./selectors.js";
import {canvas} from "./index.js";
import {Mode} from "./actions.js";

export class Shapes {
    constructor(btn) {
        this.btn = btn;
        this.shapesPanel = document.getElementById(SELECTORS.TOOLBAR.shapesPanel.id);
        this.shapeObjects = {};
    }

    draw() {
        this.shapesPanel.classList.remove('invisible');
        this.shapesPanel.classList.add('visible');

        let shapeBtns = document.getElementsByClassName(SELECTORS.TOOLBAR.shapesPanel.btnClass);
        for (let shapeBtn of shapeBtns) {
            this.shapeObjects[shapeBtn.dataset.mode] = function (shapeBtn) {
                switch (shapeBtn.dataset.mode) {
                    case 'RECTANGLE':
                        return new Rectangle(shapeBtn);
                    case 'ELLIPSE':
                        return new Ellipse(shapeBtn);
                    case 'TRIANGLE':
                        return new Triangle(shapeBtn);
                }
            }(shapeBtn);
            if (shapeBtn.classList.contains(SELECTORS.TOOLBAR.shapesPanel.activeBtnClass)) {
                this.activeShapeBtn = shapeBtn;
                this.shapeObjects[shapeBtn.dataset.mode].draw();
            }
            shapeBtn.addEventListener('click', evt => {
                if (this.activeShapeBtn.dataset.mode !== shapeBtn.dataset.mode) {
                    this.activeShapeBtn.classList.remove(SELECTORS.TOOLBAR.shapesPanel.activeBtnClass);
                    this.shapeObjects[this.activeShapeBtn.dataset.mode].exit();
                    this.activeShapeBtn = shapeBtn;
                    this.activeShapeBtn.classList.add(SELECTORS.TOOLBAR.shapesPanel.activeBtnClass);
                    this.shapeObjects[this.activeShapeBtn.dataset.mode].draw();
                }
            })
        }

    }

    exit() {
        this.shapeObjects[this.activeShapeBtn.dataset.mode].exit();
        this.shapesPanel.classList.remove('visible');
        this.shapesPanel.classList.add('invisible');
    }
}


export class Rectangle extends Mode{
    constructor(btn) {
        super(btn);
        this.btn = btn;
        this.handlers = {
            downHandler: this.downHandler.bind(this),
            moveHandler: this.moveHandler.bind(this),
            upHandler: this.upHandler.bind(this),
        }
    }
    renderParams() {
        this.params.innerHTML = `<p>
                <label for="color">Цвет заливки:</label>
                <input type="color" name="" id="color" value="#FFF000">
            </p>
            <p>
                <label for="stroke-width">Ширина рамки:</label>
                <input type="range"  id="stroke-width" value="0" min="0" max="100">
            </p>
            <p>
                <label for="stroke-color">Цвет рамки:</label>
                <input type="color"  id="stroke-color" value= "#000000">
            </p>
            
`;
    }


    draw() {
        this.renderParams();
        this.props = {
            color: "red",
            shadowColor: "#000000",
            shadowBlur: 0,
            strokeWidth : 0,
            strokeColor : "#000000"
        }
        this.props.color = document.getElementById('color');
        this.props.shadowColor = document.getElementById('shadow-color');
        this.props.shadowBlur = document.getElementById('shadow-blur');
        this.props.strokeWidth= document.getElementById('stroke-width');
        this.props.strokeColor = document.getElementById('stroke-color');
        canvas.on("mouse:down", this.handlers.downHandler);
        canvas.on("mouse:up", this.handlers.upHandler);

    }

    downHandler(event) {
        if (canvas.getActiveObjects().length === 0) {
            let evt = event.e;
            this.rect = new fabric.Rect;
            this.rect.set({
                left: evt.offsetX,
                top: evt.offsetY,
                width: 0,
                height: 0,
                fill: this.props.color.value,
                strokeWidth: parseInt(this.props.strokeWidth.value, 10),
                stroke: this.props.strokeColor.value
            });
            this.constPoint = {
                x: this.rect.left,
                y: this.rect.top
            }
            canvas.add(this.rect);
            canvas.on("mouse:move", this.handlers.moveHandler);
        }
    }

    moveHandler(event) {
        let deltaW = event.e.clientX - this.constPoint.x;
        let deltaH = event.e.clientY - this.constPoint.y;
        if (deltaW >= 0 && deltaH >= 0) {
            this.rect.set({
                width: deltaW,
                height: deltaH,
            })
        } else if (deltaW < 0 && deltaH >= 0) {
            this.rect.set({
                left: event.e.clientX,
                width: -deltaW,
                height: deltaH,
            })
        } else if (deltaW >= 0 && deltaH < 0) {
            this.rect.set({
                top: event.e.clientY,
                width: deltaW,
                height: -deltaH,
            })
        } else {
            this.rect.set({
                left: event.e.clientX,
                top: event.e.clientY,
                width: -deltaW,
                height: -deltaH,
            })
        }


        canvas.renderAll();
    }

    upHandler(event) {
        canvas.off("mouse:move", this.handlers.moveHandler);
    }

    exit() {
        canvas.off("mouse:down", this.handlers.downHandler);
        canvas.off("mouse:up", this.handlers.upHandler);
    }
}



class Ellipse extends Mode{
    constructor(btn) {
        super(btn);
        this.btn = btn;
        this.handlers = {
            downHandler: this.downHandler.bind(this),
            moveHandler: this.moveHandler.bind(this),
            upHandler: this.upHandler.bind(this),
        }

    }
        renderParams() {
        this.params.innerHTML = `<p>
                <label for="color">Цвет заливки:</label>
                <input type="color" name="" id="color" value="#FFF000">
            </p>
            <p>
                <label for="stroke-width">Ширина рамки:</label>
                <input type="range"  id="stroke-width" value="0" min="0" max="100">
            </p>
            <p>
                <label for="stroke-color">Цвет рамки:</label>
                <input type="color"  id="stroke-color" value= "#000000">
            </p>
            
`;
    }
    draw() {
        this.renderParams();
        this.props = {
            color: "red",
            shadowColor: "#000000",
            shadowBlur: 0,
            strokeWidth : 0,
            strokeColor : "#000000"
        }
        this.props.color = document.getElementById('color');
        this.props.shadowColor = document.getElementById('shadow-color');
        this.props.shadowBlur = document.getElementById('shadow-blur');
        this.props.strokeWidth= document.getElementById('stroke-width');
        this.props.strokeColor = document.getElementById('stroke-color');
        canvas.on("mouse:down", this.handlers.downHandler);
        canvas.on("mouse:up", this.handlers.upHandler);

    }

    downHandler(event) {
        if (canvas.getActiveObjects().length === 0) {
            let evt = event.e;
            this.ellipse = new fabric.Ellipse({
                left: evt.offsetX,
                top: evt.offsetY,
                rx: 0,
                ry: 0,
                fill: this.props.color.value,
                strokeWidth: parseInt(this.props.strokeWidth.value, 10),
                stroke: this.props.strokeColor.value
            });
            this.constPoint = {
                x: this.ellipse.left,
                y: this.ellipse.top
            }
            canvas.add(this.ellipse);
            canvas.on("mouse:move", this.handlers.moveHandler);
        }
    }

    moveHandler(event) {
        let deltaW = event.e.clientX - this.constPoint.x;
        let deltaH = event.e.clientY - this.constPoint.y;
        if (deltaW >= 0 && deltaH >= 0) {
            this.ellipse.set({
                rx: deltaW / 2,
                ry: deltaH / 2,
            })
        } else if (deltaW < 0 && deltaH >= 0) {
            this.ellipse.set({
                rx: -deltaW / 2,
                ry: deltaH / 2,
                left: event.e.clientX,
            })
        } else if (deltaW >= 0 && deltaH < 0) {
            this.ellipse.set({
                top: event.e.clientY,
                rx: deltaW / 2,
                ry: -deltaH / 2,
            })
        } else {
            this.ellipse.set({
                left: event.e.clientX,
                top: event.e.clientY,
                rx: -deltaW / 2,
                ry: -deltaH / 2,
            })
        }

        canvas.renderAll();
    }


    upHandler(event) {
        canvas.off("mouse:move", this.handlers.moveHandler);
    }

    exit() {
        canvas.off("mouse:down", this.handlers.downHandler);
        canvas.off("mouse:up", this.handlers.upHandler);
    }
}

class Triangle extends Mode{
    constructor(btn) {
        super(btn);
        this.btn = btn;

        this.handlers = {
            downHandler: this.downHandler.bind(this),
            moveHandler: this.moveHandler.bind(this),
            upHandler: this.upHandler.bind(this),
        }

    }

     renderParams() {
        this.params.innerHTML = `<p>
                <label for="color">Цвет заливки:</label>
                <input type="color" name="" id="color" value="#FFF000">
            </p>
            <p>
                <label for="stroke-width">Ширина рамки:</label>
                <input type="range"  id="stroke-width" value="0" min="0" max="100">
            </p>
            <p>
                <label for="stroke-color">Цвет рамки:</label>
                <input type="color"  id="stroke-color" value= "#000000">
            </p>
            
`;
    }
    draw() {
        this.renderParams();
        this.props = {
            color: "red",
            shadowColor: "#000000",
            shadowBlur: 0,
            strokeWidth : 0,
            strokeColor : "#000000"
        }
        this.props.color = document.getElementById('color');
        this.props.shadowColor = document.getElementById('shadow-color');
        this.props.shadowBlur = document.getElementById('shadow-blur');
        this.props.strokeWidth= document.getElementById('stroke-width');
        this.props.strokeColor = document.getElementById('stroke-color');
        canvas.on("mouse:down", this.handlers.downHandler);
        canvas.on("mouse:up", this.handlers.upHandler);

    }

    downHandler(event) {
        if (canvas.getActiveObjects().length === 0) {
            let evt = event.e;
            this.triangle = new fabric.Triangle({
                left: evt.offsetX,
                top: evt.offsetY,
                width: 0,
                height: 0,
                fill: this.props.color.value,
                strokeWidth: parseInt(this.props.strokeWidth.value, 10),
                stroke: this.props.strokeColor.value
            });
            this.constPoint = {
                x: this.triangle.left,
                y: this.triangle.top
            }
            canvas.add(this.triangle);
            canvas.on("mouse:move", this.handlers.moveHandler);
        }
    }

    moveHandler(event) {
        let deltaW = event.e.clientX - this.constPoint.x;
        let deltaH = event.e.clientY - this.constPoint.y;
        if (deltaW >= 0 && deltaH >= 0) {
            this.triangle.set({
                width: deltaW,
                height: deltaH,
            })
        } else if (deltaW < 0 && deltaH >= 0) {
            this.triangle.set({
                left: event.e.clientX,
                width: -deltaW,
                height: deltaH,
            })
        } else if (deltaW >= 0 && deltaH < 0) {
            this.triangle.set({
                top: event.e.clientY,
                width: deltaW,
                height: -deltaH,
            })
        } else {
            this.triangle.set({
                left: event.e.clientX,
                top: event.e.clientY,
                width: -deltaW,
                height: -deltaH,
            })
        }
        canvas.renderAll();
    }

    upHandler() {
        canvas.off("mouse:move", this.handlers.moveHandler);
    }

    exit() {
        canvas.off("mouse:down", this.handlers.downHandler);
        canvas.off("mouse:up", this.handlers.upHandler);
    }
}