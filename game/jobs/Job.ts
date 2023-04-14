type StatBlock = {
	vitality: number,
	attack: number,
	magicAttack: number,
	armor: number,
	magicArmor: number,
	speed: number,
}


class Job {
	health: number
	mana: number
	exp: number
	stats: StatBlock
	scaling: StatBlock

	constructor() {
		// general resources for jobs
		this.health = 0;
		this.mana = 0;
		this.exp = 0;
		// stats for jobs
		this.stats = {
			vitality: 0,
			attack: 0,
			magicAttack: 0,
			armor: 0,
			magicArmor: 0,
			speed: 0,
		};
		//scaling for stats
		this.scaling = {
			vitality: 0,
			attack: 0,
			magicAttack: 0,
			armor: 0,
			magicArmor: 0,
			speed: 0,
		};
	}
}

export default Job;
