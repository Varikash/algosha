import React, { useEffect, useState } from "react";
import Style from "./sorting-page.module.css"
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";


enum SortMethod {
  Selection = 'SELECTION',
  Bubble = 'BUBBLE'
}

export const SortingPage: React.FC = () => {
  const [arrayForRender, setArrayForRender] = useState<number[]>([]);
  const [sortMethod, setSortMethod] = useState<SortMethod>(SortMethod.Selection)

  const swap = (arr: number[], firstIndex: number, secondIndex: number): void => {
    const temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  };
  
  const selectionSort = (arr: number[], direction: Direction): void => {
    const length = arr.length;
    for (let i = 0; i < length - 1; i++) {
      let extremeInd = i;
      for (let j = i + 1; j < length; j++) {
        if (direction === Direction.Ascending? arr[j] < arr[extremeInd] : arr[j] > arr[extremeInd]) {
          extremeInd = j;
        }
      }
      if (i !== extremeInd) {
        swap(arr, i, extremeInd);;
      }
    }
  };

  const bubbleSort = (arr: number[], direction: Direction): void => {
    for (let i = 0; i < arr.length - 1; i++){
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (direction === Direction.Ascending ? arr[j] > arr[j+1] : arr[j] < arr[j+1]) {
          swap(arr, j, j+1);
        }
      }
    }
  }

  const randomArray = (minLen = 3, maxLen = 17):void => {
    const len = Math.floor(Math.random() * (maxLen  - minLen + 1)) + minLen;
    setArrayForRender(Array.from({length: len}, () => Math.floor(Math.random() * 100)));
  }

  const handleSort = (direction: Direction): void => {
    const newArray = [...arrayForRender];
    if (sortMethod === SortMethod.Selection) {
      selectionSort(newArray, direction);
    } else if (sortMethod === SortMethod.Bubble) {
      bubbleSort(newArray, direction);
    }
    setArrayForRender(newArray);
  }

  useEffect(() => {
    randomArray();
  }, []);

  
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
              type = "button"
              sorting={Direction.Ascending}
              onClick={() => handleSort(Direction.Ascending)}
            />
            <Button 
              text="По убыванию"
              type = "button"
              sorting={Direction.Descending}
              onClick={() => handleSort(Direction.Descending)}
            />
          </div>
            <Button 
              text="Новый массив"
              type = "button"
              onClick={() => {
                randomArray();
              }}
            />
        </form>
        <div className={Style.columnBox}>
          {arrayForRender.map((element, index) => (
            <Column
              key={index}
              index={element}
            />
          ))}
        </div>
      </section>
    </SolutionLayout>
  );
};
