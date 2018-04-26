'use strict';
let express = require('express');
let knex = require('../knex');
let router = express.Router();


router.get('/tags', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/tags/:id', (req,res,next) => {
  const searchTerm = req.params.id;
      
  knex
    .select()
    .from('tags')
    .where('id', searchTerm)
    .then(results => {
      res.json(results[0]);
    }).catch(err => {
      next(err);
    });
});







router.put('/tags/:id', (req, res, next) => {
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
    
  knex('tags')
    .where({id:searchTerm})
    .update(updateObj)
    .returning(['id','name'])
    .then(results => {
      res.json(results);
    }).catch(err => {
      next(err);
    });
});



















router.post('/tags', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };
  
  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});












router.delete('/tags/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('tags')
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});
  























module.exports = router;














