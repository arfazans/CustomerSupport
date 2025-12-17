const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Credential', 
    required: true 
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Credential' 
  }],
  inviteCode: { 
    type: String, 
    unique: true,
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);