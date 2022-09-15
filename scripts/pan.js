import {canvas} from "./index.js";

canvas.on('mouse:down:before', event => {
    let evt = event.e;
    if (evt.altKey) {
        canvas.getObjects().forEach(obj => obj.selectable = false);
    }
})

canvas.on('mouse:down', event => {
    let evt = event.e;
    if (evt.altKey) {
        canvas.isDragging = true;
        canvas.selection = false;
        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;
    }
});

canvas.on('mouse:move', event => {
    if (canvas.isDragging) {
        let e = event.e;
        let vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', event => {
    if (canvas.isDragging) {
        canvas.setViewportTransform(canvas.viewportTransform);
        canvas.isDragging = false;
        canvas.selection = true;
        canvas.getObjects().forEach(obj => obj.selectable = true);
    }
});
