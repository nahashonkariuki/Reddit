const {post,comment,vote} = require("./post");
const mongoose = require("mongoose");
class postCrud {
    constructor() {};
    async getPost() {
        let data = {};
        await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
           await post.find({}).then((d)=> {
               data = d;
           }).catch(e=>new Error(e));
        }).catch(e=>new Error(e));
        return data;
    }
    async getOnePost(id) {
        let data = {};
        await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
           await post.find({_id: id}).then((d)=> {
               data = d;
           }).catch(e=>new Error(e));
        }).catch(e=>new Error(e));
        return data;
    }
    async createPost(creator,title,content,votes,comments) {


    }
    async updatePost(id,title,content,votes,comments) {
        try {
            mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                   // id,title, content,votes,comments
                    await post.findOneAndUpdate({_id: id},{title,content,votes,comments}).then(d=>d).catch(e=>new Error(e));
                   }).catch(e=>new Error(e));
            }).catch(e=>new Error(e));
        } catch (error) {
            throw new Error(error);
        }
    }
    async deletePost(id) {
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                await post.findOneAndDelete({_id:id}).then(d=>d).catch(e=>new Error(e));
            }).catch(e=>new Error(e));
        } catch (error) {
            throw new Error(error);
        }
    }

    async addCommentToPost(id, commentInput,creator) {
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                await post.findOne({_id:id}).then(async da=> {
                    // found post
                    let postsFound = da;
                    let comments = commentInput;
                    await comment.create({creator,comments}).then(async d=>{
                        //console.log(d) d=comment
                        postsFound.comments.push(d);
                    const {title, content,votes,comments} = postsFound;
                    let id = postsFound._id;
                    await new postCrud().updatePost(id,title, content,votes,comments).then(d=> {
                        console.log("updated post with new comments");
                        return d;
                    }).catch(e=>new Error(e));
                    }
                    ).catch(e=>new Error(e));
                     
                    
                }).catch(e=>new Error(e));
            }).catch(e=>new Error(e));
        } catch (error) {
            throw new Error(error);
        }
    }

   

    async editComments(id1, id2, commentInput) {
        
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                // update comment

                await comment.findOneAndUpdate({_id:id2},{comments: commentInput}).then(async selectedComment=> {
                  
                    
                    await post.findOne({_id:id1}).then(async postFound=> {
                        // 
                        for(let i=0;i<postFound.comments.length;i++) {
                            if(postFound.comments[i]._id == id2) {
                                postFound.comments[i].comments = selectedComment['comments'];
                            }
                        }
                        //
                        const {title, content,votes,comments} = postFound;
                        let id = postFound._id;
                        await new postCrud().updatePost(id,title, content,votes,comments).then(d=> {
                            return d;
                        }).catch(e=>new Error(e));
                    }).catch(e=>new Error(e));    
                }).catch(e=>new Error(e));
                //first connect to mongoose
                
            }).catch(e=>new Error(e));
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteComments(id1, id2) {
        
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async ()=> {
                // update comment

                await comment.findOneAndDelete({_id:id2}).then(async selectedComment=> {
                  
                    
                    await post.findOne({_id:id1}).then(async postFound=> {
                        // 
                        for(let i=0;i<postFound.comments.length;i++) {
                            if(postFound.comments[i]._id == id2) {
                                // delete specific comment
                                if(i!=0) {
                                    let swap = postFound.comments[0];
                                    postFound.comments[0] = postFound.comments[i];
                                    postFound.comments[i] = swap;
                                    postFound.comments.shift();
                                }else if(i==0) {
                                    postFound.comments.shift();
                                } 
                            }
                        }
                        //
                        const {title, content,votes,comments} = postFound;
                        let id = postFound._id;
                        await new postCrud().updatePost(id,title, content,votes,comments).then(d=> {
                            return d;
                        }).catch(e=>new Error(e));
                    }).catch(e=>new Error(e));    
                }).catch(e=>new Error(e));
                //first connect to mongoose
                
            }).catch(e=>new Error(e));
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = postCrud;