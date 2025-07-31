import React, { useContext } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { loginContext } from '../context/context'
import { OTP_Verification } from './OTP_Verification'
import Profile from './Profile'
import Navbar from './Navbar'


const ProtectedRoutes = () => {

    const loginvalue = useContext(loginContext)

    const location = useLocation();

    if (loginvalue.islogin) {
        return (
            <>
                <Navbar></Navbar>
                <Outlet></Outlet>
            </>
        )
    }

    if (loginvalue.issignup) {
        return <OTP_Verification></OTP_Verification>
    }

    if (loginvalue.isprof) {
        return <Profile></Profile>
    }

    return <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoutes;