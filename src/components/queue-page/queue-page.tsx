import React, { FormEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Queue } from "./queue";
import { ElementStates } from "../../types/element-states";
import { delayExecution } from "../../constants/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";
import Style from "./queue-page.module.css";

type Quenue = {
  item: string;
  state: ElementStates;
  head?: string;
}

enum position {
  head = "head",
  tail = "tail",
}

const empty = Array.from({ length: 7 }, () => ({
  item: "",
  state: ElementStates.Default,
}));

export const QueuePage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [array, setArray] = useState(empty);
  const [quenue, setQuenue] = useState(new Queue<Quenue>(7));
  const [isActiveState, setIsActiveState] = useState(false);
  const [isEnqueue, setIsEnqueue] = useState(false);
  const [isDequeue, setIsDequeue] = useState(false);
  const [isPurge, setIsPurge] = useState(false);

  const handleInputChange = (evt: FormEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value);
  };


  const handleAddButton = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsActiveState(true);
    setIsEnqueue(true);
    quenue.enqueue({ item: inputValue, state: ElementStates.Default });
    setQuenue(quenue);
    array[quenue.getTail() - 1] = { item: "", state: ElementStates.Changing };
    setArray([...array]);
    await delayExecution(SHORT_DELAY_IN_MS);
    array[quenue.getTail() - 1] = {item: inputValue, state: ElementStates.Changing };
    setArray([...array]);
    array[quenue.getTail() - 1] = {item: inputValue, state: ElementStates.Default };
    setArray([...array]);
    setInputValue("");
    setIsActiveState(false);
    setIsEnqueue(false);
  };

  const handleRemoveButton = async () => {
    setIsActiveState(true);
    setIsDequeue(true);
    quenue.dequeue();
    setQuenue(quenue);
    array[quenue.getHead() - 1] = {item: array[quenue.getHead() - 1].item, state: ElementStates.Changing};
    setArray([...array]);
    await delayExecution(SHORT_DELAY_IN_MS);
    array[quenue.getHead() - 1] = {item: "", state: ElementStates.Default };
    setArray([...array]);
    setIsActiveState(false);
    setIsDequeue(false);
  };


  const handleClearButton = async () => {
    setIsActiveState(true);
    setIsPurge(true);
    quenue.clear();
    setQuenue(quenue);
    setArray(Array.from({ length: 7 }, () => ({item: "", state: ElementStates.Default })));
    setIsActiveState(false);
    setIsPurge(false);
  };

  return (
    <SolutionLayout title="Очередь">
      <form className={Style.form} onSubmit={handleAddButton}>
        <div className={Style.container}>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            extraClass={Style.input}
            isLimitText={true}
            maxLength={4}
          />
          <Button
            text="Добавить"
            type={"submit"}
            disabled={!inputValue || isActiveState || quenue.getLength() >= 7}
            isLoader={isEnqueue}
            data-cy="button-add"
          />
          <Button
            text="Удалить"
            onClick={handleRemoveButton}
            disabled={quenue.isEmpty() || isActiveState}
            isLoader={isDequeue}
            data-cy="button-delete"
          />
        </div>
        <Button
          text="Очистить"
          onClick={handleClearButton}
          disabled={quenue.isEmpty() || isActiveState}
          isLoader={isPurge}
          data-cy="button-clear"
        />
      </form>
      <ul className={Style.list}>
        {array.map((item, index) => (
          <li key={index}>
            <Circle
              letter={item.item}
              state={item.state}
              index={index}
              head={
                index === quenue.getHead() && !quenue.isEmpty()
                  ? position.head
                  : ""
              }
              tail={
                index === quenue.getTail() - 1 && !quenue.isEmpty()
                  ? position.tail
                  : ""
              }
            />
          </li>
        ))}
      </ul>
    </SolutionLayout>
  );
};