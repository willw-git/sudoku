import React from 'react';
import './App.css';

import { TResult, SubmitResult, getResults } from './calcs';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Form } from 'react-bootstrap';

// npm start then it is on port 3000

/* Ideas
   Have a line of Must Includes
*/

type SubmitHandler = (r: SubmitResult) => void;

function UsedCheckBox({ labelNum, isSelected, onCheckboxChange }:
  { labelNum: number, isSelected: boolean, onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <Form.Check inline 
      type="checkbox"
      name={labelNum.toString()}
      label={(labelNum + 1).toString()}
      checked= {isSelected} 
      onChange={onCheckboxChange} />  
  ) 
  // return (
  //   <label style={{ marginLeft: "6px", marginRight: "6px" }}>
  //     <input
  //       type="checkbox"
  //       name={label.toString()}
  //       checked={isSelected}
  //       onChange={onCheckboxChange} />
  //     {(labelNum + 1).toString()}
  //   </label>
  // )
}

function EntryForm({ onSubmit }: { onSubmit: SubmitHandler }) {
  // Array of constants 1..9
  const OPTIONS = Array.from(new Array(9), (x, i) => i /*+ 1*/);
  const [validNumbers, setValidNumbers] = React.useState(false);
  const [checkBoxes, setCheckBoxes] = React.useState(
    OPTIONS.map(() => false));

  const createCheckBox = (option: number) => (
    <UsedCheckBox
      labelNum={option}
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
    <>
      <h1>Killer Killer Sudoku</h1>
      <Form onSubmit={onLocalSubmit}>
        <div>
          <Form.Group>
            <Form.Label htmlFor="total">Total: </Form.Label>
            <Form.Control ref={totalRef} onChange={handleChange} name="total" type="number" />
            <Button type="button" onClick={onClearTotalButton} name="clearTotalButton">X</Button>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="squareCount">Count of Squares: </Form.Label>
            <Form.Label ref={squareCountLabelRef} className="will-sliderlabel" > </Form.Label>
            <Form.Control ref={squareCountRef} onChange={handleChange} name="squareCount" type="range" min="2" max="8" style={{ minWidth: '200px' }} />
            </Form.Group>
        </div>
        <Form.Group>
          <span>
            <Form.Label>Without: </Form.Label>
            {createCheckBoxes()}
          </span>
          <span >
            <Button type="button" onClick={onSelectAll} name="allButton">A</Button>
            <Button type="button" onClick={onSelectNone} name="noneButton">N</Button>
          </span>
        </Form.Group>

        <Button type="submit" disabled={!validNumbers}>Submit</Button>
      </Form>
    </>
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
    <div className='container'>
      <EntryForm onSubmit={handleSubmit}></EntryForm>
      <ResultDisplay results={results} />
    </div>
  );
}

export default App;
