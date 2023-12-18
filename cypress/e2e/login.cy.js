describe("login", () => {
  it("can login and view its credits", () => {
    cy.visit("").wait(1000);

    cy.get("#email")
      .invoke("val", "knallis@stud.noroff.no")
      .should("have.value", "knallis@stud.noroff.no");

    cy.get("#password").invoke("val", "12345678");

    cy.get("#submit").click();

    cy.get("#my-balance").should("exist");
  });
});
