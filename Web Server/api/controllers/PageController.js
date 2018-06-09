/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	showHomePage: function (req, res) {
    	console.log('debug: enter PageController.showHomePage action! \n');
		if (!req.session.userId || req.session.userId == 'undefined') {
        	return res.view('homepage', {
        		me: null
      		});
    	}
	    User.findOne(req.session.userId, function(err, foundUser) {
	     	if (err) {
	        	return res.negotiate(err);
	      	}
	      	/*session of another user*/
	      	if (!foundUser) {
	        	sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
	        	return res.view('homepage', {   
	          		me: null
	        	});
	      	}
	      	/*exact user*/
	      	console.log('debug showHomePage: user session: ' + foundUser.username + ' ' + foundUser.id +'\n');
     	 	if(foundUser.admin){
     	 		return res.view('AdminDashboard', {
			        me: {
			        		id: foundUser.id,
				          	username: foundUser.username,
				          	gravatarURL: foundUser.gravatarURL,
				          	admin: foundUser.admin
			        },
      			});//return
     	 	}
     	 	else{
     	 		return res.view('UserDashboard', {
			        me: {
			        		id: foundUser.id,
				          	username: foundUser.username,
				          	gravatarURL: foundUser.gravatarURL,
				          	admin: foundUser.admin
			        },
      			});//return
     	 	}//if admin
    	}); //User.findOne
	},

	showSignupPage: function (req, res) {
		//debug
    	console.log('debug: enter PageController.showSignupPage action! \n');
		return res.view('signup');
	},

	showForgotPasswordPage: function (req, res) {
		//debug	
    	console.log('debug: enter PageController.showForgotPasswordPage action! \n');
		return res.view('forgotPassword');
	},

	/*D A S H B O A R D*/
	showDashboardPage: function (req, res) {
    	console.log('debug: enter PageController.showDashboardPage action! \n');

		if (!req.session.userId || req.session.userId == 'undefined') {
      		return res.redirect('/');
    	}

	    User.findOne(req.session.userId, function(err, foundUser) {
	     	if (err) {
	        	return res.negotiate(err);
	      	}

	      	/*session of another user*/
	      	if (!foundUser) {
	        	sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
	        	return res.view('homepage', {   
	          		me: null
	        	});
	      	}
	      	console.log('debug showDashboardPage: \n user session: ' + foundUser.username + ' ' + foundUser.id +'\n');
     	 	if(foundUser.admin){
     	 		return res.view('AdminDashboard', {
			        me: {
			        		id: foundUser.id,
				          	username: foundUser.username,
				          	gravatarURL: foundUser.gravatarURL,
				          	admin: foundUser.admin
			        },
      			});//return
     	 	}
     	 	else{
     	 		return res.view('UserDashboard', {
			        me: {
			        		id: foundUser.id,
				          	username: foundUser.username,
				          	gravatarURL: foundUser.gravatarURL,
				          	admin: foundUser.admin
			        },/*me*/
      			});//return
     	 	}//if admin
    	});
	},	


 	/*P R O F I L E*/
 	showProfilePage: function (req, res) {
 		//debug
    	console.log('debug: enter PageController.showProfilePage action! \n');

 		if (!req.session.userId || req.session.userId == 'undefined') {
      		return res.redirect('/');
    	}

	    User.findOne(req.session.userId, function(err, foundUser) {
	     	if (err) {
	        	return res.negotiate(err);
	      	}

	      	/*session of another user*/
	      	if (!foundUser) {
	        	sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
	        	return res.view('homepage', {   
	          		me: null
	        	});
	      	}
	      	console.log('debug PageController.showProfilePage of session: ' + foundUser.username + ' ' + foundUser.id +'\n');
     	 	return res.view('profile', {
		        me: {
		        		id: foundUser.id,
		        		email: foundUser.email,
			          	username: foundUser.username,
			          	gravatarURL: foundUser.gravatarURL,
			          	admin: foundUser.admin
		        },
      		});
    	});
 	},

 	showMapPage: function (req, res) {
		//debug
    	console.log('debug: enter PageController.showMapPage action! \n');
		if (!req.session.userId || req.session.userId == 'undefined') {
      		return res.redirect('/');
    	}

	    User.findOne(req.session.userId, function(err, foundUser) {
	     	if (err) {
	        	return res.negotiate(err);
	      	}

	      	/*session of another user*/
	      	if (!foundUser) {
	        	sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
	        	return res.view('homepage', {   
	          		me: null
	        	});
	      	}

	      	if(foundUser.admin){
	      		return res.forbidden("QTV không được truy cập!");
	      	}
	      	console.log('debug showMapPage: ' + foundUser.username + ' - ' + foundUser.id +'\n');
     	 	return res.view('tabview/user/map', {
		        me: {
		        		id: foundUser.id,
		        		email: foundUser.email,
			          	username: foundUser.username,
			          	gravatarURL: foundUser.gravatarURL,
			          	admin: foundUser.admin
		        },
      		});
    	});
	},
};

