import { CloudMoon, CloudSun, ScanText } from 'lucide-react'
import { toggleTheme } from '@/Utils/ToggleTheme';
import { Link } from 'react-router-dom';
import Newbadge from '../Newbadge';
const Header = ({ isDarkMode, setIsDarkMode, isSidebarActive }) => {



    return (
        <div className='sticky w-full h-10 bg-[var(--header)] top-0  flex items-center justify-between px-8 text-white z-10' >
            <div className="w-{50%} h-full content-center cursor-pointer ">
                Hello
            </div>

            <div className="w-[50%] flex items-center justify-end gap-4 text-amber-500 font-semibold  text-sm  ">
                <Newbadge />
                <Link className='hover:text-amber-600 transition duration-150' to="docs" >Dashboard</Link>
                <Link className='hover:text-amber-600 transition duration-150' to="docs" >Document</Link>
                <Link className='hover:text-amber-600 transition duration-150' to="docs" >About</Link>
                {isDarkMode ? <CloudMoon
                    className='cursor-pointer text-white'
                    onClick={() => toggleTheme(isDarkMode, setIsDarkMode)}
                /> : <CloudSun
                    className='cursor-pointer text-white'
                    onClick={() => toggleTheme(isDarkMode, setIsDarkMode)}
                />}
            </div>

        </div>
    )
}

export default Header