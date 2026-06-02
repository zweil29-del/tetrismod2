// Board state management
class Board {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(null).map(() => Array(width).fill(0));
        this.cellSize = 30;
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    canPlacePiece(piece, x, y) {
        const shape = piece.getShape();
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;

                    if (!this.isInBounds(boardX, boardY)) {
                        return false;
                    }

                    if (this.grid[boardY][boardX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece(piece, x, y) {
        const shape = piece.getShape();
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;
                    if (this.isInBounds(boardX, boardY)) {
                        this.grid[boardY][boardX] = {
                            type: piece.type,
                            color: piece.color
                        };
                    }
                }
            }
        }
    }

    clearLines() {
        const linesToClear = [];

        for (let y = 0; y < this.height; y++) {
            if (this.grid[y].every(cell => cell !== 0)) {
                linesToClear.push(y);
            }
        }

        for (let i = linesToClear.length - 1; i >= 0; i--) {
            this.grid.splice(linesToClear[i], 1);
        }

        while (this.grid.length < this.height) {
            this.grid.unshift(Array(this.width).fill(0));
        }

        return linesToClear.length;
    }

    getOccupiedCells(x, y) {
        const cells = [];
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.grid[row][col] !== 0) {
                    cells.push({ x: col, y: row });
                }
            }
        }
        return cells;
    }

    checkGameOver(x, y) {
        const shape = Piece.SHAPES[Piece.TYPES.I][0]; // Use any piece
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (this.grid[y + row] && this.grid[y + row][x + col] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    reset() {
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
    }
}
