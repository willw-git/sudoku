import React from 'react';
import './App.css';

import { TResult, SubmitResult, getResults } from './calcs';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Alert, Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';

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
      checked={isSelected}
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
  const squareCountLabelRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v =
      (totalRef?.current?.valueAsNumber ?? 0) > 0 &&
      (squareCountRef?.current?.valueAsNumber ?? 0) > 0;
    setValidNumbers(v);
    if (e.currentTarget === squareCountRef.current && squareCountLabelRef.current) {
      squareCountLabelRef.current.value = squareCountRef.current.value;
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
      <Form onSubmit={onLocalSubmit}>
        <div>
          <Form.Group as={Row} className="mb-2">
            <Col md={2}>
              <Form.Label htmlFor="total">Total: </Form.Label>
            </Col>
            <Col md={4}>
              <InputGroup className='mb-2'>
                <Form.Control ref={totalRef} onChange={handleChange} name="total" type="number" />
                <Button type="button" onClick={onClearTotalButton} variant="outline-danger" name="clearTotalButton"><i className="bi bi-x" /></Button>
              </InputGroup>
            </Col>
            <Col md={2} xs={6}>
              <Form.Label htmlFor="squareCount">Count of Squares: </Form.Label>
            </Col>
            <Col md={1} xs={6}>
              <Form.Control readOnly ref={squareCountLabelRef} defaultValue="" />
            </Col>
            <Col md={3}>
              <Form.Range ref={squareCountRef} onChange={handleChange} name="squareCount" min="2" max="8" style={{ minWidth: '200px' }} />
            </Col>
          </Form.Group>
        </div>
        <Form.Group as={Row}>
          <Col md={2} xs={4}>
            <Form.Label>Without </Form.Label>
          </Col>
          <Col md={8} xs={8}>
            {createCheckBoxes()}
          </Col>
          <Col md={2} xs={{ span: 4, offset: 8 }} >
            <Button type="button" variant="secondary" onClick={onSelectAll} name="allButton" size="sm" style={{ marginRight: "4px" }}>All</Button>
            <Button type="button" variant="secondary" onClick={onSelectNone} name="noneButton" size="sm" >None</Button>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-2">
          <Col md={1}>
            <Button type="submit" disabled={!validNumbers}>Submit</Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  )

} /* EntryForm */

function ResultDisplay({ results, show, onClose }: { results: TResult | null, show: boolean, onClose: () => void }) {
  
  return (<>
    {results?.length &&
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
          <Modal.Title>Valid combinations</Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <ul>
          {results?.map((item, index) => (
            <li key={index}>{item.join(", ")}</li>
          ))}
        </ul>
      </Modal.Body>
      </Modal> }
  </>)
}



function App() {
  const [results, setResults] = React.useState<TResult | null>(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  const handleSubmit = (sr: SubmitResult) => {
    const r = getResults(sr);
    setResults(r);
    setShowAlert(r?.length === 0);
    setShowResults(r?.length > 0);
  }

  return (
    <div className='container'>
      <h4 className='mb-4 mt-2'>Killer Killer Sudoku</h4>
      {showAlert &&
        <Alert variant='danger' onClose={() => { setShowAlert(false); }} dismissible>
          No Valid Results!
        </Alert>
      }
      <EntryForm onSubmit={handleSubmit}></EntryForm>
      {showResults && 
        <ResultDisplay results={results} show={showResults} onClose={()=>{setShowResults(false)}} />}
    </div>
  );
}

export default App;
