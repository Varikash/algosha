import React, { FormEvent, useState, ChangeEvent } from "react";
import Style from './string.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { delayExecution } from "../../constants/utils";
import { DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { StringElement } from "../../types/types";
import { swapStrings } from "./utils";

export const StringComponent: React.FC = () => {

  const [string, setString] = useState<string>("")
  const [stringArray, setArray] = useState<StringElement[]>([]);
  const [calmState, setState] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  
  const handleChage = (event: ChangeEvent<HTMLInputElement>) => {
    setString(event.target.value);
    setState(false);
  }

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const initialArray = string.split('').map(char => ({
      value: char,
      state: ElementStates.Default
    }));
    setArray(initialArray);
    await delayExecution(DELAY_IN_MS);
    swapStrings(initialArray, setArray, setLoading, setState);
    setString('');
  }


  return (
    <SolutionLayout title="Строка">
      <section className={Style.contentBox}>
        <form onSubmit={handleSubmit} className={Style.inputContainer}>
        <Input type="text" maxLength={11} isLimitText={true} extraClass={Style.stringInput} onChange={handleChage} value={string}/>
        <Button extraClass={Style.buttonInput} text="Развернуть" type="submit" disabled={calmState} isLoader={isLoading}/>
        </form>
        <div className={Style.circleContainer}>
        {stringArray.map((element, index) => (
            <Circle 
              key={index}
              letter={element.value}
              state={element.state}
            />
          ))}
        </div>
      </section>
    </SolutionLayout>
  );
};
