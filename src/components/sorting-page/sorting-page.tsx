import React, { useState } from "react";
import { Direction } from "../../types/direction"; 
import { ElementStates } from "../../types/element-states"; 
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { delayExecution } from "../../constants/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./sorting-page.module.css";

// Утилиты
const randomArr = (min: number, max: number, maxNumber: number): number[] =>
  Array.from({ length: Math.floor(Math.random() * (max - min + 1) + min) }, () => Math.floor(Math.random() * (maxNumber + 1)));

const swap = (array: ArrayElement[], firstIndex: number, secondIndex: number): void => {
  [array[firstIndex], array[secondIndex]] = [array[secondIndex], array[firstIndex]];
};

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const compareArrayItems = (direction: Direction, array: number[], firstIndex: number, secondIndex: number): boolean =>
  direction === Direction.Ascending ? array[firstIndex] > array[secondIndex] : array[firstIndex] < array[secondIndex];

const DELAY_IN_MS = 300;

interface ArrayElement {
  value: number;
  state: ElementStates;
}

// Функции сортировки
const bubbleSort = async (
  array: ArrayElement[],
  direction: Direction,
  setArrayState: React.Dispatch<React.SetStateAction<ArrayElement[]>>
): Promise<void> => {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      array[j].state = ElementStates.Changing;
      array[j + 1].state = ElementStates.Changing;
      setArrayState(array.slice());
      await delay(DELAY_IN_MS);

      if (compareArrayItems(direction, array.map(a => a.value), j, j + 1)) {
        swap(array, j, j + 1);
      }

      array[j].state = ElementStates.Default;
      array[j + 1].state = ElementStates.Default;
    }
    array[n - i - 1].state = ElementStates.Modified;
    setArrayState(array.slice());
  }
};

const SortingPage: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>(randomArr(3, 17, 100).map(value => ({ value, state: ElementStates.Default })));
  const [direction, setDirection] = useState<Direction>(Direction.Ascending);

  const handleSort = async () => {
    await bubbleSort([...array], direction, setArray);
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.controls}>
        <RadioInput 
          label="По возрастанию" 
          name="direction" 
          checked={direction === Direction.Ascending} 
          onChange={() => setDirection(Direction.Ascending)} 
        />
        <RadioInput 
          label="По убыванию" 
          name="direction" 
          checked={direction === Direction.Descending} 
          onChange={() => setDirection(Direction.Descending)} 
        />
        <Button text="Сортировать" onClick={handleSort} />
      </div>
      <div className={styles.array}>
        {array.map((element, index) => (
          <Column key={index} index={element.value} state={element.state} />
        ))}
      </div>
    </SolutionLayout>
  );
};

export default SortingPage;