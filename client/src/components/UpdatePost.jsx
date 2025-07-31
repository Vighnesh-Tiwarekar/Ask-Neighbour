import React, { useEffect, useState } from 'react'
import { updatepost } from '../js/sendpost'
import close from '../assets/close.svg'
import { handletextarea } from '../js/handletextarea'

const UpdatePost = (props) => {

    const [post, setpost] = useState(props.post)

    const handleUpdate = () => {
        updatepost(props.setupdate, post)
    }

    useEffect(() => {
        handletextarea()
    }, [])

    return (
        <>
            <div className='mx-auto my-[50px] w-[80vw] md:w-[70vw] lg:w-[60vw]'>

                <div className='card text-center font-bold text-[35px] border-b-2 mb-[50px]'>Update Post</div>

                <form action="" className='card p-[20px]' onSubmit={handleUpdate}>
                    <div className='w-fit flex flex-col gap-x-[20px] gap-y-[20px] profdetails mx-auto'>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Title <span className='text-[red]'>*</span></label>
                            <input type="text" id='utitle' required value={post.title} placeholder='Enter your Post Title' className='p-[10px]'
                                onChange={(e) => {
                                    setpost(previspost => ({
                                        ...previspost,
                                        title: e.target.value
                                    }))
                                }} />
                        </div>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Details</label>
                            <textarea type="text" id='udesc' value={post.description} placeholder='Enter Details' className='p-[10px]'
                                onChange={(e) => {
                                    setpost(previspost => ({
                                        ...previspost,
                                        description: e.target.value
                                    }))
                                }} />
                        </div>

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label className='dd' >Paid ? <span className='text-[red]'>*</span></label>
                            <select name="pay" id="upay" value={post.tags[0] ? 'true' : 'false'} className='p-[10px]' required
                                onChange={(e) => {
                                    setpost(previspost => ({
                                        ...previspost,
                                        tags: [
                                            e.target.value === 'true',    
                                            previspost.tags?.[1] ?? false    
                                        ]
                                    }))
                                }}>
                                <option value='false'>Unpaid</option>
                                <option value='true'>Paid</option>
                            </select>
                        </div>

                        {post.post_type == 'Request' && <div className='flex gap-[25px] items-center justify-between'>
                            <label>Urgency <span className='text-[red]'>*</span></label>
                            <select name="time" id="uurgency" value={post.tags[1] ? 'true' : 'false'} className='p-[10px]' required
                                onChange={(e) => {
                                    setpost(previspost => ({
                                        ...previspost,
                                        tags: [
                                            previspost.tags?.[0] ?? false,    
                                            e.target.value === 'true'    
                                        ]
                                    }))
                                }}>
                                <option value='true'>Yes</option>
                                <option value='false'>No</option>
                            </select>
                        </div>}

                        <div className='flex gap-[25px] items-center justify-between'>
                            <label>Images</label>
                            <input type="file" id='uimg' className='imginput p-[10px] '
                                onChange={(e) => {
                                    setpost(previspost => ({
                                        ...previspost,
                                        post_img_url: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : ''
                                    }))
                                }} />
                        </div>

                        {post.post_img_url && <div className='w-fit mx-auto border-[10px] mt-[10px] relative'>
                            <img src={post.post_img_url} className='max-h-[30vh] md:max-h-[40vh]' alt="" />
                            <img src={close} className='absolute h-[30px] top-0 right-0 border-[2px] z-10 rounded-[20px] hover:bg-[#ffffff]' alt=""
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setpost(previspost => ({
                                        ...previspost,
                                        post_img: null,
                                        post_img_url: ''
                                    }))
                                }} />
                        </div>}

                        <div className='w-fit mx-auto relative btndiv before:rounded-[10px] flex gap-[30px] justify-center items-center'>

                            <button className='postbtn btn relative p-[12px] rounded-[10px] overflow-hidden' type='submit'>
                                <span className='relative z-1'>Update</span>
                            </button>

                            <button className=' btn cancelbtn p-[12px] rounded-[10px] relative overflow-hidden' type='button'
                                onClick={() => props.setupdate(false)}>
                                <span className='relative z-1'>Cancel</span>
                            </button>

                        </div>


                    </div>
                </form >
            </div>
        </>
    )
}

export default UpdatePost