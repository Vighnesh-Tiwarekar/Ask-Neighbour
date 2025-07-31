import React, { useState, useEffect, useContext } from 'react'
import '../css/Login.css'
import { loginContext } from '../context/context.js';
import { handleLogin } from '../js/login.js';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {

    const [signmeth, setsignmeth] = useState('signin');
    const [instr, setinstr] = useState('')
    const navigate = useNavigate();

    const location = useLocation();

    const loginvalue = useContext(loginContext)


    useEffect(() => {
        if (loginvalue.islogin) {
            const redirectPath = location.state?.from?.pathname || '/';
            loginvalue.handleprof(false);
            navigate(redirectPath)
        }
        else if (loginvalue.isprof) {
            navigate('/')
        }

    }, [loginvalue.islogin, loginvalue.isprof])

    const handlemethod = (e) => {
        setsignmeth(e.target.id);
    }

    const handleinstr = (msg) => {
        setinstr(msg)
    }

    const handleSubmit = async (e) => {
        await handleLogin(e, { handleinstr, signmeth, loginvalue, navigate })
    }

    return (
        <div className='loginpg w-[100vw] h-[100vh] flex items-center'>

            <div className='card w-fit flex flex-col items-center mx-auto relative z-1'>

                <div className='flex justify-around w-full middletxt font-bold'>

                    <div id='signin' className={`signop cursor-pointer w-full text-center py-[10px] sm:py-[20px] ${signmeth == 'signin' ? 'selectedop' : ''} `} onClick={handlemethod}>
                        SIGN IN
                    </div>

                    <div className="divider w-[1px]"></div>

                    <div id='signup' className={`signop cursor-pointer w-full text-center py-[10px] sm:py-[20px] ${signmeth == 'signup' ? 'selectedop' : ''} `} onClick={handlemethod}>
                        SIGN UP
                    </div>

                </div>

                <div className='loginform p-[15px] md:p-[30px] '>

                    <form className='flex flex-col gap-y-[15px] md:gap-y-[30px] normaltxt' onSubmit={handleSubmit}>

                        <div className="email flex justify-between gap-[20px] items-center">
                            <label htmlFor="email" className=''>EMAIL</label>
                            <input type="email" id='email' value={loginvalue.email} placeholder='Enter Email' className='w-[17.5vw] min-w-[120px]'
                                onChange={(e) => { loginvalue.setemail(e.target.value) }} required />
                        </div>

                        <div className="password flex justify-between gap-[20px] items-center">
                            <label htmlFor="password" className=''>PASSWORD</label>
                            <input type="password" id='password' value={loginvalue.password} placeholder='Enter Password' className='w-[17.5vw] min-w-[120px]'
                                onChange={(e) => { loginvalue.setpassword(e.target.value) }} required />
                        </div>

                        <div className={`${instr.length === 0 ? 'hidden' : 'block'} text-wrap text-center text-[red] `}>{instr}</div>

                        <div className='w-fit mx-auto btndiv before:rounded-[12px]'>
                            <button className='signbtn btn cursor-pointer rounded-[10px] relative overflow-hidden' type='submit'>
                                <span className='relative z-1'>{signmeth == 'signin' ? 'SIGN IN' : 'SIGN UP'}</span>
                            </button>
                        </div>
                    </form>

                </div>

            </div>
            
        </div>
    )
}