const { text } = require("express");
const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, chatwithid }) => {
      const roomId = [userId, chatwithid].sort().join("_");
      console.log(firstName + " Joining room Id :: ", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, chatwithid, text }) => {
        console.log(firstName + " send " + text);
        const roomId = [userId, chatwithid].sort().join("_");
        console.log("roomID     ", roomId);
        const hour = new Date().getHours();
        const minutes = new Date().getMinutes();
        const formatedTime = `${hour}:${minutes} ${new Date().getHours() > 12 ? "pm" : "am"}`;

        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, chatwithid] },
          });
          console.log("chattt",chat);

          if (!chat) {
            console.log("chatwithid",chatwithid)
            chat = new Chat({
              participants: [userId, chatwithid],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            formatedTime,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
