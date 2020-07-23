const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  photo_url: String,
});

module.exports = User = mongoose.model("users", UserSchema);
