import React, { useState } from "react";
import { Direction } from "../../types/direction"; 
import { ElementStates } from "../../types/element-states"; 
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { delayExecution } from "../../constants/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import Style from "./sorting-page.module.css";

enum SortMethod {
  Selection = "SELECTION",
  Bubble = "BUBBLE",
}

export interface ArrayElement {
  value: number;
  state: ElementStates;
}

const randomArr = (minLen: number, maxLen: number, maxValue: number): ArrayElement[] => {
  return Array.from({ length: Math.floor(Math.random() * (maxLen - minLen + 1) + minLen) }, () => ({
    value: Math.floor(Math.random() * (maxValue + 1)),
    state: ElementStates.Default,
  }));
};

const swap = (array: ArrayElement[], firstIndex: number, secondIndex: number): void => {
  [array[firstIndex], array[secondIndex]] = [array[secondIndex], array[firstIndex]];
};

const compareArrayItems = (direction: Direction, firstValue: number, secondValue: number): boolean => {
  return direction === Direction.Ascending ? firstValue > secondValue : firstValue < secondValue;
};

export const bubbleSort = async (array: ArrayElement[], direction: Direction, setArrayForRender: React.Dispatch<React.SetStateAction<ArrayElement[]>>): Promise<void> => {
  let n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      array[j].state = ElementStates.Changing;
      array[j + 1].state = ElementStates.Changing;
      setArrayForRender([...array]);
      await delayExecution(SHORT_DELAY_IN_MS);

      if (compareArrayItems(direction, array[j].value, array[j + 1].value)) {
        swap(array, j, j + 1);
      }

      array[j].state = ElementStates.Default;
      array[j + 1].state = ElementStates.Default;
    }
    array[n - i - 1].state = ElementStates.Modified;
    setArrayForRender([...array]);
  }
};

export const selectionSort = async (
  array: ArrayElement[],
  direction: Direction,
  setArrayForRender: React.Dispatch<React.SetStateAction<ArrayElement[]>>
): Promise<void> => {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let extremeIndex = i; // Наименьший или наибольший элемент в зависимости от направления сортировки
    array[extremeIndex].state = ElementStates.Changing; // Выделяем элемент
    for (let j = i + 1; j < n; j++) {
      array[j].state = ElementStates.Changing; // Выделяем текущий сравниваемый элемент
      setArrayForRender([...array]);
      await delayExecution(SHORT_DELAY_IN_MS);

      // Сброс состояния для предыдущего сравниваемого элемента
      if (j > i + 1) array[j - 1].state = ElementStates.Default;

      if (compareArrayItems(direction, array[extremeIndex].value, array[j].value)) {
        array[extremeIndex].state = ElementStates.Default; // Сброс состояния предыдущего кандидата
        extremeIndex = j; // Обновляем индекс кандидата
        array[extremeIndex].state = ElementStates.Changing; // Выделяем нового кандидата
      }
    }

    if (i !== extremeIndex) {
      swap(array, i, extremeIndex); 
    }

    array[i].state = ElementStates.Modified; // Отсортированный элемент
    if (extremeIndex !== i) array[extremeIndex].state = ElementStates.Default; // Сброс состояния, если элемент был перемещен

    // Сброс состояний всех остальных элементов
    array.forEach((el, idx) => {
      if (idx > i && idx !== extremeIndex) el.state = ElementStates.Default;
    });

    setArrayForRender([...array]);
  }

  // В конце сортировки помечаем все элементы как отсортированные
  array.forEach(el => el.state = ElementStates.Modified);
  setArrayForRender([...array]);
};


export const SortingPage: React.FC = () => {
  const [arrayForRender, setArrayForRender] = useState<ArrayElement[]>(randomArr(3, 17, 100));
  const [sortMethod, setSortMethod] = useState<SortMethod>(SortMethod.Bubble);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSort = async (direction: Direction) => {
    setActiveButton(direction);
    setLoading(true);
    if (sortMethod === SortMethod.Bubble) {
      await bubbleSort([...arrayForRender], direction, setArrayForRender);
    } else if (sortMethod === SortMethod.Selection) {
      await selectionSort([...arrayForRender], direction, setArrayForRender);
    }
    setLoading(false);
  };
  

  return (
    <SolutionLayout title="Сортировка массива">
      <section className={Style.contentBox}>
        <form className={Style.form}>
          <div className={Style.radioButtons}>
            <RadioInput 
              label="Выбор"
              checked={sortMethod === SortMethod.Selection}
              onChange={() => setSortMethod(SortMethod.Selection)}
            />
            <RadioInput 
              label="Пузырёк"
              checked={sortMethod === SortMethod.Bubble}
              onChange={() => setSortMethod(SortMethod.Bubble)}
            />
          </div>
          <div className={Style.sortingDirection}>
            <Button 
              text="По возрастанию"
              type="button"
              sorting={Direction.Ascending}
              onClick={() => handleSort(Direction.Ascending)}
              isLoader={activeButton === Direction.Ascending && isLoading}
              disabled={isLoading && activeButton !== Direction.Ascending}
            />
            <Button 
              text="По убыванию"
              type="button"
              sorting={Direction.Descending}
              onClick={() => handleSort(Direction.Descending)}
              isLoader={activeButton === Direction.Descending && isLoading}
              disabled={isLoading && activeButton !== Direction.Descending}
            />
          </div>
          <Button 
            text="Новый массив"
            type="button"
            onClick={() => {
              setActiveButton('newArray');
              setArrayForRender(randomArr(3, 17, 100));
            }}
            isLoader={activeButton === 'newArray' && isLoading}
            disabled={isLoading && activeButton !== 'newArray'}
          />
        </form>
        <div className={Style.columnBox}>
          {arrayForRender.map((element, index) => (
            <Column
              key={index}
              index={element.value}
              state={element.state}
            />
          ))}
        </div>
      </section>
    </SolutionLayout>
  );
};
