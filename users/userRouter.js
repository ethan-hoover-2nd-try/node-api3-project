const express = require('express');


const userDb = require("./userDb")
const postDb = require("../posts/postDb")
const router = express.Router();


router.use(express.json())

// POST create a new user
router.post('/', validateUser, (req, res) => {
  // do your magic!

  const user = req.body
  // if(!user){
  //   res.status(400).json({error: "Please provide username."})
  // }
  userDb
  .insert(user)
  .then(user => {
      res.status(201).json(user)
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error adding the user"
      });
  });

});

// POST create a new post under a user
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  req.body.user_id = id;
  const postData = req.body;
          postDb.insert(postData)    
          .then(post => {
              res.status(201).json(post);
          })
          .catch(error => {
              console.log('error on POST /api/users/:id/posts', error);
              res.status(500).json({ error: 'There was an error while saving the post to the database' })
          })
      
});



// GET users
router.get('/', (req, res) => {
  // do your magic!
  userDb.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
  
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the users"
    });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id

  userDb
  .getById(id)

  .then(user => {
      if(user) {
          res.status(200).json(user);
      } else {
      res.status(404).json({ error: "Requested ID does not exist" })
      }
    })
    .catch(error => {
   
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the db"
      });
    });


});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id

  userDb
  .getUserPosts(id)

  .then(user => {
        if(user.length > 0) {
          res.status(200).json(user);
        } else {
        res.status(404).json({ error: "User with the requested ID does not exist" })
        }
    })
    .catch(error => {
   
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the db"
      });
    });

});

router.delete('/:id',validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id

    userDb.remove(id)
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: "The user has been deleted" })  
        } else {
        res.status(404).json({ message: "User with the requested ID does not exist" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Error removing the user"
        })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const changes = req.body
  const id = req.params.id
  
    userDb
    .update(id,changes)
    .then(edit => {
        if (edit) {
            res.status(201).json({...changes, id: id});
        } else {
        res.status(404).json({ error: "user not found" })
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: "Error updating the user"
        });
      });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
 
  const id = Number(req.params.id || 0);
     if(id){
        req.user = id
        next();
    } else {
    res.status(400).json({ message: "Invalid user ID" })
    }
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body){
    res.status(400).json({ message: "Missing user data" })
}
  if(!isNaN(req.body.name)){
    res.status(400).json({ message: "Missing required name " })
}
if(req.body.name === null){
  res.status(400).json({ message: "Missing required name field" })
}
next();
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing the post data" });
} 
if (!req.body.text) {
    res.status(400).json({ message: "missing the required text data" });
} 
if(!req.body.user_id){
    res.status(400).json({ message: "missing the required user_id data" });
} 
else {
    next();
}
}

module.exports = router;