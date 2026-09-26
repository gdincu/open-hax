
import React from 'react';

import Field from './Components/Field';
import Line from './Components/Field/line';
import Circle from './Components/Field/circle';
import Disc from './Components/Field/disc';
import Arc from './Components/Field/arc';
import Goal from './Components/Field/goal';
import Player from './Components/Player';
import Ball from './Components/Ball';
import Collisions from './collisions';

import materials from './materials';
import SoundManager from './SoundManager';

import GameActions from './Actions/GameActions';
import KeyboardInput from './Input/KeyboardInput';
import GamepadInput from './Input/GamepadInput';

//small stadium theme
let lines = [
                //line up
                {
                    x1: 30,
                    y1: 30,
                    x2: 830,
                    y2: 30,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line right 1
                {
                    x1: 830,
                    y1: 30,
                    x2: 830,
                    y2: 160,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line right 2
                {
                    x1: 830,
                    y1: 300,
                    x2: 830,
                    y2: 430,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line down
                {
                    x1: 30,
                    y1: 430,
                    x2: 830,
                    y2: 430,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line left 1
                {
                    x1: 30,
                    y1: 30,
                    x2: 30,
                    y2: 160,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line left 2
                {
                    x1: 30,
                    y1: 300,
                    x2: 30,
                    y2: 430,
                    collidesWithBall: true,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                },
                //line middle field
                {
                    x1: 430 - 1,
                    y1: 30,
                    x2: 430 - 1,
                    y2: 430,
                    collidesWithBall: false,
                    collidesWithPlayer: false,
                    style: {
                        borderColor: 0xffffff,
                        borderSize: 2,
                        borderAlpha: 1
                    }
                }
            ];

let circles = [{
                x: 860/2 -1,
                y: 460/2 - 1,
                diameter: 150,
                collidesWithBall: false,
                collidesWithPlayer: false,
                style: {
                    borderColor: 0xffffff,
                    borderSize: 2,
                    borderAlpha: 1
                }
            }];

let discs = [{
                x: 30,
                y: 160,
                diameter: 15,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    backgroundColor: 0xff0000,
                    backgroundAlpha: 1,
                    borderColor: 0x000000,
                    borderSize: 2,
                    borderAlpha: 1
                }
            },
            {
                x: 30,
                y: 300,
                diameter: 15,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    backgroundColor: 0xff0000,
                    backgroundAlpha: 1,
                    borderColor: 0x000000,
                    borderSize: 2,
                    borderAlpha: 1
                }
            },
            {
                x: 830,
                y: 160,
                diameter: 15,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    backgroundColor: 0x0000ff,
                    backgroundAlpha: 1,
                    borderColor: 0x000000,
                    borderSize: 2,
                    borderAlpha: 1
                }
            },
            {
                x: 830,
                y: 300,
                diameter: 15,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    backgroundColor: 0x0000ff,
                    backgroundAlpha: 1,
                    borderColor: 0x000000,
                    borderSize: 2,
                    borderAlpha: 1
                }
            }];

let arcs = [{
                cx: 10,
                cy: 160,
                radius: 140,
                startAngle: 150,
                endAngle: 210,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    borderColor: 0x000000,
                    borderSize: 3,
                    borderAlpha: 1
                }
            },{
                cx: 827,
                cy: 160,
                radius: 140,
                startAngle: 330,
                endAngle: 30,
                collidesWithBall: true,
                collidesWithPlayer: true,
                style: {
                    borderColor: 0x000000,
                    borderSize: 3,
                    borderAlpha: 1
                }
            }]

let ball = {

            };


//if the ball cross those lines, it's a goal
let goals = {
    home: {
        x1: 30,
        y1: 160,
        x2: 30,
        y2: 300,
        style: {
            borderColor: 0xffffff,
            borderSize: 2,
            borderAlpha: 1
        }
    },
    away: {
        x1: 830,
        y1: 160,
        x2: 830,
        y2: 300,
        style: {
            borderColor: 0xffffff,
            borderSize: 2,
            borderAlpha: 1
        }
    }

}



