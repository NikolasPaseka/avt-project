const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now()
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})
const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment