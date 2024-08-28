import React from 'react'

const Stepper = ({ currentStep }) => {

    const steps = ["Leave Request", "HR Approval", "Management Approval"]

    return (
        <div className='flex justify-between mt-2'>
            {
                steps.map((step, index) => (
                    <div key={index} className='flex flex-col items-center'>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {index + 1}
                        </div>
                        <div className='mt-2'>{step}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default Stepper