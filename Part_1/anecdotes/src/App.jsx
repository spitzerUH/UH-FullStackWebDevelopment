import { useState } from "react";

const Anecdote = (props) => {
  return (
    <div>
      {props.anecdote}
      <br />
      has {props.votes} votes
    </div>
  );
};

const Buttons = (props) => {
  return (
    <div>
      <button
        onClick={() => {
          const newPoints = [...props.points];
          newPoints[props.selected] += 1;
          props.setPoints(newPoints);
        }}
      >
        vote
      </button>
      <button
        onClick={() =>
          props.setSelected(Math.round(Math.random() * props.anecdotes.length))
        }
      >
        next anecdote
      </button>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length));

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} votes={points[selected]} />

      <Buttons
        anecdotes={anecdotes}
        selected={selected}
        setSelected={setSelected}
        points={points}
        setPoints={setPoints}
      />
      <h1>Anecdote with most hosts</h1>
      <Anecdote
        anecdote={anecdotes[points.indexOf(Math.max(...points))]}
        votes={Math.max(...points)}
      />
    </div>
  );
};

export default App;
