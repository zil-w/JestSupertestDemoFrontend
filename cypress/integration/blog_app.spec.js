const apiUrl = 'http://localhost:3003/api/'
const websiteUrl = 'http://localhost:3000'

describe('Testing the blog app', function () { //since it's based on Mocha, we have to use the function notation
    //empty the E2E testing DB and populate it with two users
    beforeEach(function () {
        console.log('outer most describe beforeEach block is being ran')
        cy.request('post', `${apiUrl}testing/reset`)
        const defaultUser = {
            username: 'admin',
            name: 'admin',
            password: 'bigWow123'
        }
        const secondUser = {
            username: 'root',
            name: 'root',
            password: 'flamingo'
        }
        cy.request('post', `${apiUrl}users`, defaultUser)
        cy.request('post', `${apiUrl}users`, secondUser)
        cy.visit(websiteUrl)
    })

    it('Front page is accessible and has a login form', function () {
        cy.visit(websiteUrl)
        cy.contains('Username:')
        cy.contains('Password:')
        //cy.contains('Submit')
    })

    describe('Testing login funcitons', function () {
        it('User can login with correct credentials', function () {
            cy.get('#username').type('admin')
            cy.get('#password').type('bigWow123')
            cy.get('#login-button').click()
            cy.get('#system-status').should('have.css', 'color', 'rgb(0, 128, 0)')//rgb value for green, which is the success message's color
        })

        it('User cannot login with incorrect credentials', function () {
            cy.get('#username').type('admin')//it would seem like beforeEacb block is executed for each it blocks
            cy.get('#password').type('admin')
            cy.get('#login-button').click()
            cy.contains('Username:')
            cy.contains('Password:')
            cy.get('#system-status').should('have.css', 'color', 'rgb(255, 0, 0)')//rgb value for green, which is the success message's color
        })
    })

    describe('Testing functionalities requiring logging in', function () {
        console.log('inner describe block is being ran')

        const blogTitle = 'Test Blog The Best Blog' //this is very interesting, free floating code inside a describe block seems to execute even before the beforeEach of outer scope
        const blogAuthor = 'John Doe'
        const blogUrl = 'testblog.com'

        const newPost = {
            title: blogTitle,
            url: blogUrl,
            author: blogAuthor
        }

        beforeEach(function () {
            //helper functions can be added into cypress/support/commands.js
            console.log('inner beforeEach is being ran')
            cy.login({ username: 'admin', password: 'bigWow123' })
        })

        it('Logged-in user can create a post', function () {
            cy.contains('Add Blog').click()
            cy.get('#Title').type(blogTitle)
            cy.get('#Blog_Author').type(blogAuthor)
            cy.get('#Blog_URL').type(blogUrl)
            cy.get('#Submission_Button').click()
            cy.contains(blogTitle)
        })

        it('The logged in user can delete a post he made', function () {
            //newPost format = {title, url, author, token}
            cy.makePost(newPost)
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('delete').click()
        })

        it('after making a post, the user can like the post', function () {
            console.log('the actual thing is being ran')
            const moddedPost = { ...newPost, token: localStorage.getItem('token') }
            cy.makePost(moddedPost)
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('like').click()
            cy.contains('likes: 1')
        })

        it('The logged in user cannot delete a post that someone else made', function () {
            cy.makePost(newPost)
            cy.logout()
            cy.login({ username: 'root', password: 'flamingo' })
            cy.contains(blogTitle).contains('Show').click()
            cy.contains(blogTitle).contains('delete').should('not.exist')
        })
    })

    describe('Testing posts\'s collective behaviors:', function () {

        beforeEach(function () {
            cy.login({ username: 'admin', password: 'bigWow123' })
        })

        it.only('Posts are arranged by their number of likes in descending order:', function () {
            
            //creating test posts
            const blogTitle = 'Test Blog The Best Blog'
            const blogAuthor = 'John Doe'
            const blogUrl = 'testblog.com'

            const newPosts = [//this can probably be done inside a loop
                {
                    title: blogTitle,
                    url: blogUrl,
                    author: blogAuthor
                },
                {
                    title: blogTitle + '1',
                    url: blogUrl + '1',
                    author: blogAuthor + '1'
                },
                {
                    title: blogTitle +'2',
                    url: blogUrl +'2',
                    author: blogAuthor +'2'
                },
                {
                    title: blogTitle +'3',
                    url: blogUrl +'3',
                    author: blogAuthor +'3'
                }
            ]

            //submitting the test posts directly through backend
            cy.makeManyPosts({posts: newPosts, token: localStorage.getItem('token')})//had to define this through recursion, maybe there is a more straightforward way
            cy.get('.blog').each(function () {
                cy.contains('Show').click()
            })

            //click each blog's like buttons the same number of times as their index in the array of test posts
            const clickLikeManyTimes = function (outerIdentifier, buttonIdentifier, clickNum) {
                for (let i = 0; i < clickNum; i++) {
                    cy.contains(outerIdentifier).contains(buttonIdentifier).click()
                }
            }

            for (let i = 0; i < newPosts.length; i++){
                clickLikeManyTimes(newPosts[i].title, 'like', i)
            }

            //verify if the posts are ordered by their number of likes
            //how would we do this? do we somehow get text in each element?
            //hmm, should('containText', textHere), this is useful, but we need to somehow call it in the order in the order the blogs are displayed
            // cy.get('.blog')
            //     .then(elements => {
            //         for (const element in elements) {
            //             console.log('the stuff we are getting is:', element) //this is returning us weird stuff, like one gazillion things instead of just 4 things
            //         }
            // })

            console.log('we got past the manyClicks')

            let postText = []

            cy.get('.blog') //but this is working
                .each(function (post) {
                    console.log('get block callback is being called', post)
                    postText.push(post.text())
                }
            )

            console.log('we got past the loop', postText)

            for (let newPost of postText) {//okay this is not working, wtf, the array is filled as inted why wouldn't it log
                console.log('text we got is:', newPost)
            }
        })
    })

})