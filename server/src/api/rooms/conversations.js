import app, {playRoomSocket} from "~/src/server.js";
import Rooms from "~/src/models/rooms.js";
import Convos from "~/src/models/convos.js";
import { authMiddleware } from "~/src/lib/middlewares";
import Users from "../../models/users";

app.post("/get-current-convo", authMiddleware, async (req, res) => {
  let {} = req.body;

  if (req.user.currentConvoId == null) {
    let room = await Rooms.findOne({
      admins: req.user._id,
    });
  
    res.json({
      room
    });
  } else {
    let convo = await Convos.findOne({
      _id: req.user.currentConvoId,
    });
    let room = await Rooms.findOne({
      _id: convo.roomId,
    });
  
    res.json({
      convo,
      room
    });  
  }
});

app.post("/client/join-convo", authMiddleware, async (req, res) => {
  let { socketRoomId } = req.body;

  let room = await Rooms.findOne({socketRoomId});
  if (room == null) {
    res.status(400).json({message: `${socketRoomId} doesn't exist`});
  }

  let convo = await Convos.insert({
    clientId: req.user._id,
    roomId: room._id,
    state: "waiting"
  });

  await Users.update({_id: req.user._id},
    {$set: {
      currentConvoId: convo._id,
      convoRole: "client"
    }
  });

  res.json({
    convo,
    room
  });
});

app.post("/client/leave-convo", authMiddleware, async (req, res) => {
  let {} = req.body;

  if (req.user.currentConvoId == null) {
    res.json({
      message: "Client is not in any conversation"
    });
    return ;
  }
  
  let convo = await Convos.findOne({_id: req.user.currentConvoId});
  await Convos.update({_id: convo._id}, {
    $set: {
      state: convo.state == "waiting" ? "abandoned" : "ended-by-client"
    }
  });

  await Users.update({_id: req.user._id},
    {$set: {
      currentConvoId: null,
      convoRole: null  
    }
  });

  res.json({
    message: "Success"
  });
});

app.post("/admin/end-convo", authMiddleware, async (req, res) => {
  let {} = req.body;

  if (req.user.currentConvoId == null) {
    res.json({
      message: "Admin is not in any conversation"
    });
    return ;
  }
  
  let convo = await Convos.findOne({_id: req.user.currentConvoId});
  await Convos.update({_id: convo._id}, {
    $set: {
      state: convo.state == "ended-by-admin"
    }
  });

  await Users.update({_id: req.user._id},
    {$set: {
      currentConvoId: null,
      convoRole: null  
    }
  });

  res.json({
    message: "Success"
  });
});

app.post("/admin/next-convo", authMiddleware, async (req, res) => {
  let {} = req.body;
  
  let room = await Rooms.findOne({
    admins: req.user._id,
  });

  let convos = await Convos.find({
    roomId: room._id,
    state: {$in: ["waiting"]}
  }, {sort: {createdAt: -1}});

  if (convos.length == 0) {
    res.json({
      message: "There are no clients waiting in this room"
    });
    return ;
  }
  let convo = convos[0];

  await Promise.all([
    Convos.update({_id: convo._id}, {
      $set: {
        adminId: req.user._id,
        state: "in-conversation"
      }
    }),
    Users.update({_id: req.user._id},
      {$set: {
        currentConvoId: convo._id,
        convoRole: "admin"
      }
    })
  ]);
  
  res.json({
    message: "Joined the conversation !"
  });
});


async function onSetupConvos({}, authToken, responseCb) {
  console.log("authToken: ", authToken);
  let user = await Users.findOne({authToken});

  if (user.currentConvoId != null) {
    this.join("convo#" + user.currentConvoId);
  }
  responseCb("okay");
}

async function onTransmitSignal({signal}, authToken, responseCb) {
  console.log("authToken: ", authToken);
  let user = await Users.findOne({authToken});

  if (user.currentConvoId == null) {
    console.log("You are not part of any conversation");
    responseCb("okay");
    return ;
  }
  let recipientRole = user.convoRole == "admin" ? "client" : "admin";
  this.to("convo#" + user.currentConvoId).emit("signal-emitted-to-" + recipientRole, {signal});
  responseCb("okay");
}


export {
  onSetupConvos,
  onTransmitSignal
};