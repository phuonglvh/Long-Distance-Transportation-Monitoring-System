/**
 * Data_collect.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },

  	devid: {
  		type: 'integer',
      unique: false,
      required: true,
  	},

  	packetid: {
      type: 'integer',
      unique: false,
      required: true,
  	},

  	timestamp: {
      type: 'datetime',
      required: true,
      // defaultsTo: new Date().toLocaleString(),
    },

  	humid: {
      type: 'float',
      required: true,
      defaultsTo: 0.0
    },

  	temp: {
      type: 'float',
      required: true,
      defaultsTo: 0.0
    },

    Lat: {
      type: 'float',
      required: true,
      defaultsTo: 0.0
    },

    Long: {
      type: 'float',
      required: true,
      defaultsTo: 0.0
    },

    locked: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    }
  }
};

