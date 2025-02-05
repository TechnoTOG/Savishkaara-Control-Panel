const { io } = require("../server");
const express = require('express');
const router = express.Router(); // Ensure this is exported from server.js

module.exports = function (io) {
    io.on("connection", (socket) => {
      console.log(`User connected (ID: ${socket.id})`);
  
      // Handle user joining a specific page room
      socket.on("join-room", (roomName) => {
        socket.join(roomName);
        console.log(`User (ID: ${socket.id}) joined room: ${roomName}`);
      });
  
      // Handle user leaving a room
      socket.on("leave-room", (roomName) => {
        socket.leave(roomName);
        console.log(`User (ID: ${socket.id}) left room: ${roomName}`);
      });
  
      // Disconnect event
      socket.on("disconnect", () => {
        console.log(`User disconnected (ID: ${socket.id})`);
      });
    });
  
    return router; // Ensure router is returned
  };