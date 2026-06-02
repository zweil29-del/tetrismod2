// Main application entry point and event handling
class GameApp {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.previewCanvas = document.getElementById('nextPiece');
        this.holdCanvas = document.getElementById('holdPiece');
        
        this.board = new Board(10, 20);
        this.renderer = new Renderer(this.canvas, this.previewCanvas, this.holdCanvas);
        this.game = new Game(this.board, this.renderer);
        
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.setupControls();
        this.setupEventListeners();
        
        this.animationFrameId = null;
        this.startGameLoop();
    }

    setupControls() {
        this.keys = {};
        this.lastMoveTime = {};
        this.DAS_DELAY = 120;
        this.DAS_REPEAT = 40;

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;

            // Handle single-press controls
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.hardDrop();
                }
            } else if (key === 'p') {
                e.preventDefault();
                if (!this.game.gameOver) {
                    this.game.togglePause();
                    this.updatePauseUI();
                }
            } else if (key === 'c') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.holdPieceAction();
                }
            } else if (key === 'z') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.rotateLeft();
                }
            } else if (key === 'x' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.rotateRight();
                }
            } else if (key === 'arrowleft' || key === 'arrowright') {
                e.preventDefault();
                this.lastMoveTime[key] = Date.now();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            if (key === 'arrowleft' || key === 'arrowright') {
                this.lastMoveTime[key] = 0;
            }
        });
    }

    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => {
            this.game.reset();
            this.gameOverScreen.classList.remove('active');
        });
    }

    updatePauseUI() {
        if (this.game.paused) {
            this.pauseOverlay.classList.add('active');
        } else {
            this.pauseOverlay.classList.remove('active');
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.game.score;
        document.getElementById('level').textContent = this.game.level;
        document.getElementById('lines').textContent = this.game.lines;
        document.getElementById('highScore').textContent = this.game.highScore;
        
        if (this.game.gameOver) {
            document.getElementById('finalScore').textContent = this.game.score;
            document.getElementById('finalLevel').textContent = this.game.level;
            document.getElementById('finalLines').textContent = this.game.lines;
            this.gameOverScreen.classList.add('active');
        }
    }

    handleInput() {
        if (this.game.gameOver || this.game.paused) return;

        const now = Date.now();

        // Left movement with DAS
        if (this.keys['arrowleft']) {
            const lastTime = this.lastMoveTime['arrowleft'] || 0;
            const timeSincePress = now - lastTime;
            
            if (lastTime === 0) {
                this.game.moveLeft();
                this.lastMoveTime['arrowleft'] = now;
            } else if (timeSincePress > this.DAS_DELAY && (timeSincePress - this.DAS_DELAY) % this.DAS_REPEAT === 0) {
                this.game.moveLeft();
            }
        }

        // Right movement with DAS
        if (this.keys['arrowright']) {
            const lastTime = this.lastMoveTime['arrowright'] || 0;
            const timeSincePress = now - lastTime;
            
            if (lastTime === 0) {
                this.game.moveRight();
                this.lastMoveTime['arrowright'] = now;
            } else if (timeSincePress > this.DAS_DELAY && (timeSincePress - this.DAS_DELAY) % this.DAS_REPEAT === 0) {
                this.game.moveRight();
            }
        }

        if (this.keys['arrowdown']) {
            this.game.softDrop();
        }
    }

    startGameLoop() {
        let lastTime = 0;

        const gameLoop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            this.handleInput();
            this.game.update();
            this.renderer.render(
                this.board,
                this.game.currentPiece,
                this.game.nextPiece,
                this.game.holdPiece
            );
            this.updateUI();

            this.animationFrameId = requestAnimationFrame(gameLoop);
        };

        this.animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
