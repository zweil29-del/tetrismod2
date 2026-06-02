# tetrismod2 - Tetr.io Style Tetris Game

A high-quality, single-player Tetris game built with HTML5 Canvas and Vanilla JavaScript. Designed to closely mirror the mechanics and feel of [tetr.io](https://tetr.io/), with all advanced Tetris mechanics implemented.

## Features

### Core Gameplay
- **All 7 Tetrominoes** (I, O, T, S, Z, J, L) with proper colors and spawning
- **SRS Rotation System** - Super Rotation System with wall kicks for realistic piece rotation
- **Collision Detection** - Accurate piece placement and boundary checking
- **Gravity System** - Progressive gravity that increases with levels
- **Lock Delay** - Brief delay before pieces lock, with reset on movement

### Advanced Mechanics
- **T-spin Detection** - Automatically detects T-spins and awards bonus points (1.5x multiplier)
- **Hold Piece** - Hold and swap pieces with the current falling piece (once per spawn)
- **Ghost Piece** - Visual preview showing where the piece will land
- **Hard Drop** - Instant piece placement with double points per row dropped
- **Soft Drop** - Faster controlled descent with 1 point per cell

### Scoring System
- **Base Scoring** - Standard Tetris scoring (100/300/500/800 points × level)
- **T-spin Bonus** - 1.5x multiplier on T-spin clears
- **Back-to-back Bonus** - 1.1x multiplier on consecutive Tetrises and T-spins
- **Level Progression** - Levels increase every 10 lines cleared
- **High Score Persistence** - Automatically saves high score to browser localStorage

### User Interface
- **Real-time Stats** - Live display of score, level, and lines cleared
- **Next Piece Preview** - Shows next 1 piece
- **Hold Piece Display** - Shows currently held piece (if any)
- **Controls Reference** - On-screen keyboard layout
- **Game Over Screen** - Final score, level, and lines with restart button
- **Pause Feature** - Press P to pause/resume at any time

## Controls

| Key | Action |
|-----|--------|
| **← →** | Move left/right |
| **↓** | Soft drop (faster fall with 1 point/cell) |
| **SPACE** | Hard drop (instant placement with 2 points/row) |
| **Z** | Rotate counter-clockwise |
| **X** or **↑** | Rotate clockwise |
| **C** | Hold piece (swap with current piece) |
| **P** | Pause/Resume |

## How to Play

1. Open `index.html` in a modern web browser
2. Use arrow keys to move and rotate pieces
3. Clear lines to increase your score and level
4. Achieve T-spins for bonus points
5. Beat your high score!

### Getting Started
- You can run this locally with any HTTP server:
  ```bash
  python3 -m http.server 8000
  # Then open http://localhost:8000
  ```

## Technical Details

### Architecture
```
tetrismod2/
├── index.html         # Main entry point with game layout
├── css/
│   └── style.css      # Styling with tetr.io-inspired design
├── js/
│   ├── main.js        # Application entry point & event handling
│   ├── game.js        # Game state management & logic
│   ├── board.js       # Board data structure & collision detection
│   ├── piece.js       # Tetromino definitions and piece logic
│   ├── rotation.js    # SRS rotation system with wall kicks
│   └── renderer.js    # Canvas rendering system
└── README.md          # This file
```

### Key Systems

**SRS Rotation System (`rotation.js`)**
- Implements official Tetris Rotation System (SRS) with wall kick table
- Special handling for I-piece with wider kick offsets
- Handles all rotation states and transitions
- T-spin detection based on cavity filling

**Board Management (`board.js`)**
- 10x20 playing field (standard Tetris dimensions)
- Collision detection for piece placement
- Line clear detection and cascade logic
- Efficient grid representation

**Rendering (`renderer.js`)**
- Hardware-accelerated Canvas rendering
- 30px cells for clear visibility
- Grid visualization with subtle coloring
- Ghost piece transparency (30% opacity)
- Separate canvases for next piece and hold piece displays

**Game State (`game.js`)**
- Gravity calculation with level-based acceleration
- Lock delay system (30 frames before lock)
- Score calculation with all multipliers
- High score persistence via localStorage
- Game over detection

## Game Mechanics Explained

### T-spin
A T-spin occurs when you rotate a T-piece into a cavity filled with blocks. The game detects this and awards a 1.5x score multiplier on the line clear. This is a key advanced technique in modern Tetris!

### Back-to-back Bonuses
Clearing 4 lines at once (Tetris) or a T-spin awards a 10% bonus on the next similar clear if it's consecutive.

### Level Progression
- Starting gravity: 0.5 cells/frame
- Each level increases gravity by 0.05
- Gravity caps at 5.0 cells/frame (around level 91)
- Score multiplier increases by level

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any browser with HTML5 Canvas and ES6 support

## Performance

- Optimized for 60 FPS gameplay
- Efficient collision detection
- Minimal canvas redraws
- Responsive input handling with DAS (Delayed Auto Shift)

## Code Quality

- Clean, modular architecture
- Object-oriented design with clear separation of concerns
- Well-documented code with comments on complex systems
- No external dependencies (vanilla JavaScript only)
- ~1,300 lines of code total

## Future Enhancement Ideas

- Sound effects and music
- Multiplayer modes
- Difficulty settings
- Skin/theme customization
- Replay/replay system
- Leaderboard integration
- Mobile touch controls

## License

This is a personal project for learning and entertainment purposes.

---

**Enjoy the game! Challenge yourself to beat your high score.** 🎮
