// roomupdater.js
const User = require('../models/User'); // Import the User model
module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Handle joining a room with authentication
        socket.on("join-room", async ({ roomName, objId }) => {
            try {
                const user = await findUserById(objId);
                if (!user) {
                    return socket.emit("error", { message: "Unauthorized: User not found" });
                }
                const ROOM_ACCESS = {
                    'super': ['dashboard', 'samridhi', 'server', 'eventso', 'eventsa', 'myevent', 'userso', 'usersa','eventreg'],
                    'admin': ['dashboard', 'samridhi', 'eventso','myevent'],
                    'coor': ['myevent']
                };
                const allowedRooms = ROOM_ACCESS[user.role];
                if (allowedRooms && allowedRooms.includes(roomName)) {
                    socket.join(roomName);
                    socket.user = user; // Attach user object to the socket for later use
                    console.log({
                        event   : 'user_joined_room',
                        userId  : user._id.toString(),
                        userName: user.name,
                        socketId: socket.id,
                        roomName,
                        timestamp: new Date().toISOString()
                    });
                    socket.emit("message", { message: `Successfully joined room: ${roomName}` });
                } else {
                    const redirectUrl = "/403"; // Target URL for redirection
                    socket.emit("redirect", { url: redirectUrl });
                }
            } catch (error) {
                console.error('Error during room join:', error);
                socket.emit("error", { message: "Unauthorized: Server error" });
            }
        });

        // Handle leaving a room
        socket.on("leave-room", (roomName) => {
            socket.leave(roomName);
            console.log({
                event: 'user_left_room',
                socketId: socket.id,
                roomName,
                timestamp: new Date().toISOString()
            });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log({
                event: 'user_disconnected',
                socketId: socket.id,
                timestamp: new Date().toISOString()
            });
        });

        // Handle errors
        socket.on("error", (error) => {
            console.error({
                event: 'socket_error',
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