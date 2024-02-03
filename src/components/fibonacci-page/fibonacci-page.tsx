import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Style from './fibonacci-page.module.css'
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { delayExecution } from "../../constants/utils";
import { DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {

  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [calmState, setState] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sequenceArray, setSequence] = useState<number[]>([]);

  async function generateFibonacciSequence(n: number): Promise<number[]> {
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

  const handleChage = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseInt(event.target.value));
  }
  
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    generateFibonacciSequence(inputValue!)
  }

  useEffect(() => {
    if (inputValue !== undefined) {
      if (inputValue > 19) {
        setState(true);
      } else {
        setState(false);
      }
    }

    if (Number.isNaN(inputValue)) {
      setState(true);
    }
  }, [inputValue])

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section className={Style.contentBox}>
        <form onSubmit={handleSubmit} className={Style.inputContainer}>
          <Input 
            type="number"
            max={19}
            min={1}
            maxLength={19} 
            isLimitText={true}
            extraClass={Style.stringInput} 
            onChange={handleChage} 
            value={inputValue === 0 ? "" : inputValue} 
            placeholder='Введите число'/>
          <Button extraClass={Style.buttonInput} text="Развернуть" type="submit" disabled={calmState} isLoader={isLoading}/>
        </form>
        <div className={Style.circleContainer}>
          {sequenceArray.map((element, index)=>(
            <Circle 
              key={index}
              letter={element.toString()}
              index={index}
            />
          ))}
        </div>
      </section>
    </SolutionLayout>
  );
};
