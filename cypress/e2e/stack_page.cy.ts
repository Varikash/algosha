import { Selectors } from '../../src/constants/cypress-constants';
import { Colors } from '../../src/constants/cypress-constants';

describe("The Stack Page", () => {
  beforeEach(() => {
    cy.visit("/stack");
  })

  it('Кнопки не активны когда input пустой', () => {
    cy.get('input').clear();
    cy.get('[data-cy="button-add"]').should('be.disabled');
    cy.get('[data-cy="button-delete"]').should('be.disabled');
    cy.get('[data-cy="button-clear"]').should('be.disabled');
  });

  it('Элементы добавляются в стэк и анимация работает', () => {
    for (let i = 0; i < 4; i++) {
      cy.get('input').type(`${i}`);
      cy.get('[data-cy="button-add"]').click();
      cy.get(Selectors.head).eq(i).should('have.text', 'top');
      cy.get(Selectors.letter).eq(i).should("have.text", `${i}`);
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.changed);
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.default);
    }
  });

  it('Элементы удаляются', () => {
    for (let i = 0; i < 4; i++) {
      cy.get('input').type(`${i}`);
      cy.get('[data-cy="button-add"]').click();
    }

    for (let i = 3; i >= 0; i--) {
      cy.get('[data-cy="button-delete"]').click();
      cy.get(Selectors.state).eq(i).should("have.css", "border-color", Colors.changed);
      cy.get(Selectors.head).eq(i-1).should('have.text', 'top');
    }
  });

  it('Стек очищается', () => {
    for (let i = 0; i < 4; i++) {
      cy.get('input').type(`${i}`);
      cy.get('[data-cy="button-add"]').click();
    }

    cy.get('[data-cy="button-clear"]').click();
    cy.get(Selectors.letter).should("not.exist");
  });
});
