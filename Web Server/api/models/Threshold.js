/**
 * Threshold.js
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
      autoIncrement: true,
    },

    devid: {
        type: 'integer',
        required: true,
    },

    // renter: {
    //     type: 'integer',
    //     required: true,
    // },

    upperTemp: {
        type: 'float',
        required: true,
        defaultsTo: 0.0,
    },

    lowerTemp: {
        type: 'float',
        required: true,
        defaultsTo: 0.0,
    },

    upperHumid: {
        type: 'float',
        required: true,
        defaultsTo: 0.0,
    },
    lowerHumid: {
        type: 'float',
        required: true,
        defaultsTo: 0.0,
    },

  },

};

