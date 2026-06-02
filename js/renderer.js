// Canvas rendering system
class Renderer {
    constructor(canvas, previewCanvas, holdCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.previewCanvas = previewCanvas;
        this.previewCtx = previewCanvas.getContext('2d');
        this.holdCanvas = holdCanvas;
        this.holdCtx = holdCanvas.getContext('2d');
        
        this.cellSize = 30;
        this.gridColor = '#1a3a3a';
        this.gridBorderColor = '#00ff88';
    }

    clear() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(board) {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= board.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, board.height * this.cellSize);
            this.ctx.stroke();
        }

        for (let y = 0; y <= board.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(board.width * this.cellSize, y * this.cellSize);
            this.ctx.stroke();
        }

        // Border
        this.ctx.strokeStyle = this.gridBorderColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, board.width * this.cellSize, board.height * this.cellSize);
    }

    drawBoard(board) {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                const cell = board.grid[y][x];
                if (cell !== 0) {
                    this.drawCell(x, y, cell.color, this.ctx);
                }
            }
        }
    }

    drawPiece(piece, offsetX = 0, offsetY = 0) {
        const shape = piece.getShape();
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = piece.x + x + offsetX;
                    const boardY = piece.y + y + offsetY;
                    if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20) {
                        this.drawCell(boardX, boardY, piece.color, this.ctx);
                    }
                }
            }
        }
    }

    drawGhostPiece(piece) {
        const ghostY = this.getGhostY(piece);
        const shape = piece.getShape();
        
        this.ctx.globalAlpha = 0.3;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = ghostY + y;
                    if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20) {
                        this.drawCell(boardX, boardY, piece.color, this.ctx);
                    }
                }
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawCell(x, y, color, context = this.ctx) {
        const px = x * this.cellSize;
        const py = y * this.cellSize;

        context.fillStyle = color;
        context.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);

        // Highlight
        context.fillStyle = color.replace(/^#/, '#') + '88';
        context.fillRect(px + 1, py + 1, this.cellSize - 2, 6);
    }

    drawPreview(piece) {
        this.previewCtx.fillStyle = '#1a1a2e';
        this.previewCtx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

        const shape = piece.getShape();
        const bbox = Piece.getBoundingBox(shape);
        
        const canvasWidth = this.previewCanvas.width;
        const canvasHeight = this.previewCanvas.height;
        const cellSize = 15;
        
        const offsetX = (canvasWidth - bbox.width * cellSize) / 2;
        const offsetY = (canvasHeight - bbox.height * cellSize) / 2;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = offsetX + (x - bbox.minX) * cellSize;
                    const py = offsetY + (y - bbox.minY) * cellSize;
                    
                    this.previewCtx.fillStyle = piece.color;
                    this.previewCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    
                    this.previewCtx.fillStyle = piece.color.replace(/^#/, '#') + '88';
                    this.previewCtx.fillRect(px + 1, py + 1, cellSize - 2, 4);
                }
            }
        }
    }

    drawHold(piece) {
        this.holdCtx.fillStyle = '#1a1a2e';
        this.holdCtx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);

        if (!piece) return;

        const shape = piece.getShape();
        const bbox = Piece.getBoundingBox(shape);
        
        const canvasWidth = this.holdCanvas.width;
        const canvasHeight = this.holdCanvas.height;
        const cellSize = 15;
        
        const offsetX = (canvasWidth - bbox.width * cellSize) / 2;
        const offsetY = (canvasHeight - bbox.height * cellSize) / 2;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = offsetX + (x - bbox.minX) * cellSize;
                    const py = offsetY + (y - bbox.minY) * cellSize;
                    
                    this.holdCtx.fillStyle = piece.color;
                    this.holdCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    
                    this.holdCtx.fillStyle = piece.color.replace(/^#/, '#') + '88';
                    this.holdCtx.fillRect(px + 1, py + 1, cellSize - 2, 4);
                }
            }
        }
    }

    getGhostY(piece, board) {
        let ghostY = piece.y;
        while (board.canPlacePiece(piece, piece.x, ghostY + 1)) {
            ghostY++;
        }
        return ghostY;
    }

    render(board, currentPiece, nextPiece, holdPiece) {
        this.clear();
        this.drawGrid(board);
        this.drawBoard(board);
        
        if (currentPiece) {
            this.drawGhostPiece(currentPiece, board);
            this.drawPiece(currentPiece);
        }

        if (nextPiece) {
            this.drawPreview(nextPiece);
        }

        if (holdPiece) {
            this.drawHold(holdPiece);
        } else {
            this.drawHold(null);
        }
    }
}
