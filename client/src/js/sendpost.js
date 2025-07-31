

export const sendpost = async(post_info, navigate,queryClient) => {

    const formData = new FormData();


    formData.append('title', post_info.title);
    formData.append('description', post_info.description);
    formData.append('post_type', post_info.post_type);
    formData.append('paid', post_info.paid);
    formData.append('urgency', post_info.urgency);

    const fileInput = document.getElementById('img');
    if (fileInput.files[0]) {
        formData.append('post_img', fileInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/service/sendpost', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if(response.ok)
        {
            alert('Post has been sent');
            queryClient.invalidateQueries(['yourposts'])
            queryClient.invalidateQueries(['posts'])
            navigate('/')
            return;
        }
        
        const msg = await response.json();
        alert(msg.message)

    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        alert("Some Error Occured")
    }

}

export const updatepost = async(setupdate, post) => {

    const formData = new FormData();

    formData.append('post_id', post._id)
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('paid', post.tags[0]);
    formData.append('urgency', post.tags[1]);

    console.log(post.tags)

    const fileInput = document.getElementById('uimg');
    if (fileInput.files[0]) {
        formData.append('post_img', fileInput.files[0]);
    }
    else
    {
        console.log(post.post_img)
        formData.append('post_img', post.post_img )
    }

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/service/updatepost', {
            method: 'PATCH',
            body: formData,
            credentials: 'include'
        });

        if(response.ok)
        {
            alert('Post has been updated');
            setupdate(false);
            return;
        }
        
        const msg = await response.json();
        alert(msg.message)

    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        alert("Some Error Occured")
    }

}


export const update_status = async(post_id, posted, queryClient) => {

    try{

        const userConfirmed = confirm(`Are you sure you want to ${posted?'Post' : 'Rollback'} this post?`);

        if(!userConfirmed)
        {
            return;
        }

        const res = await fetch('http://localhost:8000/ask_neigh/service/post_status',{
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id,
                posted : posted
            }),
            credentials: 'include'
        })

        if(res.ok)
        {
            queryClient.invalidateQueries(['yourposts','posts'])
            return;
        }

        alert("The process failed. Try again")
    }
    catch(err)
    {
        alert('Some error occured')
    }

}

export const delete_post = async(post_id, queryClient) => {

    try{

        const userConfirmed = confirm("Are you sure you want to delete this post?");

        if(!userConfirmed)
        {
            return;
        }
        
        const res = await fetch(`http://localhost:8000/ask_neigh/service/delete_post/${post_id}`,{
            method: 'DELETE',
            credentials: 'include'
        })

        if(res.ok)
        {
            alert("Post has been deleted");
            queryClient.invalidateQueries(['yourposts','posts']);
            return;
        }

        alert('Delete process failed')
    }
    catch(err)
    {
        alert('Some error occured')
    }
}   