/**
 * Configuration file.
 */

 var conf = {
    /**
     * Server Port
     */
    server:{
        port:'3333'
    },

    test:{
       intCount: 100000,
       selectCount: 100,
       startDateRange: new Date(2012, 0, 1),
       endDateRange: new Date(),
       selectLimit : 5,
       poolSize : 5
    }
 };

 module.exports = conf;