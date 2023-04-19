
async function addVote(loggedinuser,vote,creator,postId,voteId) {
    
console.log({loggedinuser,vote,creator,postId});
    await axios.put('/api/posts/addVote',{
        id:loggedinuser,
        vot:vote,
        creator:creator,
        postId: postId
    }).then(d=> {
        console.log("votes",d.data);
    }).catch(e=>new Error(e));
}