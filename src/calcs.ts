
export type TResult = Array<Array<number>>;


export function getResults(total: number, squareCount: number): TResult {
  // return [];
  let fullResults: TResult = [];

  const calcResult = (start: number, balance: number, count: number, partial: Array<number>) => {
    if (count === 1) {
      if (start <= balance && balance < 10) {
        // Success! Save result1
        partial.push(balance);
        fullResults.push(partial);
      }
    } else {
      for (let i = start; i <= Math.min(balance, 9); i++) {
        const newPartial = [...partial, i]; // partial.concat(i);
        calcResult(i+1, balance - i, count - 1, newPartial);
      }
    }
  }
  calcResult(1, total, squareCount, []);

  return fullResults;
}
