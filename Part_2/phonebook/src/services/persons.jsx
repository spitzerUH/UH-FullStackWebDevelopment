import axios from "axios";
const serverUrl = "http://localhost:3001/persons";

const getAll = () => {
    return axios.get(serverUrl);
};

const create = (newPerson) => {
    return axios.post("http://localhost:3001/persons", newPerson);
};

const update = (id, newPerson) => {
    return axios.put(`http://localhost:3001/persons/${id}`, newPerson);
};

const remove = (persion) => {
    if (window.confirm(`Delete ${persion.name}?`)) {
        return axios.delete(`http://localhost:3001/persons/${persion.id}`);
    }
};

export default {
    getAll: getAll,
    create: create,
    update: update,
    remove: remove,
};
