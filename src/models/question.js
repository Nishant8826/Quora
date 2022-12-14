const mongoose = require("mongoose");
const ObjectId =mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true ,trim:true},
    tag: {type:[String],trim:true},
    askedBy: {type:ObjectId ,ref: 'User' ,trim:true},
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports=mongoose.model('Question',questionSchema)
