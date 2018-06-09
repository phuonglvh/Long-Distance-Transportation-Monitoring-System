/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {

		id: {
			type: 'integer',
			primaryKey: true,
			autoIncrement: true
		},

		email: {
		      type: 'string',
		      email: 'true',
		      unique: 'true',
		      required: true
	    },

	   	username: {
		      type: 'string',
		      unique: 'true',
		      required: true
	    },

	    encryptedPassword: {
	      	type: 'string'
	    },

	    company:{
	    		type: 'string'
	    },

	    address:{
	    		type: 'string'
	    },

	    phone:{
	    		type: 'integer'
	    },

		gravatarURL: {
		      	type: 'string'
	    },

	    deleted: {
		      	type: 'boolean',
		      	defaultsTo: false
	    },

	    admin: {
	      		type: 'boolean',
	      		defaultsTo: false
	    },

    	banned: {
	      	type: 'boolean',
	      	default: false
    	},

    	passwordRecoveryToken: {
      		type: 'string',
      		defaultsTo: 'abcdefghijklmnopqrstuvtyz'
    	},

		
   	//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    	
    	services: {
    		collection: 'service',
    		via: 'renter'
    	},


    	
    	toJSON: function() {
	      var obj = this.toObject();
	      delete obj.password;
	      delete obj.encryptedPassword;
	      return obj;
    	}
  	}
};

