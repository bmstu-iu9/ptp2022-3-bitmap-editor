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
                    case 'RHOMBUS':
                        return new Rhombus(shapeBtn);
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

//RECTANGLE

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
                <input type="color" name="" id="color" value="#F00000">
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
            this.rect = new fabric.Rect;
            this.rect.set({
                left: event.e.offsetX,
                top: event.e.offsetY,
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
        if (event.e.shiftKey){
            let length = Math.abs(deltaH)
            if (deltaW >= 0 && deltaH >= 0) {
                this.rect.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y,
                    width: length,
                    height: length,
                })
            } else if (deltaW < 0 && deltaH >= 0) {
                this.rect.set({
                    left: this.constPoint.x - length,
                    width: length,
                    height: length,
                })
            } else if (deltaW >= 0 && deltaH < 0) {
                this.rect.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y - length,
                    width: length,
                    height: length,
                })
            } else {
                this.rect.set({
                    left: this.constPoint.x - length,
                    top: this.constPoint.y - length,
                    width: length,
                    height: length,
                })
            }
        }
        else{
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

//ELLIPSE

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
                <input type="color" name="" id="color" value="#F00000">
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
            this.ellipse = new fabric.Ellipse({
                left: event.e.offsetX,
                top: event.e.offsetY,
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
        if (event.e.shiftKey){
            let length = Math.abs(deltaH)
            if (deltaW >= 0 && deltaH >= 0) {
                this.ellipse.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y,
                    rx: length / 2,
                    ry: length / 2,
                })
            } else if (deltaW < 0 && deltaH >= 0) {
                this.ellipse.set({
                    left: this.constPoint.x - length,
                    rx: length / 2,
                    ry: length / 2,
                })
            } else if (deltaW >= 0 && deltaH < 0) {
                this.ellipse.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y - length,
                    rx: length / 2,
                    ry: length / 2,
                })
            } else {
                this.ellipse.set({
                    left: this.constPoint.x - length,
                    top: this.constPoint.y - length,
                    rx: length / 2,
                    ry: length / 2,
                })
            }
        }
        else{
            if (deltaW >= 0 && deltaH >= 0) {
                this.ellipse.set({
                    rx: deltaW / 2,
                    ry: deltaH / 2,
                })
            } else if (deltaW < 0 && deltaH >= 0) {
                this.ellipse.set({
                    left: event.e.clientX,
                    rx: -deltaW / 2,
                    ry: deltaH / 2,
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

//TRIANGE

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
                <input type="color" name="" id="color" value="#FF0000">
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
            this.triangle = new fabric.Triangle({
                left: event.e.offsetX,
                top: event.e.offsetY,
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
        if (event.e.shiftKey){
            let length = Math.abs(deltaH)
            let k = length/Math.sqrt(3/4)
            if (deltaW >= 0 && deltaH >= 0) {
                this.triangle.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y,
                    width: k,
                    height: length,
                })
            } else if (deltaW < 0 && deltaH >= 0) {
                this.triangle.set({
                    left: this.constPoint.x - k,
                    top: this.constPoint.y,
                    width: k,
                    height: length,             
                })
            } else if (deltaW >= 0 && deltaH < 0) {
                this.triangle.set({
                    left: this.constPoint.x,
                    top: this.constPoint.y - length,
                    width: k,
                    height: length,
                })
            } else {
                this.triangle.set({
                    left: this.constPoint.x - k,
                    top: this.constPoint.y - length,
                    width: k,
                    height: length,
                })
            }

        }
        else{
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

//RHOMBUS

export class Rhombus extends Mode{
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
                <input type="color" name="" id="color" value="#FF0000">
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
            this.triangle = new fabric.Triangle({
                left: event.e.offsetX,
                top: event.e.offsetY,
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

            this.triangle2 = new fabric.Triangle({
                left: event.e.offsetX,
                top: event.e.offsetY,
                width: 0,
                height: 0,
                angel: 0,
                fill: this.props.color.value,
                strokeWidth: parseInt(this.props.strokeWidth.value, 10),
                stroke: this.props.strokeColor.value
            });
            this.constPoint = {
                x: this.triangle2.left,
                y: this.triangle2.top
            }
            canvas.add(this.triangle, this.triangle2);

            canvas.on("mouse:move", this.handlers.moveHandler);
        }
    }
    moveHandler(event) {
        let deltaW = event.e.clientX - this.constPoint.x;
        let deltaH = event.e.clientY - this.constPoint.y;

        if (event.e.shiftKey){
            let length = Math.abs(deltaH)
            let k = 2*length
            if (deltaW >= 0 && deltaH >= 0) {
                this.triangle.set({
                    left: this.constPoint.x,
                    top: 2*this.constPoint.y - event.e.clientY,
                    width: k,
                    height: length,
                })
                this.triangle2.set({
                    left: this.constPoint.x + k,
                    top: event.e.clientY,
                    width: k,
                    height: length,
                    angle: 180,
                })
            } else if (deltaW < 0 && deltaH >= 0) {
                this.triangle.set({
                    left: this.constPoint.x - k,
                    top: 2*this.constPoint.y - event.e.clientY,
                    width: k,
                    height: length, 
                })
                this.triangle2.set({
                    left: this.constPoint.x,
                    top: event.e.clientY, 
                    width: k,
                    height: length, 
                    angle: 180
                })
            } else if (deltaW >= 0 && deltaH < 0) {
                this.triangle.set({
                    left: this.constPoint.x,
                    top: event.e.clientY, 
                    width: k,
                    height: length,
                })
                this.triangle2.set({ 
                    left: this.constPoint.x + k,
                    top: 2*this.constPoint.y - event.e.clientY, 
                    width: k,
                    height: length,
                    angle: 180
                })
            } else {
                this.triangle.set({
                    left: this.constPoint.x - k,
                    top: event.e.clientY,
                    width: k,
                    height: length,
                })
                this.triangle2.set({
                    left: this.constPoint.x,
                    top: 2*this.constPoint.y - event.e.clientY, 
                    width: k,
                    height: length,
                    angle: 180,
                })
            }
        }
        else{
            if (deltaW >= 0 && deltaH >= 0) {
                this.triangle.set({
                    top: 2*this.constPoint.y - event.e.clientY, 
                    width: deltaW,
                    height: deltaH,
                })
                this.triangle2.set({
                    left: event.e.clientX,
                    top: event.e.clientY,
                    width: deltaW,
                    height: deltaH,
                    angle: 180,
                })

            } else if (deltaW < 0 && deltaH >= 0) {
                this.triangle.set({
                    left: event.e.clientX,
                    top: 2*this.constPoint.y - event.e.clientY,
                    width: -deltaW,
                    height: deltaH, 
                })
                this.triangle2.set({
                    top: event.e.clientY, 
                    width: -deltaW,
                    height: deltaH, 
                    angle: 180
                })
            } else if (deltaW >= 0 && deltaH < 0) {
                this.triangle.set({
                    top: event.e.clientY, 
                    width: deltaW,
                    height: -deltaH,
                })
                this.triangle2.set({
                    left: event.e.clientX,
                    top: 2*this.constPoint.y - event.e.clientY, 
                    width: deltaW,
                    height: -deltaH,
                    angle: 180
                })
            } else {
                this.triangle.set({
                    left: event.e.clientX,
                    top: event.e.clientY,
                    width: -deltaW,
                    height: -deltaH,
                })
                this.triangle2.set({
                    top: 2*this.constPoint.y - event.e.clientY, 
                    width: -deltaW,
                    height: -deltaH,
                    angle: 180,
                })
            }
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