class Game extends React.Component {

    constructor(props) {
        super(props);
        this.bounds = new Phaser.Rectangle(0, 0, 860, 460);
        this.childs = [];
        this.onSoundLoad = this.onSoundLoad.bind(this);
        this.state = { pads: [null, null] };
        this.onPadChange = this.onPadChange.bind(this);
        // Goal mouth geometry (must match `goals` below and the wall gaps).
        this.goalLines = { leftX: 30, rightX: 830, topY: 160, bottomY: 300 };
        this.goalCooldownUntil = 0;
    }

    onPadChange() {
        if (typeof navigator === 'undefined' || !navigator.getGamepads) {
            return;
        }
        let pads = navigator.getGamepads();
        this.setState({
            pads: [
                pads && pads[0] ? pads[0].id : null,
                pads && pads[1] ? pads[1].id : null
            ]
        });
    }

    componentDidMount() {
        this.game = new Phaser.Game(this.bounds.width, this.bounds.height, Phaser.AUTO, 'open-hax-game', { preload: () => { this.preload(); }, create: () => { this.create(); }, update: () => { this.update(); } });

        window.addEventListener('gamepadconnected', this.onPadChange);
        window.addEventListener('gamepaddisconnected', this.onPadChange);

        GameActions.timerStart();
    }

    componentWillUnmount() {
        window.removeEventListener('gamepadconnected', this.onPadChange);
        window.removeEventListener('gamepaddisconnected', this.onPadChange);
        if (this.game) {
            this.game.destroy();
        }
    }

    preload() {
        //images
        this.game.load.image('field', 'img/grass.png');
        //sounds
        this.soundManager = new SoundManager(this.game, this.onSoundLoad);
        this.soundManager.preload();
    }

    create() {

        this.soundManager.create();
        // Enable Phaser's gamepad manager too (harmless; we poll via
        // navigator.getGamepads() so USB and Bluetooth look identical).
        if (this.game.input && this.game.input.gamepad) {
            this.game.input.gamepad.start();
        }
        this.game.stage.backgroundColor = '#5F7B48';
        this.game.world.setBounds(0, 0, this.bounds.width, this.bounds.height);

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.75;
        this.collisions = new Collisions(this.game);
        this.game.physics.p2.updateBoundsCollisionGroup();

        materials.init(this.game);

        this.game.physics.p2.setWorldMaterial(materials.world, true, true, true, true);
        this.game.physics.p2.world.defaultContactMaterial.friction = 0.9;
        this.game.physics.p2.world.setGlobalStiffness(1e5);

        this.field = new Field(this.game, materials.field, {
            width: 800,
            height: 400,
            x: 30,
            y: 30
        });
        this.field.render();

        lines.map((props) => {
            let line = new Line(this.game, this.collisions, props);
            this.field.addLine(line);
        });

        circles.map((props) => {
            let circle = new Circle(this.game, this.collisions, props);
            this.field.addCircle(circle);
        });

        arcs.map((props) => {
            let arc = new Arc(this.game, this.collisions, props);
            this.field.addArc(arc);
        });

        //goal home
        goals.home.home = true;
        let goalHome = new Goal(this.game, this.collisions, goals.home);
        this.field.addGoal(goalHome);

        //goal away
        goals.away.away = true;
        let goalAway = new Goal(this.game, this.collisions, goals.away);
        this.field.addGoal(goalAway);

        discs.map((props) => {
            let disc = new Disc(this.game, this.collisions, props);
            this.field.addDisc(disc);
        });


        // Local 2P on one PC: pad 0 (e.g. USB) drives home, pad 1 (e.g. BT) drives away.
        // Each falls back to keyboard so the game stays playable with 0/1 pads:
        // P1 fallback = arrows + X, P2 fallback = WASD + Space.
        let p1Input = new GamepadInput(0, new KeyboardInput(this.game, 'arrows'));
        let p2Input = new GamepadInput(1, new KeyboardInput(this.game, 'wasd'));
        this.p1Input = p1Input;
        this.p2Input = p2Input;

        this.player = new Player(this.game, materials.player, this.collisions, "home", "P1", ":)", true, p1Input);
        this.player2 = new Player(this.game, materials.player, this.collisions, "away", "P2", ":(", true, p2Input);
        this.ball = new Ball(this.game, materials.ball, this.collisions);

        this.field.addPlayer(300, 300, this.player);
        this.field.addPlayer(300, 50, this.player2);
        this.field.addBall(430, 300, this.ball);

        this.childs.push(this.player);
        this.childs.push(this.player2);
        this.childs.push(this.ball);
    }

