import User from "../../types/user";

const users: User[] = [];

// Join user to chat
export function userJoin(id: string, username: string, room: string): User {
	const user: User = { id, username, room };
	users.push(user);
	return user;
}

// Get current user
export function getCurrentUser(id: string): User {
	return users.find((user) => user.id == id);
}

// User leaves chat
export function userLeaves(id: string): User {
	const index: number = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// Get room users
export function getRoomUsers(room: string): User[] {
	return users.filter((user: User) => user.room === room);
}
