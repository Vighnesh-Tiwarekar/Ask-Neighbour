import React, { useContext } from 'react'
import { useState } from 'react';
import '../css/OTP_Verification.css'
import { loginContext } from '../context/context';
import { handleOTP, handleOTPresend } from '../js/login';
import { useNavigate } from 'react-router-dom';

export const OTP_Verification = () => {

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const loginvalue = useContext(loginContext);
    const navigate = useNavigate();

    const handleMssg = (v) => {
        setMessage(v)
    }

    const handleotp = (v) => {
        setOtp(v)
    }

    const handleVerify = async (e) => {
        await handleOTP(e, { loginvalue, otp, handleMssg, handleotp, navigate })
    };

    const handleResend = async (e) => {
        await handleOTPresend(e, { loginvalue, handleMssg })
    };

    return (
        <div className='otp-pg w-[100vw] h-[100vh] flex items-center '>

            <div className="otp-container w-fit mx-auto max-w-[400px] p-[15px] sm:p-[30px] text-center">

                <div className='text-[20px] font-bold mb-[10px]'>Email Verification</div>

                <div className="otp-instruction mb-[16px] text-[15px]">
                    An OTP has been sent to: <strong>{loginvalue.email || "your email"}</strong>
                </div>

                <form onSubmit={handleVerify}>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="otp-input p-[12px] rounded-[10px] mb-[20px]  w-[17.5vw] min-w-[250px]"
                        required
                    />

                    <div className='btndiv before:rounded-[10px]  mb-[20px]'>
                        <button className="otp-button  w-[17.5vw] min-w-[250px] btn cursor-pointer p-[12px] rounded-[10px] relative overflow-hidden" onClick={handleResend} type='button'>
                            <span className='relative z-1 font-bold'>Resend OTP</span>
                        </button>
                    </div>

                    <div className='btndiv before:rounded-[10px]  mb-[20px]'>
                        <button className="otp-button  w-[17.5vw] min-w-[250px] btn cursor-pointer p-[12px] rounded-[10px] relative overflow-hidden" type='submit'>
                            <span className='relative z-1 font-bold'>Verify</span>
                        </button>
                    </div>

                </form>

                {message && <div className="otp-message mt-[12px] text-[14px]">{message}</div>}

                <div className="otp-description block mt-[24px] text-[13px] text-wrap text-center mx-auto w-[17.5vw] min-w-[250px]">
                    * To use our services, please verify your email using the OTP sent to you.
                </div>
            </div>
        </div>
    );

}
