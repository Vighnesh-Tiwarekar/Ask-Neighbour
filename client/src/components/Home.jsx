import React, { useEffect, useState } from 'react'
import Navbar from './Navbar.jsx'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchposts } from '../js/getposts.js';
import '../css/Home.css'
import user from '../assets/user.png'
import filter from '../assets/filter.png'
import search from '../assets/search.png'
import moment from 'moment'
import save_white from '../assets/save_white.png'
import save_red from '../assets/save_red.png'
import { mark_post, unmark_post } from '../js/markpost.js';


const PostCard = ({ post }) => {

  const [viewprof, setviewprof] = useState(null)
  const [viewpic, setviewpic] = useState(null)
  const [bookmarked, setbookmarked] = useState(post.bookmarked)

  const handlebookmark = () => {

    if (bookmarked) {
      unmark_post(post, setbookmarked)
    }
    else {
      mark_post(post, setbookmarked)
    }
  }

  useEffect(() => {
    setbookmarked(post.bookmarked);
  }, [post.bookmarked]);

  return (

    <>
      {viewprof == post._id && <div className='h-[100vh] w-[100vw] viewpic z-50' onClick={() => setviewprof(null)}>
        <img src={post.profile_img_url || user} className='h-[400px] border-[4px] w-[400px] object-contain bg-white mx-auto relative z-100' alt=""
          onClick={(e) => e.stopPropagation()} />
      </div>}

      <section className='flex p-[10px] justify-between items-center font-bold middletxt gap-[20px] border-b-[4px] bg-black text-white'>

        <div className='flex items-center gap-[20px]'>

          <div onClick={(e) => e.target.active} className='relative'>
            <img src={post.profile_img_url || user} className='h-[50px] w-[50px] rounded-[50px] border-[4px] object-contain box-content profimg bg-white relative' alt=""
              onClick={() => setviewprof(post._id)} />
          </div>

          <div>
            {post.user_info.name}
          </div>

        </div>

        <div onClick={handlebookmark}>
          <img src={bookmarked ? save_red : save_white} className='h-[40px] relative save' alt="" />
        </div>

      </section>


      <section className='p-[20px]'>

        <div className='font-extrabold title mb-[10px] relative'>
          {post.title}
        </div>

        <div className='flex gap-[15px] items-center mb-[25px] font-semibold'>
          <span className='tags'>{post.post_type}</span>
          {post.tags[1] ? <span className='text-[red] tags'>Urgent</span> : null}
          <span className='tags'>{post.tags[0] ? 'Paid' : 'Unpaid'}</span>
        </div>

        {viewpic == post._id && <div className='h-[100vh] w-[100vw] viewpic z-50' onClick={() => setviewpic(null)}>
          <img src={post.post_img_url || user} className='h-[60vh] border-[4px] object-contain bg-white mx-auto relative z-100' alt=""
            onClick={(e) => e.stopPropagation()} />
        </div>}

        {post.post_img_url && <div className='mx-auto w-fit mb-[25px]'>
          <img className='max-h-[30vh] md:max-h-[40vh] border-[10px]' src={post.post_img_url} alt="" onClick={() => setviewpic(post._id)} />
        </div>}

        <section className='font-semibold text-[14px] flex flex-col gap-y-[8px] text-wrap'>

          <div className='mb-[25px] md:mb-[40px] text-[17px]'>{post.description}</div>

          <div>Address: {post.user_info.address}</div>

          <div>Contact No.: {post.user_info.contact}</div>

          <div>Email: {post.user_info.email}</div>
          <div className=''>Posted on: {moment(post.updatedAt).format("D MMMM YYYY, h:mm A")}</div>

        </section>

      </section>

    </>

  )

}

const Posts = (props) => {

  const { status, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchposts,
    staleTime: Infinity,
    cacheTime: Infinity
  })

  const checkConditions = (searchbar, filters, post) => {

    const search = searchbar.toLowerCase();

    const matchesSearch = post.title.toLowerCase().includes(search) ||
      post.description.toLowerCase().includes(search) ||
      post.user_info.address.toLowerCase().includes(search) ||
      post.user_info.email.toLowerCase().includes(search);

    const matchesPostType = !filters.post_type || post.post_type === filters.post_type;
    const matchesPaid = !filters.paid || post.tags[0].toString() === filters.paid;
    const matchesUrgency = !filters.urgency || post.tags[1].toString() == filters.urgency;
    const matchesBookmark = !filters.bookmark || post.bookmarked;

    return matchesSearch && matchesPostType && matchesBookmark && matchesPaid && matchesUrgency;

  }

  return (
    <>
      {
        (Array.isArray(data) ? data : [])?.filter(post => checkConditions(props.searchbar, props.filters, post)).map((post, index) => (

          <div key={index} className='card w-[90vw] md:w-[80vw] lg:w-[60vw] mx-auto mb-[50px]'>

            <PostCard post={post}></PostCard>

          </div>
        ))
      }
    </>
  )

}


const Home = () => {

  const [searchbar, setsearch] = useState('')
  const [filteropen, setfilteropen] = useState(false)
  const [filters, setfilters] = useState({
    post_type: '',
    paid: '',
    urgency: '',
    bookmark: ''
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

        <form className='relative w-fit mx-auto  mb-[50px]' action="" onSubmit={(e) => e.preventDefault()}>

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

              <div style={{ marginBottom: '10px' }}>
                <div><strong>Saved</strong></div>
                <label style={{ marginRight: '15px' }}>
                  <input
                    type="checkbox"
                    checked={filters.bookmark === 'true'}
                    onChange={() => handleCheckboxChange('bookmark', 'true')}
                  />
                  Yes
                </label>
              </div>

            </div>

          </div>

        </form>

        <Posts searchbar={searchbar} filters={filters} ></Posts>

      </div>

    </>
  )
}

export default Home