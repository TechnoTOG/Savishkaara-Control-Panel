// utils/roomManager.js

const Room = {
    /**
     * Joins a room using the provided WebSocket instance.
     * @param {Object} socket - The WebSocket instance.
     * @param {string} roomName - The name of the room to join.
     * @param {string} objId - The user's ID or identifier.
     */
    join: (socket, roomName, objId) => {
      if (socket) {
        socket.emit("join-room", { roomName, objId });
      }
    },
  
    /**
     * Leaves a room using the provided WebSocket instance.
     * @param {Object} socket - The WebSocket instance.
     * @param {string} roomName - The name of the room to leave.
     */
    leave: (socket, roomName) => {
      if (socket) {
        socket.emit("leave-room", roomName);
      }
    },
  };
  
  export default Room;