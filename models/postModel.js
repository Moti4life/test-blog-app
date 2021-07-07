const mongoose = require('mongoose')

const postSchema = new mongoose.Schema ({
    name: {
        type: String
    },
    content: {
        type: String
    },
    time: {
        type: String
    }
})

const Post = mongoose.model('post', postSchema)

module.exports = {
    Post
}