import React from 'react';
import './App.css';

import { TResult, SubmitResult, getResults } from './calcs';

type SubmitHandler = (r: SubmitResult) => void;

function EntryForm({ onSubmit }: { onSubmit: SubmitHandler }) {
  const [validNumbers, setValidNumbers] = React.useState(false);
  const [used, setUsed] = React.useState<boolean[]>(new Array(10).fill(false));

  const totalRef = React.useRef<HTMLInputElement>(null);
  const squareCountRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (/* e: React.ChangeEvent<HTMLInputElement> */) => {
    const v =
      (totalRef?.current?.valueAsNumber ?? 0) > 0 &&
      (squareCountRef?.current?.valueAsNumber ?? 0) > 0;
    setValidNumbers(v);
  }

  const handleCbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    let newUsed = [...used];
    newUsed[Number(e.target.value)] = e.target.checked;
    setUsed(newUsed);
  }

  const onLocalSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      total: { valueAsNumber: number };
      squareCount: { valueAsNumber: number };
    };

    onSubmit({
      total: target.total.valueAsNumber,
      squareCount: target.squareCount.valueAsNumber,
      used: used
    });
  }

  const onGroupClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as typeof e.target & { name: string };
    const checked = target.name === "allButton";
    console.log(checked);
  }

  return (
    <form onSubmit={onLocalSubmit} className="will-style">
      <div>
        <div className="will-div">
          <label htmlFor="total">Total: </label>
          <input ref={totalRef} onChange={handleChange} name="total" type="number" />
        </div>
        <div className="will-div">
          <label htmlFor="squareCount">Count of Squares: </label>
          <input ref={squareCountRef} onChange={handleChange} name="squareCount" type="number" />
        </div>
      </div>
      <div className="will-div-cb">
        Used:
        {Array.from(new Array(9), (x, i) => i + 1).map((v: number) => (
        <span key={v}>
          <input style={{ marginLeft: "18px" }} type="checkbox" name={`cb${v}`} value={v} onChange={handleCbChange} />
          <label htmlFor={`cb${v}`}>{` ${v}`}</label>
        </span>
      ))}
      </div>
      <div className="will-div-button">
        <button type="button" onClick={onGroupClick} name="allButton">All</button>
        <button type="button" onClick={onGroupClick} name="noneButton">None</button>
      </div>


      <button type="submit" disabled={!validNumbers}>Submit</button>
    </form>
  )

}

function ResultDisplay({ results }: { results: TResult | null }) {
  return (
    <div className="will-style" hidden={results === null} >
      <p>Result:</p>
      {results?.length === 0 ?
        (
          <p style={{ color: 'red' }} >No Valid Results</p>
        ) : (
          <ul>
            {results?.map((item, index) => (
              <li key={index}>{item.join(", ")}</li>
            ))}
          </ul>
        )}
    </div>
  )
}

function App() {
  // const [total, setTotal] = React.useState(0);
  // const [squareCount, setSquareCount] = React.useState(0);
  const [results, setResults] = React.useState<TResult | null>(null);

  const handleSubmit = (sr: SubmitResult) => {
    // setTotal(target.total.valueAsNumber);
    // setSquareCount(target.squareCount.valueAsNumber);
    const r = getResults(sr);
    setResults(r);
  }

  return (
    <>
      <EntryForm onSubmit={handleSubmit}></EntryForm>
      <ResultDisplay results={results} />
    </>
  );
}

export default App;
