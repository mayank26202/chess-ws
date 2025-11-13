# ♟️ Chess-WS

A real-time multiplayer **Chess Game** built using **React.js** and **Node.js WebSockets (ws)**.  
This project enables two players to connect, play live chess, and see synchronized moves instantly through WebSocket communication.

---

## 🚀 Features

- Real-time gameplay via WebSockets  
- Two-player room-based connection (host and join)  
- Live move synchronization between players  
- Chess logic validation using `chess.js`  
- Player turn and move legality indication  
- Interactive UI using React and Tailwind CSS  
- Lightweight WebSocket backend built with Node.js  

---

## 🧰 Tech Stack

**Frontend:**
- React.js  
- Tailwind CSS  
- chess.js  

**Backend:**
- Node.js  
- ws (WebSocket library)  

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/chess-ws.git
cd chess-ws
```

## Install dependencies

For backend:
```bash
cd backend1
npm install
```

For frontend:
```bash
cd frontend
npm install
```

## Start the backend server
```bash
cd backend1
npm run dev
```

##Run the frontend
```bash
Copy code
cd frotend
npm run dev
```

## How It Works
Player A creates a new room (assigned by backend).

Player B joins using the room ID.

Both players’ boards stay in sync via WebSocket events.

The backend validates moves and broadcasts updates to both clients.

Game ends when a checkmate or draw condition is detected.


## Future Enhancements

Add player chat system

Implement user authentication

Add matchmaking and leaderboards

