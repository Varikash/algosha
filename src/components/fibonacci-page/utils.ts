import { delayExecution } from "../../constants/utils";
import { DELAY_IN_MS } from "../../constants/delays";


export async function generateFibonacciSequence(
  n: number,
  setSequence: React.Dispatch<React.SetStateAction<number[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setInputValue: React.Dispatch<React.SetStateAction<number | undefined>>,
  ): Promise<number[]> {
  if (n <= 0) {
    return [];
  }
  let sequence = [1];
  setSequence([...sequence])
  if (n > 1) {
    await delayExecution(DELAY_IN_MS)
    sequence.push(1);
    setSequence([...sequence])
  }
  for (let i = 2; i <= n; i++) {
    await delayExecution(DELAY_IN_MS)
    sequence.push(sequence[i - 1] + sequence[i - 2]);
    setSequence([...sequence])
  }
  setLoading(false);
  setInputValue(undefined);
  return sequence;
}