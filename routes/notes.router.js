'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
let hydrateNotes = require('../utils/hydrateNotes');


// // Get All (and search by query)
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  let {folderId} = req.query;
  let {tagId} = req.query;
  knex.select('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'note_id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      } 
    })
    .modify(function (queryBuilder) {
      if (tagId) {
        queryBuilder.where('tag_id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      if (results){
        let hydrated = hydrateNotes(results);
        res.json(hydrated);
      } else { next(); }
    })
    .catch(err => next(err));
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const searchTerm = req.params.id;
  
  knex
    .first('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'note_id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .where('notes.id', searchTerm)
    .orderBy('notes.id')
    .then(results => {
      let result =[results];
      if (results){
        let [hydrated] = hydrateNotes(result);
        res.json(hydrated);
      } else { next(); }
    })
    .catch(err => next(err));
});

router.post('/notes', (req, res, next) => {
  const { title, content, folder_id, tags=[] } = req.body; // Add `folder_id` to object destructure
  const newItem = {
    title,
    content,
    folder_id 
  };
  if (!newItem.title) 
  { const err = new Error('Missing `title` in request body'); err.status = 400; return next(err); }

  let noteId;
  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      let tagsInsert = tags.map(tagId => ({note_id: noteId, tag_id:tagId}));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => {
      return  knex
        .select('notes.id','title','content','folders.id as folder_id','folders.name as foldername', 'tags.id as tagId', 'tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id','folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags','notes_tags.tag_id','tags.id')
        .where('notes.id',noteId);
    })
    .then(result => {
      if (result){
        const hydrated = hydrateNotes(result)[0];
        res.location(`${req.originalUrl}/${hydrated.id}`).status(201).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});  

router.put('/notes/:id', (req, res, next) => {
  const id= req.params.id;
  const { title, content, folderId,tags=[]} = req.body;
  /***** Never trust users - validate input *****/
  const updateObj = {
    title,
    content,
    folderId,
  };
  const updateableFields = ['title', 'content','folders_id'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }


  knex('notes')
    .update(updateObj)
    .where({id})
    .then(()=> {
      return  knex('notes_tags')
        .del()
        .where('note_id',id);
    })
    .then(()=>{
      let tagsInsert = tags.map(tagId => ({note_id: id, tag_id:tagId}));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => {
      return knex.select('notes.id','title','content','folders.id as folder_id','folders.name as foldername', 'tags.id as tagId', 'tags.name as tagName')
        .from('notes')

        .leftJoin('folders', 'notes.folder_id', 'folders.id')

        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')

        .leftJoin('tags','notes_tags.tag_id','tags.id')

        .where('notes.id', id);
    })  .then(result => {
      if (result){
        const hydrated = hydrateNotes(result)[0];
        res.location(`${req.originalUrl}/${hydrated.id}`).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('notes')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});









module.exports = router;

