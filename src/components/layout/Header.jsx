import { Link, NavLink } from 'react-router-dom';
import Newbadge from '../Newbadge';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { clearUser } from '@/Redux/Slices/User/user';
import { toggleTheme } from '@/Redux/Slices/User/theme';
import { toast } from 'sonner';


const Header = () => {


    const [theme, setTheme] = useState(useAppSelector((state) => state.theme));
    const dispatch = useAppDispatch();

    useEffect(() => {
    }, [theme]);

    const toggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        dispatch(toggleTheme());
    };



    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user);
    

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

    return (
        <div className='sticky w-full h-10 bg-[var(--header)] top-0  flex items-center justify-between px-8 text-[var(--text-primary)] z-10' >
            <div className="w-{50%} h-full content-center cursor-pointer ">
                BGP
            </div>

            <div className="w-[50%] flex items-center justify-end gap-4 text-amber-500 font-semibold  text-sm  ">
                <Newbadge />
                {user.isAuthenticated ? (
                    <>
                        {/* {headerData.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out'
                            >
                                {item.name}
                            </Link>

                        )
                        )} */}
                        <button
                            onClick={toggle}
                            className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out cursor-pointer '
                        >
                            {theme === "light" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon cursor-pointer">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                        </button>

                        {/* <NavLink to="/login" > */}
                            <button
                                onClick={() => {
                                    dispatch(clearUser());
                                    navigate("/");
                                    toast.success("Logout successfully");
                                }
                                }
                                className='border border-blue-600 text-blue-700 px-3 py-0.5 rounded-2xl text-sm hover:bg-blue-400 hover:text-blue-900 transition-transform active:scale-90 '
                            >
                                Logout
                            </button>
                        {/* </NavLink> */}
                    </>
                )
                    :
                    (
                        <>
                            <Link
                                to="/signup"
                                className='border border-blue-600 text-blue-700 px-3 py-0.5 rounded-2xl text-sm hover:bg-blue-400 hover:text-white transition-transform active:scale-90 '
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className='border border-gray-400 text-[var(--white-8)] px-3 py-0.5 rounded-2xl text-sm hover:bg-[var(--white-9)] hover:text-[var(--white-1)] transition-transform active:scale-90 '
                            >
                                Login
                            </Link>
                            <button
                                onClick={toggle}
                                className='flex items-center gap-1 hover:text-amber-600 transition-all duration-300 ease-in-out cursor-pointer '
                            >
                                {theme === "light" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon cursor-pointer">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                )}
                            </button>
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