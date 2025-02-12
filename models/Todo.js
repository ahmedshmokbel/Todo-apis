const mongoose = require('mongoose');

// const TodoSchema = new mongoose.Schema({
//   // title: {
//   //   type: String,
//   //   required: true
//   // },
//   // completed: {
//   //   type: Boolean,
//   //   default: false
//   // }
// });

const TodoSchema =  new mongoose.Schema({   title: String,   completed: Boolean }) // Ensure this matches your MongoDB collection name

// const Todo = mongoose.model('Todo', TodoSchema);
module.exports = mongoose.model('Todo', TodoSchema,{ strict: false });
