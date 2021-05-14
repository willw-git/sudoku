import React from 'react';
import './App.css';

type SubmitHandler = (e: React.SyntheticEvent) => void;

function EntryForm({onSubmit } : {onSubmit : SubmitHandler}) {
  return (
    <form onSubmit={onSubmit} className="will-style">
      <div>
        <div className="will-div">
          <label htmlFor="total">Total: </label>
          <input name="total" type="number" />
        </div>
        <div className="will-div">
          <label htmlFor="squareCount">Count of Squares: </label>
          <input name="squareCount" type="number" />
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  )

}


function App() {

  const [total, setTotal] = React.useState(0);
  const [squareCount, setSquareCount] = React.useState(0);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      total: { value: number };
      squareCount: { value: number };
    };
    setTotal(target.total.value);
    setSquareCount(target.squareCount.value);
  }
  
  React.useEffect(()=>{
    if (total > 0 && squareCount > 0) {
      alert(`You entered: ${total} and ${squareCount}`)
    }
  }, [total, squareCount]);
  

  return (
    <EntryForm onSubmit={handleSubmit}></EntryForm>
  );
}

export default App;
