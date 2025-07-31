import { createBrowserRouter } from "react-router-dom";
import Login from './Login.jsx'
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Profile from "./Profile.jsx";
import CreatePost from "./CreatePost.jsx";
import Home from "./Home.jsx";
import YourPosts from "./YourPosts.jsx";


export const Router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },

    {   
        element: <ProtectedRoutes />,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/createpost',
                element: <CreatePost></CreatePost>
            },
            {
                path: '/profile',
                element: <Profile></Profile>
            },
            {
                path: '/yourposts',
                element: <YourPosts></YourPosts>
            }
        ]
    }
])