// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const apiUrl = 'http://localhost:3003/api/'
const websiteUrl = 'http://localhost:3000'

//this works
Cypress.Commands.add('login', ({username, password}) => {
    // cy.request('post', apiUrl, {username, password})
    cy.request({
        method: "POST",
        url: apiUrl,
        body: {
            username,
            password
        }
    })
    .then(response => {
        console.log('logging in successful, received server res:', response.body)
        localStorage.setItem('name', response.body.name)
        localStorage.setItem('token', response.body.token)
        cy.visit(websiteUrl)
    })
})

Cypress.Commands.add('logout', () => {
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    cy.visit(websiteUrl)
})

//this might not work
Cypress.Commands.add('makePost', ({title, url, author, token}) => {
    const auth = {'bearer': token}
    // cy.request(auth)//idk if this will work as intended let's see
    // cy.request('post', `${apiUrl}blogs`, {title, url, author})
    cy.request({
        method: 'POST',
        url: `${apiUrl}blogs`,
        auth,
        body: {title, url, author}
    })
    .then(response => cy.visit(websiteUrl))
})

Cypress.Commands.add('makeManyPosts', ({ posts, token }) => { //this is a fucking nightmare, let's try a recursive function
    console.log('manyPost is being called')
    const auth = {'bearer': token}

    const sendRequest = function(posts){//recursive actually works WTF, there must be a better way to do this right???
        if(posts.length > 0){
            const [post, ...remainingPosts] = posts 
            cy.request({
                method: 'POST',
                url: `${apiUrl}blogs`,
                auth,
                body: {title:post.title, url:post.url, author:post.author}
            })
            .then(response => {
                sendRequest(remainingPosts)
            })
        }
        else{
            return
        }
    }

    // for(let i = 0; i<posts.length; i++){
    //     cy.request({
    //         method: 'POST',
    //         url: `${apiUrl}blogs`,
    //         auth,
    //         body: {
    //             title: posts[i].title,
    //             url: posts[i].url,
    //             author:posts[i].author
    //         }
    //     }).as(`makePost${i}`)

    //     cy.wait(`@makePost${i}`)
    // }
    sendRequest(posts)

    cy.visit(websiteUrl)
})