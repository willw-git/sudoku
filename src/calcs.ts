
export type TResult = Array<Array<number>>;
export type SubmitResult = {
  total : number;
  squareCount: number;
  used: boolean[];
}



export function getResults(sr : SubmitResult): TResult {
  // return [];
  let fullResults: TResult = [];

  const calcResult = (start: number, balance: number, count: number, partial: Array<number>) => {
    if (count === 1) {
      if (start <= balance && balance < 10 && !sr.used[balance]) {
        // Success! Save result1
        partial.push(balance);
        fullResults.push(partial);
      }
    } else {
      for (let i = start; i <= Math.min(balance, 9); i++) {
        if (sr.used[i]) continue;
        const newPartial = [...partial, i]; // partial.concat(i);
        calcResult(i+1, balance - i, count - 1, newPartial);
      }
    }
  }
  calcResult(1, sr.total, sr.squareCount, []);

  return fullResults;
}
