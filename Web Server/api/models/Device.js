/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
    },

  	devid: {
  		type: 'integer',
  		unique: true
  	},

  	devname: {
  		type: 'string',
  		required: true
  	},

    parameter: {
      type: 'string',
    },



    // id: {
    //   type: 'integer',
    //   autoIncrement: true
    // },

    // devid: {
    //   type: 'integer',
    //   primaryKey: true,
    //   unique: true
    // },

    // devname: {
    //   type: 'string',
    //   required: true
    // },

    // parameter: {
    //   type: 'string',
    // },

    // owner: {
    //   model: 'user'
    // },
  },
};

