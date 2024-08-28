export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function areDatesSame(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
}

export function countSundays(startDate, endDate) {
    let count = 0
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {

        if (currentDate.getDay() === 0)
            count++

        currentDate.setDate(currentDate.getDate() + 1)
    }
    return count
}