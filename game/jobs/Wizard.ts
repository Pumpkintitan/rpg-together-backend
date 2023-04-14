import Job from './Job';

class Wizard extends Job {
	constructor() {
		super();
		// wizard lol
	}

	healths() {
		return this.health;
	}
}

export default Wizard;
