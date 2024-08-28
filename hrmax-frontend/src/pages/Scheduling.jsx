import React, { useCallback, useEffect, useState } from 'react'
import axios from "axios";
import Notification from "../components/Notification";

const Scheduling = () => {

    const [people, setPeople] = useState([]);
    const [dates, setDates] = useState([]);
    const [days, setDays] = useState([]);
    const [assigned, setAssigned] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null)
    const [colSpan, setColSpan] = useState(0);
    const [pendingChanges, setPendingChanges] = useState([]);

    const [counts, setCounts] = useState([]);
    const [pHList, setPHList] = useState([]);

    const [notification, setNotification] = useState({ message: '', color: '' })

    const prepareDisplay = useCallback((responseData) => {
        const names = [];
        let tasks;
        let assignedValue;
        let month, year;
        let newPHList = [];

        if (responseData.length > 0) {
            for (const people of responseData) {
                const name = people.name;
                names.push(name);

                tasks = people.tasks;
                assignedValue = people.assigned;
                month = people.month
                year = people.year

                newPHList.push(tasks.map(task => task.value));

            }

            const taskDates = tasks.map(task => task.date);
            setDates(taskDates);
            const taskDays = tasks.map(task => task.day);
            setDays(taskDays);

            setAssigned(assignedValue);
            setMonth(month);
            setYear(year);

            setColSpan(taskDays.length + 1);
            setPHList(newPHList);

            //const countsResult = countVertically(pHList);
            const countsResult = countVertically(newPHList);
            setCounts(countsResult);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const respond = await axios.get('http://localhost:8800/api/scheduling/people')

                setPeople(respond.data);

                prepareDisplay(respond.data);
            } catch (error) {
                console.log('Error is ', error)
            }
        }
        fetchData();
    }, [prepareDisplay])

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file)

        try {
            const response = await axios.post('http://localhost:8800/api/scheduling/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            showNotification("Your file has been uploaded", 'green');

            setPeople(response.data);

            prepareDisplay(response.data);

        } catch (error) {
            console.error(error)
        }
    };

    const handleCellChange = (personId, taskId, date, value) => {
        const changes = { personId, taskId, date, value };
        setPendingChanges(prevChanges => [...prevChanges, changes]);
    };

    const saveChanges = async () => {

        try {
            const respond = await axios.put('http://localhost:8800/api/scheduling/people/batch', { changes: pendingChanges });

            const updatedPeople = people.map(person => {
                const updatedPerson = respond.data.find(p => p._id === person._id);
                return updatedPerson || person
            });

            showNotification("Your changes has been updated", 'green');

            setPeople(updatedPeople);
            setPendingChanges([]);

            prepareDisplay(updatedPeople);

        } catch (error) {
            console.error(error);
        }
    }

    const handleExport = (people, dayHeader, datesHeader, assigned, filename = 'Rota.csv') => {
        let csvContent = 'No.,Dates,' + datesHeader.join(',') + ',Rota Ratio,Department,\n';
        csvContent += ',Days,' + dayHeader.join(',') + '\n';
        csvContent += ',' + month + ' ' + year + ' (' + assigned + '),\n';

        people.forEach((person, index) => {
            const row = [
                index + 1,
                person.name,
                ...person.tasks.map(task => task.value),
                person.rostaRatio,
                person.deaprtment
            ];
            csvContent += row.join(',') + '\n';
        })
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');

        if (link.download !== undefined) {

            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }
    }

    const showNotification = (message, color) => {
        setNotification({ message, color })

        setTimeout(() => {
            setNotification({ message: '', color: '' });
        }, 3000)
    }

    function countVertically(data) {
        const rows = data.length;
        const columns = data[0].length;

        const counts = Array(columns).fill(null).map(() => ({ P: 0, H: 0 }));

        for (let column = 0; column < columns; column++) {
            for (let row = 0; row < rows; row++) {
                if (data[row][column] === 'P') counts[column].P++
                else if (data[row][column] === 'H') counts[column].H++
            }
        }

        return counts;
    }

    const setDayColor = (param) => {

        if (param === 'Sat' || param === 'Sun') {
            return 'text-red-700';
        }
        if (param === 'Mon' || param === 'Tue' || param === 'Wed' || param === 'Thu' || param === 'Fri') {
            return 'text-gray-500';
        }
        if (param === 'P') {
            return 'bg-green-500 text-white';
        }
    }

    return (
        <div className='container mx-auto p-3'>

            <div className="flex flex-col md:flex-row justify-between items-center mb-5">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4 shadow-sm rounded-sm px-2 py-1 border" />
                </div>
                {
                    people.length > 0 &&
                    <div className="mt-4 md:mt-0">
                        {
                            pendingChanges.length > 0 &&
                            <button className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded' onClick={saveChanges}>
                                Save Changes
                            </button>
                        }

                        <button className='bg-green-500 hover:bg-green-700 text-white py-2 px-3 rounded ml-3' onClick={() => handleExport(people, days, dates, assigned)}>
                            Export Csv
                        </button>
                    </div>
                }
            </div>

            <div className="bg-white shadow-md rounded overflow-x-auto">
                {
                    people.length > 0 && (
                        <div className="table-auto min-w-full border-collapse border border-gray-200">
                            <table className="min-w-full leading-normal">
                                <thead className='bg-slate-100 text-sm'>
                                    <tr>
                                        <th rowSpan={3} className="border border-gray-300 p-2">No.</th>
                                        <th className="border border-gray-300 p-2">Dates</th>
                                        {dates.map((date, index) => (
                                            <th key={index} className="border border-gray-300 p-2">{date}</th>
                                        ))}
                                        <th rowSpan={3} className='border border-gray-300 p-2'>Rosta Ratio</th>
                                        <th rowSpan={3} className='border border-gray-300 p-2'>Department</th>
                                    </tr>
                                    <tr>

                                        <th className="border border-gray-300 p-2">Days</th>
                                        {days.map((day, index) => (
                                            <th key={index} className={`border border-gray-300 p-2 ${setDayColor(day)}`}>{day}</th>
                                        ))}
                                    </tr>
                                    <tr>
                                        <th colSpan={colSpan} className="border border-gray-300 p-2 text-center">{month} , {year} ({assigned})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        people.map((person, index) => (
                                            <React.Fragment key={person._id}>
                                                <tr>
                                                    <td className="border border-gray-300 p-2 whitespace-nowrap text-sm">{index + 1}</td>
                                                    <td className="border border-gray-300 p-2 whitespace-nowrap text-sm">{person.name}</td>
                                                    {dates.map((date, index) => {
                                                        const task = person.tasks.find(task => task.date === date);

                                                        return (
                                                            <td
                                                                key={index}
                                                                className={`border border-gray-300 p-2 whitespace-nowrap text-sm ${setDayColor(task.value)}`}
                                                                contentEditable
                                                                onBlur={(e) => handleCellChange(person._id, task._id, date, e.target.innerText)}
                                                            >
                                                                {task ? task.value : ''}
                                                            </td>
                                                        );

                                                    })}
                                                    <td className='border border-gray-300 p-2 whitespace-nowrap text-sm'>
                                                        {person.rostaRatio}
                                                    </td>
                                                    <td className='border border-gray-300 p-2 whitespace-nowrap text-sm'>
                                                        {person.deaprtment}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="border border-gray-300 p-2 whitespace-nowrap text-sm font-bold"></td>
                                        <td className="border border-gray-300 p-2 whitespace-nowrap text-sm font-bold">Total </td>
                                        {
                                            counts.map((count, index) => (
                                                <td className="border border-gray-300 p-2 whitespace-nowrap text-sm font-semibold" key={index}>{count.P}</td>
                                            ))
                                        }
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )
                }

            </div>
            <Notification message={notification.message} color={notification.color} />
        </div>
    )
}

export default Scheduling