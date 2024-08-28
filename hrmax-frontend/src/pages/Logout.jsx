import React  from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate(-1)
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div className='flex item-center justify-center h-screen bg-gray-900'>
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 flex flex-col p-4 md:p-10 rounded-xl max-w-4xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-6">Are you sure you want to log out?</p>

                <div className='flex justify-between'>
                    <button className='bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600' onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Logout