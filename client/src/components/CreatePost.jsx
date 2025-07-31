import React, { useContext, useEffect, useRef, useState } from 'react'
import '../css/CreatePost.css'
import { useNavigate } from 'react-router-dom'
import { sendpost } from '../js/sendpost';
import { loginContext } from '../context/context';
import Navbar from './Navbar';
import { useQueryClient } from '@tanstack/react-query';
import close from '../assets/close.svg'
import { handletextarea } from '../js/handletextarea';

const CreatePost = () => {

    const navigate = useNavigate();
    const [imgFile, setimgFile] = useState('');
    const queryClient = useQueryClient();
    const imgref = useRef(null)

    const [post_info, setpost_info] = useState({
        title: '',
        description: '',
        post_type: '',
        paid: 'false',
        urgency: 'false'
    })

    const handlepost = (e) => {
        e.preventDefault();
        sendpost(post_info, navigate, queryClient)
    }

    const handleimg = (e) => {
        e.preventDefault();
        const img = e.target.files[0]
        if (img) {
            setimgFile(URL.createObjectURL(img))
        }
        else {
            setimgFile('')
        }
    }

    useEffect(() => {
        handletextarea()
    }, [])


    return (
        <>

            <div className='mx-auto my-[50px] w-[80vw] md:w-[70vw] lg:w-[60vw]'>

                <div className='text-center font-bold text-[35px] mb-[50px] card'>Create Post</div>

                <form action="" className='p-[20px] card' onSubmit={handlepost}>
                    <div className='w-fit flex flex-col gap-x-[20px] gap-y-[20px] profdetails mx-auto'>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Title <span className='text-[red]'>*</span></label>
                            <input type="text" id='title' value={post_info.title} required placeholder='Enter your Post Title' className='p-[10px]'
                                onChange={(e) => setpost_info(previspost => ({
                                    ...previspost,
                                    title: e.target.value
                                }))
                                } />
                        </div>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Details</label>
                            <textarea type="text" id='desc' value={post_info.description} placeholder='Enter Details' className='p-[10px]'
                                onChange={(e) => setpost_info(previspost => ({
                                    ...previspost,
                                    description: e.target.value
                                }))
                                } />
                        </div>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label className=''>Post <br className='exsm:hidden' /> Type <span className='text-[red]'>*</span></label>
                            <select name="ptype" id="ptype" className='p-[10px]' value={post_info.post_type} required
                                onChange={(e) => setpost_info(previspost => ({
                                    ...previspost,
                                    post_type: e.target.value
                                }))
                                }>
                                <option value="Offer">Offer</option>
                                <option value="Request">Request</option>
                            </select>
                        </div>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label className='dd' >Paid ? <span className='text-[red]'>*</span></label>
                            <select name="pay" id="pay" className='p-[10px]' required value={post_info.paid}
                                onChange={(e) => setpost_info(previspost => ({
                                    ...previspost,
                                    paid: e.target.value
                                }))
                                }>
                                <option value={false}>Unpaid</option>
                                <option value={true}>Paid</option>
                            </select>
                        </div>

                        {post_info.post_type == 'Request' && <div className='flex gap-[25px] items-center justify-between'>
                            <label>Urgency <span className='text-[red]'>*</span></label>
                            <select name="time" id="urgency" className='p-[10px]' required value={post_info.urgency}
                                onChange={(e) => setpost_info(previspost => ({
                                    ...previspost,
                                    urgency: e.target.value
                                }))
                                }>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>}

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Images</label>
                            <input ref={imgref} type="file" id='img' className={`p-[10px] ${imgref.current ? imgref.current.value ? '' : 'imginput' : 'imginput'}`} onChange={handleimg} />
                        </div>

                        {imgFile && <div className='w-fit mx-auto border-[10px] mt-[10px] relative'>
                            <img src={imgFile} className='max-h-[30vh] md:max-h-[40vh]' alt="" />
                            <img src={close} className='absolute h-[30px] top-0 right-0 border-[2px] z-10 rounded-[20px] hover:bg-[#ffffff]' alt=""
                                onClick={(e) => {
                                    e.stopPropagation()
                                    imgref.current.value = null
                                    setimgFile('')
                                }} />
                        </div>}

                        <div className='w-fit mx-auto relative btndiv before:rounded-[10px]'>
                            <button className='postbtn btn relative p-[12px] rounded-[10px] overflow-hidden' type='submit'>
                                <span className='relative z-1'>POST</span>
                            </button>
                        </div>

                    </div>
                </form >
            </div>
        </>
    )
}

export default CreatePost