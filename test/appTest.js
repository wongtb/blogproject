//const mongoose = require('mongoose')
var database = require('../database')
app = require('../index');
dotenv = require('dotenv').config(); // need to obtain secret for decoding the JWT?  

// Test Data
var user = {
    email: "wongtb@mcmaster.ca",
    name: "Brian Wong",
    password: "pw_brian"
}


// Dev Devepncies
const chai = require('chai')
chaiHTTP = require('chai-http')
should = chai.should()

// Middleware for chaiHTTP
chai.use(chaiHTTP)

// Clean Database
database.clearDatabase();

// Create User (1)
describe('Create Initial User', () => {
    it('it should create a user', (done) => {

        chai.request(app)// ('http://localhost:3000')
            .post('/api/user')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

// Create User with the same password - should reject
describe('Create Already Existing User', () => {
    it('it should deny a new account', (done) => {
        
        chai.request(app)
            .post('/api/user')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .end((err, res) => {
                res.should.have.status(403);
                done();
            })
    })
})
// Login - should receive a JWT
// Get Users - should see 2 users

// Submit a Blog Post without logging in (JWT) - should reject
// Submit a Blog Post with given JWT - should get okay
// Get all posts - should receive 1 post

// Update a post with improper credentials 
// Update a post with no credentials
// Update a post with the correct credentials

// Get post vote

// Upvote a post
// Upvote a post
// Downvote a post