const mongoose = require("mongoose");

const CommentModel = new mongoose.Schema({
    creator: {
        type: String,
        required: true
    },
    comments: {
      type:String
    }});
const VoteModel = new mongoose.Schema({
    creator: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        required: true
    }
});
const PostModel = new mongoose.Schema({
    // creator email: currently
    creator: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: [VoteModel],
        required: true
    },
    comments: {
        type: [CommentModel],
        default: undefined
    }
});

const post = mongoose.model('post', PostModel);
const comment = mongoose.model('comment',CommentModel);
const vote = mongoose.model('vote',VoteModel);
module.exports = {post,comment,vote};
