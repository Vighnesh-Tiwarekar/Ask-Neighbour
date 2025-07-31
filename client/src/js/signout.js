
export const signout = async(loginvalue,location,queryClient) => {
    try
    {
        const result = await fetch('http://localhost:8000/ask_neigh/login/signout',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if(result.ok)
        {
            queryClient.invalidateQueries(['posts'])
            queryClient.invalidateQueries(['yourposts'])
            location.pathname=null;
            loginvalue.handlelogin(false);
            return;
        }

        alert("Sign out failed!")

    }
    catch(err)
    {
        console.log('Error: ',err);
        alert("Sign out failed!")
    }
}