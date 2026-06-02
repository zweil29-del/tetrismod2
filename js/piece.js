// Tetromino piece definitions and logic
class Piece {
    static TYPES = {
        I: 'I',
        O: 'O',
        T: 'T',
        S: 'S',
        Z: 'Z',
        J: 'J',
        L: 'L'
    };

    static COLORS = {
        I: '#00f0f0',
        O: '#f0f000',
        T: '#a000f0',
        S: '#00f000',
        Z: '#f00000',
        J: '#0000f0',
        L: '#f0a000'
    };

    static SHAPES = {
        I: [
            [[0, 0, 0, 0],
             [1, 1, 1, 1],
             [0, 0, 0, 0],
             [0, 0, 0, 0]],
            [[0, 0, 1, 0],
             [0, 0, 1, 0],
             [0, 0, 1, 0],
             [0, 0, 1, 0]],
            [[0, 0, 0, 0],
             [0, 0, 0, 0],
             [1, 1, 1, 1],
             [0, 0, 0, 0]],
            [[0, 1, 0, 0],
             [0, 1, 0, 0],
             [0, 1, 0, 0],
             [0, 1, 0, 0]]
        ],
        O: [
            [[1, 1],
             [1, 1]],
            [[1, 1],
             [1, 1]],
            [[1, 1],
             [1, 1]],
            [[1, 1],
             [1, 1]]
        ],
        T: [
            [[0, 1, 0],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 1],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 1],
             [0, 1, 0]],
            [[0, 1, 0],
             [1, 1, 0],
             [0, 1, 0]]
        ],
        S: [
            [[0, 1, 1],
             [1, 1, 0],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 1],
             [0, 0, 1]],
            [[0, 0, 0],
             [0, 1, 1],
             [1, 1, 0]],
            [[1, 0, 0],
             [1, 1, 0],
             [0, 1, 0]]
        ],
        Z: [
            [[1, 1, 0],
             [0, 1, 1],
             [0, 0, 0]],
            [[0, 0, 1],
             [0, 1, 1],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 0],
             [0, 1, 1]],
            [[0, 1, 0],
             [1, 1, 0],
             [1, 0, 0]]
        ],
        J: [
            [[1, 0, 0],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 1],
             [0, 1, 0],
             [0, 1, 0]],
            [[0, 0, 0],
             [1, 1, 1],
             [0, 0, 1]],
            [[0, 1, 0],
             [0, 1, 0],
             [1, 1, 0]]
        ],
        L: [
            [[0, 0, 1],
             [1, 1, 1],
             [0, 0, 0]],
            [[0, 1, 0],
             [0, 1, 0],
             [0, 1, 1]],
            [[0, 0, 0],
             [1, 1, 1],
             [1, 0, 0]],
            [[1, 1, 0],
             [0, 1, 0],
             [0, 1, 0]]
        ]
    };

    constructor(type) {
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.rotationState = 0;
        this.shape = Piece.SHAPES[type];
        this.color = Piece.COLORS[type];
    }

    getShape() {
        return this.shape[this.rotationState];
    }

    rotate(direction = 1) {
        const newRotation = (this.rotationState + direction + 4) % 4;
        this.rotationState = newRotation;
    }

    resetRotation() {
        this.rotationState = 0;
    }

    clone() {
        const cloned = new Piece(this.type);
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.rotationState = this.rotationState;
        return cloned;
    }

    static randomPiece() {
        const types = Object.values(Piece.TYPES);
        return new Piece(types[Math.floor(Math.random() * types.length)]);
    }

    static getBoundingBox(shape) {
        let minX = shape[0].length;
        let maxX = -1;
        let minY = shape.length;
        let maxY = -1;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        return {
            minX: minX === shape[0].length ? 0 : minX,
            maxX: maxX === -1 ? 0 : maxX,
            minY: minY === shape.length ? 0 : minY,
            maxY: maxY === -1 ? 0 : maxY,
            width: (maxX === -1 ? 0 : maxX - (minX === shape[0].length ? 0 : minX)) + 1,
            height: (maxY === -1 ? 0 : maxY - (minY === shape.length ? 0 : minY)) + 1
        };
    }
}
