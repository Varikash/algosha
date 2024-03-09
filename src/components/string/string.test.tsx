import { swapStrings } from './utils';
import { StringElement } from "../../types/types";
import { ElementStates } from "../../types/element-states";

describe("reverse string", () => {

  jest.setTimeout(10000); // Без тайм-аута не успевает сработать(

  const mockSetArray = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetState = jest.fn();

  test.each([
    ["even string length", "winter", "retniw"],
    ["odd string length", "спасите", "етисапс"],
    ["one char", "ы", "ы"],
    ["empty string", "", ""],
  ])("%s", async (_, initialValue: string, expectedValue: string) => {
    const stringArray: StringElement[] = initialValue.split('').map((char) => ({
      value: char,
      state: ElementStates.Default
    }));

    await swapStrings(stringArray, mockSetArray, mockSetLoading, mockSetState);

    if (mockSetArray.mock.calls.length > 0) {
      const finalCall = mockSetArray.mock.calls[mockSetArray.mock.calls.length - 1][0];
      const finalArray = finalCall as StringElement[];
      const resultString = finalArray.map((element: StringElement) => element.value).join('');

      expect(resultString).toBe(expectedValue);
      expect(finalArray).toMatchSnapshot();
    } else {
      expect(expectedValue).toBe('');
      expect(mockSetArray).not.toHaveBeenCalled();
    }
  });
});