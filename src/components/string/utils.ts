import { StringElement } from "../../types/types";
import { ElementStates } from "../../types/element-states";
import { delayExecution } from "../../constants/utils";
import { DELAY_IN_MS } from "../../constants/delays";
import React from "react";

const swap = (arr: StringElement[], firstIndex: number, secondIndex: number) => {
  [arr[firstIndex], arr[secondIndex]] = [arr[secondIndex], arr[firstIndex]];
};


export const swapStrings = async (
  arr: StringElement[],
  setArray: React.Dispatch<React.SetStateAction<StringElement[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {

  let length = arr.length - 1;
  let half = Math.floor(length / 2);

  for (let head = 0, tail = length; head < tail; head++, tail--) {

    arr[head].state = ElementStates.Changing;
    arr[tail].state = ElementStates.Changing;
    setArray([...arr]);

    await delayExecution(DELAY_IN_MS);


    swap(arr, head, tail);


    arr[head].state = ElementStates.Modified;
    arr[tail].state = ElementStates.Modified;
    setArray([...arr]);

    await delayExecution(DELAY_IN_MS);
  }

  if (arr.length % 2 !== 0) {
    arr[half].state = ElementStates.Modified;
    setArray([...arr]);
  }

  setLoading(false);
  setState(true);
};