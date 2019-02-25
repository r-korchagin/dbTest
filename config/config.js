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
       intCount: 1000,
       selectCount: 1000,
       startDateRange: new Date(2012, 0, 1),
       endDateRange: new Date()
    }
 };

 module.exports = conf;