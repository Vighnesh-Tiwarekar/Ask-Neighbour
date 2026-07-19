import { uploadToCloudinary } from './uploadImage';

export const create_profile = async (loginvalue, isreadonly, profile, queryClient) => {
    let imageUrl = '';
    
    // Check if profimg is a File object (meaning they uploaded a new image)
    if (profile.profimg && typeof profile.profimg !== 'string') {
        try {
            imageUrl = await uploadToCloudinary(profile.profimg);
        } catch (error) {
            alert('Profile image upload failed.');
            return;
        }
    }

    const payload = {
        name: profile.name,
        contact: profile.contact,
        email: profile.email,
        address: profile.address,
        lat: profile.lat,
        lon: profile.lon,
        profile_image: imageUrl
    };

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/setup/create_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        if (response.ok) {
            alert('Profile Saved');
            queryClient.invalidateQueries(['post']);
            queryClient.invalidateQueries(['yourpost']);
            loginvalue.handlelogin(true);
            loginvalue.handleprof(false);
            isreadonly(true);
            return;
        }

        const msg = await response.json();
        alert(msg.message);
    } catch (err) {
        console.log(`Error: ${err}`);
        alert("Some Error Occurred");
    }
}


export const update_profile = async (loginvalue, isreadonly, profile, queryClient) => {
    let imageUrl = typeof profile.profimg === 'string' ? profile.profimg : '';
    
    const fileInput = document.getElementById('profpic');
    
    // If there is a new file input, upload to Cloudinary
    if (fileInput && fileInput.files[0]) {
        try {
            imageUrl = await uploadToCloudinary(fileInput.files[0]);
        } catch (error) {
            alert('Profile image upload failed.');
            return;
        }
    }

    const payload = {
        name: profile.name,
        contact: profile.contact,
        email: profile.email,
        address: profile.address,
        lat: profile.lat,
        lon: profile.lon,
        profile_image: imageUrl,
        img_update: !!(fileInput && fileInput.files[0])
    };

    try {
        const response = await fetch('http://localhost:8000/ask_neigh/setup/update_profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        if (response.ok) {
            alert('Profile Saved');
            queryClient.invalidateQueries(['post']);
            queryClient.invalidateQueries(['yourpost']);
            loginvalue.handlelogin(true);
            loginvalue.handleprof(false);
            isreadonly(true);
            return;
        }

        const msg = await response.json();
        alert(msg.message);
    } catch (err) {
        console.log(`Error: ${err}`);
        alert("Some Error Occurred");
    }
}