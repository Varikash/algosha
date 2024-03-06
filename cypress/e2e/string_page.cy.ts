import { Selectors } from '../../src/constants/cypress-constants';
import { Colors } from '../../src/constants/cypress-constants';
import { DELAY_IN_MS } from '../../src/constants/delays';

describe("The String Page", () => {
  beforeEach(() => {
    cy.visit("/recursion");
  });


  it('Кнопка не активна когда input пустой', () => {
    cy.get('input').clear();
    cy.get(Selectors.button).should('be.disabled');
  });

  it('Кнопка активна когда input не пустой', () => {
    cy.get('input').type('test');
    cy.get(Selectors.button).should('not.be.disabled');
  });

  it('Корректно меняет местами буквы', () => {
    const testString = 'hello';
    const reversedString = [...testString].reverse().join('');

    cy.get('input').type(testString);
    cy.get(Selectors.button).click();
    cy.get(Selectors.button).should('be.disabled');
    cy.get(Selectors.letter).should('have.length', testString.length);

    reversedString.split('').forEach((char, index) => {
      cy.get(Selectors.letter).eq(index)
        .should('contain', char);
    });

    cy.get('input').clear();
    cy.get(Selectors.button).should('be.disabled');
  });

  it('Корректно меняются цвета и буквы', () => {
    const testString = 'abc';
    cy.get('input').type(testString);
    cy.get(Selectors.button).click();

    [...testString].forEach((element, index) => {
      cy.get(Selectors.state).eq(index).should('have.css', 'border-color', Colors.default)
    });

    cy.wait(DELAY_IN_MS).then(() => {
      cy.get(Selectors.state).eq(0).should('have.css', 'border-color', Colors.changed);
      cy.get(Selectors.state).eq(2).should('have.css', 'border-color', Colors.changed);
    });

    cy.wait(DELAY_IN_MS).then(() => {
      cy.get(Selectors.letter).eq(0).should('have.text', 'c');
      cy.get(Selectors.state).eq(0).should('have.css', 'border-color', Colors.modified);
      cy.get(Selectors.letter).eq(2).should('have.text', 'a');
      cy.get(Selectors.state).eq(2).should('have.css', 'border-color', Colors.modified);
    });

    cy.wait(DELAY_IN_MS).then(() => {
      cy.get(Selectors.state).eq(1).should('have.css', 'border-color', Colors.modified);
    });
  })

})