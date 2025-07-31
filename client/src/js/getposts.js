

export const fetchposts = async() => {

    try{

        const res = await fetch('http://localhost:8000/ask_neigh/service/fetchposts',{
            method: 'GET',
            credentials: 'include'
        });

        const data = await res.json();

        return data;

    }
    catch(err)
    {
        console.log('Error: ',err)
    }
}

export const fetchyourposts = async() => {

    try{

        const res = await fetch('http://localhost:8000/ask_neigh/service/fetchyourposts',{
            method: 'GET',
            credentials: 'include'
        });

        const data = await res.json();

        return data;

    }
    catch(err)
    {
        console.log('Error: ',err)
    }
}