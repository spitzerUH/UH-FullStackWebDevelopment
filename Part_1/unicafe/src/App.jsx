import { useState } from "react";

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        {props.value}
        {props.suffix}
      </td>
    </tr>
  );
};

const Statistics = (props) => {
  return (
    <div>
      <h1>statistics</h1>
      {props.statistics[3].value == 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            {props.statistics.map(({ text, value, suffix }, index) => (
              <StatisticLine
                key={index}
                text={text}
                value={value}
                suffix={suffix}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Buttons = (props) => {
  return (
    <div>
      <h1>give feedback</h1>
      {props.buttons.map(({ text, value, state, onClick }, index) => (
        <button key={index} onClick={onClick}>
          {text}
        </button>
      ))}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const statistics = [
    { text: "good", value: good },
    { text: "neutral", value: neutral },
    { text: "bad", value: bad },
    { text: "all", value: all },
    { text: "average", value: average },
    { text: "positive", value: positive, suffix: "%" },
  ];

  const updateAll = (newGood, newNeutral, newBad) => {
    const newAll = all + 1;
    setAll(newAll);
    setAverage((newGood - newBad) / newAll);
    setPositive(((newGood + newNeutral) / newAll) * 100);
  };

  const handleGoodClicked = () => {
    setGood(good + 1);
    updateAll(good + 1, neutral, bad);
  };
  const handleNeutralClicked = () => {
    setNeutral(neutral + 1);
    updateAll(good, neutral + 1, bad);
  };
  const handleBadClicked = () => {
    setBad(bad + 1);
    updateAll(good, neutral, bad + 1);
  };

  const buttons = [
    { text: "good", value: good, state: setGood, onClick: handleGoodClicked },
    {
      text: "neutral",
      value: neutral,
      state: setNeutral,
      onClick: handleNeutralClicked,
    },
    { text: "bad", value: bad, state: setBad, onClick: handleBadClicked },
  ];

  return (
    <div>
      <Buttons buttons={buttons} />

      <Statistics statistics={statistics} />
    </div>
  );
};

export default App;
