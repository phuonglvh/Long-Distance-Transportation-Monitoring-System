/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Emailaddresses = require('machinepack-emailaddresses');
var Passwords = require('machinepack-passwords');
var Gravatar = require('machinepack-gravatar');
var uniqid = require('uniqid');


module.exports = {

  /*L O G I N - ACTION*/
	login: function(req, res) {
    console.log('debug: enter user/login action! \n');
    for(var key in req.body) {
      if(req.body.hasOwnProperty(key)){
        var array = req.param(key).split(",");
      console.log('debug: login debug:' + key);
      }
    }
    User.findOne({
        or: [{
           email: req.param('email')
          },{
            username: req.param('username')
        }]
    }, function foundUser(err, createdUser) {
      if (err) return res.negotiate(err);
      if (!createdUser) return res.notFound();

      Passwords.checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: createdUser.encryptedPassword
      }).exec({

        error: function(err) {
          return res.negotiate(err);
        },

        incorrect: function() {
          return res.notFound();
        },

        success: function() {

          if (createdUser.deleted) {
            return res.forbidden("'Your our account has been deleted.'");
          }

          if (createdUser.banned) {
            return res.forbidden("'Your our account has been banned!'");
          }
          // Store session in agency's browser
          req.session.userId = createdUser.id;

          console.log('User: '+req.param('email') + ' ' + createdUser.id +' logged in\n');
          return res.ok();

        }
      });
    });
  },	//login

  /*L O G O U T*/
  logout: function(req, res) {

    User.findOne(req.session.userId, function foundUser(err, foundUser) {
      if (err) return res.negotiate(err);
      if (!foundUser) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.redirect('/');
      }
      req.session.userId = null;
      console.log('UserController.logout: 73: ' + foundUser.username);
      return res.ok();
    });
  },


  /*S I G N U P - ACTION*/
  signup: function(req, res) {
    console.log('debug: enter signup action\n');
    if (_.isUndefined(req.param('email'))) {
      return res.badRequest('An email address is required!');
    }

    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required!');
    }

    if (req.param('password').length < 6) {
      return res.badRequest('Password must be at least 6 characters!');
    }

    if (_.isUndefined(req.param('username'))) {
      return res.badRequest('A username is required!');
    }
    var splitUsername = req.param('username').split(' ').join('-');

    Emailaddresses.validate({
      string: req.param('email'),
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.serverError(err);
      },
      // The provided string is not an email address.
      invalid: function() {
        return res.badRequest('Doesn\'t look like an email address to me!');
      },
      // OK.
      success: function() {
        Passwords.encryptPassword({
          password: req.param('password'),
        }).exec({

          error: function(err) {
            return res.serverError(err);
          },

          success: function(result) {

            var options = {};

            try {
              options.gravatarURL = Gravatar.getImageUrl({
                emailAddress: req.param('email')
              }).execSync();

            } catch (err) {
              return res.serverError(err);
            }
            options.email = req.param('email');
            options.username = splitUsername;
            options.encryptedPassword = result;
            options.address=req.param('address');
            options.company=req.param('company');
            options.phone=req.param('phone');
            options.deleted = false;
            options.admin = false;
            options.banned = true;

            User.create(options).exec(function(err, createdUser) {
              if (err) {
                console.log('User.create error is: ', err.invalidAttributes);
                // Check for duplicate email address
                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                  // return res.send(409, 'Email address is already taken by another user, please try again.');
                  return res.alreadyInUse(err);
                }

                // Check for duplicate username
                if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {

                  return res.alreadyInUse(err);
                }
                return res.negotiate(err);
              }
              // Log the user in
              req.session.userId = createdUser.id;
              console.log('User: '+req.param('username')+ ' signed up\n');
              return res.json({
                username: createdUser.username
              });
            }); //User.create(
          }
        });
      }
    });
  },//signup action


  /*A D M I N - U S E R S*/
  adminUsers: function(req, res) {
    console.log('debug: UserController/adminUsers\n');
    User.find().exec(function(err, users) {
      if (err) return res.negotiate(err);
      if (users.length === 0) return res.notFound();
      var updatedUsers = _.map(users, function(user){
        user = {
          id: user.id,
          username: user.username,
          admin: user.admin,
          banned: user.banned,
          deleted: user.deleted,
        };
        return user;
      });
      return res.json(updatedUsers);
    });
  },

