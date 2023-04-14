import Wizard from './jobs/Wizard';
import Job from './jobs/Job';
import Monster from './monsters/Monster';

type Event = {
	player: string
	target: string
	action: string
}

class GameManager {
	stage: number
	players: Map<string, Job>
	monsters: Map<string, Monster>

	constructor() {
		this.stage = 1;
		this.players = new Map;
		this.monsters = new Map;
	}

	addPlayer(username: string, job: Job) {
		this.players.set(username, job)
	}

	handleEvent(value: Event) {
		const wiz = new Wizard();

		return {
			message: `${value.player} does '${wiz.healths()} and ${wiz.stats.vitality
				}' to ${value.target}`,
			users: [value.player, value.target],
		};
	}
}

export default GameManager;
