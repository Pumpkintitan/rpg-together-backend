class Monster {
	health: number
	mana: number
	stats: object

	constructor() {
		// general resources for jobs
		this.health = 0;
		this.mana = 0;
		// stats for jobs
		this.stats = {
			vitality: 0,
			attack: 0,
			magicAttack: 0,
			armor: 0,
			magicArmor: 0,
			speed: 0,
		};
	}
}

export default Monster;
