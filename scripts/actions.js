import {canvas} from "./index.js";

export class Move {
    constructor(toolbarBtn) {
        this.toolbarBtn = toolbarBtn;

        this.handlers = {
            mousedown: this.mousedownHandler.bind(this),
        };

        this.datasetMode = toolbarBtn.dataset.mode;
        this.draw();
    }

    mousedownHandler(event) {
        let evt = event.e;
        if (evt.button === 0) {
            canvas.lastPosX = evt.clientX;
            canvas.lastPosY = evt.clientY;
        }
    }

    draw() {
        canvas.selection = true;
        canvas.on('mouse:down', this.handlers.mousedown);
    }

    exit() {
        canvas.selection = false;
        canvas.off('mouse:down', this.handlers.mousedown);
    }
}

export class Pen {
    constructor(toolbarBtn) {
        this.toolbarBtn = toolbarBtn;

        this.handlers = {
            altKeyDown: this.altKeyPressed.bind(this),
            altKeyUp: this.altKeyUnPressed.bind(this),
        };

        this.datasetMode = toolbarBtn.dataset.mode;
        this.draw();
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


    draw() {
        console.log("hello pen");
        canvas.isDrawingMode = true;
        window.addEventListener('keydown', this.handlers.altKeyDown);
        window.addEventListener('keyup', this.handlers.altKeyUp);
    }

    exit() {
        canvas.isDrawingMode = false;
        window.removeEventListener('keydown', this.handlers.altKeyDown);
        window.removeEventListener('keyup', this.handlers.altKeyUp);
    }
}

//
// class Copy extends Canvas {
//     constructor() {
//         super();
//     }
//
//     mouseOutHandler(event) {
//         console.log(event.offsetX);
//     }
//
//     draw() {
//         $canvas.addEventListener('mouseout', this.mouseOutHandler)
//         console.log("copy draw")
//     }
//
//     exit() {
//         $canvas.removeEventListener('mouseout', this.mouseOutHandler);
//     }
// }
//
// class Comment extends Canvas {
//     constructor() {
//         super();
//     }
//
//     mouseClickHandler(event) {
//         console.log(event.offsetX);
//     }
//
//     draw() {
//         $canvas.addEventListener('click', this.mouseClickHandler)
//         console.log("comment draw")
//     }
//
//     exit() {
//         $canvas.removeEventListener('click', this.mouseClickHandler);
//     }
// }
//
// class Shapes extends Canvas {
//     constructor() {
//         super();
//     }
//
//     mouseClickHandler(event) {
//         console.log(event.offsetX);
//     }
//
//     draw() {
//         $canvas.addEventListener('click', this.mouseClickHandler)
//         console.log("shapes draw")
//     }
//
//     exit() {
//         $canvas.removeEventListener('click', this.mouseClickHandler);
//     }
// }