const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      try {
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (error) {
        console.error("Socket Join Error:", error.message);
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [location.lng, location.ltd],
          },
          socketId: socket.id,
        });
      } catch (error) {
        console.error("Location Update Error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(`Sending message to ${socketId}`, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

socket.on("send-message", async (data) => {
  try {
    let receiver;
    if (data.receiverType === "user") {
      receiver = await userModel.findById(data.receiverId);
    } else if (data.receiverType === "captain") {
      receiver = await captainModel.findById(data.receiverId);
    }

    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("receive-message", {
        senderId: data.senderId,
        message: data.message,
      });
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
});

module.exports = { initializeSocket, sendMessageToSocketId };
