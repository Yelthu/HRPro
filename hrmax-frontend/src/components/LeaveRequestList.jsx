import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { formatDate } from '../utils/index.js'
import RejectModal from './RejectModal.jsx'
import { useNavigate } from "react-router-dom";

const LeaveRequestList = () => {

    const [showModal, setShowModal] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const displayMessage = "There`s no leave requests at the moment.Otherwise,the leave requests will be displaying...."

    const navigate = useNavigate()

    const handleNewLeaveRequest = () => {
        navigate('/leave')
    }

    const handleReject = async (id) => {
        setShowModal(true)
        setSelectedRequestId(id)
    };

    const confirmReject = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/leave/reject', {
                id: selectedRequestId, reason: rejectReason
            })
            if (response.status === 200) {
                setLeaveList(preRequests => preRequests.map(request => request._id === selectedRequestId ? { ...request, status: 'Rejected' } : request))
            }
            setShowModal(false)
            setSelectedRequestId(null)
            setRejectReason('')
        } catch (error) {
            console.error('Error rejecting leave request:', error);
        }
    }

    const [leavelist, setLeaveList] = useState([])

    const { user } = useUser()

    console.log(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'User') {
                    const respond = await axios.get('http://localhost:8800/api/leave/leave-list-emp', {
                        params: {
                            name: user.Name
                        }
                    })
                    setLeaveList(respond.data)
                }
                else if (user.role === 'HR') {
                    const respond = await axios.get('http://localhost:8800/api/leave', {
                        params: {
                            state: 'HR Approval'
                        }
                    })
                    setLeaveList(respond.data)
                }
                else if (user.role === 'Admin') {
                    const respond = await axios.get('http://localhost:8800/api/leave', {
                        params: {
                            state: 'Management Approval'
                        }
                    })
                    setLeaveList(respond.data)
                }

            } catch (error) {
                console.log('Error is ', error)
            }
        }
        fetchData()
    }, [user])

    const handleApprove = async (id) => {
        try {
            const response = await axios.post('http://localhost:8800/api/leave/approve', {
                id
            })
            if (response.status === 200) {
                setLeaveList(preRequests => preRequests.map(request => request._id === id ? { ...request, status: 'Approved' } : request))
            } else {
                console.error('Failed to approve the leave request');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const setStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'text-green-700';
            case 'Rejected':
                return 'text-red-700';
            default:
                return 'text-yellow-500';
        }
    }

    const isDisabled = (status) => status !== 'Pending'

    return (
        <>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
                <div className="bg-white shadow-md rounded overflow-x-auto">
                    {leavelist.length > 0 ?
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Leave Type
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Days
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>

                                    {
                                        user.role !== 'User' ?
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                            :
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Reason
                                            </th>
                                    }

                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        HR Approval
                                    </th>

                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Mangement Approval
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leavelist.map(leave => (
                                        <tr key={leave._id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {leave.Name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{leave.Leave_Type}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{formatDate(leave.Start_Date)}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{formatDate(leave.End_Date)}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{leave.No_Of_Days}</p>
                                            </td>

                                            <td className={`px-5 py-5 border-b border-gray-200 font-semibold bg-white text-sm ${setStatusColor(leave.Status)}`}>{leave.Status}</td>

                                            {
                                                user.role !== 'User' ?
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                        <button
                                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2 ${isDisabled(leave.Status) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                            onClick={() => handleApprove(leave._id)}
                                                            disabled={isDisabled(leave.Status)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ${isDisabled(leave.Status) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                            onClick={() => handleReject(leave._id)}
                                                            disabled={isDisabled(leave.Status)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </td>
                                                    :
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">{leave.Reason}</p>
                                                    </td>
                                            }

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">On going</p>
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">Not starting yet</p>
                                            </td>

                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        :

                        < p className='antialiased text-center border-b-5 font-semibold'>
                            {displayMessage}
                        </p>

                    }

                </div>

                <RejectModal show={showModal} onClose={() => setShowModal(false)} onConfirm={confirmReject} title="Confirm Rejection">
                    Are you sure you want to reject this leave request?

                    <textarea className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-4' placeholder='Enter reject reason' rows='4' value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                </RejectModal>

                <div className='flex items-center justify-center'>
                    <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-3 rounded p-5 mt-5' onClick={handleNewLeaveRequest}> Create Leave Request</button>
                </div>


            </div >

        </>

    );
};

export default LeaveRequestList;