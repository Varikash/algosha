import React, { FormEvent, useMemo, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import Style from "./list-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "./linkedList";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { delayExecution } from "../../constants/utils";
import { ArrowIcon } from "../ui/icons/arrow-icon";

type Circle = {
  item: string;
  state: ElementStates;
}

enum position {
  head = "head",
  tail = "tail",
}

enum ElementColors {
  Default = "#0032ff",
  Changing = "#d252e1",
  Modified = "#7fe051",
}

export const ListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [indexValueInput, setIndexValueInput] = useState<number>();
  const [isActiveState, setActiveState] = useState(false);
  const [isPrepending, setIsPrepending] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  const [isRemovingFromHead, setIsRemovingFromHead] = useState(false);
  const [isRemovingFromTail, setIsRemovingFromTail] = useState(false);
  const [isInsertByIndex, setIsInsertByIndex] = useState(false);
  const [isRemoveByIndex, setIsRemoveByIndex] = useState(false);
  const [temporaryValue, setTemporaryValue] = useState("");

  const initialValues = useMemo(() => ["0", "34", "8", "1"], []);
  const list = useMemo(
    () => new LinkedList<string>(initialValues),
    [initialValues]
  );
  const [arrayWithState, setArrayWithState] = useState<Circle[]>(
    list.getArrayWithState()
  );

  const handleInputValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, ''); // Удаляем все символы, кроме цифр
    setInputValue(value);
  };

  const handleInputIdxChange = (e: FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setIndexInput(value);
    }
  };

  const prepend = async () => {
    if (inputValue) {
      setActiveState(true);
      setIsPrepending(true);
      setIndexValueInput(0);
      await delayExecution(SHORT_DELAY_IN_MS);

      list.prepend(inputValue);
      setIsPrepending(false);
      const arrayWithState = list.getArrayWithState();
      arrayWithState[0].state = ElementStates.Modified;
      setArrayWithState(arrayWithState);

      await delayExecution(SHORT_DELAY_IN_MS);

      arrayWithState[0].state = ElementStates.Default;
      setArrayWithState(arrayWithState);

      setInputValue("");
      setActiveState(false);
    }
  };

  const append = async () => {
    if (inputValue) {
      setActiveState(true);
      setIsAppending(true);
      setIndexValueInput(list.getSize - 1);
      await delayExecution(SHORT_DELAY_IN_MS);

      list.append(inputValue);
      setIsAppending(false);
      const arrayWithState = list.getArrayWithState();
      arrayWithState[arrayWithState.length - 1].state = ElementStates.Modified;
      setArrayWithState(arrayWithState);
      await delayExecution(SHORT_DELAY_IN_MS);

      arrayWithState[arrayWithState.length - 1].state = ElementStates.Default;
      setArrayWithState(arrayWithState);
    }
    setInputValue("");
    setActiveState(false);
  };

  const shift = async () => {
    if (list.getSize) {
      const arrayWithState = list.getArrayWithState();
      setActiveState(true);
      setIsRemovingFromHead(true);
      setIndexValueInput(0);
      arrayWithState[0].item = "";
      setArrayWithState(arrayWithState);
      await delayExecution(SHORT_DELAY_IN_MS);
      list.shift();
      setIsRemovingFromHead(false);
      setArrayWithState(list.getArrayWithState());
    }
    setActiveState(false);
  };

  const pop = async () => {
    if (list.getSize) {
      const arrayWithState = list.getArrayWithState();
      setTemporaryValue(arrayWithState[arrayWithState.length - 1].item);
      setActiveState(true);
      setIsRemovingFromTail(true);
      setIndexValueInput(list.getSize - 1);

      arrayWithState[arrayWithState.length - 1].item = "";
      setArrayWithState(arrayWithState);
      await delayExecution(SHORT_DELAY_IN_MS);

      list.pop();
      setIsRemovingFromTail(false);
      setArrayWithState(list.getArrayWithState());
    }
    setActiveState(false);
  };

  const addByIndex = async () => {
    const numericIdx = parseInt(indexInput);
    if (numericIdx < 0 || numericIdx > list.getSize - 1) {
      return; // индекс невалидный, кнопка должна быть неактивной
    }
    setActiveState(true);
    setIsInsertByIndex(true);

    const arrayWithState = list.getArrayWithState();
    for (let i = 0; i < numericIdx; i++) {
      setIndexValueInput(i);
      await delayExecution(SHORT_DELAY_IN_MS);
      if (i < numericIdx) {
        arrayWithState[i].state = ElementStates.Changing;
        setArrayWithState(arrayWithState);
      }
    }
    setIsInsertByIndex(false);
    setIndexValueInput(parseInt(""));
    list.insertByIndex(inputValue, numericIdx);
    const newArrayWithState = list.getArrayWithState();
    newArrayWithState[numericIdx].state = ElementStates.Modified;

    setArrayWithState(newArrayWithState);
    await delayExecution(SHORT_DELAY_IN_MS);
    newArrayWithState[numericIdx].state = ElementStates.Default;
    setArrayWithState(newArrayWithState);

    setActiveState(false);
    setInputValue("");
    setIndexInput("");
  };

  const removeByIndex = async () => {
    const numericIdx = parseInt(indexInput);
    if (numericIdx < 0 || numericIdx > list.getSize - 1) {
      return;  // индекс невалидный, кнопка должна быть неактивной
    }

    setActiveState(true);
    const arrayWithState = list.getArrayWithState();
    for (let i = 0; i < numericIdx; i++) {
      await delayExecution(SHORT_DELAY_IN_MS);
      arrayWithState[i].state = ElementStates.Changing;
      setArrayWithState([...arrayWithState]);
    }
    await delayExecution(SHORT_DELAY_IN_MS);
    setTemporaryValue(arrayWithState[numericIdx].item);
    arrayWithState[numericIdx].item = "";
    setIsRemoveByIndex(true);
    arrayWithState[numericIdx].state = ElementStates.Default;
    setIndexValueInput(numericIdx);

    await delayExecution(SHORT_DELAY_IN_MS);
    list.removeByIndex(numericIdx);
    setArrayWithState(list.getArrayWithState());
    setIsRemoveByIndex(false);
    setActiveState(false);
    setIndexInput("");
  };

  const showHead = (index: number): string => {
    if (index === 0 && (!isPrepending || !isInsertByIndex)) {
      return position.head;
    } else if (index === 0 && isInsertByIndex && indexValueInput !== 0) {
      return position.head;
    }
    return "";
  };
  const showTail = (index: number): string => {
    if (
      index === arrayWithState.length - 1 &&
      (!isRemovingFromTail || !isRemoveByIndex)
    ) {
      return position.tail;
    } else if (index === arrayWithState.length - 1 && isRemoveByIndex) {
      return position.tail;
    } else if (arrayWithState.length === 1) {
      return "";
    }
    return "";
  };

  return (
    <SolutionLayout title="Связный список">
      <form className={Style.form}>
        <div className={Style.container}>
          <Input
            value={inputValue}
            onChange={handleInputValChange}
            extraClass={Style.input}
            isLimitText={true}
            maxLength={4}
            placeholder={"Введите значение"}
          />
          <Button
            text="Добавить в head"
            onClick={prepend}
            disabled={!inputValue}
            isLoader={isPrepending}
          />
          <Button
            text="Добавить в tail"
            onClick={append}
            disabled={!inputValue}
            isLoader={isAppending}
          />
          <Button
            text="Удалить из head"
            onClick={shift}
            disabled={!list.getSize}
            isLoader={isRemovingFromHead}
          />
          <Button
            text="Удалить из tail"
            onClick={pop}
            disabled={!list.getSize}
            isLoader={isRemovingFromTail}
          />
        </div>
        <div className={Style.container}>
          <Input
            value={indexInput}
            onChange={handleInputIdxChange}
            extraClass={Style.input}
            placeholder={"Введите индекс"}
            type="number"
          />
          <Button
            text="Добавить по индексу"
            extraClass={Style.btn}
            onClick={addByIndex}
            disabled={!indexInput || parseInt(indexInput) > list.getSize - 1}
            isLoader={isInsertByIndex}
          />
          <Button
            text="Удалить по индексу"
            extraClass={Style.btn}
            onClick={removeByIndex}
            disabled={!indexInput || parseInt(indexInput) > list.getSize - 1}
            isLoader={isRemoveByIndex}
          />
        </div>

        <ul className={Style.list}>
          {arrayWithState.map((item, index) => (
            <li key={index} className={Style.list__item}>
              {isActiveState &&
                (isPrepending || isAppending || isInsertByIndex) &&
                index === indexValueInput && (
                  <Circle
                    isSmall={true}
                    extraClass={Style.small__top}
                    letter={inputValue}
                    state={ElementStates.Changing}
                  />
                )}

              {isActiveState &&
                (isRemovingFromHead || isRemovingFromTail || isRemoveByIndex) &&
                index === indexValueInput && (
                  <Circle
                    isSmall={true}
                    extraClass={Style.small__bottom}
                    letter={temporaryValue}
                    state={ElementStates.Changing}
                  />
                )}

              <Circle
                index={index}
                head={isPrepending || isInsertByIndex ? "" : showHead(index)}
                tail={
                  isRemovingFromTail || isRemoveByIndex ? "" : showTail(index)
                }
                letter={item.item}
                state={item.state}
              />
              {arrayWithState.length - 1 !== index && (
                <ArrowIcon fill={ElementColors.Default} />
              )}
            </li>
          ))}
        </ul>
      </form>
    </SolutionLayout>
  );
};