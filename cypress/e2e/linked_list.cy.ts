import { Selectors } from '../../src/constants/cypress-constants';
import { Colors } from '../../src/constants/cypress-constants';

describe("The Linked List Page", () => {
  beforeEach(() => {
    cy.visit("/list");
  })

  it('Кнопки не активны когда inputs пустые', () => {
    cy.get(Selectors.inputValue).clear();
    cy.get(Selectors.inputIndex).clear();
    cy.get(Selectors.addToHead).should('be.disabled');
    cy.get(Selectors.addToTail).should('be.disabled');
    cy.get(Selectors.addByIndex).should('be.disabled');
    cy.get(Selectors.deleteByIndex).should('be.disabled');
  });

  it('Отрисовка дефолтного списка', () => {
    cy.get(Selectors.circle).then(circleElements => {
      expect(circleElements).to.have.length.within(4, 6);
      cy.wrap(circleElements[0]).find(Selectors.head).should("have.text", "head");
      cy.wrap(circleElements[circleElements.length - 1]).find(Selectors.tail).should("have.text", "tail");
    });
  });

  it('Добавление элемента в head', () => {
    let testString = 'test';

    cy.get(Selectors.inputValue).type(testString);
    cy.get(Selectors.addToHead).should('be.enabled').click();

    cy.get(Selectors.state).eq(0).should('have.css', 'border-color', Colors.changed);
    cy.get(Selectors.letter).eq(0).should('have.text', testString);
    cy.get(Selectors.state).eq(0).should('have.css', 'border-color', Colors.modified);
    cy.get(Selectors.state).eq(0).should('have.css', 'border-color', Colors.default);
  });

  it('Добавление элемента в tail', () => {
    let testString = 'test';

    cy.get(Selectors.inputValue).type(testString);
    cy.get(Selectors.addToTail).should('be.enabled').click();

    const smallCircleIndex = -2;

    cy.get(Selectors.state).eq(smallCircleIndex).should("have.css", "border-color", Colors.changed).find(Selectors.letter).should("have.text", testString);

    cy.get(Selectors.letter).last().should("have.text", testString);
    cy.get(Selectors.state).last().should("have.css", "border-color", Colors.modified);
    cy.get(Selectors.state).last().should("have.css", "border-color", Colors.default);
  });

  it('Добавление по индексу работает корректно', () => {
    let index = 3;
    let testString = 'test'
    cy.get(Selectors.inputValue).type(testString);
    cy.get(Selectors.inputIndex).type(`${index}`);
    cy.get(Selectors.addByIndex).should('be.enabled').click();

    for (let i = 0; i < index; i++) {
      cy.get(Selectors.circle).eq(i)
        .within(() => {
          cy.get(Selectors.smallCircle).find(Selectors.state).should("have.css", "border-color", Colors.changed);
          cy.get(Selectors.bigCircle).find(Selectors.state).last().should("have.css", "border-color", Colors.default);
        });
    }

    cy.get(Selectors.circle).eq(index).find(Selectors.bigCircle).find(Selectors.state).should("have.css", "border-color", Colors.modified);
    cy.get(Selectors.circle).last().find(Selectors.tail).should("have.text", 'tail');
  });

  it('Удаление из head происходить корректно', () => {
    cy.get(Selectors.circle).first().then(circleElements => {
      const firstNumber = circleElements.find(Selectors.letter).text();

      cy.get(Selectors.deleteFromHead).should("be.enabled").click();

      cy.wrap(circleElements).find(Selectors.smallCircle).should("have.text", firstNumber);
      cy.wrap(circleElements).find(Selectors.bigCircle).find(Selectors.letter).first().should("have.text", "");
      cy.wrap(circleElements).find(Selectors.smallCircle).find(Selectors.state).should("have.css", "border-color", Colors.changed);
    })

    cy.get(Selectors.smallCircle).should("not.exist");
    cy.get(Selectors.circle).first().find(Selectors.head).should("exist");
  });

  it('Удаление из tail происходит корректно', () => {
    cy.get(Selectors.circle).last().then((circleElements) => {
      const lastNumber = circleElements.find(Selectors.letter).text();

      cy.get(Selectors.deleteFromTail).should("be.enabled").click();

      cy.wrap(circleElements).find(Selectors.letter).first().should("have.text", "");
      cy.wrap(circleElements).find(Selectors.smallCircle).should("have.text", lastNumber);
      cy.wrap(circleElements).find(Selectors.smallCircle).find(Selectors.state).should("have.css", "border-color", Colors.changed);
    });

      cy.get(Selectors.smallCircle).should("not.exist");
      cy.get(Selectors.circle).last().find(Selectors.tail).should("exist");
  });

  it("Удаление по индексу происходит корректно", () => {
    const index = 2;
    cy.get(Selectors.inputIndex).type(`${index}`);

    cy.get(Selectors.circle).then((circleElements) => {
      const deleteNumber = circleElements.eq(index).find(Selectors.letter).text();
      cy.get(Selectors.deleteByIndex).should("be.enabled").click();

      for (let i = 0; i < index; i++) {
        cy.wrap(circleElements).eq(i).find(Selectors.state).should("have.css", "border-color", Colors.changed);
      }

      cy.wrap(circleElements).eq(index).within(() => {
        cy.get(Selectors.smallCircle).find(Selectors.letter).should("have.text", deleteNumber);
        cy.get(Selectors.smallCircle).find(Selectors.state).should("have.css", "border-color", Colors.changed);
        cy.get(Selectors.bigCircle).find(Selectors.state).should("have.css", "border-color", Colors.default).find(Selectors.letter).first().should("have.text", "");
        });

      cy.get(Selectors.smallCircle).should("not.exist");
      cy.get(Selectors.circle).last().find(Selectors.tail).should("exist");
    });
  });
});