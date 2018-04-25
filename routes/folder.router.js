'use strict';
let express = require('express');
let knex = require('../knex');
let router = express.Router();


// router.get('/folders', (req, res, next) => {
//   knex
//     .select('id', 'name')
//     .from('folders')
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => next(err));
// });


// router.get('/notes', (req, res, next) => {
//     const { searchTerm } = req.query;
//       knex
//       .select('notes.id', 'title', 'content')
//       .from('notes')
//       .modify(queryBuilder => {if (searchTerm) {queryBuilder.where('title', 'like', `%${searchTerm}%`);} })
//       .orderBy('notes.id')
//       .then(results => { res.json(results);})
//       .catch(err => { next(err); });


router.get('/folders/:id', (req,res,next) => {
  const searchTerm = req.params.id;
    
  knex
    .select()
    .from('folders')
    .where('id', searchTerm)
    .then(results => {
      res.json(results[0]);
    }).catch(err => {
      next(err);
    });
});

router.put('/folders/:id', (req, res, next) => {
  const searchTerm = req.params.id;
  
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['name'];
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex('folders')
    .where({id:searchTerm})
    .update(updateObj)
    .returning(['id','name'])
    .then(results => {
      res.json(results);
    }).catch(err => {
      next(err);
    });
});


router.post('/folders', (req, res, next) => {
  const { name  } = req.body;
  
  const newItem = { name };
  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  knex('folders')
    .insert([newItem])
    .returning(['id', 'name'])
    .then(results => {
      res.status(201).json(results[0]);
    }).catch(err => {
      next(err);
    });

});

router.delete('/folders/:id', (req, res, next) => {
  const searchTerm = req.params.id;
  
  knex('notes')
    .where({id:searchTerm})
    .del()
    .then(results => {
      res.status(204).json(results);
    }).catch(err => {
      next(err);
    });
});


























module.exports = router;