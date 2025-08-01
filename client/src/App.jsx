import { useEffect, useState } from 'react'
import './css/App.css'
import './css/Mode.css'
import { loginContext } from './context/context'
import { RouterProvider, Navigate } from 'react-router-dom'
import { Router } from './components/router'
import Navbar from './components/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient();

function App() {

  const [theme, settheme] = useState('defwhite')
  const [islogin, setislogin] = useState(false);
  const [issignup, setissignup] = useState(false);
  const [isprof, setisprof] = useState(false);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')

  const handlelogin = (v) => {
    setislogin(v)
  }

  const handlesignup = (v) => {
    setissignup(v)
  }

  const handleprof = (v) => {
    setisprof(v)
  }

  useEffect(() => {

    const checkvalidity = async () => {

      try {
        const isValid = await fetch('http://localhost:8000/ask_neigh/login/validate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',

        });

        if (isValid.status == 200) {
          handleprof(false);
          handlelogin(true);
        }
        else if (isValid.status == 201) {
          handleprof(true);
        }

      }
      catch (err) {
        console.log('Error: ', err)
      }

    }

    checkvalidity();


  }, [islogin])

  useEffect(()=>{
    console.log(theme)
  },[theme])

  return (
    <loginContext.Provider value={{ theme, settheme, email, setemail, password, setpassword, islogin, issignup, handlelogin, handlesignup, isprof, handleprof }}>
      <QueryClientProvider client={queryClient}><main className={`${theme} `}>


        {/* {islogin && <Navbar />} */}

        <div className={`${theme}`}> 

          <RouterProvider router={Router}>
          </RouterProvider>

        </div>


      </main>
      </QueryClientProvider>
    </loginContext.Provider>
  )
}

export default App
