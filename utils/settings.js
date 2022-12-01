require('dotenv').config();

const { NODE_ENV, PORT, DB } = process.env;

module.exports.PORT_SETTING = NODE_ENV === 'production' ? PORT : 3001;
module.exports.DB_SETTING = NODE_ENV === 'production' ? DB : 'mongodb://localhost:27017/moviesdb';
