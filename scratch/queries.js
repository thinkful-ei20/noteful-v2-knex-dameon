'use strict';

const knex = require('../knex');

let searchTerm = 2;
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// knex
//   .select()
//   .from('notes')
//   .where({'id': searchTerm})
//   .then(results => {
//     //results.status(200).send('Success');
//     console.log(JSON.stringify(results[0], null, 2));
//   });

// knex('notes')
//   .where({id:searchTerm})
//   .update({title:'Good times'})
//   .returning(['id','content','title'])
//   .then(results => {
//     
//   });



// knex('notes')
//   .insert([{content:'Ths sxx' , title:'Here it is'}])
//   .returning(['id', 'content','title'])
//   .then(results => {
//     console.log(JSON.stringify(results[0], null, 2));
//   });


// knex('notes')
// .where({id:searchTerm})
// .del()
// .then(results => {
//   console.log('Deleted');
// });

// knex('notes')
// .select()
// .where({id:searchTerm})
// .then(results => {
//   console.log(results);
// });




