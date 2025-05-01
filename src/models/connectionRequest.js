const mongoose = require("mongoose");
console.log("console")
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    status: {
      type: String,
      lowerCase: true,
      enum: {
        values: ["intrested", "accepted", "rejected", "ignored"],
        message: `{VALUE} is not valid`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
const connectionRequest = this;
if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
  throw new Error("Cannot send request to yourself");
}
next();
});

const ConnectionRequestModel = mongoose.model(
  "ConenctionRequest",
  connectionRequestSchema
);


module.exports = ConnectionRequestModel;
