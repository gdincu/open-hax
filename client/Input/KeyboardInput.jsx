// Shared interface (duck-typed):
//   getMove() -> { x: -1..1, y: -1..1, left, right, up, down: bool }
//     x: -1 = left, +1 = right. y: -1 = up, +1 = down.
//   isKickDown() -> bool

class KeyboardInput {

    // mapping: 'arrows' (P1 default: cursors + X) or 'wasd' (P2 default: WASD + Space)
    constructor(game, mapping) {
        this.game = game;
        this.mapping = mapping || 'arrows';

        if (this.mapping === 'wasd') {
            this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.kick = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        } else {
            this.cursors = game.input.keyboard.createCursorKeys();
            this.kick = game.input.keyboard.addKey(Phaser.Keyboard.X);
        }
    }

    _digital() {
        if (this.mapping === 'wasd') {
            return {
                left: this.left.isDown,
                right: this.right.isDown,
                up: this.up.isDown,
                down: this.down.isDown
            };
        }
        return {
            left: this.cursors.left.isDown,
            right: this.cursors.right.isDown,
            up: this.cursors.up.isDown,
            down: this.cursors.down.isDown
        };
    }

    getMove() {
        let d = this._digital();
        let x = (d.right ? 1 : 0) - (d.left ? 1 : 0);
        let y = (d.down ? 1 : 0) - (d.up ? 1 : 0);
        return { x: x, y: y, left: d.left, right: d.right, up: d.up, down: d.down };
    }

    isKickDown() {
        return this.kick.isDown;
    }
}

export default KeyboardInput;
