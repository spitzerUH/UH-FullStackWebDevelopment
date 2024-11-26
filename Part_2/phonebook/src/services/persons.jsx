import axios from "axios";
const serverUrl = "/";
const apiUrl = `${serverUrl}api/persons`;

const getAll = () => {
    return axios.get(apiUrl);
};

const create = (newPerson) => {
    return axios.post(apiUrl, newPerson);
};

const update = (id, newPerson) => {
    return axios.put(`${apiUrl}/${id}`, newPerson);
};

const remove = (persion) => {
    if (window.confirm(`Delete ${persion.name}?`)) {
        return axios.delete(`${apiUrl}/${persion.id}`);
    }
};

export default {
    getAll: getAll,
    create: create,
    update: update,
    remove: remove,
};
