import React from 'react'

const Notification = ({ message, color }) => {
    return (
        <div className={`fixed top-4 right-4 bg-${color}-500 text-white p-4 rounded shadow-lg transition-transform transform ${message ? 'translate-y-0' : '-translate-y-full'
            }`}>
            {message}
        </div>
    )
}

export default Notification