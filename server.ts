import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import GameManager from './game/GameManager';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

type Message = {
	type: string
	id: string
	user: string
	value: string
	time: number
}

type Event = {
	player: string
	target: string
	action: string
}

let rooms = new Map;

class Connection {
	socket: any
	io: any
	username: string
	room: Room | null
	constructor(io: any, socket: any) {
		this.socket = socket;
		this.io = io;
		this.username = 'Anon';
		this.room = null;

		socket.on('joinroom', (roomid: { roomid: number, username: string }) => this.joinroom(roomid));
		socket.on('connect_error', (err: any) => {
			console.log(`connect_error due to ${err.message}`);
		});
	}

	joinroom(info: { roomid: number, username: string }) {
		if (!rooms.get(info.roomid)) {
			rooms.set(info.roomid, new Room(info.roomid, this.io))
		}
		this.username = info.username;
		rooms.get(info.roomid).addUser(info.username, this);
		this.room = rooms.get(info.roomid);
	}
}

class Room {
	roomid: number
	io: any
	users: Map<string, Connection>
	gameManager: GameManager

	constructor(id: number, io: any) {
		this.roomid = id;
		this.io = io;
		this.users = new Map;
		this.gameManager = new GameManager();
	}

	addUser(username: string, connection: Connection) {
		this.users.set(username, connection)
		if (this.users.get(username)) {
			this.users.get(username)?.socket.join(this.roomid);
			this.users.get(username)?.socket.on('message', (value: string) => {
				this.handleUserMessage(value, this.users.get(username))
			}
			);
		}
		this.users.get(username)?.socket.on('event', (value: Event) => this.handleEvent(value));
		console.log(`${username} connected to room ${this.roomid}`);
		this.handleServerMessage(`${username} connected to room ${this.roomid}`, [
			username,
		]);
	}

	sendMessage(message: Message) {
		this.io.to(this.roomid).emit('message', message);
		console.log(`Sent "${message.value}" to room ${this.roomid}`);
	}

	handleServerMessage(value: string, users: Array<string>) {
		let userString = '';
		for (const user of users) {
			userString += `${user}|`;
		}
		const message: Message = {
			type: 'server',
			id: uuidv4(),
			user: userString,
			value,
			time: Date.now(),
		};

		this.sendMessage(message);
	}

	handleUserMessage(value: string, user: Connection | undefined) {
		if (user !== undefined) {
			const message: Message = {
				type: 'user',
				id: uuidv4(),
				user: user.username,
				value,
				time: Date.now(),
			};
			this.sendMessage(message);
		}

	}

	handleEvent(value: Event) {
		const gameMessage = this.gameManager.handleEvent(value);
		console.log(gameMessage);
		this.handleServerMessage(gameMessage.message, gameMessage.users);
	}
}

io.on('connection', (socket) => {
	new Connection(io, socket);
});

httpServer.listen(8080, () =>
	console.log('listening on http://localhost:8080')
);
