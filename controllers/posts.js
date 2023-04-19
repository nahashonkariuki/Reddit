const mongoose = require("mongoose");
const {post,comment,vote} = require("../models/posts/post");
const postCrud = require("../models/posts/postCrud");

const viewPosts = async (req,res) => {
    try {
        await new postCrud().getPost().then(d=> {
            console.log("here is data");
            console.log(d);
            res.status(200).json(d);
        }).catch(e=>new Error(e));
    } catch (error) {
        throw new Error(error);
    }
}

const viewSinglePost = async (req,res) => {
    try {
        const {id} = req.params;
        await new postCrud().getOnePost(id).then(d=> {
            console.log("one post");
            console.log(d);
            res.status(200).json(d);
        }).catch(e=>new Error(e));
    } catch (error) {
        throw new Error(error);
    }
}
const createPosts = async (req,res) => {
    try {
        const {creator,title,content,votes,comments} = req.body;
        await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
            await comment.create({creator,comments}).then(async d=>{
                //console.log(d) d=comment
                await vote.create({creator,voteCount:votes}).then(async v=> {
                    await post.create({creator,title,content,votes:v,comments: d}).then(p=>{
    
                        console.log("successfully created post");
                                
                            res.status(200).json(p);
                            res.status(200).json(d);
                            res.status(200).json(v);

                            }).catch(e=>new Error(e));
                    }).catch(e=>new Error(e)); 
            }).catch(e=>new Error(e));
            }).catch(e=>new Error(e));
        
    } catch (error) {
        throw new Error(error);
    }
}



const addComment = async(req,res) => {
    try {
        const {id,commentInput,creator} = req.body;
        console.log("please add comment", req.body);
        await new postCrud().addCommentToPost(id,commentInput,creator).then(d=> {
            // 
            res.status(200).json({activity: "added comment...", d});
        }).catch(e=>new Error(e));
    } catch (error) {
        throw new Error(error);
    }
}



module.exports = {viewPosts, viewSinglePost, createPosts,addComment};