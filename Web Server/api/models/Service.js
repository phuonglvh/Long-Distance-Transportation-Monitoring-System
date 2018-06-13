/**
 * Service.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true
    },

    devid: {
        type: 'integer',
        required: true,
    },

    renter: {
        model: 'user',
        required: true,
    },

    dep_Lat: {
        type: 'float',
        required: true,
        defaultsTo: 0.0000
    },

    dep_Long: {
        type: 'float',
        required: true,
        defaultsTo: 0.0000
    },
    des_Lat: {
        type: 'float',
        required: true,
        defaultsTo: 0.0000
    },

    des_Long: {
        type: 'float',
        required: true,
        defaultsTo: 0.0000
    },

    valid: {
        type: 'boolean',
        defaultsTo: true
    },

    note: {
         type: 'string',
         defaultsTo: '',
    },
    

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

