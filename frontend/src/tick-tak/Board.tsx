import { useEffect, useRef, useState } from "react";
import Square from "./Square";

type Symbol = "X" | "O" | null;

function Board() {
    const socketRef = useRef<WebSocket | null>(null);

    const [board, setBoard] = useState<Symbol[]>(Array(9).fill(null));
    const [symbol, setSymbol] = useState<Symbol>(null);
    const [turn, setTurn] = useState<Symbol>(null);
    const [joined, setJoined] = useState(false);
    const [roomId] = useState("room1"); // later make this dynamic
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (socketRef.current) return;

        const ws = new WebSocket("ws://localhost:3000");

        ws.onopen = () => {
            console.log("WS connected");
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "joined") {
                setSymbol(msg.payload.symbol);
                setJoined(true);
            }

            if (msg.type === "start") {
                setTurn(msg.payload.turn);
            }

            if (msg.type === "update") {
                setBoard(msg.payload.board);
                setTurn(msg.payload.turn);
            }

            if (msg.type === "gameover") {
                setTimeout(() => {
                    alert("Game Over");
                    setGameOver(true);
                }, 100);
            }

            if (msg.type === "reset") {
                setBoard(msg.payload.board);
                setTurn(msg.payload.turn);
                setGameOver(false);
            }
        };

        ws.onclose = () => {
            console.log("WS closed");
            socketRef.current = null;
        };

        socketRef.current = ws;

        return () => ws.close();
    }, []);

    const createRoom = () => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(JSON.stringify({
            type: "create",
            payload: { roomId }
        }));
    };

    const joinRoom = () => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(JSON.stringify({
            type: "join",
            payload: { roomId }
        }));
    };

    const resetGame = () => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        console.log("resetting game");
        ws.send(JSON.stringify({
            type: "reset",
            payload: { roomId }
        }));
    };

    const handleClick = (index: number) => {
        const ws = socketRef.current;
        if (!ws) return;
        if (ws.readyState !== WebSocket.OPEN) return;
        if (turn !== symbol) return;
        if (board[index] !== null) return;

        ws.send(JSON.stringify({
            type: "move",
            payload: { index, symbol }
        }));
    };

    return (
        <div className="space-y-4">
            <h2>You: {symbol ?? "-"}</h2>
            <h3>Turn: {turn ?? "-"}</h3>

            {!joined && (
                <div className="flex gap-2">
                    <button
                        onClick={createRoom}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Create Room
                    </button>

                    <button
                        onClick={joinRoom}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Join Room
                    </button>
                </div>
            )}

            {gameOver && (
                <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Play Again
                </button>
            )}

            <div className="grid grid-cols-3 gap-1 w-48">
                {board.map((value, i) => (
                    <Square
                        key={i}
                        value={value}
                        onClick={() => handleClick(i)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;