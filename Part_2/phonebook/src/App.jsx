import { useState, useEffect } from "react";
import personService from "./services/persons";

function triggerNotification(
    message,
    setNotificationMessage,
    type = "success"
) {
    setNotificationMessage({ message: message, type: type });
    setTimeout(() => {
        setNotificationMessage(null);
    }, 5000);
}

const Notification = ({ notification }) => {
    if (notification === null) {
        return null;
    }

    const style = {
        position: "fixed",
        left: 0,
        top: 0,
        color: "white",
        backgroundColor: notification.type === "success" ? "green" : "red",
        fontSize: 16,
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "32px",
    };

    return <div style={style}>{notification.message}</div>;
};

const PhonebookEntries = ({ persons, setDeletedPerson }) => {
    const onDeleteClicked = (person) => {
        personService.remove(person).then(() => {
            setDeletedPerson(person);
        });
    };

    return persons.map((p) => (
        <PhonebookEntry
            key={p.id}
            person={p}
            onDeleteClicked={onDeleteClicked}
        />
    ));
};

const PhonebookEntry = ({ person, onDeleteClicked }) => {
    return (
        <p>
            {person.name} {person.number}{" "}
            <button onClick={() => onDeleteClicked(person)}>delete</button>
        </p>
    );
};

const SearchPerson = ({ allPersons, setFilteredPersons }) => {
    const onFilteredNameChanged = (event) => {
        let persons = allPersons;
        if (event.target.value) {
            persons = allPersons.filter((p) =>
                p.name.toLowerCase().includes(event.target.value.toLowerCase())
            );
        }
        setFilteredPersons(persons);
    };

    return (
        <div>
            filter shown with <input onChange={onFilteredNameChanged} />
        </div>
    );
};

const AddPhonebookEntry = ({ persons, setPersons, setNotificationMessage }) => {
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");

    const onNameChanged = (event) => {
        setNewName(event.target.value);
    };

    const onNumberChanged = (event) => {
        setNewNumber(event.target.value);
    };

    const addPerson = (event) => {
        event.preventDefault();

        if (newName && newNumber) {
            const existingPersion = persons.find(
                (p) => p.name.toLowerCase() === newName.toLowerCase()
            );

            if (!existingPersion) {
                const newPersons = [...persons];
                const newPerson = { name: newName, number: newNumber };
                newPersons.push(newPerson);
                setPersons(newPersons);
                personService
                    .create(newPerson)
                    .then(() =>
                        triggerNotification(
                            `${newName} successfully added to phonebook.`,
                            setNotificationMessage
                        )
                    );
            } else {
                if (
                    confirm(
                        `${newName} is already added to phonebook, replace the old number with a new one?`
                    )
                ) {
                    personService
                        .update(existingPersion.id, {
                            name: newName,
                            number: newNumber,
                        })
                        .then(() =>
                            triggerNotification(
                                `${newName} successfully updated.`,
                                setNotificationMessage
                            )
                        )
                        .catch((err) => {
                            triggerNotification(
                                `Information of ${newName} has already been removed from server`,
                                setNotificationMessage,
                                "error"
                            );
                        });
                }
            }

            setNewName("");
            setNewNumber("");
        } else {
            alert(`Name and number have to be set`);
        }
    };

    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={onNameChanged} />
            </div>
            <div>
                number: <input value={newNumber} onChange={onNumberChanged} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

const App = () => {
    const [deletedPerson, setDeletedPerson] = useState(null);
    const [persons, setPersons] = useState([]);
    const [filteredPersons, setFilteredPersons] = useState(persons);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        personService.getAll().then((res) => {
            const tempPersons = res.data;

            setPersons(tempPersons);
            setFilteredPersons(tempPersons);
        });
    }, [deletedPerson, notification]);

    return (
        <div>
            <Notification notification={notification} />
            <h2>Phonebook</h2>
            <SearchPerson
                allPersons={persons}
                setFilteredPersons={setFilteredPersons}
            />

            <h3>Add a new</h3>
            <AddPhonebookEntry
                persons={persons}
                setPersons={setPersons}
                setNotificationMessage={setNotification}
            />

            <h3>Numbers</h3>
            <PhonebookEntries
                persons={filteredPersons}
                setDeletedPerson={setDeletedPerson}
            />
        </div>
    );
};

export default App;
