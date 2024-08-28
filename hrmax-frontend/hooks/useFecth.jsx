import { useEffect, useState } from "react"
import axios from 'axios'

const useFetch = (url) => {

    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const respond = await axios.get(url)
                setData(respond.data)
            } catch (error) {
                setError(error)
            }
            setLoading(false)
        }
        fetchData()
    }, [url])

    const reFetch = async () => {
        setLoading(true)
        try {
            const respond = await axios.get(url)
            setData(respond.data)
        } catch (error) {
            setError(error)
        }
        setLoading(false)
    }

    return (data, loading, error, reFetch)

}

export default useFetch


