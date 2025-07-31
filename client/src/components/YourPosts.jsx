import React, { useContext, useState, useEffect } from 'react'
import user from '../assets/react.svg'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchyourposts } from '../js/getposts'
import UpdatePost from './UpdatePost'
import { delete_post, update_status } from '../js/sendpost'
import { loginContext } from '../context/context'
import search from '../assets/search.png'
import filter from '../assets/filter.png'



const Button = (props) => {

  if (props.sent) {
    return (
      <>
        <button className=' btn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={() => update_status(props.post_id, false, props.queryClient)}>
          <span className='relative z-1'>Rollback</span>
        </button>
      </>
    )
  }
  else {
    return (
      <>
        <button className=' btn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={() => update_status(props.post_id, true, props.queryClient)}>
          <span className='relative z-1'>Post</span>
        </button>
      </>
    )
  }

}


const Posts = (props) => {

  const queryClient = useQueryClient();
  const loginvalue = useContext(loginContext)

  const { status, error, data } = useQuery({
    queryKey: ['yourposts'],
    queryFn: fetchyourposts,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: loginvalue.islogin,
  })

  const handleUpdate = (post) => {
    props.setpost(post)
    props.setupdate(true)
  }

  const checkConditions = (searchbar, filters, post) => {

    console.log(filters)

    const matchesSearchbar = post.title.toLowerCase().includes(searchbar.toLowerCase());

    const matchesPostType = !filters.post_type || post.post_type === filters.post_type;
    const matchesPaid = !filters.paid || post.tags[0].toString() === filters.paid;
    const matchesUrgency = !filters.urgency || post.tags[1].toString() == filters.urgency;

    return matchesSearchbar && matchesPostType && matchesPaid && matchesUrgency;

  }

  return (
    <>
      {
        (Array.isArray(data) ? data : [])?.filter(post => checkConditions(props.searchbar, props.filters, post)).map((post, index) => (
          <div key={index} className='card w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto mb-[50px]'>

            <section className='p-[20px]'>

              <div className='font-extrabold title mb-[10px] relative'>{post.title}</div>

              <div className='flex gap-[15px] items-center mb-[25px] font-semibold'>
                <span className='tags'>{post.post_type}</span>
                {post.tags[1] ? <span className='tags text-[red]'>Urgent</span> : null}
                <span className='tags'>{post.tags[0] ? 'Paid' : 'Unpaid'}</span>
              </div>

              {post.post_img_url && <div className='mx-auto w-fit mb-[25px]'>
                <img className='max-h-[30vh] md:max-h-[40vh] border-[10px]' src={post.post_img_url} alt="" />

              </div>}

              <div className='font-semibold text-[17px] mb-[40px] text-wrap '>{post.description}</div>

              <div className='w-fit mx-auto flex flex-wrap gap-[20px] items-center justify-center'>

                <button className=' btn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={() => handleUpdate(post)}>
                  <span className='relative z-1'>Update</span>
                </button>

                <Button sent={post.posted} post_id={post._id} queryClient={queryClient} />

                <button className=' btn cancelbtn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={() => delete_post(post._id, queryClient)}>
                  <span className='relative z-1'>Delete</span>
                </button>

              </div>

            </section>

          </div>
        ))
      }
    </>
  )

}


const YourPosts = () => {

  const [post, setpost] = useState(null);
  const [update, setupdate] = useState(false);

  const [searchbar, setsearch] = useState('')
  const [filteropen, setfilteropen] = useState(false)
  const [filters, setfilters] = useState({
    post_type: '',
    paid: '',
    urgency: ''
  })

  const handleCheckboxChange = (category, value) => {
    setfilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  return (
    <>

      <div className='my-[50px]'>

        {!update && <form className='relative w-fit mx-auto mb-[50px]' action="" onSubmit={(e) => e.preventDefault()}>

          <div className='card w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto flex justify-between items-center h-fit'>

            <div className='pl-[5px] w-full flex gap-[5px] items-center'>

              <div>
                <img src={search} className='w-[35px]' alt="" />
              </div>

              <input className='searchbar border-0 outline-0 w-full font-bold px-[5px]' type="text" placeholder='Search'
                onChange={(e) => setsearch(e.target.value)} />

            </div>

            <div className={`border-l-[4px] p-[5px] bg-white filterpic ${filteropen ? 'invert-[1] border-white' : ''}`} onClick={() => setfilteropen(previsfilter => !previsfilter)}>
              <img src={filter} className='h-[35px]' alt="" />
            </div>

          </div>

          <div className={`filter w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto absolute bg-white flex gap-[10px] p-[10px] ${filteropen ? 'filteropen' : ''} `}>

            <div>
              <div style={{ marginBottom: '10px' }}>
                <div><strong>Post Type</strong></div>
                <label style={{ marginRight: '15px' }}>
                  <input
                    type="checkbox"
                    checked={filters.post_type === 'Request'}
                    onChange={() => handleCheckboxChange('post_type', 'Request')}
                  />
                  Request
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.post_type === 'Offer'}
                    onChange={() => handleCheckboxChange('post_type', 'Offer')}
                  />
                  Offer
                </label>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div><strong>Paid</strong></div>
                <label style={{ marginRight: '15px' }}>
                  <input
                    type="checkbox"
                    checked={filters.paid === 'true'}
                    onChange={() => handleCheckboxChange('paid', 'true')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.paid === 'false'}
                    onChange={() => handleCheckboxChange('paid', 'false')}
                  />
                  No
                </label>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div><strong>Urgent</strong></div>
                <label style={{ marginRight: '15px' }}>
                  <input
                    type="checkbox"
                    checked={filters.urgency === 'true'}
                    onChange={() => handleCheckboxChange('urgency', 'true')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.urgency === 'false'}
                    onChange={() => handleCheckboxChange('urgency', 'false')}
                  />
                  No
                </label>
              </div>
            </div>

          </div>

        </form>}

        {update ? <UpdatePost post={post} setupdate={setupdate} ></UpdatePost> : <Posts searchbar={searchbar} filters={filters} setpost={setpost} setupdate={setupdate} ></Posts>}

      </div>
    </>
  )
}

export default YourPosts