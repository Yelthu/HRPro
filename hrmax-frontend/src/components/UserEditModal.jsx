import React, { useState } from 'react'

const UserEditModal = ({ user, onSave, onCancel }) => {

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null,
        empType: user.empType,
        joinedDate: user.joinedDate
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        onSave(formData)
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50' >
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"

                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled selected>Select User Role</option>
                            <option value="User">User</option>
                            <option value="HR">HR</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empType">
                            Employee Type
                        </label>
                        <select
                            name="empType"
                            value={formData.empType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled selected>Select Employee Type</option>
                            <option value="Probation">Probation</option>
                            <option value="Permanent">Permanent</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="joinedDate">
                            Joined Date
                        </label>
                        <input class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline sm:text-sm" id="joinedDate" name='joinedDate' type="date" value={formData.joinedDate} onChange={handleChange} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="profilePicture">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            name="profilePicture"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserEditModal