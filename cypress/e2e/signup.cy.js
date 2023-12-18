describe("logout", () => {
  it("can log out and no longer see its credits", () => {
    cy.login();
    cy.wait(1000);
    cy.get("#header-profile").click();
    cy.get("#logout-btn").click();
    cy.get("#my-balance").should("not.exist");
  });
});
