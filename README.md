# OpenHax — Local 2-Player Haxball Clone

> This is a fork that adds split-screen multiplayer using 2 controllers connected to the same PC.

![screenshot](screenshot.png)

There is no online play and no chat — each player uses their own gamepad (e.g. one USB, one Bluetooth).
<br>Rendering and physics are **Phaser** (P2 physics), UI is **React**, served by a minimal **Express** server.

## Controls

| | P1 (red, home) | P2 (blue, away) |
|---|---|---|
| Gamepad | Pad 0 (e.g. USB) | Pad 1 (e.g. Bluetooth) |
| Move | Left stick / d-pad | Left stick / d-pad |
| Kick | A / RT | A / RT |
| Keyboard fallback | Arrows + X | WASD + Space |

The pad assignment is shown under the field. 
<br><br>**Tip**: press any button on each pad once
after the page loads, otherwise the browser does not expose it. USB vs Bluetooth
makes no difference — they are just pad 0 and pad 1.

## Rules

* Score by getting the ball through the opponent's goal
* The header scoreboard updates, a goal sound plays, and play restarts from kickoff
* The timer in the header counts up from kickoff
