import { useDispatch } from "react-redux"
import { clearFilter, setFilter } from "../reducers/filterReducer"

const AnecdoteFilter = () => {

    const dispatch = useDispatch()

    const handleChange = (event) => {
        if (event.target.value === '') {
            dispatch(clearFilter())
        } else {
            dispatch(setFilter(event.target.value))
        }
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default AnecdoteFilter