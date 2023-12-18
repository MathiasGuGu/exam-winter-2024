describe("login", () => {
  it("can login and view its credits", () => {
    cy.visit("https://main--funny-hotteok-1ffc10.netlify.app/r/login").wait(
      1000
    );

    cy.get("#email")
      .invoke("val", "matgum51873@stud.noroff.no")
      .should("have.value", "matgum51873@stud.noroff.no");

    cy.get("#password").invoke("val", "Aaiiuues");

    cy.get("button").click();

    cy.url().should("include", "/r/listings");
  });
});
