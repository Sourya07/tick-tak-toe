import WebSocket, { WebSocketServer } from "ws";
// import { handleMessage } from "./wsRouter.js";
import { authenticateSocket } from "./wsAuth.js";

interface JwtPayload {
    userId: string;
}
interface AuthenticatedWebSocket extends WebSocket {
    userId?: string;
    roomId?: string;
}
type PlayerSymbol = "X" | "O";

interface GameRoom {
    players: Set<AuthenticatedWebSocket>;
    board: (PlayerSymbol | null)[];
    turn: PlayerSymbol;
}
export function initWebSocket(server: any) {
    const wss = new WebSocketServer({ server });

    const rooms = new Map<string, GameRoom>();
    wss.on("connection", (ws: AuthenticatedWebSocket, req) => {
        // const user = authenticateSocket(req);
        // if (!user) {
        //     ws.close();
        //     console.log("hello there is no user")
        //     return;
        // }


        // ws.userId = user.userId;

        ws.on("message", (data) => {
            let realmessage;

            try {
                realmessage = JSON.parse(data.toString());
            } catch (err) {
                console.log("Non-JSON message received:", data.toString());
                return; // ignore ping / junk
            }

            if (realmessage.type == "create") {


                const roomId = realmessage.payload.roomId;
                if (!roomId) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "roomId required"
                    }));
                    return;
                }

                const room: GameRoom = {
                    players: new Set(),
                    board: Array(9).fill(null),
                    turn: "X"
                };

                room.players.add(ws);
                rooms.set(roomId, room);

                ws.roomId = roomId;
                ws.send(JSON.stringify({
                    type: "created",
                    payload: { roomId, symbol: "X" }
                }));
                ws.send(JSON.stringify({
                    type: "joined",
                    payload: { symbol: "X", roomId }
                }));

                ws.send(JSON.stringify({
                    type: "start",
                    payload: { turn: room.turn }
                }));
            }

            if (realmessage.type == "join") {


                const room = rooms.get(realmessage.payload.roomId);
                if (!room) {
                    return
                }


                if (room.players.size >= 2) {
                    console.log(`[Join Failed] Room ${realmessage.payload.roomId} is full. Players: ${room.players.size}`);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Room full"
                    }));
                    return;
                }
                room.players.add(ws);
                ws.roomId = realmessage.payload.roomId;
                ws.send(JSON.stringify({
                    type: "joined",
                    payload: { symbol: "O", roomId: realmessage.payload.roomId }
                }));
                for (const client of room.players) {
                    client.send(JSON.stringify({
                        type: "start",
                        payload: { turn: room.turn }
                    }));
                }
            }


            if (realmessage.type === "chat") {
                const roomId = ws.roomId;

                if (!roomId) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "You are not in a room"
                    }));
                    return;
                }

                const room = rooms.get(roomId);
                if (!room) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Room not found"
                    }));
                    return;
                }


                for (const client of room.players) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: realmessage.payload.message
                            }
                        }));
                    }
                }
            }


            if (realmessage.type === "move") {
                const roomId = ws.roomId;
                if (!roomId) return;

                const room = rooms.get(roomId);
                if (!room) return;

                const { index, symbol } = realmessage.payload;


                if (room.turn !== symbol) {
                    ws.send(JSON.stringify({ type: "error", message: "Not your turn" }));
                    return;
                }


                if (room.board[index] !== null) {
                    ws.send(JSON.stringify({ type: "error", message: "Cell occupied" }));
                    return;
                }


                room.board[index] = symbol;
                room.turn = symbol === "X" ? "O" : "X";


                for (const client of room.players) {
                    client.send(JSON.stringify({
                        type: "update",
                        payload: {
                            board: room.board,
                            turn: room.turn
                        }
                    }));
                }



                const winner = checkWinner(room.board);
                if (winner === "X" || winner === "O") {
                    for (const client of room.players) {
                        client.send(JSON.stringify({
                            type: "gameover",
                            payload: { winner }
                        }));
                    }
                } else if (winner === "draw") {
                    for (const client of room.players) {
                        client.send(JSON.stringify({
                            type: "gameover",
                            payload: { winner: null }
                        }));
                    }
                }
            }

            if (realmessage.type === "reset") {
                const roomId = ws.roomId;
                if (!roomId) return;

                const room = rooms.get(roomId);
                if (!room) return;

                room.board = Array(9).fill(null);
                console.log("resetting board");
                console.log(room.board);
                room.turn = "X";

                for (const client of room.players) {
                    client.send(JSON.stringify({
                        type: "reset",
                        payload: {
                            board: room.board,
                            turn: room.turn
                        }
                    }));
                }
            }
        });

        ws.on("close", () => {
            const roomId = ws.roomId;
            if (!roomId) return;

            const room = rooms.get(roomId);
            if (!room) return;

            room.players.delete(ws);

            for (const client of room.players) {
                client.send(JSON.stringify({
                    type: "gameover",
                    payload: { reason: "opponent_left" }
                }));
            }

            rooms.delete(roomId);
        });



    });
}

function checkWinner(board: (string | null)[]) {
    const wins: [number, number, number][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of wins) {
        if (
            board[a] !== null &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return board.includes(null) ? null : "draw";
}