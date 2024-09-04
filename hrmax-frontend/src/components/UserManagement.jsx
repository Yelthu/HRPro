import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import UserEditModal from './UserEditModal';
import RejectModal from './RejectModal.jsx'
import Notification from "../components/Notification";
import axiosInstance from '../utils/axiosInstance.js'

const UserManagement = () => {

    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null)

    const [showModal, setShowModal] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState(null)

    const [query, setQuery] = useState('')

    const [notification, setNotification] = useState({ message: '', color: '' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_UR}/api/user/search?q=${query}`);

                setUsers(response.data);

            } catch (error) {
                console.error('Error fetching search results', error);
            }
        }

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 300)

        return () => clearTimeout(delayDebounce);

    }, [query])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/user')

                setUsers(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/upload-user-list`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setUsers(response.data);

        } catch (error) {
            console.error('Error uploading file:', error);
            showNotification('Error uploading file');
        }

    };

    const handleEdit = (users) => {
        setEditingUser(users)
    }

    const handleSave = async (updatedUser) => {
        try {
            const response = await axiosInstance.post('/api/user/update', updatedUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    id: editingUser._id
                }
            })

            if (response.status === 200) {
                const u = response.data
                showNotification("User has been updated", 'green')
                setUsers(users.map(user => user._id === editingUser._id ? u : user))
            }
        } catch (error) {
            console.error('Error updating user:', error)
        }

        setEditingUser(null)
    }

    const handleCancel = (users) => {
        setEditingUser(null)
    }

    const handleDelete = (id) => {
        setShowModal(true)
        setSelectedRequestId(id)
    };

    const showNotification = (message, color) => {
        setNotification({ message, color })

        setTimeout(() => {
            setNotification({ message: '', color: '' });
        }, 3000)
    }

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${selectedRequestId}`, {
                id: selectedRequestId
            })
            if (response.status === 200) {
                showNotification(response.data.message, 'red')
                setUsers(users.filter(user => user._id !== selectedRequestId));

            }
            setShowModal(false)
            setSelectedRequestId(null)

        } catch (error) {
            console.error('Error deleteion user:', error);
        }
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">User Management</h2>

                <div className="flex flex-col sm:flex-row justify-between my-2 mb-5">
                    <div className="flex sm:w-1/2">
                        <div className="block relative">
                            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                    <path d="M10 2a8 8 0 015.292 13.708l5.59 5.588-1.415 1.415-5.588-5.59A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
                                </svg>
                            </span>
                            <input placeholder="Search" className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                                value={query} onChange={(e) => setQuery(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex sm:w-1/2 justify-end mt-2 sm:mt-0">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="appearance-none rounded border border-gray-400 border-b w-full bg-white placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>


                <div className="bg-white shadow-md rounded overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Emp No
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Avatar
                                </th>
                                <th className="px-5 py-3 border-b-2  border-blue-400 bg-green-400 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {user.Emp_No}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.Name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.Email}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.Role}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{user.Department}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex items-center">
                                                {user.ProfilePicture ? (
                                                    <img src={`${process.env.REACT_APP_API_URL}${user.ProfilePicture}`} alt={user.Name} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <span className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">N/A</span>
                                                )}
                                            </div>

                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                className='bg-indigo-600 hover:bg-indigo-900 text-white font-bold py-1 px-3 rounded mr-3 cursor-pointer'
                                                onClick={() => handleEdit(user)}
                                            >
                                                <PencilIcon className="h-5 w-5 inline" />
                                            </button>
                                            <button
                                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded cursor-pointer'
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <TrashIcon className="h-5 w-5 inline" />
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {
                    editingUser && (
                        <UserEditModal user={editingUser} onSave={handleSave} onCancel={handleCancel} />
                    )
                }

                <RejectModal show={showModal} onClose={() => setShowModal(false)} onConfirm={confirmDelete} title="Confirm Delete">
                    Are you sure you want to delete this user?
                </RejectModal>

                <Notification message={notification.message} color={notification.color} />
            </div>
            {/* <Notification message={notification.message} color={notification.color} /> */}

        </>
    )
}

export default UserManagement