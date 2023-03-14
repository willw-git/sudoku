import React from 'react';
import './App.css';

import { TResult, SubmitResult, getResults } from './calcs';

// npm start then it is on port 3000

/* Ideas
   Have a line of Must Includes
*/

type SubmitHandler = (r: SubmitResult) => void;

function UsedCheckBox({ label, isSelected, onCheckboxChange }:
  { label: number, isSelected: boolean, onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <label style={{ marginLeft: "6px",marginRight: "6px" }}>
      <input
        type="checkbox"
        name={label.toString()}
        checked={isSelected}
        onChange={onCheckboxChange} />
      {(label + 1).toString()}
    </label>
  )
}

function EntryForm({ onSubmit }: { onSubmit: SubmitHandler }) {
  // Array of constants 1..9
  const OPTIONS = Array.from(new Array(9), (x, i) => i /*+ 1*/);
  const [validNumbers, setValidNumbers] = React.useState(false);
  const [checkBoxes, setCheckBoxes] = React.useState(
    OPTIONS.map(() => false));

  const createCheckBox = (option: number) => (
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
  const squareCountLabelRef = React.useRef<HTMLLabelElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v =
      (totalRef?.current?.valueAsNumber ?? 0) > 0 &&
      (squareCountRef?.current?.valueAsNumber ?? 0) > 0;
    setValidNumbers(v);
    if (e.currentTarget === squareCountRef.current && squareCountLabelRef.current) {
      squareCountLabelRef.current.innerText = squareCountRef.current.value;
    }
  }

  const onClearTotalButton = () => {
    const totalInput = totalRef.current as HTMLInputElement;
    totalInput.value = "";
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


  return (
    <form onSubmit={onLocalSubmit}>
      <div>
        <div>
          <label htmlFor="total">Total: </label>
          <input ref={totalRef} onChange={handleChange} name="total" type="number" />
          <button className="will-clear" type="button" onClick={onClearTotalButton} name="clearTotalButton">X</button>
        </div>
        <div>
          <label htmlFor="squareCount">Count of Squares: </label>
          <label ref={squareCountLabelRef} className="will-sliderlabel" > </label>
          <input ref={squareCountRef} onChange={handleChange} name="squareCount" type="range" min="2" max="8" style={{ minWidth: '200px' }} />
        </div>
      </div>
      <div>
        <span>
          Without:
        {createCheckBoxes()}
        </span>
        <span >
          <button type="button" onClick={onSelectAll} name="allButton">A</button>
          <button type="button" onClick={onSelectNone} name="noneButton">N</button>
        </span>
      </div>

      <button type="submit" disabled={!validNumbers}>Submit</button>
    </form>
  )

} /* EntryForm */

function ResultDisplay({ results }: { results: TResult | null }) {
  return (
    <div hidden={results === null} >
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
  const [results, setResults] = React.useState<TResult | null>(null);

  const handleSubmit = (sr: SubmitResult) => {
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
