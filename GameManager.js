class GameManager {
  constructor() {
    this.stage = 1;
    this.players = [];
    this.monsters = [];
  }

  addPlayer(username) {
    this.players.push(username);
  }

  handleEvent(value) {
    return {
      message: `${value.player} does ${value.action} to ${value.target}`,
      users: [value.player, value.target],
    };
  }
}

module.exports = GameManager;
