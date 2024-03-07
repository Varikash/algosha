import React, {useState, FormEvent} from "react";
import Style from './stack-page.module.css'
import { ElementStates } from "../../types/element-states";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { delayExecution } from "../../constants/utils";
import { Stack } from "./stack";

export type Circle = {
  item: string;
  state: ElementStates;
}

export const StackPage: React.FC = () => {

  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState<Circle[]>([]);
  const [stack] = useState(new Stack<Circle>());
  const [isActive, setIsActive] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleInputChange = (evt: FormEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };

  //1. Кнопка добавления 

  const handleAddButton = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsActive(true);
    setIsPushing(true);
    if (inputValue) {
      stack.push({ item: inputValue, state: ElementStates.Changing });
      setInputValue("");
      setArray([...stack.getItems()]);
      await delayExecution(SHORT_DELAY_IN_MS);
      stack.peak().state = ElementStates.Default;
      setArray([...stack.getItems()]);
    }
    setIsActive(false);
    setIsPushing(false);
  };

  //2. Кнопка удаления

  const handleRemoveButton = async () => {
    setIsActive(true);
    setIsPopping(true);
    stack.peak().state = ElementStates.Changing;
    setArray([...stack.getItems()]);
    await delayExecution(SHORT_DELAY_IN_MS);
    stack.pop();
    setArray([...stack.getItems()]);
    setIsActive(false);
    setIsPopping(false);
  };

  //3. Кнопка очистки 

  const handleClearButton = async () => {
    setIsActive(true);
    setIsResetting(true);
    await delayExecution(SHORT_DELAY_IN_MS);
    stack.clear();
    setArray([...stack.getItems()]);
    setIsActive(false);
    setIsResetting(false);
  };


  return (
    <SolutionLayout title="Стек">
      <section className={Style.section}>
        <form 
          className={Style.controlsContainer}
          onSubmit={handleAddButton}
        >
          <div className={Style.inputBox}>
            <Input 
              value={inputValue}
              onChange={handleInputChange}
              extraClass={Style.input}
              type="text"
              maxLength={4}
              isLimitText={true}
            />
            <Button 
              text='Добавить'
              type="submit"
              disabled={!inputValue || isActive}
              isLoader={isPushing}
              data-cy="button-add"
            />
            <Button 
              text='Удалить'
              type="button"
              onClick={handleRemoveButton}
              disabled={!array.length || isActive}
              isLoader={isPopping}
              data-cy="button-delete"
            />
          </div>
          <Button 
            text='Очистить'
            type="button"
            onClick={handleClearButton}
            disabled={!array.length || isActive}
            isLoader={isResetting}
            data-cy="button-clear"
          />
        </form>
        <div>
          <ul className={Style.list}>
          {array.map((item, index) => (
            <li key={index}>
              <Circle
                letter={item.item}
                state={item.state}
                tail={index.toString()}
                head={array.length - 1 === index ? "top" : ""}
              />
          </li>
        ))}
      </ul>
        </div>
      </section>
    </SolutionLayout>
  );
};
