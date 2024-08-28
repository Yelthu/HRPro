import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.jsx'
import { useContext, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import { useUser } from "../context/UserContext.jsx";

export default function Signin() {

    const { setUser } = useUser()

    const { dispatch } = useContext(AuthContext)

    const navigate = useNavigate()

    const [notification, setNotification] = useState({ message: '', color: '' })

    const showNotification = (message, color) => {
        setNotification({ message, color })

        setTimeout(() => {
            setNotification({ message: '', color: '' });
        }, 3000)
    }

    const handleClickForgotPassword = () => {
        navigate('/ForgotPassword')
    }

    const [formData, setFormData] = useState({
        Name: '',
        password: '',
        role: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
        //setCredential(formData)
    }


    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8800',
        withCredentials: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch({ type: "LOGIN_START" })

        try {
            const response = await axiosInstance.post('/api/auth/login', formData)
           // console.log('Response is ', response)

            if (response.data.details.IsAdmin) {
                dispatch({ type: "LOGIN_SUCCESS", payload: response.data.details })
                navigate('/Home')
            } else {
                dispatch({ type: "LOGIN_SUCCESS", payload: response.data.details })
                navigate('/Home')
            }

            formData.role = response.data.details.Role

            setUser(formData)

        } catch (error) {
            console.log('Error is ', error)
            showNotification(error.response?.data?.message, 'red')
            dispatch({ type: "LOGIN_FAILURE", payload: error.response.data })
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-gradient-to-r from-gray-800 to-gray-600 flex flex-col md:flex-row items-center justify-center p-4 md:p-10 rounded-xl max-w-4xl w-full">

                    <div className="md:w-1/2 p-5 text-white">
                        <h1 className="font-bold mb-4 text-pretty text-4xl">Login</h1>
                        <p className="mb-6 text-lg font-bold text-pretty">Sign in to continue</p>
                        <div className="border-t-4 border-white my-4 p-5"></div>
                        <button className="bg-green-500 hover:bg-green-700 text-black font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline w-1/2 m-5 ml-0"
                            onClick={handleClickForgotPassword}
                        >
                            Forgot Password
                        </button>
                    </div>

                    <div className="md:w-1/2 bg-gray-500 p-8 shadow-lg max-w-md w-full rounded-2xl">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold text-white text-center text-pretty">Sign in</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2 text-pretty" htmlFor="email">
                                    NAME
                                </label>
                                <input
                                    id="Name"
                                    type="text"
                                    name="Name"
                                    required
                                    onChange={handleChange}
                                    placeholder=""
                                    className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-400"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2 text-pretty" htmlFor="password">
                                    PASSWORD
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-400"
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-900 text-white font-bold w-1/3 py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline text-pretty"
                                >
                                    Log in
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
