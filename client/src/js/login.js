
export const handleLogin = async (e, { handleinstr, signmeth, loginvalue, navigate }) => {

    e.preventDefault();
    handleinstr('');

    try {

        const result = await fetch(`http://localhost:8000/ask_neigh/login/${signmeth}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: loginvalue.email,
                password: loginvalue.password
            })
        });

        if (!result.ok) {

            const errormssg = await result.json();
            handleinstr(errormssg.message);
            return;

        }

        if (result.status == 202) {
            loginvalue.handlesignup(true);
            loginvalue.handlelogin(false);
            navigate('/')
            return;
        }

        if(result.status == 201)
        {
            loginvalue.handleprof(true);
            navigate('/');
            return;
        }

        loginvalue.handlelogin(true);
        navigate('/');

    }
    catch (err) {
        console.log(`Error: ${err}`);
        handleinstr('Some Error Occured')
    }

}


export const handleOTP = async (e, { loginvalue, otp, handleMssg, handleotp, navigate }) => {

    e.preventDefault();
    handleMssg("");
    handleotp('')


    try {

        const d = new Date();

        const result = await fetch(`http://localhost:8000/ask_neigh/login/otp_verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: loginvalue.email,
                password: loginvalue.password,
                otp: otp,
                sent_at: d.toISOString()
            })
        });

        if (result.status != 200) {
            const errormssg = await result.json();
            handleMssg(errormssg.message);
            setTimeout(() => {
                alert("Restart the Sign Up Process!")
                loginvalue.handlesignup(false);
            }, 200);
            return;

        }

        loginvalue.handlesignup(false);
        loginvalue.handleprof(true);
        navigate('/');
    }
    catch (err) {
        console.log('Error: ', err)
        handleMssg(('Some Error Occured'))
        setTimeout(() => {
            alert("Restart the Sign Up Process!")
            loginvalue.handlesignup(false);
        }, 200);
    }

}

export const handleOTPresend = async (e, { loginvalue, handleMssg }) => {

    e.preventDefault();
    handleMssg('');

    try {

        const result = await fetch(`http://localhost:8000/ask_neigh/login/resend_otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginvalue.email,
            })
        });

        const msg = await result.json()

        alert(msg.message);

    }
    catch (err) {

        console.log('Error: ', err)
        handleMssg(('Some Error Occured'))
        setTimeout(() => {
            alert("Restart the Sign Up Process!")
        }, 200);
    }

}