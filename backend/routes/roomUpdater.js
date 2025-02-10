const { io } = require("../server");
const mongoose = require('mongoose');
const mongoConnect = require('../db/mongodb'); // Ensure MongoDB connection

// Define or retrieve the User model
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { collection: "users" }));

module.exports = function (io) {
    // Authorization middleware
    io.use(async (socket, next) => {
        const objID = socket.handshake.auth.objId;
        try {
            const user = await findUserById(objID);
            if (!user) {
                return next(new Error('Unauthorized: User not found'));
            }
            if (!['super', 'admin', 'coor'].includes(user.role)) {
                return next(new Error('Unauthorized: Insufficient permissions'));
            }
            socket.user = user; // Attach user object to the socket for later use
            next();
        } catch (error) {
            console.error('Error during authorization:', error);
            return next(new Error('Unauthorized: Server error'));
        }
    });

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
        const { user } = socket; // Retrieve user from the socket object
        const clientIp = socket.handshake.address;
        const userAgent = socket.handshake.headers['user-agent'];
        const timestamp = new Date().toISOString();

        // Log connection details
        console.log({
            event: 'user_connected',
            userId: user._id.toString(),
            userName: user.name,
            socketId: socket.id,
            clientIp,
            userAgent,
            timestamp
        });

        // Send welcome message to the client
        socket.emit("message", { message: "Welcome to the Socket.io server!" });

        // Define room access rules
        const ROOM_ACCESS = {
            'super': ['dashboard', 'samridhi', 'server', 'eventso', 'eventsa', 'userso', 'usersa'],
            'admin': ['dashboard', 'samridhi', 'vevents'],
            'coor': ['dashboard', 'myevent']
        };

        // Handle joining a room
        socket.on("join-room", (roomName) => {
            const allowedRooms = ROOM_ACCESS[user.role];
            if (allowedRooms && allowedRooms.includes(roomName)) {
                socket.join(roomName);
                console.log({
                    event: 'user_joined_room',
                    userId: user._id.toString(),
                    userName: user.name,
                    socketId: socket.id,
                    roomName,
                    timestamp: new Date().toISOString()
                });
            } else {
                // Redirect the user if they don't have permission
                const redirectUrl = "/403"; // Target URL for redirection
                socket.emit("redirect", { url: redirectUrl });
            }
        });

        // Handle leaving a room
        socket.on("leave-room", (roomName) => {
            socket.leave(roomName);
            console.log({
                event: 'user_left_room',
                userId: user._id.toString(),
                userName: user.name,
                socketId: socket.id,
                roomName,
                timestamp: new Date().toISOString()
            });
        });

        // Handle incoming messages
        socket.on("message", (data) => {
            console.log({
                event: 'message_received',
                userId: user._id.toString(),
                userName: user.name,
                socketId: socket.id,
                data,
                timestamp: new Date().toISOString()
            });

            // Echo back to the client
            socket.emit("message", { message: `Server received: ${JSON.stringify(data)}` });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log({
                event: 'user_disconnected',
                userId: user._id.toString(),
                userName: user.name,
                socketId: socket.id,
                timestamp: new Date().toISOString()
            });

            // Leave all rooms
            socket.rooms.forEach((room) => {
                socket.leave(room);
                console.log({
                    event: 'user_left_room_on_disconnect',
                    userId: user._id.toString(),
                    userName: user.name,
                    socketId: socket.id,
                    room,
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Handle errors
        socket.on("error", (error) => {
            console.error({
                event: 'socket_error',
                userId: user._id.toString(),
                userName: user.name,
                socketId: socket.id,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        });
    });
};

// Function to find a user by _id
async function findUserById(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}