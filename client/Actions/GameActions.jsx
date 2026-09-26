import GameStore from '../Stores/GameStore';

let interval = null;

const GameActions = {
    timerSet: (time) => {
        GameStore.setTimer(time);
    },
    timerStart: () => {

    	let data = {
    		minutes: 0,
    		seconds: 0
    	}

        GameStore.setTimer(data);

        if(interval != null) {
        	clearInterval(interval);
        }

        interval = setInterval( () => {
        	data.seconds++;
            if(data.seconds == 60) {
                data.seconds = 0;
                data.minutes++;
            }
        	GameActions.timerSet(data);
        }, 1000);

    },
    timerEnd: () => {
        if(interval != null) {
            clearInterval(interval);
        }
    },
    scoreGoal: (team) => {
        GameStore.goalScored(team);
    }
};

export default GameActions;
