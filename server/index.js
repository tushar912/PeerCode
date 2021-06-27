const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const mainRouter = require('./routes/main');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("Socket connection");
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.emit("countSockets", io.of("/").adapter.rooms.get(roomId).size);
    console.log(`Join room connection: ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`Leave room connection: ${roomId}`);
  });
  socket.on("syncCode", (data) => {
    socket.to(data.codeRoom).emit(
      "newCode",
      data.codeString
    );
  });

  socket.on("newMessage", (messageData) => {
    const codeRoom = messageData.codeRoom;
    delete messageData.codeRoom;
    socket.to(codeRoom).emit(
      "newMessage",
      messageData
    );
  });

  socket.on("initiateCall", (callData) => {
    socket.to(callData.codeRoom).emit("receiveCall", {
      offerId: callData.offerId,
      newConnection: callData.newConnection,
    });
  });

  socket.on("iceConnection", (data) => {
    socket.to(data.codeRoom).emit("iceConnection", data);
  });

  socket.on("callBack", (callData) => {
    socket.to(callData.offerId).emit("connectCall", {
      callBack: callData.callBack,
    });
  });
});

app.use('/', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app: app, server: server };