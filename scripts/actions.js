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
