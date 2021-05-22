import React from 'react';
import './App.css';

import { TResult, SubmitResult, getResults } from './calcs';

type SubmitHandler = (r: SubmitResult) => void;

function UsedCheckBox({ label, isSelected, onCheckboxChange } :
   {label: number, isSelected:boolean, onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>}) {
  return (
    <label>
      <input
        style={{ marginLeft: "18px" }}
        type="checkbox"
        name={label.toString()}
        checked={isSelected}
        onChange={onCheckboxChange} />
      {(label + 1).toString( )}
    </label>
  )
}

function EntryForm({ onSubmit }: { onSubmit: SubmitHandler }) {
  // Array of constants 1..9
  const OPTIONS = Array.from(new Array(9), (x, i) => i /*+ 1*/);
  const [validNumbers, setValidNumbers] = React.useState(false);
  const [checkBoxes, setCheckBoxes] = React.useState(
    OPTIONS.map(() => false));
  
  const createCheckBox = (option:number) => (
    <UsedCheckBox
      label={option}
      isSelected={checkBoxes[option]}
      onCheckboxChange={handleCbChange}
      key={option}
    />
  );

  const createCheckBoxes = () => OPTIONS.map(createCheckBox);

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
    const { name } = e.target;
    let newCheckBoxes = [...checkBoxes];
    newCheckBoxes[+name] = !newCheckBoxes[+name];
    setCheckBoxes(newCheckBoxes);
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
      used: [false, ...checkBoxes]
    });
  }
  
  const onSelectAll = () => selectAllCheckBoxes(true);
  const onSelectNone = () => selectAllCheckBoxes(false);

  const selectAllCheckBoxes = (isSelected: boolean) =>
    setCheckBoxes(OPTIONS.map(() => isSelected));

  
  

  // const onGroupClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const target = e.target as typeof e.target & { name: string };
  //   const checked = target.name === "allButton";
  //   console.log(checked);
  // }

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
        {createCheckBoxes()}
      </div>
      <div className="will-div-button">
        <button type="button" onClick={onSelectAll} name="allButton">All</button>
        <button type="button" onClick={onSelectNone} name="noneButton">None</button>
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
