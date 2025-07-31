import React, { useContext, useEffect, useState } from 'react'
import square from '../assets/square.png'
import menu from '../assets/menu.png'
import cross from '../assets/cross.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { signout } from '../js/signout'
import { loginContext } from '../context/context'
import '../css/Navbar.css'
import { useQueryClient } from '@tanstack/react-query'
import lamp from '../assets/lamp.png'

const NavComp = (props) => {

  const navigate = useNavigate();
  const location = useLocation();
  const loginvalue = useContext(loginContext);
  const queryClient = useQueryClient();

  const handlesignout = () => {
    signout(loginvalue, location, queryClient);
  }

  return (
    <>
      <div className='px-[15px] sm:flex items-center' onClick={() => {
        navigate('/')
        props.setismenu(false)
      }}>
        Home
      </div>

      <div className='px-[15px] ' onClick={() => {
        navigate('/yourposts')
        props.setismenu(false)
      }}>
        Your Posts
      </div>

      <div className='px-[15px]' onClick={() => {
        navigate('/createpost')
        props.setismenu(false)
      }}>
        Create Post
      </div>

      <div className='px-[15px] sm:flex items-center' onClick={() => {
        navigate('/profile')
        props.setismenu(false)
      }}>
        Profile
      </div>

      <div className='px-[15px]' onClick={handlesignout}>
        Sign Out
      </div>
    </>
  )

}

const Navbar = () => {

  const [ismenu, setismenu] = useState(false);

  const handlemenu = () => {
    setismenu(prevismenu => !prevismenu)
  }

  const loginvalue = useContext(loginContext)

  const handleModeToggle = () =>{

    if(loginvalue.theme === 'defblack')
    {
      loginvalue.settheme('defwhite')
    }
    else
    {
      loginvalue.settheme('defblack')
    }
  }

  return (
    <>
      <div className='p-[20px] pb-[0px] sticky top-0 bg-[#ffffff] z-10'>

        <div className='flex items-center justify-between py-[10px] px-[20px] card'>

          <div className=''>
            <img src={square} className='h-[40px] invert-[0.5]' alt="" />
          </div>

          <div className='hidden midl:flex font-bold text-[20px] gap-[30px] cursor-pointer horiznav text-center'>

            <NavComp setismenu={setismenu} ></NavComp>

          </div>

          <div className='p-[10px] hover:bg-[gray] rounded-[30px] display midl:hidden cursor-pointer' onClick={handlemenu}>
            <img src={ismenu ? cross : menu} className='h-[25px]' alt="" />
          </div>

        </div>

        {ismenu && <div className='absolute z-10 right-0 font-bold flex flex-col gap-[10px] py-[15px] text-[18px] bg-white text-center'>
          <NavComp setismenu={setismenu} ></NavComp>
        </div>}

        <div className='absolute -z-5 left-[20px] bottom-[calc(-5vh)] origin-top lamp' onClick={handleModeToggle}>
          <img src={lamp} className='w-[5vh]' alt="" />
        </div>

      </div>

    </>
  )
}

export default Navbar