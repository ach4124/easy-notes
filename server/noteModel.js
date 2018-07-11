const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    tags: Array,
    active: Boolean,
    color: String,
    attachedFile: String,
    user: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);