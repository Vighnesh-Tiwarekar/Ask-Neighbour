

export const getprofile = async (setprofile, setisreadonly) => {

    try {

        const response = await fetch('http://localhost:8000/ask_neigh/setup/profile/details', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();

        return data.user_profile;

    }
    catch (err) {
        console.log("Error: ", err);
    }

}