const mongoose = require('mongoose');
const moodBoardSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
emojis: [{
type: String,
required: true
}],
imageUrl: {
type: String,
required: true
},
color: {
type: String,
required: true
},
note: {
type: String,
required: true,
maxlength: 200
},
date: {
type: Date,
default: Date.now
}
}, {
timestamps: true
});
// Create compound index for one moodboard per user per day
moodBoardSchema.index({ user: 1, date: 1 });
module.exports = mongoose.model('MoodBoard', moodBoardSchema);