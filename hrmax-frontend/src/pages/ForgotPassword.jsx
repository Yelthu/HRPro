import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";

export default function ForgotPassword() {

    const navigate = useNavigate()

    const handleClickLearnMore = () => {
        navigate('/AboutUsNew')
    }

    const [notification, setNotification] = useState({ message: '', color: '' })

    const showNotification = (message, color) => {
        setNotification({ message, color })

        setTimeout(() => {
            setNotification({ message: '', color: '' });
        }, 3000)
    }

    const [formData, setFormData] = useState({
        email: '',
        newpassword: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/resetPassword`, formData);
            console.log('Response is ', response)

            showNotification(response.data.message, 'green')

            navigate('/Signin')
        } catch (error) {
            console.log('Error is ', error)
            showNotification(error.response?.data?.message, 'red')
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 flex flex-col md:flex-row items-center justify-center p-4 md:p-10 rounded-xl max-w-4xl w-full">

                    <div className="md:w-1/2 p-5 text-white">
                        <h1 className="font-bold mb-4 text-pretty text-4xl">Forgot The Password</h1>
                        <p className="mb-6 text-lg font-bold text-pretty">New Password</p>
                        <div className="border-t-4 border-white my-4 p-5"></div>
                        <button className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline w-1/2 m-5 ml-0"
                            onClick={handleClickLearnMore}>
                            Learn More
                        </button>
                    </div>

                    <div className="md:w-1/2 bg-gray-500 p-8 shadow-lg max-w-md w-full rounded-2xl">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold text-white text-center text-pretty">Create</h2>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2 text-pretty" htmlFor="email">
                                    EMAIL
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    onChange={handleChange}
                                    placeholder=""
                                    className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-400"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2 text-pretty" htmlFor="newpassword">
                                    NEW PASSWORD
                                </label>
                                <input
                                    id="newpassword"
                                    name="newpassword"
                                    required
                                    onChange={handleChange}
                                    type="password"
                                    className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-400"
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-900 text-white font-bold w-1/3 py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline text-pretty"
                                >
                                    Send
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            </div>
            <Notification message={notification.message} color={notification.color} />
        </>
    )
}
