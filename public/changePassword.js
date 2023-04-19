
document.getElementById("adminForm").addEventListener('submit',async e=> {
    e.preventDefault();
    let password1 = document.getElementById("password0").value;
    let password2 = document.getElementById("password1").value;
    if(password1==password2) {
        // call a route to get current user.
            console.log("getting current loggenin user");
        //
        await axios.get('/getloggedinuser').then(async d=>{
            const {id} = d.data;
            let password = password1;
           await axios.post('/api/auth/changePassword', {id,password}).then(d=> {
               console.log("password changed!!!",d);
               document.getElementById("modalBox").click();
           });
        });
    }
});