import React, { useState } from 'react'
import Stepper from './Stepper'
import Leave from '../pages/Leave'
import LeaveRequestList from './LeaveRequestList'

const ApprovalWorkflow = () => {

    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState(null)

    const handleFormSubmit = (data) => {
        setFormData(data)
        setCurrentStep(1)
    }

    const handleHRApproval = () => {
        setCurrentStep(2)
    }

    const handleManagementApproval = () => {
        setCurrentStep(3)
    }

    return (
        <div className='container mx-auto p-0'>
            <Stepper currentStep={currentStep} />
            {
                currentStep === 0 && <Leave onSubmit={handleFormSubmit} />
            }

            {
                currentStep === 1 && (
                    // <div className='mt-4'>
                    //     <h2 className='text-xl font-bold'>HR Approval</h2>
                    //     <p>Name : {formData.name}</p>
                    //     <p>Email : {formData.email}</p>
                    //     <p>Leave Type : {formData.leaveType}</p>
                    //     <p>Start Date : {formData.startDate}</p>
                    //     <p>End Date  : {formData.endDate}</p>
                    //     <p>Reason  : {formData.reason}</p>
                    //     <button onClick={handleHRApproval} className='px-4 ppy-2 mt-4 bg-green-500 text-white rounded-md'>Approve</button>
                    // </div>
                    < LeaveRequestList />
                )
            }

            {
                currentStep === 2 && (
                    <div className='mt-4'>
                        <h2 className='text-xl font-bold'>Management Approval</h2>
                        <p>Name : {formData.name}</p>
                        <p>Email : {formData.email}</p>
                        <p>Leave Type : {formData.leaveType}</p>
                        <p>Start Date : {formData.startDate}</p>
                        <p>End Date  : {formData.endDate}</p>
                        <p>Reason  : {formData.reason}</p>
                        <button onClick={handleManagementApproval} className='px-4 ppy-2 mt-4 bg-green-500 text-white rounded-md'>Approve</button>
                    </div>
                )
            }

            {
                currentStep === 3 && (
                    <div className='mt-4'>
                        <h2 className='text-xl font-bold'>Leave Request Approved</h2>
                        <p>Name : {formData.name}</p>
                        <p>Email : {formData.email}</p>
                        <p>Leave Type : {formData.leaveType}</p>
                        <p>Start Date : {formData.startDate}</p>
                        <p>End Date  : {formData.endDate}</p>
                        <p>Reason  : {formData.reason}</p>
                        <p className='mt-4 text-green-500'>Your leave request has been approved!</p>
                    </div>
                )
            }

        </div>
    )
}

export default ApprovalWorkflow