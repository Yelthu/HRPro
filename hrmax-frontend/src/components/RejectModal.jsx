import React from 'react'

const RejectModal = ({ show, onClose, onConfirm, title, children }) => {

    if (!show) return null

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
            <div className='bg-white rounded-lg overflow-hidden shadow-xl max-w-sm w-full'>
                <div className='p-4'>
                    <h2 className='text-xl font-bold mb-2'>{title}</h2>
                    <div className='mb-4'>{children}</div>
                    <div className='flex justify-end space-x-2'>
                        <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded' onClick={onClose}>
                            Cancel
                        </button>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded' onClick={onConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RejectModal