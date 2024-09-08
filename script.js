// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.drawing-board canvas');
    const ctx = canvas.getContext('2d');
    const sizeSlider = document.getElementById('size-slider');
    const colorPicker = document.getElementById('color-picker');
    const fillColorCheckbox = document.getElementById('fill-color');
    const clearCanvasButton = document.querySelector('.clear-canvas');
    const saveImgButton = document.querySelector('.save-img');

    let currentTool = 'brush';
    let brushSize = sizeSlider.value;
    let brushColor = colorPicker.value;
    let fillColor = false;
    let isDrawing = false;
    let startX, startY;

    // Set canvas size
    canvas.width = document.querySelector('.drawing-board').clientWidth;
    canvas.height = document.querySelector('.drawing-board').clientHeight;

    // Function to handle tool selection
    document.querySelectorAll('.tool').forEach(tool => {
        tool.addEventListener('click', () => {
            document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
            tool.classList.add('active');
            currentTool = tool.id;
        });
    });

    // Function to handle color selection
    document.querySelectorAll('.color .option').forEach(color => {
        color.addEventListener('click', () => {
            document.querySelectorAll('.color .option').forEach(c => c.classList.remove('selected'));
            color.classList.add('selected');
            brushColor = color.style.backgroundColor || colorPicker.value;
        });
    });

    colorPicker.addEventListener('input', (e) => {
        brushColor = e.target.value;
        document.querySelector('.color .selected').style.backgroundColor = brushColor;
    });

    fillColorCheckbox.addEventListener('change', (e) => {
        fillColor = e.target.checked;
    });

    sizeSlider.addEventListener('input', (e) => {
        brushSize = e.target.value;
    });

    // Drawing logic
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        startX = e.clientX - canvas.offsetLeft;
        startY = e.clientY - canvas.offsetTop;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            const x = e.clientX - canvas.offsetLeft;
            const y = e.clientY - canvas.offsetTop;

            if (currentTool === 'brush') {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;
                ctx.lineTo(x, y);
                ctx.stroke();
            } else if (currentTool === 'eraser') {
                ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'triangle') {
            const endX = event.clientX - canvas.offsetLeft;
            const endY = event.clientY - canvas.offsetTop;

            ctx.fillStyle = fillColor ? brushColor : 'transparent';
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;

            if (currentTool === 'rectangle') {
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
                if (fillColor) ctx.fillRect(startX, startY, endX - startX, endY - startY);
            } else if (currentTool === 'circle') {
                ctx.beginPath();
                const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
                ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                ctx.stroke();
                if (fillColor) ctx.fill();
            } else if (currentTool === 'triangle') {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineTo(startX, endY);
                ctx.closePath();
                ctx.stroke();
                if (fillColor) ctx.fill();
            }
        }
        isDrawing = false;
    });

    // Clear canvas button
    clearCanvasButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save image button
    saveImgButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
