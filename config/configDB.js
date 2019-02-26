/**
 * Configuration file for DB
 */

 var db = [
     {
        name: 'MongoDB',
        connection: 'mongodb://localhost:27017/local',
     },
     /*
     {
        name: 'Cassandra',
        connection: { contactPoints: ['localhost']},
     },
     {
        name: 'CouchDB',
        connection: 'http://localhost:5984',
     },
     {
        name: 'LevelDB',
        connection: './mydb',
     },
     {
        name: 'MySQL',
        connection: {
            host     : 'localhost',
            user     : 'dbuser',
            password : 's3kreee7'
          },
     },
     {
        name: 'Neo4j',
        connection: '',
     },
     */
     {
        name: 'PostgreSQL',
        connection: 'postgres://testadm:123@localhost:5432/testDB',
     },
     /*
     {
        name: 'Redis',
        connection: '',
     },
     {
        name: 'SQLite',
        connection: ':memory:',
     },
     {
        name: 'ElasticSearch',
        connection: {
            host: 'localhost:9200'
          },
     },
     */
 ];

 module.exports = db;