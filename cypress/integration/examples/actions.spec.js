/// <reference types="cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1234");
  });

  it("", () => {
    cy.get("[data-cy='title']").should("be.visible");
    cy.get("[data-cy='title']").contains("Math!");
    
    cy.get("[data-cy='btn-one']").should("be.visible");
    cy.get("[data-cy='btn-two']").should("be.visible");
  });
});
