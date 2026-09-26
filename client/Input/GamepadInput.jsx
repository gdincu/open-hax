// Polls one physical gamepad via the standard Gamepad API.
// USB vs Bluetooth does not matter: the browser exposes both as pad indices.
// Standard mapping assumed (Chrome/Edge/Firefox "standard"):
//   axes[0,1] = left stick, buttons[14,15,12,13] = dpad L/R/U/D,
//   buttons[0] (A / Cross) or buttons[7] (RT) = kick.
// An optional keyboard fallback keeps the game playable when the pad is
// disconnected or before the user presses a button (browsers only expose
// pads after first interaction).

const DEADZONE = 0.25;

function applyDeadzone(v) {
    if (Math.abs(v) < DEADZONE) {
        return 0;
    }
    // rescale remaining range to 0..1 for nicer control
    let sign = v > 0 ? 1 : -1;
    return sign * ((Math.abs(v) - DEADZONE) / (1 - DEADZONE));
}

class GamepadInput {

    // padIndex: 0 = first pad (e.g. USB), 1 = second pad (e.g. Bluetooth).
    // fallback: optional KeyboardInput used when pad is missing.
    constructor(padIndex, fallback) {
        this.padIndex = (padIndex == null) ? 0 : padIndex;
        this.fallback = fallback || null;
    }

    _pad() {
        try {
            let pads = (typeof navigator !== 'undefined' && navigator.getGamepads)
                ? navigator.getGamepads()
                : [];
            if (!pads) {
                return null;
            }
            return pads[this.padIndex] || null;
        } catch (e) {
            return null;
        }
    }

    getId() {
        let pad = this._pad();
        return pad ? pad.id : null;
    }

    isConnected() {
        return !!this._pad();
    }

    _buttonDown(pad, i) {
        if (!pad || !pad.buttons || !pad.buttons[i]) {
            return false;
        }
        let b = pad.buttons[i];
        // spec: button can be object {pressed, value} or plain number (old impl)
        if (typeof b === 'object') {
            return !!(b.pressed || b.value > 0.5);
        }
        return b > 0.5;
    }

    getMove() {
        let pad = this._pad();

        if (!pad) {
            if (this.fallback) {
                return this.fallback.getMove();
            }
            return { x: 0, y: 0, left: false, right: false, up: false, down: false };
        }

        let ax = (pad.axes && pad.axes.length > 0) ? applyDeadzone(pad.axes[0] || 0) : 0;
        let ay = (pad.axes && pad.axes.length > 1) ? applyDeadzone(pad.axes[1] || 0) : 0;

        let dLeft = this._buttonDown(pad, 14);
        let dRight = this._buttonDown(pad, 15);
        let dUp = this._buttonDown(pad, 12);
        let dDown = this._buttonDown(pad, 13);

        // dpad overrides / adds to stick
        if (dLeft) { ax = -1; }
        if (dRight) { ax = 1; }
        if (dUp) { ay = -1; }
        if (dDown) { ay = 1; }

        // clamp (stick + dpad could exceed 1)
        ax = Math.max(-1, Math.min(1, ax));
        ay = Math.max(-1, Math.min(1, ay));

        return {
            x: ax,
            y: ay,
            left: ax < -0.2 || dLeft,
            right: ax > 0.2 || dRight,
            up: ay < -0.2 || dUp,
            down: ay > 0.2 || dDown
        };
    }

    isKickDown() {
        let pad = this._pad();
        if (!pad) {
            return this.fallback ? this.fallback.isKickDown() : false;
        }
        // A / Cross, plus RT / RB as alternates
        return this._buttonDown(pad, 0) || this._buttonDown(pad, 7) || this._buttonDown(pad, 5);
    }
}

export default GamepadInput;
