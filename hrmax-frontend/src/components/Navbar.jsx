import React, { useContext, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react';
import Logo from '../asset/Logo.png'

const Navbar = () => {

    const { user } = useContext(AuthContext)
    const [isOpen, setIsOpen] = useState(false)
    const [drowdownOpen, setDrowdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    const toggleDropdown = () => {
        setDrowdownOpen(!drowdownOpen)
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDrowdownOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <nav className="bg-gray-900 p-4">
            {user &&
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-lg font-semibold">
                        <Link to="/Home" className='flex items-center space-x-2'>
                            <img srcSet={Logo} alt='Logo' className='h-12 w-auto shadow-xl dark:shadow-green-800 rounded-lg bg-gray-300'></img>
                            {/* <span className="text-white text-sm font-bold">HRMax</span> */}
                        </Link>
                    </div>

                    <div className='block lg:hidden'>
                        <button className='text-white focus:outline-none' onClick={toggleMenu}>
                            <svg
                                className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                                viewBox='0 0 24 24' stroke='currentColor'
                            >
                                <path d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
                            </svg>
                        </button>
                    </div>

                    <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? '' : 'hidden'}`}>
                        <ul className="lg:flex lg:justify-between">
                            {
                                user.Role !== 'User' &&
                                <li className='block lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-4 py-2'>
                                    <NavLink
                                        exact
                                        to="/appraisal"
                                        className={({ isActive }) => (isActive ? 'text-gray-500' : 'text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium')}
                                    >
                                        Appraisal
                                    </NavLink>
                                </li>
                            }
                            {
                                user.Role === 'Admin' &&
                                <li className='block lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-4 py-2'>
                                    <NavLink
                                        exact
                                        to="/usermanagement"
                                        className={({ isActive }) => (isActive ? 'text-gray-500' : 'text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium')}
                                    >
                                        User Management
                                    </NavLink>
                                </li>
                            }


                            <li className='relative block lg:inline-block lg:mt-0  text-white hover:text-gray-200 px-4 py-2'>
                                <button className='text-white focus:outline-none' onClick={toggleDropdown}>
                                    Time Management
                                </button>

                                {drowdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-slate-400 rounded-md shadow-lg py-2 z-20' ref={dropdownRef}>
                                        {
                                            user.Role !== 'User' &&
                                            <NavLink
                                                exact
                                                to="/attendance"
                                                className="block px-4 py-2 text-white hover:bg-gray-700"
                                            >
                                                Time and Attendance
                                            </NavLink>
                                        }

                                        <NavLink
                                            exact
                                            to="/leaverequestlist"
                                            className="block px-4 py-2 text-white hover:bg-gray-700"
                                        >
                                            Leave Management
                                        </NavLink>
                                        {
                                            user.Role !== 'User' &&
                                            <NavLink
                                                exact
                                                to="/scheduling"
                                                className="block px-4 py-2 text-white hover:bg-gray-700"
                                            >
                                                Scheduling
                                            </NavLink>
                                        }
                                    </div>
                                )}
                            </li>

                            {
                                user &&
                                <li className='block lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-4 py-2'>
                                    <NavLink
                                        exact
                                        to="/logout"
                                        className={({ isActive }) => (isActive ? 'text-gray-500' : 'text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 font-medium')}
                                    >
                                        Logout
                                    </NavLink>
                                </li>
                            }


                        </ul>
                    </div>



                </div>
            }
        </nav>
    )
}

export default Navbar