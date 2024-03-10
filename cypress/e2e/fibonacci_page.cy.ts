import { Selectors } from '../../src/constants/cypress-constants'

describe("The Fibonacci Page", () => {
  beforeEach(() => {
    cy.visit("/fibonacci");
  });

  it('Кнопка не активна когда input пустой', () => {
    cy.get('input').clear();
    cy.get(Selectors.button).should('be.disabled');
  });

  it('Кнопка не активна если input value больше 9', () => {
    cy.get('input').type('20');
    cy.get(Selectors.button).should('be.disabled');
  })

  it('Корректная генерация последовательности', () => {
    cy.get('input').type('5');
    cy.get(Selectors.button).click();
    cy.get(Selectors.letter, { timeout: 10000 }).should('have.length', 5);

    const expectedSequence = ['1', '1', '2', '3', '5', '8'];

    expectedSequence.forEach((num, index) => {
      cy.get(Selectors.letter).eq(index).should('contain', num);
    });
  });


});
