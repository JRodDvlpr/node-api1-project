// implement your API here

//Getting Database
const db = require('./data/db');

//Getting express module
const express = require('express');

// Getting CORS module
const cors = require('cors');

//Create Server to use
const server = express();

//Server LocalHost Port
const port = 5000;

server.listen(port, () => {
    console.log(`API server listening on ${port}...`)
})

// Using JSON body parser
server.use(express.json());

// Using CORS
server.use(cors());

//main endpoint

server.get('/', (req, res) =>{
    res.status(200).json({message: "Success, Welcome to the API"})
})

//When the client makes a GET request to /api/users:
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        if(users){
        res.status(200).json(users);
        } else {
            res.status(404).json({message: "No users in the data base"})
        }
    })
    .catch(err => {
        res.status(500).json({errorMessage: "The users information could not be retrieved."});
    });
});


//When the client makes a GET request to /api/users/:id:
server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: "The user with the specified ID does not exist."});
        }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The user information could not be retrieved."})
    })
})

//When the client makes a POST request to /api/users:


server.post('/api/users', (req, res) => {
    const {name, bio} = req.body;
    if (name && bio ) {
        db.insert(req.body)
        .then(user => {
            res.status(201).json({Success: true, name: name, bio: bio});
        })
        .catch(err => {
            res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
        })
        
    } else {
        res.status(404).json({errorMessage: "Please provide name and bio for the user."})
    }
})


//When the client makes a DELETE request to /api/users/:id:

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
    .then(user => {
        if (user) {
            db.remove(id)
            .then(() =>{
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({errorMessage: "The user could not be removed"})
            })
        } else {
            res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({errorMessage: "The user could not be removed"})
    })
})

//When the client makes a PUT request to /api/users/:id:

server.put('/api/users/:id', (req, res)  => {
    const id = req.params.id;
    const { name, bio } = req.body;
    

    if (name && bio ) {
        db.findById(id)
        .then(user => {
            if (user) {
                db.update(id, {name:name, bio: bio})
                .then(user => {
                    res.status(200).json({Sucess: true, name: name, bio: bio})
                })
                .catch(err => {res.status(500).json({error: "The user information could not be modified."})
            })
            } else {
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The user information could not be modified."})
        })
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }
})