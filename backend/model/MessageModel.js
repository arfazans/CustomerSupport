const mongoose = require('mongoose');
const {Schema} = mongoose;


const messageSchema = new mongoose.Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'Credential', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'Credential', required: true },
  text: { type: String },
  image: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("Message",messageSchema)