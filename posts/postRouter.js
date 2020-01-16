const express = require('express');
const postDB = require('./postDb');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  // do your magic!
  // console.log(req.body);
  postDB.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the users'
    });
  });
});

router.get('/:id', (req, res) => {
  // do your magic!

  const id = req.params.id
  
  postDB
    .getById(id)

    .then(post => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: "The post with the requested ID does not exist." })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the user db"
      });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  const id = req.params.id

  postDB.remove(id)
  .then(postCount => {
    if (postCount > 0) {
      res.status(200).json({ message: `The post with the ID: ${id} has been deleted` })
    } else {
      res.status(404).json({ message: "Specified post doed not exist" })
    }
  })
  .catch(error => {
    res.status(500).json({
      errorMessage: "Error removing the post"
    });
  });

});

// router.put('/:id', validatePostId, (req, res) => {
//   // do your magic!
//   const id = req.params.id;
//   const changes = req.body;

//   postDB
//     .update(id, changes)
//     .then(edit => {
//       if(edit) {
//         res.status(201).json({ ...changes, id: id})
//       } else {
//         res.status(404).json({ error: 'post not found' })
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({
//         message: 'error updating the user'
//       });
//     });
// });

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  postDB.getById(req.params.id)
  .then((post) => {
    if(post === undefined) {
      res.status(404).json({ message: "Post id not found" })
    } else {
      next();
    }
  })
  .catch(err => {
    res.status(500).json({err})
  })
}


module.exports = router;
