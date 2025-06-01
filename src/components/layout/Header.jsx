import { CloudMoon, CloudSun, ScanText } from 'lucide-react'
import { toggleTheme } from '@/Utils/ToggleTheme';
import { Link } from 'react-router-dom';
import Newbadge from '../Newbadge';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { clearUser } from '@/Redux/Slices/User/user';


const Header = () => {



    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const headerData = [
        {
            "name": "Dashboard",
            "link": "/dashboard",
        },
        {
            "name": "Document",
            "link": "/docs",
        },
        {
            "name": "About",
            "link": "/about",
        },
        {
            "name": "Settings",
            "link": "/settings",
        }

    ]
    useEffect(() => {
        !user.isAuthenticated && navigate("/");
    }, [])

    return (
        <div className='sticky w-full h-10 bg-[#000] top-0  flex items-center justify-between px-8 text-white z-10' >
            <div className="w-{50%} h-full content-center cursor-pointer ">
                Hello
            </div>

            <div className="w-[50%] flex items-center justify-end gap-4 text-amber-500 font-semibold  text-sm  ">
                <Newbadge />
                {user.isAuthenticated ? (
                    <>
                        {headerData.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                            >
                                {item.name}
                            </Link>

                        )
                        )}
                        <button
                            onClick={() => {
                                dispatch(clearUser());
                                navigate("/");
                            }
                            }
                            className='border border-blue-600 text-blue-700 px-3 py-0.5 rounded-2xl text-sm hover:bg-blue-400 hover:text-blue-900 transition-transform active:scale-90 '
                        >
                            Logout
                        </button>
                    </>
                )
                    :
                    (
                        <>
                            <Link
                                to="/signup"
                                className='border border-blue-600 text-blue-700 px-3 py-0.5 rounded-2xl text-sm hover:bg-blue-400 hover:text-blue-900 transition-transform active:scale-90 '
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className='border border-gray-400 text-white px-3 py-0.5 rounded-2xl text-sm hover:bg-white hover:text-black transition-transform active:scale-90 '
                            >
                                Login
                            </Link>
                        </>

                    )
                }

                {/* <Link
                    to="/dashboard"
                    className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                <Link
                    to="/login"
                    className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                >Login</Link>
                <Link
                    to="/login"
                    className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                >Signup</Link>

                <Link
                    to="/login"
                    className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                ></Link>
                <Link
                    to="/login"
                    className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                ></Link>
                    

                {/* {isDarkMode ? <CloudMoon
                    className='cursor-pointer text-white'
                    onClick={() => toggleTheme(isDarkMode, setIsDarkMode)}
                /> : <CloudSun
                    className='cursor-pointer text-white'
                    onClick={() => toggleTheme(isDarkMode, setIsDarkMode)}
                />} */}
            </div>

        </div>
    )
}

export default Header