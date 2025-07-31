
export const create_profile = async (loginvalue, isreadonly, profile, queryClient) => {

    const formData = new FormData();


    formData.append('name', profile.name);
    formData.append('contact', profile.contact);
    formData.append('email', profile.email);
    formData.append('address', profile.address);
    formData.append('lat', profile.lat);
    formData.append('lon', profile.lon);
    formData.append('profile_image', profile.profimg)

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/setup/create_profile', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            alert('Profile Saved');
            queryClient.invalidateQueries(['post'])
            queryClient.invalidateQueries(['yourpost'])
            loginvalue.handlelogin(true);
            loginvalue.handleprof(false);
            isreadonly(true)
            return;
        }

        const msg = await response.json();
        alert(msg.message)

    }
    catch (err) {
        console.log(`Error: ${err}`);
        alert("Some Error Occured")
    }

}


export const update_profile = async (loginvalue, isreadonly, profile, queryClient) => {

    const formData = new FormData();

    formData.append('name', profile.name);
    formData.append('contact', profile.contact);
    formData.append('email', profile.email);
    formData.append('address', profile.address);
    formData.append('lat', profile.lat);
    formData.append('lon', profile.lon);
    formData.append('profile_image', profile.profimg)

    const fileInput = document.getElementById('profpic');
    formData.append('img_update', fileInput.files[0] ? true : false)

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/setup/update_profile', {
            method: 'PATCH',
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            alert('Profile Saved');
            queryClient.invalidateQueries(['post'])
            queryClient.invalidateQueries(['yourpost'])
            loginvalue.handlelogin(true);
            loginvalue.handleprof(false);
            isreadonly(true)
            return;
        }

        const msg = await response.json();
        alert(msg.message)

    }
    catch (err) {
        console.log(`Error: ${err}`);
        alert("Some Error Occured")
    }

}