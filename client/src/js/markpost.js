
export const mark_post = async (post,setbookmarked) => {

    try {

        const post_id = post._id

        const res = await fetch('http://localhost:8000/ask_neigh/service/mark_post', {
            method: 'PATCH',
            body: JSON.stringify({ post_id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (res.ok) {
            post.bookmarked = true;
            setbookmarked(true)
        }


    }
    catch (err) {
        console.log('Error', err)
    }
}

export const unmark_post = async (post,setbookmarked) => {

    try {

        const post_id = post._id

        const res = await fetch('http://localhost:8000/ask_neigh/service/unmark_post', {
            method: 'PATCH',
            body: JSON.stringify({ post_id }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (res.ok) {
            post.bookmarked = false;
            setbookmarked(false)
        }


    }
    catch (err) {
        console.log('Error', err)
    }
}