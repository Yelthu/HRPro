import express from 'express'
import multer from 'multer'
import fs from 'fs'
import csv from 'csv-parser'
import { schedulingAttachmentsDir, getCurrentYearAndMonth, createDate } from '../utils/utils.js'
import Person from '../models/Person.js'
import Attendance from '../models/Attendance.js'
import { getPeople, updatePeople } from '../controllers/SchedulingController.js'
import User from '../models/User.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(schedulingAttachmentsDir)) {
            fs.mkdirSync(schedulingAttachmentsDir, { recursive: true })
        }
        cb(null, schedulingAttachmentsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res, next) => {
    const people = [];

    const results = [];

    const file = req.file

    const filePath = file.path

    const { month, year } = getCurrentYearAndMonth();

    try {
        fs.createReadStream(filePath)
            .pipe(csv({ headers: false }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {

                const [header, days, task, ...rows] = results;

                const assigned = task['0'];

                // rows.shift();

                for (const row of rows) {
                    const name = row['0'];
                    const tasks = Object.keys(row).filter(key => key !== '0').map(key => ({
                        date: header[key],
                        day: days[key],
                        value: row[key]
                    }));

                    const searchQuery = {
                        name: name,
                        month: month,
                        year: year
                    }

                    let person = await Person.findOne(searchQuery);
                    // console.log(`${person}`)

                    if (!person) {
                        person = new Person({ name, tasks });
                    } else {
                        person.tasks = tasks;
                    }

                    person.month = month;
                    person.year = Number(year);

                    person.assigned = assigned;

                    person.rostaRatio = await calculateRostaRatio(person.name, person.tasks);

                    const p_name = person.name;

                    const user = await User.findOne({ Name: new RegExp('^' + p_name.replace(/\s+/g, '\\s*') + '$', 'i') });

                    person.deaprtment = user.Department;

                    people.push(person);

                    await person.save();

                }
                fs.unlinkSync(filePath);

                res.status(200).json(people);
            })
    } catch (error) {
        next(error);
    }

});

export const calculateRostaRatio = async (name, tasks) => {
    const totalTasks = tasks.length;
    let completedTasks = 0;

    for (const task of tasks) {

        const date = createDate(task.date);

        const attendanceRecord = await Attendance.findOne({
            Name: new RegExp('^' + name.replace(/\s+/g, '\\s*') + '$', 'i'), // Case-insensitive and whitespace-insensitive regex
            Date: date
        });

        if (attendanceRecord && attendanceRecord.Clock_In && attendanceRecord.Clock_Out) {
            completedTasks++;
        }
    }

    return `${(completedTasks / totalTasks * 100).toFixed(2)}%`;
};


router.get('/people', getPeople)
router.put('/people/batch', updatePeople)

export default router