import React from 'react';
import './App.css';

import {TResult, getResults} from './calcs';

type SubmitHandler = (e: React.SyntheticEvent) => void;


function EntryForm({ onSubmit }: { onSubmit: SubmitHandler }) {
  const [validNumbers, setValidNumbers] = React.useState(false);

  const totalRef = React.useRef<HTMLInputElement>(null);
  const squareCountRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (/* e: React.ChangeEvent<HTMLInputElement> */) => {
    const v =
      (totalRef?.current?.valueAsNumber ?? 0) > 0 &&
      (squareCountRef?.current?.valueAsNumber ?? 0) > 0;
    setValidNumbers(v);
  }
  return (
    <form onSubmit={onSubmit} className="will-style">
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
      <button type="submit" disabled={!validNumbers}>Submit</button>
    </form>
  )

}

function ResultDisplay({results} : {results: TResult | null}) {
  return (
    <div className="will-style" hidden={results === null} >
      <p>Result:</p>
      {results?.length === 0 ? 
      (
        <p style={{color:'red'}} >No Valid Results</p>
      ) :  (
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
  const [total, setTotal] = React.useState(0);
  const [squareCount, setSquareCount] = React.useState(0);
  const [results, setResults] = React.useState<TResult | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      total: { value: number };
      squareCount: { value: number };
    };
    setTotal(target.total.value);
    setSquareCount(target.squareCount.value);
    const r = getResults(total, squareCount);
    setResults(r);
  }

  return (
    <>
      <EntryForm onSubmit={handleSubmit}></EntryForm>
      <ResultDisplay results={results}/>
    </>
  );
}

export default App;
