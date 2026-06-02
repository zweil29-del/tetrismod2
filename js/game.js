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
        
        this.highScore = parseInt(localStorage.getItem('tetrisHighScore')) || 0;
        
        this.gravity = 0.5;
        this.gravityCounter = 0;
        this.lockDelay = 0;
        this.lockDelayMax = 30;
        this.lastMoveTime = 0;
        this.backToBackClears = 0;
        
        this.spawnNewPiece();
    }

    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = Piece.randomPiece();
        this.hasHeld = false;

        // Center the piece at the top using bounding box
        const shape = this.currentPiece.getShape();
        const bbox = Piece.getBoundingBox(shape);
        this.currentPiece.x = Math.floor((this.board.width - bbox.width) / 2) - bbox.minX;
        this.currentPiece.y = -bbox.minY;

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

            // Reset position and rotation
            const shape = this.currentPiece.getShape();
            const bbox = Piece.getBoundingBox(shape);
            this.currentPiece.x = Math.floor((this.board.width - bbox.width) / 2) - bbox.minX;
            this.currentPiece.y = -bbox.minY;
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
        // Store piece for T-spin detection
        const pieceType = this.currentPiece.type;
        
        this.board.placePiece(this.currentPiece, this.currentPiece.x, this.currentPiece.y);
        
        const clearResult = this.board.clearLines();
        const linesCleared = clearResult.count;
        const isTSpin = pieceType === Piece.TYPES.T && RotationSystem.detectTSpin(this.currentPiece, this.board);
        
        if (linesCleared > 0) {
            this.addScore(linesCleared, isTSpin);
            this.lines += linesCleared;
            
            this.level = Math.floor(this.lines / 10) + 1;
            this.gravity = Math.min(0.5 + (this.level - 1) * 0.05, 5.0);
        }

        this.spawnNewPiece();
    }

    addScore(linesCleared, isTSpin = false) {
        const baseScores = [0, 100, 300, 500, 800];
        let points = baseScores[Math.min(linesCleared, 4)] * this.level;
        
        // T-spin bonus
        if (isTSpin) {
            points = Math.floor(points * 1.5);
        }
        
        // Back-to-back bonus
        if (linesCleared === 4 || isTSpin) {
            this.backToBackClears++;
            if (this.backToBackClears > 1) {
                points = Math.floor(points * 1.1);
            }
        } else {
            this.backToBackClears = 0;
        }
        
        this.score += points;
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
        // Save high score if current score is higher
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tetrisHighScore', this.highScore);
        }
        
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
        this.backToBackClears = 0;
        
        this.gravity = 0.5;
        this.gravityCounter = 0;
        this.lockDelay = 0;
        
        this.spawnNewPiece();
    }

    togglePause() {
        this.paused = !this.paused;
    }
}
