

document.getElementById("viewCommentsClose").addEventListener('click',()=> {
    document.getElementById("viewComments").style.display = "none";
    // call refresh posts
    viewPosts();
});
let id,creator,post;
async function createComment(postId,id,creator) {
    viewComments(postId)
    document.getElementById("viewComments").style.display = "flex";
    
    id = postId;
    creator = id;
    post = postId;
}

document.getElementById("create-comment-id2").addEventListener("submit",async e=> {
    e.preventDefault();
    let commentInput = document.getElementById("create-comment-content").value;
    if(!commentInput) {
        document.getElementById("create-comment-content").value = '';
        return;
    }
    //
    // create comment
    await axios.put('/api/posts/addComment',{id,commentInput,creator}).then(d=> {
        document.getElementById("create-comment-content").value = '';
        console.log("finish to post, viewing new comments");
        console.log(d);
        viewComments(post);
    }).catch(e=>new Error(e));
});

async function viewComments(id) {
    document.getElementById("viewCommentsContent").innerHTML = '';
    console.log(id);
    await axios.get(`/api/posts/get/${id}`).then(d=> {
        let commentsArray = d.data[0]['comments'];
        
        //
        for(let comment of commentsArray) {
            const {_id,comments} = comment;
            if(comments=='') {
                continue;
            }
    
            let postContentP = document.createElement('p');
            postContentP.setAttribute("id","postContentP2");
            postContentP.innerHTML = comments;
            postContentP.addEventListener('click',()=> {
            
               if(creator == comment.creator) {
                console.log("you can edit");
                // display for edit or delete
                displayForEditOrDelete(comments,_id);
               }else {
                   console.log("this is not your comment");
               }
            })
    
            let postContent = document.createElement('div');
            // postContent.setAttribute("class","post-content");
            postContent.appendChild(postContentP);
    
            let postContentMain = document.createElement('div');
            postContentMain.setAttribute("class","post-content2");
            postContentMain.appendChild(postContent);
            
            let viewpost = document.createElement('div');
            viewpost.setAttribute("class","view-post2");
    
            viewpost.appendChild(postContentMain);
            document.getElementById("viewCommentsContent").appendChild(viewpost);
        }
    }).catch(e=>new Error(e));
}

function displayForEditOrDelete(commentToEdit,commentId) {
    let overlayDiv = document.createElement('div');
    overlayDiv.setAttribute('id',"overlayDiv");
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.background = "rgba(223,223,220,.4)";
    overlayDiv.style.position = "absolute";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    
    // form
    let editForm = document.createElement('form');
    editForm.setAttribute('id', 'editForm');
    editForm.style.width = "600px";
    editForm.style.height = "350px";
    editForm.style.background = "black";
    editForm.style.margin = "80px auto";
    editForm.style.display = "flex";
    editForm.style.flexDirection = "column";
    editForm.style.justifyContent = "start";
    editForm.addEventListener('submit',async e=> {
        e.preventDefault();
        if(e.submitter.getAttribute('id') == 'editCommentButton') {
            console.log("calling edit...");
        let id1 = id;
        let id2 = commentId;
        let commentInput = commentEditForm.value;

        console.log({id1,id2,commentInput});
        await axios.put('/api/posts/editComment',{id1,id2,commentInput}).then(d=> {
            
            closeEditForm.click();
            viewComments(id);
        }).catch(e=>new Error(e));
        }else {
            console.log("calling delete...");
            let id1 = id;
            let id2 = commentId;
            console.log({id1,id2});
            await axios.delete('/api/posts/deleteComment',{data:{id1,id2}}).then(d=> {
                
                closeEditForm.click();
                viewComments(id);
            }).catch(e=>new Error(e));
        }
    });
    // close
    let closeEditForm = document.createElement('input');
    closeEditForm.setAttribute('id','cl6oseEditForm');
    closeEditForm.setAttribute('type','button');
    closeEditForm.setAttribute("value","Close");
    closeEditForm.style.position = "absolute";
    closeEditForm.style.top = "10px";
    closeEditForm.style.right = "10px";
    closeEditForm.style.backgroundColor = "black";
    closeEditForm.style.color = "white";
    closeEditForm.addEventListener('click',() => {
        overlayDiv.style.display = "none";
    });
    editForm.appendChild(closeEditForm);
    // comment input text area.
    let commentEditForm = document.createElement('textarea');
    //<textarea name="content" id="create-post-content" placeholder="Enter Post Content" cols="30" rows="10"></textarea>
    commentEditForm.setAttribute('id','commentEditForm');
    commentEditForm.setAttribute('rows','25');
    commentEditForm.setAttribute('cols','45');
    commentEditForm.value = commentToEdit;commentId
    commentEditForm.style.margin = "10px auto";
    // buttons
    let editCommentButtonDiv = document.createElement('div');
    editCommentButtonDiv.setAttribute('id','editCommentButtonDiv');
    editCommentButtonDiv.style.width = "100%";
    editCommentButtonDiv.style.display = "flex";
    editCommentButtonDiv.style.flexDirection = "row";
    editCommentButtonDiv.style.justifyContent = "space-evenly";

    let editCommentButton = document.createElement('input');
    editCommentButton.setAttribute('id','editCommentButton');
    editCommentButton.setAttribute('type','submit');
    editCommentButton.style.width = "40%";
    editCommentButton.style.height = "50px";
    editCommentButton.setAttribute("value", "Edit Comment");
    editCommentButton.style.backgroundColor = "green";
    editCommentButton.style.color = "white";
    editCommentButton.style.margin = "10px";

    let deleteCommentButton = document.createElement('input');
    deleteCommentButton.setAttribute('id','deleteCommentButton');
    deleteCommentButton.setAttribute('type','submit');
    deleteCommentButton.style.width = "40%";
    deleteCommentButton.style.height = "50px";
    deleteCommentButton.setAttribute("value","Delete Comment");
    deleteCommentButton.style.backgroundColor = "red";
    deleteCommentButton.style.color = "white";
    deleteCommentButton.style.margin = "10px";
    

    editCommentButtonDiv.appendChild(editCommentButton);
    editCommentButtonDiv.appendChild(deleteCommentButton);
    
    editForm.appendChild(commentEditForm);
    editForm.appendChild(editCommentButtonDiv);
    overlayDiv.appendChild(editForm);
    if(document.getElementById("viewComments").children.length>3) {
        document.getElementById("viewComments").removeChild(document.getElementById("overlayDiv"));
    }


    document.getElementById("viewComments").appendChild(overlayDiv);
}