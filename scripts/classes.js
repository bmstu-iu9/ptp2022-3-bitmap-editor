class Canvas {
    constructor($el) {
        this.$canvas = $el;
        this.ctx = $el.getContext('2d');
    }

    initToolbar() {
        const $toolbar = document.getElementById(TOOLBAR.id);
        const toolbar = new Toolbar(this.$canvas, $toolbar);
        toolbar.initBtns();
    }

    initGlobalParams() {
        const $globalParams = document.querySelector(GLOBALPARAMS.id);

    }

    start() {
        this.initToolbar();
        this.initGlobalParams();
    }
}

class Toolbar extends Canvas {
    constructor($canvas, $el) {
        super($canvas);
        this.$toolbar = $el;
    }


    initBtns() {
        this.$toolbarBtns = document.getElementsByClassName(TOOLBAR.btnClass);
        for (let $toolbarBtn of this.$toolbarBtns) {
            const toolbarBtn = new ToolbarBtn(this.$canvas, this.$toolbar, $toolbarBtn);
        }
    }

}

class ToolbarBtn extends Toolbar {
    constructor($canvas, $toolbar, $el) {
        super($canvas, $toolbar);
        this.$toolbarBtn = $el;
        this.initListeners();
    }

    static activeBtn;

    initListeners() {
        if (this.$toolbarBtn.classList.contains(TOOLBAR.activeBtnClass)) {
            this.activate();
        }
        this.$toolbarBtn.addEventListener('click', this.reactivate.bind(this));
    }

    activate() {
        ToolbarBtn.activeBtn = this;
        this.$toolbarBtn.classList.add(TOOLBAR.activeBtnClass);
        this.setMode();
    }

    reactivate() {
        if (ToolbarBtn.activeBtn !== this) {
            ToolbarBtn.activeBtn.disactivate();
            this.activate();
        }
    }

    disactivate() {
        this.$toolbarBtn.classList.remove(TOOLBAR.activeBtnClass);
        this.unsetMode();
    }

    switchMode(mode) {
        switch (mode) {
            case 'PEN':
                return new Pen(this.$canvas);
            case 'MOVE':
                return new Move(this.$canvas);
            case 'COPY':
                return new Copy(this.$canvas);
            case 'COMMENT':
                return new Comment(this.$canvas);
        }
    }

    setMode() {
        this.mode = this.switchMode(this.$toolbarBtn.dataset.mode);
        this.mode.draw();
    }

    unsetMode() {
        this.mode.exit();
    }
}

//======================================================
//=======================MODES==========================

class Move extends Canvas {
    constructor($canvas) {
        super($canvas);
        console.log(this.ctx);
    }

    mouseMoveHandler(event) {
        console.log(event.clientX);
    }

    draw() {
        this.$canvas.addEventListener('mousemove', this.mouseMoveHandler)
        console.log("move draw")
    }

    exit() {
        this.$canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    }
}

class Pen extends Canvas {
    constructor($canvas) {
        super($canvas);
        console.log(this.ctx);
    }

    mouseOverHandler(event) {
        console.log(event.clientX);
    }

    draw() {
        this.$canvas.addEventListener('mouseover', this.mouseOverHandler)
        console.log("pen draw")
    }

    exit() {
        this.$canvas.removeEventListener('mouseover', this.mouseOverHandler);
    }
}

class Copy extends Canvas {
    constructor($canvas) {
        super($canvas);
        console.log(this.ctx);
    }

    mouseOutHandler(event) {
        console.log(event.clientX);
    }

    draw() {
        this.$canvas.addEventListener('mouseout', this.mouseOutHandler)
        console.log("copy draw")
    }

    exit() {
        this.$canvas.removeEventListener('mouseout', this.mouseOutHandler);
    }
}

class Comment extends Canvas {
    constructor($canvas) {
        super($canvas);
        console.log(this.ctx);
    }

    mouseClickHandler(event) {
        console.log(event.clientX);
    }

    draw() {
        this.$canvas.addEventListener('click', this.mouseClickHandler)
        console.log("comment draw")
    }

    exit() {
        this.$canvas.removeEventListener('click', this.mouseClickHandler);
    }
}