/*CHANGE ADMIN STATE*/
  updateAdmin: function(req, res) {
   if (!req.session.userId || req.session.userId == 'undefined') {
        return res.view('homepage', {
          me: null
        });
      }
      User.findOne(req.session.userId, function(err, foundUser) {
        if (err) {
            return res.negotiate(err);
        }//if(err)

        /*session of another user*/
        if (!foundUser) {
          sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
          return res.view('homepage', {   
              me: null
          });
        }//if
        if(!foundUser.admin){
          console.log('not admin');
          return res.badRequest("Không được phép truy cập CSDL!");
        }
        else if(foundUser.admin){
          /*check disable admin itself*/
          if(req.param('id') != foundUser.id)
          {
            User.update(req.param('id'), {
              admin: req.param('admin')
              }).exec(function(err, update) {
              if (err) return res.negotiate(err);
              return res.ok();
            });//User.update
          }//if(req.param('id') != foundUser.id)
          else
          {
            console.log('admin cannot disable himself\n');
            return res.badRequest("Admin root can not disable yourself");
          }//else if(req.param('id') != foundUser.id)
        }//else if(foundUser.admin)
      });//User.findOne
  },


/*CHANGE BANNED STATE*/
  updateBanned: function(req, res) {
      if (!req.session.userId || req.session.userId == 'undefined') {
        return res.view('homepage', {
          me: null
        });
      }

      User.findOne(req.session.userId, function(err, foundUser) {
        if (err) {
            return res.negotiate(err);
        }//if(err)

        /*session of another user*/
        if (!foundUser) {
          sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
          return res.view('homepage', {   
              me: null
          });
        }//if
        if(!foundUser.admin){
          return res.badRequest("Không được phép truy cập CSDL!");
        }
        else if(foundUser.admin){
          /*check disable admin itself*/
          if(req.param('id') != foundUser.id)
          {
            User.update(req.param('id'), {
              banned: req.param('banned')
              }).exec(function(err, update) {
              if (err) return res.negotiate(err);
              return res.ok();
            });//User.update
          }//if(req.param('id') != foundUser.id)
          else
          {
            console.log('admin cannot disable himself\n');
            return res.badRequest("Admin root can not ban yourself");
          }//else if(req.param('id') != foundUser.id)
        }//else if(foundUser.admin)
      });//User.findOne
  },

/*CHANGE DELETED STATE*/
  updateDeleted: function(req, res) {
    if (!req.session.userId || req.session.userId == 'undefined') {
        return res.view('homepage', {
          me: null
        });
      }

      User.findOne(req.session.userId, function(err, foundUser) {
        if (err) {
            return res.negotiate(err);
        }//if(err)
        /*session of another user*/
        if (!foundUser) {
          sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
          return res.view('homepage', {   
              me: null
          });
        }//if
        if(!foundUser.admin){
          console.log('not admin');
          return res.badRequest("Không được phép truy cập CSDL!");
        }
        else if(foundUser.admin){
          /*check disable admin itself*/
          if(req.param('id') != foundUser.id)
          {
            User.update(req.param('id'), {
              deleted: req.param('deleted')
              }).exec(function(err, update) {
              if (err) return res.negotiate(err);
              return res.ok();
            });//User.update
          }//if(req.param('id') != foundUser.id)
          else
          {
            console.log('admin cannot disable himself\n');
            return res.badRequest("Admin root can not delete yourself");
          }//else if(req.param('id') != foundUser.id)
        }//else if(foundUser.admin)
      });//User.findOne
  },

/*CHANGE PASSWORD*/
  changePassword: function(req, res) {
    if (_.isUndefined(req.param('password'))) {
      return res.badRequest('A password is required!');
    }
    if (req.param('password').length < 6) {
      return res.badRequest('Password must be at least 6 characters!');
    }
    Passwords.encryptPassword({
      password: req.param('password'),
    }).exec({
      error: function(err) {
        return res.serverError(err);
      },
      success: function(result) {

        User.update({
          id: req.session.userId
        }, {
          encryptedPassword: result
        }).exec(function(err, updatedUser) {
          if (err) {
            return res.negotiate(err);
          }
         console.log('changePassword ' + req.session.userId + ' : '+ result);
          return res.json({
            username: updatedUser[0].username});
        });
      }
    });
  },

/*UPDATE GRAVATAR URL*/
  updateGravatarUrl: function(req, res) {

    User.update({
      id: req.session.userId
    }, {
      gravatarURL: req.param('gravatarURL')
    }, function(err, updatedUser) {

      if (err) return res.negotiate(err);
      console.log('debug: updateGravatarUrl ' + req.session.userId + ' : '+ req.param('gravatarURL'));
      return res.json({
        username: updatedUser[0].username
      });

    });
  },

  /*REMOVE PROFILE*/
  removeProfile: function(req, res) {
    User.update({
      id: req.session.userId
    }, {
      deleted: true
    }, function(err, removedUser) {

      if (err) return res.negotiate(err);
      if (removedUser.length === 0) {
        return res.notFound();
      }
      console.log('debug: removeProfile ' + req.session.userId );
      req.session.userId = null;
      return res.ok();
    });
  },
};

