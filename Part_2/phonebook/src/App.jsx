import { useState } from "react";

const PhonebookEntries = ({ persons }) =>
    persons.map((p) => <PhonebookEntry key={p.name} person={p} />);

const PhonebookEntry = ({ person }) => (
    <p>
        {person.name} {person.number}
    </p>
);

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

const AddPhonebookEntry = ({ persons, setPersons }) => {
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
            if (!persons.map((p) => p.name).includes(newName)) {
                const newPersons = [...persons];
                newPersons.push({ name: newName, number: newNumber });
                setPersons(newPersons);
            } else {
                alert(`${newName} is already added to phonebook`);
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
    const [persons, setPersons] = useState([
        { name: "Arto Hellas", number: "040-123456", id: 1 },
        { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
        { name: "Dan Abramov", number: "12-43-234345", id: 3 },
        { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    ]);

    const [filteredPersons, setFilteredPersons] = useState(persons);

    return (
        <div>
            <h2>Phonebook</h2>
            <SearchPerson
                allPersons={persons}
                setFilteredPersons={setFilteredPersons}
            />
            <h3>Add a new</h3>
            <AddPhonebookEntry persons={persons} setPersons={setPersons} />

            <h3>Numbers</h3>
            <PhonebookEntries persons={filteredPersons} />
        </div>
    );
};

export default App;
