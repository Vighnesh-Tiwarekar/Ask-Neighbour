import React, { useContext, useEffect, useRef, useState } from 'react'
import '../css/Profile.css'
import { getLocation } from '../js/getlocation'
import { loginContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import { create_profile, update_profile } from '../js/sendprofile.js'
import user from '../assets/user.png'
import close from '../assets/close.svg'
import { getprofile } from '../js/getprofile.js'
import { useQueryClient, useQuery } from '@tanstack/react-query'

const Profile = () => {

    const loginvalue = useContext(loginContext)

    const [profile, setprofile] = useState({
        name: '',
        contact: '',
        email: '',
        address: '',
        lat: '',
        lon: '',
        profimg: ''
    })

    const queryClient = useQueryClient();

    const imgref = useRef(null);

    const [isreadonly, setisreadonly] = useState(false)

    const getloc = async () => {
        await getLocation(setprofile)
    }

    const handlesave = async (e) => {

        e.preventDefault();

        if (profile.contact.length != 10) {
            alert('Contact No. should be 10 digits');
            return;
        }

        if (loginvalue.islogin) {
            update_profile(loginvalue, setisreadonly, profile, queryClient)
        }
        else {
            create_profile(loginvalue, setisreadonly, profile, queryClient);
        }

    }

    const handleimg = (e) => {
        const imgfile = e.target.files[0];

        if (imgfile) {
            setprofile(prevprof => ({
                ...prevprof,
                profimg: imgfile
            }))
        }
        else {
            setprofile(prevprof => ({
                ...prevprof,
                profimg: ''
            }))
        }
    }

    const { status, error, data } = useQuery({

        queryKey: ['profile'],
        queryFn: () => getprofile(),
        staleTime: Infinity,
        cacheTime: Infinity,
        enabled: loginvalue.islogin

    })

    useEffect(() => {

        setisreadonly(loginvalue.islogin)

    }, [loginvalue.islogin])

    useEffect(() => {

        if (data) {

            setprofile({
                name: data.name,
                contact: data.contact,
                email: data.email,
                address: data.address,
                lat: data.location.coordinates[1],
                lon: data.location.coordinates[0],
                profimg: data.profimg_url ? data.profimg_url : ''
            })

            setisreadonly(true);
        }

    }, [data])

    return (
        <>

            <div className='mx-auto my-[50px] w-[80vw] md:w-[70vw] lg:w-[60vw]'>

                <div className='text-center font-bold text-[40px] mb-[50px] card'>Profile</div>

                <div>
                    <form action="" className='card p-[20px] profileform' onSubmit={handlesave}>
                        <div className='w-fit flex flex-col gap-x-[20px] gap-y-[20px] profdetails mx-auto'>

                            <div className='mx-auto profimg border-[10px] box-content rounded-[150px] relative' onClick={() => imgref.current.click()}>
                                <img src={profile.profimg ?
                                    (typeof profile.profimg === 'string'
                                        ? profile.profimg
                                        : URL.createObjectURL(profile.profimg)) : user}

                                    className='h-[9vw] w-[9vw] min-h-[80px] min-w-[80px] rounded-[150px] object-contain' alt="" />
                                {!isreadonly && <img src={close} className='z-10 absolute grayscale-100 bg-white rounded-[25px] border-2 h-[25px] top-0 hover:bg-[red] right-[-10px] sm:right-[-10px] md:right-[-15px] lg:right-[-10px] xl:right-0' alt=""
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        imgref.current.value = null;
                                        setprofile(prevprof => ({
                                            ...prevprof,
                                            profimg: ''
                                        }))
                                    }} />}
                            </div>

                            <div className="fname flex gap-[25px] items-center justify-between">
                                <label className=''>Name <span className='text-[red]'>*</span></label>
                                <input type="text" id='fname' readOnly={isreadonly} value={profile.name} placeholder='Enter Full Name' className='rounded-[5px] p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        name: e.target.value
                                    }))} />
                            </div>

                            <div className="contact flex gap-[25px] items-center justify-between">
                                <label htmlFor="contact" className=''>Contact <br className='sm:hidden lg:max-mdxl:block' /> No. <span className='text-[red]'>*</span></label>
                                <input type="number" id='contact' readOnly={isreadonly} value={profile.contact} placeholder='Enter Contact No.' className='p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        contact: e.target.value
                                    }))} />
                            </div>

                            <div className="email flex gap-[25px] items-center justify-between">
                                <label htmlFor="email" className=''>Contact <br className='sm:hidden lg:max-mdxl:block' /> Email <span className='text-[red]'>*</span></label>
                                <input type="email" id='email' readOnly={isreadonly} value={profile.email} placeholder='Enter Contact Email' className='p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        email: e.target.value
                                    }))} />
                            </div>

                            <div className="specadd flex gap-[25px] items-center justify-between">
                                <label htmlFor="specadd" className=''>Address </label>
                                <input type="text" id='specadd' readOnly={isreadonly} value={profile.address} placeholder='Enter Detailed Address' className='p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        address: e.target.value
                                    }))} />
                            </div>

                            <div className='profpic hidden gap-[25px] items-center justify-between'>
                                <input ref={imgref} type="file" id='profpic' disabled={isreadonly} accept='image/*' className='imginput p-[10px] w-[60vw] min-w-[100px]' onChange={handleimg} />
                            </div>

                            <div className="lat flex gap-[25px] items-center justify-between">
                                <label htmlFor="lat" className=''>Latitude<br className='block sm:hidden' /><span className='text-[red]'>*</span></label>
                                <input type="text" id='lat' readOnly={isreadonly} value={profile.lat} placeholder='Enter Latitude Co-ordinates' className='p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        lat: e.target.value
                                    }))} />
                            </div>

                            <div className="lon flex gap-[25px] items-center justify-between">
                                <label htmlFor="lon" className=''>Longitu<br className='sm:hidden lg:max-mdxl:block' />de <span className='text-[red]'>*</span></label>
                                <input type="text" id='lon' readOnly={isreadonly} value={profile.lon} placeholder='Enter Longitude Co-ordinates' className='p-[10px] w-[60vw] min-w-[100px]' required
                                    onChange={(e) => setprofile(prevprof => ({
                                        ...prevprof,
                                        lon: e.target.value
                                    }))} />
                            </div>

                            <div className='w-fit mx-auto text-wrap text-[14px]'><span className='text-[red]'>*</span>Enter Co-ordinates manually only if Current Location is different from desired Home Location</div>

                            <div className='flex gap-[25px] items-center w-fit mx-auto '>
                                <div className='btndiv relative before:rounded-[10px]'>
                                    <button className='locbtn btn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={getloc}>
                                        <span className='relative z-1'>Get Co-ordinates</span>
                                    </button>
                                </div>
                            </div>

                            <div className='flex gap-[25px] items-center w-fit mx-auto '>
                                <div className='btndiv relative before:rounded-[10px]'>

                                    {loginvalue.islogin && isreadonly && <button className='btn p-[12px] rounded-[10px] relative overflow-hidden' type='button' onClick={() => setisreadonly(false)}>
                                        <span className='relative z-1'>Update</span>
                                    </button>}

                                    {!(loginvalue.islogin && isreadonly) && <button className='subbtn btn p-[12px] px-[20px] rounded-[10px] relative overflow-hidden' type='submit'>
                                        <span className='relative z-1'>Save</span>
                                    </button>}

                                    {loginvalue.islogin && !isreadonly && <button id='cancelbtn' className='cancelbtn btn p-[12px] rounded-[10px] relative overflow-hidden ml-[20px] bg-[red]' type='button' onClick={() => setisreadonly(true)}>
                                        <span className='relative z-1'>Cancel</span>
                                    </button>}

                                </div>
                            </div>


                        </div>

                    </form>



                </div>

            </div>
        </>
    )
}

export default Profile;