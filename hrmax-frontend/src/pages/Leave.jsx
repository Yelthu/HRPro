import React from 'react'
import { useState, useEffect } from 'react'
import Notification from "../components/Notification";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { areDatesSame, countSundays } from '../utils/index.js'

const Leave = ({ onSubmit }) => {

  const { user } = useUser()

  const initialState = {
    name: user?.Name,
    email: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    startleaveType: 'Full Day',
    endleaveType: 'Full Day',
    numofDays: 0,
    reason: '',
    attachedFiles: ''
  }

  const [formData, setFormData] = useState(initialState)
  const [leaves, setLeaves] = useState([])
  const [leaveBalance, setLeaveBalance] = useState([])
  const [filteredLeaveBalance, setFilteredLeaveBalance] = useState([]);
  const [allocatedLeaveBalance, setAllocatedLeaveBalance] = useState([])

  const [notification, setNotification] = useState({ message: '', color: '' })

  //process.env.REACT_APP_API_URL http://localhost:8800/api/leave/leave-balance

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await axios.get(`${process.env.REACT_APP_API_URL}/api/leave/leave-balance`, {
          params: {
            name: user.Name
          }
        })
        setLeaveBalance(respond.data)
      } catch (error) {
        console.log('Error is ', error)
      }
    }
    fetchData()
  }, [user])

  useEffect(() => {
    const fetchAllocatedLeaveBalance = async () => {
      try {
        const respond = await axios.get(`${process.env.REACT_APP_API_UR}/api/leave/allocated-balance`, {
          params: {
            emptype: user.Emp_Type,
            yearsOfService: user.YearsOfService
          }
        })
        setAllocatedLeaveBalance(respond.data)
      } catch (error) {
        console.log('Error is ', error)
      }
    }
    fetchAllocatedLeaveBalance()
  }, [user])

  const handleChange = (e) => {

    const { name, value, files } = e.target

    if (name === 'attachedFiles') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0]
      }))
    }
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {

      const numofDays = daysDifference();

      const formDataToSend = new FormData()
      formDataToSend.append('name', user.Name)
      //formDataToSend.append('email', user.Email)
      formDataToSend.append('leaveType', formData.leaveType)
      formDataToSend.append('startDate', formData.startDate)
      formDataToSend.append('endDate', formData.endDate)
      formDataToSend.append('startleaveType', formData.startleaveType)
      formDataToSend.append('endleaveType', formData.endleaveType)
      formDataToSend.append('reason', formData.reason)
      formDataToSend.append('attachedFiles', formData.attachedFiles)
      formDataToSend.append('numofDays', numofDays)

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_UR}/api/leave/request`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        showNotification(response.data.message, 'green')

        onSubmit(formData)

        setFormData(initialState)

      } catch (error) {
        console.log(error)
      }

    }
  }

  const showNotification = (message, color) => {
    setNotification({ message, color })

    setTimeout(() => {
      setNotification({ message: '', color: '' });
    }, 3000)
  }

  const daysDifference = () => {
    const { startDate, endDate, startleaveType, endleaveType } = formData
    const start = new Date(startDate)

    const end = new Date(endDate)
    const numofSundays = countSundays(start, end)
    let numofDays = 0


    numofDays = 1 + (end - start) / (1000 * 60 * 60 * 24)

    if (areDatesSame(start, end)) {
      if (startleaveType === 'Half Day') {
        numofDays -= 0.5
      }
    }
    if (end > start) {
      if (endleaveType === 'Half Day')
        numofDays -= 0.5

      numofDays -= numofSundays
    }

    console.log('numofDays', numofDays)

    return numofDays
  }

  const validateForm = () => {
    const { startDate, endDate, leaveType, startleaveType } = formData

    const currentDate = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const daysBefore = (start - currentDate) / (1000 * 60 * 60 * 24)

    const validationErrors = {}

    validateCasual()
    getTakenLeaveBalance(leaveType)

    const total = daysDifference()

    if (end < start) {
      validationErrors.endDate = 'End date must be greater than or equal to start date.'
      showNotification(validationErrors.endDate, 'red')
    }
    if (areDatesSame(start, end)) {
      if (leaveType === 'Casual Leave' && startleaveType === 'Half Day') {
        validationErrors.startleaveType = 'Leave can not be applied for half leave.'
        showNotification(validationErrors.startleaveType, 'red')
      }
    }
    if (leaveType === 'Casual Leave' && leaves.length > 0) {
      validationErrors.leaveType = 'Leave can not be applied more than one within two months.'
      showNotification(validationErrors.leaveType, 'red')
    }
    if (leaveType === 'Unpaid Leave' && daysBefore < 1) {
      validationErrors.startDate = 'Leave must be applied at least 1 days in advance.'
      showNotification(validationErrors.startDate, 'red')
    }
    if (leaveType === 'Annual Leave') {
      if (daysBefore < 7) {
        validationErrors.startDate = 'Leave must be applied at least 7 days in advance.'
        showNotification(validationErrors.startDate, 'red')
      }

      if (total > 7) {
        validationErrors.startDate = 'Leave cann`t be applied over 7 days.'
        showNotification(validationErrors.startDate, 'red')
      }
    }
    if (leaveType === 'Maternity Leave' && daysBefore < 30) {
      validationErrors.startDate = 'Leave must be applied at least one month in advance.'
      showNotification(validationErrors.startDate, 'red')
    }
    if (filteredLeaveBalance.length > 0) {
      const totalallocated = allocatedLeaveBalance[0].Leave_Balance

      if (filteredLeaveBalance[0].totalLeaveDays + total > totalallocated) {
        validationErrors.leaveType = `Leave can not be applied over ${totalallocated} days.`
        showNotification(validationErrors.leaveType, 'red')
      }
    }

    return Object.keys(validationErrors).length === 0

  }

  const validateCasual = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_UR}/api/leave/casual`, {
        params: { q: formData }
      })

      setLeaves(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getTakenLeaveBalance = (leaveType) => {
    if (leaveType) {
      console.log(leaveBalance)
      const filtered = leaveBalance.filter(leave => leave.leaveType === leaveType)
      setFilteredLeaveBalance(filtered)
      console.log(filtered)

      const allocatedBalance = allocatedLeaveBalance.filter(leave => leave.Leave_Type === leaveType)
      setAllocatedLeaveBalance(allocatedBalance)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6 overflow-auto">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Leave Request Form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="name" type="text" name='name' value={formData.name} onChange={handleChange} disabled />
            </div>
            {/* <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="email" type="email" name='email' value={formData.email} onChange={handleChange} />
            </div> */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="leave-type">Leave Type</label>
              <select class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 sm:text-sm" id="leave-type" name="leaveType" value={formData.leaveType} onChange={handleChange} required >
                <option value="" disabled selected>Select Leave Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Hospitalisation Leave">Hospitalisation Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div class="mb-4 flex items-center justify-between">
              <label class="text-gray-700 text-sm font-bold p-1" htmlFor="start-date">Start</label>
              <input class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="start-date" name='startDate' type="date" value={formData.startDate} onChange={handleChange} required />

              <select class="block appearance-none w-1/3 bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 sm:text-sm" id="start-leave-type" name="startleaveType" value={formData.startleaveType} onChange={handleChange} required>
                <option value="Full Day" selected>Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>

            </div>
            <div class="mb-4 flex items-center justify-between">
              <label class="text-gray-700 text-sm font-bold p-2" htmlFor="end-date">End</label>
              <input class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="end-date" name='endDate' type="date" value={formData.endDate} onChange={handleChange} required />

              <select class="block appearance-none w-1/3 bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500  sm:text-sm" id="end-leave-type" name="endleaveType" value={formData.endleaveType} onChange={handleChange} required>
                <option value="Full Day" selected>Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">Reason</label>
              <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="reason" name='reason' value={formData.reason} onChange={handleChange} rows="4" placeholder="Reason for leave" required></textarea>
            </div>

            <div class="mb-4">
              <input type="file" accept="image/*" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id='attachedFiles' name="attachedFiles" onChange={handleChange} />
            </div>

            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline md:text-md" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <Notification message={notification.message} color={notification.color} />
    </>
  )
}

export default Leave