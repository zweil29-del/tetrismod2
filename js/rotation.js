// SRS (Super Rotation System) implementation
class RotationSystem {
    static WALL_KICK_TABLE_SRS = {
        // From 0 to R rotation (CW)
        '0->R': [
            [0, 0],
            [-1, 0],
            [-1, 1],
            [0, -2],
            [-1, -2]
        ],
        // From R to 2 rotation (CW)
        'R->2': [
            [0, 0],
            [1, 0],
            [1, -1],
            [0, 2],
            [1, 2]
        ],
        // From 2 to L rotation (CW)
        '2->L': [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, -2],
            [1, -2]
        ],
        // From L to 0 rotation (CW)
        'L->0': [
            [0, 0],
            [-1, 0],
            [-1, -1],
            [0, 2],
            [-1, 2]
        ],
        // I-piece specific wall kicks (wider piece)
        'I_0->R': [
            [0, 0],
            [-2, 0],
            [1, 0],
            [-2, -1],
            [1, 2]
        ],
        'I_R->2': [
            [0, 0],
            [-1, 0],
            [2, 0],
            [-1, 2],
            [2, -1]
        ],
        'I_2->L': [
            [0, 0],
            [2, 0],
            [-1, 0],
            [2, 1],
            [-1, -2]
        ],
        'I_L->0': [
            [0, 0],
            [1, 0],
            [-2, 0],
            [1, -2],
            [-2, 1]
        ]
    };

    static attemptRotation(piece, board, direction) {
        const oldRotation = piece.rotationState;
        const newRotation = (oldRotation + direction + 4) % 4;
        
        // Temporarily rotate
        piece.rotationState = newRotation;
        
        const rotationKey = this.getRotationKey(oldRotation, newRotation, piece.type);
        const kickTable = this.WALL_KICK_TABLE_SRS[rotationKey];
        
        if (!kickTable) {
            piece.rotationState = oldRotation;
            return false;
        }

        // Try each wall kick
        for (const [offsetX, offsetY] of kickTable) {
            const newX = piece.x + offsetX;
            const newY = piece.y + offsetY;
            
            if (board.canPlacePiece(piece, newX, newY)) {
                piece.x = newX;
                piece.y = newY;
                return true;
            }
        }

        // Rotation failed, revert
        piece.rotationState = oldRotation;
        return false;
    }

    static getRotationKey(oldRotation, newRotation, pieceType) {
        const rotationStates = ['0', 'R', '2', 'L'];
        const oldState = rotationStates[oldRotation];
        const newState = rotationStates[newRotation];
        
        if (pieceType === Piece.TYPES.I) {
            return `I_${oldState}->${newState}`;
        }
        
        return `${oldState}->${newState}`;
    }

    static detectTSpin(piece, board, movedX, movedY) {
        if (piece.type !== Piece.TYPES.T) return false;

        // Check if we just placed a T-piece in a cavity (T-spin detection)
        const shape = piece.getShape();
        const x = piece.x;
        const y = piece.y;

        let cavityCount = 0;

        // Check the four corners around the T
        const checkPositions = [
            [x - 1, y - 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1]
        ];

        for (const [checkX, checkY] of checkPositions) {
            if (!board.isInBounds(checkX, checkY)) {
                cavityCount++;
            } else if (board.grid[checkY][checkX] !== 0) {
                cavityCount++;
            }
        }

        return cavityCount >= 3;
    }
}
