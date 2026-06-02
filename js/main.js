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

        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Handle single-press controls
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.hardDrop();
                }
            } else if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                if (!this.game.gameOver) {
                    this.game.togglePause();
                    this.updatePauseUI();
                }
            } else if (e.key.toLowerCase() === 'c') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.holdPieceAction();
                }
            } else if (e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.rotateLeft();
                }
            } else if (e.key.toLowerCase() === 'x' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.rotateRight();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
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
        
        if (this.game.gameOver) {
            document.getElementById('finalScore').textContent = this.game.score;
            document.getElementById('finalLevel').textContent = this.game.level;
            document.getElementById('finalLines').textContent = this.game.lines;
            this.gameOverScreen.classList.add('active');
        }
    }

    handleInput() {
        if (this.game.gameOver || this.game.paused) return;

        if (this.keys['arrowleft']) {
            this.game.moveLeft();
        }
        if (this.keys['arrowright']) {
            this.game.moveRight();
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
