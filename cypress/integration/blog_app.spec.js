const apiUrl = 'http://localhost:3003/api/'
const websiteUrl = 'http://localhost:3000'

describe('Testing the blog app', function() { //since it's based on Mocha, we have to use the function notation
    //empty the E2E testing DB and populate it with two users
    beforeEach(function(){
        console.log('outer most describe beforeEach block is being ran')
        cy.request('post', `${apiUrl}testing/reset`)
        const defaultUser = {
            username: 'admin',
            name: 'admin',
            password: 'bigWow123'
        }
        const secondUser = {
            username:'root',
            name:'root',
            password: 'flamingo'
        }
        cy.request('post', `${apiUrl}users`, defaultUser)
        cy.request('post', `${apiUrl}users`, secondUser)
        cy.visit(websiteUrl)
    })

    it('Front page is accessible and has a login form', function(){
        cy.visit(websiteUrl)
        cy.contains('Username:')
        cy.contains('Password:')
        //cy.contains('Submit')
    })

    describe('Testing login funcitons', function(){
        it('User can login with correct credentials', function() {
            cy.get('#username').type('admin')
            cy.get('#password').type('bigWow123')
            cy.get('#login-button').click()
            cy.get('#system-status').should('have.css','color','rgb(0, 128, 0)')//rgb value for green, which is the success message's color
        })
    
        it('User cannot login with incorrect credentials', function() {
            cy.get('#username').type('admin')//it would seem like beforeEacb block is executed for each it blocks
            cy.get('#password').type('admin')
            cy.get('#login-button').click()
            cy.contains('Username:')
            cy.contains('Password:')
            cy.get('#system-status').should('have.css','color','rgb(255, 0, 0)')//rgb value for green, which is the success message's color
        })
    })

    describe('Testing functionalities requiring logging in', function() {
        console.log('inner describe block is being ran')

        const blogTitle = 'Test Blog The Best Blog'
        const blogAuthor = 'John Doe'
        const blogUrl = 'testblog.com'

        const newPost = {
            title: blogTitle,
            url: blogUrl,
            author: blogAuthor
        }

        beforeEach(function(){
            //helper functions can be added into cypress/support/commands.js
            console.log('inner beforeEach is being ran')
            cy.login({username: 'admin', password:'bigWow123'})
        })

        it('Logged-in user can create a post', function(){
            cy.contains('Add Blog').click()
            cy.get('#Title').type(blogTitle)
            cy.get('#Blog_Author').type(blogAuthor)
            cy.get('#Blog_URL').type(blogUrl)
            cy.get('#Submission_Button').click()
            cy.contains(blogTitle)
        })

        it('The logged in user can delete a post he made', function(){
            //newPost format = {title, url, author, token}
            cy.makePost(newPost)
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('delete').click()
        })

        it.only('after making a post, the user can like the post', function(){
            console.log('the actual thing is being ran')
            const moddedPost = {...newPost, token: localStorage.getItem('token')}
            cy.makePost(moddedPost)
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('like').click()
            cy.contains('likes: 1')
        })

        it('The logged in user cannot delete a post that someone else made', function(){
            cy.makePost(newPost)
            cy.logout()
            cy.login({username:'root', password:'flamingo'})
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('delete').should('not.exist')
        })
    }) 
    
})