    update() {
    	this.childs.map((child) => {
    		if(typeof child.update == 'function') {
    			child.update();
    		}
    	});
        this.checkGoal();
    }

    // Positional goal detection: the Goal bodies were never wired to the
    // collision groups (no group/callback/score existed), so no goal could
    // ever register. The side walls leave a gap at the goal mouth, letting
    // the ball cross x=30 / x=830 there — detect that crossing instead.
    checkGoal() {
        if (!this.ball || !this.ball.sprite || !this.ball.sprite.body) {
            return;
        }
        if (Date.now() < this.goalCooldownUntil) {
            return;
        }
        let x = this.ball.sprite.x;
        let y = this.ball.sprite.y;
        if (y < this.goalLines.topY || y > this.goalLines.bottomY) {
            return;
        }
        if (x < this.goalLines.leftX) {
            // crossed the home (left) line -> away scores
            this.onGoal('away');
        } else if (x > this.goalLines.rightX) {
            // crossed the away (right) line -> home scores
            this.onGoal('home');
        }
    }

    onGoal(team) {
        this.goalCooldownUntil = Date.now() + 2000;
        try {
            if (this.soundManager) {
                this.soundManager.goal();
            }
        } catch (e) {}
        GameActions.scoreGoal(team);
        this.resetKickoff();
    }

    resetBody(sprite, x, y) {
        if (!sprite || !sprite.body) {
            return;
        }
        try {
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.body.angularVelocity = 0;
            sprite.body.angle = 0;
        } catch (e) {}
        try {
            sprite.body.data.velocity[0] = 0;
            sprite.body.data.velocity[1] = 0;
        } catch (e) {}
        sprite.body.x = x;
        sprite.body.y = y;
        sprite.x = x;
        sprite.y = y;
    }

    resetKickoff() {
        this.resetBody(this.ball ? this.ball.sprite : null, 430, 230);
        this.resetBody(this.player ? this.player.sprite : null, 300, 230);
        this.resetBody(this.player2 ? this.player2.sprite : null, 560, 230);
    }

    onSoundLoad () {
        console.log("sounds loaded");
        this.soundManager.startPublic();
        setTimeout(() => {
            this.soundManager.startMatch();
        }, 2000)
    }

    render() {
        let pad0 = this.state.pads[0];
        let pad1 = this.state.pads[1];
        return  <div className="game">
                    <div id="open-hax-game"></div>
                    <div className="pad-status" style={{fontSize: '12px', margin: '6px 0'}}>
                        <div>P1 (red, home): Gamepad 0 {pad0 ? <span>connected: {pad0}</span> : <span>not detected — arrows + X</span>} — left stick / dpad to move, A / RT to kick</div>
                        <div>P2 (blue, away): Gamepad 1 {pad1 ? <span>connected: {pad1}</span> : <span>not detected — WASD + Space</span>} — left stick / dpad to move, A / RT to kick</div>
                        <div style={{opacity: 0.7}}>Tip: press any button on each pad once after page load so the browser exposes it. USB vs Bluetooth makes no difference.</div>
                    </div>
                </div>;
    }

}

export default Game;
