// Game state and logic
class Game {
    constructor(board, renderer) {
        this.board = board;
        this.renderer = renderer;
        
        this.currentPiece = null;
        this.nextPiece = Piece.randomPiece();
        this.holdPiece = null;
        this.hasHeld = false;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        
        this.gravity = 0.5;
        this.gravityCounter = 0;
        this.lockDelay = 0;
        this.lockDelayMax = 30;
        this.lastMoveTime = 0;
        
        this.spawnNewPiece();
    }

    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = Piece.randomPiece();
        this.hasHeld = false;

        // Center the piece at the top
        const shape = this.currentPiece.getShape();
        this.currentPiece.x = Math.floor((this.board.width - shape[0].length) / 2);
        this.currentPiece.y = 0;

        if (!this.board.canPlacePiece(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver = true;
        }
    }

    moveLeft() {
        if (this.canMove(-1, 0)) {
            this.currentPiece.x--;
            this.resetLockDelay();
        }
    }

    moveRight() {
        if (this.canMove(1, 0)) {
            this.currentPiece.x++;
            this.resetLockDelay();
        }
    }

    softDrop() {
        if (this.canMove(0, 1)) {
            this.currentPiece.y++;
            this.score += 1;
            this.resetLockDelay();
        } else {
            this.lockPiece();
        }
    }

    hardDrop() {
        let dropDistance = 0;
        while (this.canMove(0, 1)) {
            this.currentPiece.y++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.lockPiece();
    }

    rotateLeft() {
        RotationSystem.attemptRotation(this.currentPiece, this.board, -1);
        this.resetLockDelay();
    }

    rotateRight() {
        RotationSystem.attemptRotation(this.currentPiece, this.board, 1);
        this.resetLockDelay();
    }

    holdPieceAction() {
        if (this.hasHeld) return;

        this.hasHeld = true;

        if (this.holdPiece === null) {
            this.holdPiece = this.currentPiece;
            this.spawnNewPiece();
        } else {
            const temp = this.currentPiece;
            this.currentPiece = this.holdPiece;
            this.holdPiece = temp;

            // Reset position
            const shape = this.currentPiece.getShape();
            this.currentPiece.x = Math.floor((this.board.width - shape[0].length) / 2);
            this.currentPiece.y = 0;
            this.currentPiece.resetRotation();
        }

        this.lockDelay = 0;
    }

    canMove(dx, dy) {
        return this.board.canPlacePiece(
            this.currentPiece,
            this.currentPiece.x + dx,
            this.currentPiece.y + dy
        );
    }

    resetLockDelay() {
        this.lockDelay = 0;
    }

    lockPiece() {
        this.board.placePiece(this.currentPiece, this.currentPiece.x, this.currentPiece.y);
        
        const linesCleared = this.board.clearLines();
        if (linesCleared > 0) {
            this.addScore(linesCleared);
            this.lines += linesCleared;
            
            this.level = Math.floor(this.lines / 10) + 1;
            this.gravity = 0.5 + (this.level - 1) * 0.05;
        }

        this.spawnNewPiece();
    }

    addScore(linesCleared) {
        const baseScores = [0, 100, 300, 500, 800];
        this.score += baseScores[Math.min(linesCleared, 4)] * this.level;
    }

    update() {
        if (this.gameOver || this.paused) return;

        this.gravityCounter += this.gravity;
        
        if (this.gravityCounter >= 1) {
            if (this.canMove(0, 1)) {
                this.currentPiece.y++;
                this.lockDelay = 0;
            } else {
                this.lockDelay++;
                if (this.lockDelay >= this.lockDelayMax) {
                    this.lockPiece();
                }
            }
            this.gravityCounter = 0;
        }
    }

    reset() {
        this.board.reset();
        this.currentPiece = null;
        this.nextPiece = Piece.randomPiece();
        this.holdPiece = null;
        this.hasHeld = false;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        
        this.gravity = 0.5;
        this.gravityCounter = 0;
        this.lockDelay = 0;
        
        this.spawnNewPiece();
    }

    togglePause() {
        this.paused = !this.paused;
    }
}
