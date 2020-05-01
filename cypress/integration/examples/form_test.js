
// describe("Test our form inputs", function () {
//     it("visit our local host", function () {
//         cy.vist("http://localhost:3000/")
//     })
//     it("first test", function () {
//         cy.get('[data-cy="name"]').type("Brian").should("have.value", "Brian");
//     })
// })

describe("Testing our form inputs", function () {
    beforeEach(function () {
        cy.visit("http://localhost:3000/");
    })
    it("first test", function () {
        cy.get('[data-cy="name"]').type("Brian").should("have.value", "Brian");
        cy.get('[data-cy="email"]').type("Brian@email.com").should("have.value", "Brian@email.com");
        cy.get('[data-cy="password"]').type("12345678").should("have.value", "12345678");
        cy.get("#role").select("Pass Butter").should("have.value", "Pass Butter");
        cy.get('[type="checkbox"]').check().should("be.checked")
        cy.get('[data-cy="submit"]').click();
        cy.get("form").submit();
    })
})