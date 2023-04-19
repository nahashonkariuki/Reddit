
viewPosts();

async function viewPosts() {
    document.querySelector(".posts-container-view").innerHTML = '';
  
await axios.get("/api/posts/get").then(d=> {
    let posts = d.data;
    let key = 0;
    
    for(let post of posts) {
        const {_id,creator,title,content,votes,comments} = post;
        
        //
        let votesCountDiv = document.createElement('div');
        votesCountDiv.setAttribute("class","votes-count");
        votesCountDiv.innerHTML = votes.length;
        votesCountDiv.setAttribute('id',`voteKey${key}`);
        key++;
        //<div class="upvotes"><i class="fa-solid "></i></div>
        let upvotes = document.createElement('div');
        upvotes.setAttribute("class","upvotes");
        upvotes.addEventListener('click',async()=> {
          let voteKey = votesCountDiv.getAttribute('id');
          console.log(voteKey);
          await axios.get('/getloggedinuser').then(async d=>{
            const {id} = d.data;
            let loggedinuser = id;
            addVote(loggedinuser,1,creator,_id,voteKey);
        }).catch(e=>new Error(e));
        });
        
        let iup = document.createElement('i');
        iup.setAttribute("class","fa-solid fa-angle-up");

        upvotes.appendChild(iup);
        //<div class="downvotes"><i class="fa-solid fa-angle-down"></i></div>
        let downvotes = document.createElement('div');
        downvotes.setAttribute("class","downvotes");
        downvotes.addEventListener('click',async ()=> {
          let voteKey = votesCountDiv.getAttribute('id');
          console.log(voteKey);
          await axios.get('/getloggedinuser').then(async d=>{
            const {id} = d.data;
            let loggedinuser = id;
            addVote(loggedinuser,-1,creator,_id,voteKey);
        }).catch(e=>new Error(e));
        });
        
        let idown = document.createElement('i');
        idown.setAttribute("class","fa-solid fa-angle-down");

        downvotes.appendChild(idown);  

        let commentsCountId = document.createElement('p');
        commentsCountId.setAttribute("id","comments-count-id");
        if(comments.length==1) {
            commentsCountId.innerHTML = `0 <i class="fa-solid fa-comment"></i>`;
        }else if(comments.length>1){
            commentsCountId.innerHTML = `${comments.length-1} <i class="fa-solid fa-comment"></i>`;
        }
        
        

        //<div class="post-comments">
        let postComments = document.createElement('div');
        postComments.setAttribute('class','post-comments display-comments');
        postComments.addEventListener('click',async () => {
  
await axios.get('/getloggedinuser').then(async d=>{
  const {id} = d.data;
  let loggedinuser = id;
          createComment(_id,loggedinuser,creator);
        })
      })
        postComments.appendChild(commentsCountId);

        //<div class="votes-container">
        let votesContainer = document.createElement('div');
        votesContainer.setAttribute('class','votes-container');

        votesContainer.appendChild(upvotes);
        votesContainer.appendChild(votesCountDiv);
        votesContainer.appendChild(downvotes);
        votesContainer.appendChild(postComments);

        let postTitleH1 = document.createElement('h1');
        postTitleH1.setAttribute("id","postTitleH1");
        postTitleH1.innerHTML = title;

        let postContentP = document.createElement('p');
        postContentP.setAttribute("id","postContentP");
        postContentP.innerHTML = content;

        
        let postTitle = document.createElement('div');
        postTitle.setAttribute("class","post-title");
        postTitle.appendChild(postTitleH1);

        let postContent = document.createElement('div');
        postContent.setAttribute("class","post-content");
        postContent.appendChild(postContentP);

        let postContentMain = document.createElement('div');
        postContentMain.setAttribute("class","post-content openPostContent");
        postContentMain.appendChild(postTitle);
        postContentMain.appendChild(postContent);
        postContentMain.addEventListener('click',()=> {
          // decide, if the currently loggedin user, the creator of the 
          // editPost();
        });
        
        let viewpost = document.createElement('div');
        viewpost.setAttribute("id","view-post");

        viewpost.appendChild(votesContainer);
        viewpost.appendChild(postContentMain);
        document.querySelector(".posts-container-view").appendChild(viewpost);
    }
}).catch(e=>new Error(e));
}