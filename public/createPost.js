// create post

document.getElementById("create-post-id").addEventListener("submit",async e => {

    e.preventDefault();
    let title = document.getElementById("create-post-title").value;
    let content = document.getElementById("create-post-content").value;
    if(!title || !content) {
            console.log("returning...");
            return;
        
    }
    // get current user
    await axios.get('/getloggedinuser').then(async d=>{
        const {id} = d.data;
        let creator = id;
        
        let votes = 1;
        let comments = "";
       await axios.post('/api/posts/create', {creator,title,content,votes,comments}).then(d=> {
           console.log("post created!!!",d);
           document.getElementById("create-post-title").value = "";
           document.getElementById("create-post-content").value = "";
           viewPosts();
       });
    });
})