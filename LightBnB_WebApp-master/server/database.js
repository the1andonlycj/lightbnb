const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
console.log("Connecting")

/// Users

// pool.query(`
// SELECT *
// FROM users
// LIMIT 5;
// `)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.error('query error', err.stack));

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);

  return pool.query(`
  SELECT * 
  FROM users 
  WHERE users.email = $1
  `, [email])
  .then (res => res.rows[0])
  .catch (res => null)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
return pool.query(`
  SELECT * 
  FROM users 
  WHERE users.id = $1
  `, [id])
  .then(res => res.rows[0])
  .catch(res => null)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(res => null)

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT properties.*, reservations.*
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id
    WHERE reservations.guest_id = $1
    AND end_date < now():: date
    GROUP BY properties.id, reservations.id
    ORDER BY start_date
    LIMIT $2
    `, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => null)
  
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3.0
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  //3.1 (owner_id) was I even supposed to do this one? there isn't a slot for that
  // on my page?????

  // 3.2 (pricing min)
  if (options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryParams.push(parseInt(options.minimum_price_per_night));
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    } else {
    queryParams.push(parseInt(options.minimum_price_per_night));
    queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    }
  }

  //3.3 (pricing max) 
  if (options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryParams.push(parseInt(options.maximum_price_per_night));
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    } else {
    queryParams.push(parseInt(options.maximum_price_per_night));
    queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    }
  }

  // 3.4 (minimum rating)
  if (options.minimum_rating) {
    if (queryParams.length > 0) {
      queryParams.push(parseInt(options.minimum_rating));
      queryString += `AND rating >= $${queryParams.length} `;
    } else {
      queryParams.push(parseInt(options.minimum_rating));
      queryString += `WHERE rating >= $${queryParams.length} `;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(error => console.log(error));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
