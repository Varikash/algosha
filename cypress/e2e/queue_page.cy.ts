import { Selectors } from '../../src/constants/cypress-constants';
import { Colors } from '../../src/constants/cypress-constants';

describe("The Queue Page", () => {
  beforeEach(() => {
    cy.visit("/queue");
  });

  it('Кнопки не активны когда input пустой', () => {
    cy.get('input').clear();
    cy.get('[data-cy="button-add"]').should('be.disabled');
    cy.get('[data-cy="button-delete"]').should('be.disabled');
    cy.get('[data-cy="button-clear"]').should('be.disabled');
  });

  it('Элементы добавляются в стек и анимация работает', () => {
    for (let i = 0; i < 5; i++) {
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.default);
      cy.get('input').type(`${i}`);
      cy.get('[data-cy="button-add"]').should("be.enabled");
      cy.get('[data-cy="button-add"]').click();
      cy.get(Selectors.head).eq(0).should("have.text", "head");
      cy.get(Selectors.tail).eq(i).should("have.text", "tail");
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.changed);
      cy.get(Selectors.letter).eq(i).should("have.text", `${i}`);
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.default);
    }
  });

  it('Элементы удаляются из стека корректно', () => {
    for (let i = 0; i < 7; i++) {
      cy.get('input').type(`${i}`);
      cy.get('[data-cy="button-add"]').should("be.enabled");
      cy.get('[data-cy="button-add"]').click();
      cy.get(Selectors.letter).eq(i).should("have.text", `${i}`);
    }
    for (let i = 0; i < 7; i++) {
      cy.get(Selectors.head).eq(i).should("have.text", "head");
      cy.get('[data-cy="button-delete"]').should("be.enabled").click();
      cy.get(Selectors.state).eq(i).should('have.css', 'border-color', Colors.changed);
      cy.get(Selectors.letter).eq(i).should("have.text", "");
      cy.get(Selectors.state).eq(i).should('have.css', 'border-color', Colors.default);
    }
  });

})