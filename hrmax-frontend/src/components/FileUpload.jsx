import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const FileUpload = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [message, setMessage] = useState('');

    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respond = await axios.get('http://localhost:8800/api/attendance')
                setData(respond.data)
            } catch (error) {
                console.log('Error is ', error)
            }
        }
        fetchData()
    }, [])

    const showMessage = () => {
        setTimeout(() => {
            setMessage('');
        }, 3000);
    }

    const [formData, setFormData] = useState({
        Name: '',
        att_date: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.get('http://localhost:8800/api/attendance/search', {
                params: { q: formData }
            })

            setData(response.data)

        } catch (error) {
            console.log('Error is ', error)
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const filteredData = results.data.map((row) => ({
                        "Emp No.": row["Emp_No"],
                        "Name": row["Name"],
                        "Date": row["Date"],
                        "Clock In": row["Clock_In"],
                        "Clock Out": row["Clock_Out"],
                    }))
                    setData(filteredData);
                },
            });
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post('http://localhost:8800/api/attendance/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setMessage(response.data);

        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        }
        showMessage()
    };

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setPage((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const displayedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div className="container mx-auto p-3">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4 shadow-sm rounded-sm px-2 py-1" />

            {data.length > 0 && (
                <div className='flex justify-between items-center float-end box-border md:box-content'>
                    <div>
                        <input
                            id="att_date"
                            name="att_date"
                            onChange={handleChange}
                            type="date"
                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div>
                        <input
                            id="Name"
                            name="Name"
                            onChange={handleChange}
                            type="text"
                            placeholder='Search with Name'
                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 m-3"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

            )}

            {message && (
                <div className='flex justify-center items-center m-3'>
                    <p className='font-bold text-lime-700 border-solid bg-transparent rounded-sm'>
                        {message}
                    </p>
                </div>)}

            <div className="container mx-auto p-6">
                <div className="flex overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {data.length > 0 && Object.keys(data[0]).map((key) => (
                                    <th key={key} className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {displayedData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, i) => (
                                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {data.length > 0 ?
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={(page + 1) * rowsPerPage >= data.length}
                    >
                        Next
                    </button>
                </div> :
                <div>
                    <p className='antialiased text-center border-b-5 font-semibold'>There is no data to display</p>
                </div>
            }

        </div>
    );
};

export default FileUpload;