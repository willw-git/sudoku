import React from 'react';
import './App.css';

import {TResult, getResults} from './calcs';

type SubmitHandler = (e: React.SyntheticEvent) => void;


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

  const handleCbChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    let newUsed = [...used];
    newUsed[e.target.valueAsNumber] = e.target.checked;
    setUsed(newUsed);
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
      <div className="will-div-cb">
        Used: 
        {Array.from(new Array(9), (x, i) => i + 1).map((v : number) => (
            <span key={v}>
              <label style={{marginLeft:"15px"}} htmlFor={`cb${v}`}>{` ${v}`}</label>
              <input type="checkbox" name={`cb${v}`} value={v} onChange={handleCbChange} />
            </span>
          )
        )
        
        /* {Array<number>.from( map((v:number) => {

        })} */}
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
  // const [total, setTotal] = React.useState(0);
  // const [squareCount, setSquareCount] = React.useState(0);
  const [results, setResults] = React.useState<TResult | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      total: { valueAsNumber: number };
      squareCount: { valueAsNumber: number };
    };
    // setTotal(target.total.valueAsNumber);
    // setSquareCount(target.squareCount.valueAsNumber);
    const r = getResults(target.total.valueAsNumber, target.squareCount.valueAsNumber);
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
