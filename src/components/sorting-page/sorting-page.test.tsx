import { bubbleSort, selectionSort } from './sorting-page';
import { ArrayElement } from './sorting-page';
import { ElementStates } from 'types/element-states';
import { Direction } from "../../types/direction";


describe('Sorting Algorithms', () => {
  const createArray = (numbers: number[]): ArrayElement[] =>
    numbers.map(value => ({ value, state: ElementStates.Default }));

  const mockSetArrayForRender = jest.fn();

  beforeEach(() => {
    mockSetArrayForRender.mockClear();
  });

  const testSort = (sortFunction: typeof bubbleSort | typeof selectionSort, sortMethodName: string) => {
    describe(`${sortMethodName} Sort`, () => {
      it.each([
        { direction: Direction.Ascending, array: [], sorted: [] },
        { direction: Direction.Ascending, array: [1], sorted: [1], state: ElementStates.Modified },
        { direction: Direction.Ascending, array: [3, 1, 2], sorted: [1, 2, 3], state: ElementStates.Modified },
        { direction: Direction.Descending, array: [1], sorted: [1], state: ElementStates.Modified },
        { direction: Direction.Descending, array: [1, 3, 2], sorted: [3, 2, 1], state: ElementStates.Modified }
      ])('correctly sorts an array with %s', async ({ direction, array, sorted, state }) => {
        const arrayElements = createArray(array);
        await sortFunction(arrayElements, direction, mockSetArrayForRender);

        const sortedArray = arrayElements.map(el => el.value);
        expect(sortedArray).toEqual(sorted);
        if (array.length > 0) {
          expect(arrayElements[0].state).toEqual(state);
        }
      });
    });
  };

  testSort(bubbleSort, 'Bubble');
  testSort(selectionSort, 'Selection');
});
