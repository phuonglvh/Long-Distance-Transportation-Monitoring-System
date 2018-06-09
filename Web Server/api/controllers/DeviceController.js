/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	adddevice: function(req, res){
	console.log( 'debug:  enter DeviceController/adddevice\n');

		var data = {};
			data.devid = 4;//req.param('devid');
			data.devname = req.param('devname');
			data.parameter = req.param('parameter');
			data.owner = req.session.userId;
			data.dep_Lat = req.param('dep_Lat');
			data.dep_Long = req.param('dep_Long');
			data.des_Lat = req.param('des_Lat');
			data.des_Long = req.param('des_Long');
			data.note = req.param('note');

		// console.log('debug: \n'+ JSON.stringify(data));
		Device.create(data).exec(function(err, createdDevice) {
              if (err) {
                console.log('Device.create error is: ', err.invalidAttributes);

                // Check for duplicate email address
                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {

                  // return res.send(409, 'Email address is already taken by another user, please try again.');
                  return res.alreadyInUse(err);
                }

                // Check for duplicate username
                if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {

                  // return res.send(409, 'Username is already taken by another user, please try again.');
                  return res.alreadyInUse(err);
                }

                return res.negotiate(err);
              }

	              //debug
	              console.log('> Device : '+ createdDevice.devname + ' created\n');
	              var createdDevices = _.map(createdDevice, function(device){
			        device = {
			          devid: device.devid,
			          devname: device.devname,
			        };
			        return device;
			      });

	              console.log('> Devices : \n'+ createdDevices);

	              return res.json({
	                devname: createdDevice.devname
	              });
            });
	},


	GetDevList: function(req, res) {
		console.log( 'debug:  enter DeviceController/GetDevList\n');
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
		      	var criteria={};
		        criteria.renter = req.session.userId;
		        criteria.valid = true;
		     
		      Service.find(criteria).sort({devid: 'ASC'}).exec(function(err, foundServices){
		        if (err) return res.negotiate(err);
		        if (foundServices.length === 0) return res.notFound();
		        //debug 
		
		        Device.find().exec(function (err, foundAll){
		          var updatedReturn = [];
		          for (var i = 0; i < foundServices.length; i++) {
		            for (var j = 0; j < foundAll.length; j++) {
		              if(foundServices[i].devid == foundAll[j].devid){
		                updatedReturn.push({
		                  id: foundServices[i].id, 
		                  devid: foundAll[j].devid,
		                  devname: foundAll[j].devname,
		                  parameter: foundAll[j].parameter,		      
		                  valid: foundServices[i].valid,
		                }); //updatedReturn.push
		              }//if
		            } //for
		          } //for
		          return res.json(updatedReturn);
		        });//Device.find()
		      }); //Service.find()
		   }
	     	else{
		      	Device.find().sort({devid: 'ASC'}).exec(function(err, foundDevs) {
			      if (err) return res.negotiate(err);
			      if (foundDevs.length === 0) return res.notFound();
			      return res.json(foundDevs);
			    }); //Device.find()
		    }//else
	  	});//User.findOne

	},//GetDevList

	GetDevInfoByDevId: function(req, res) {
		console.log('\ndebug:  enter DeviceController/GetDevInfoByDevId/' + req.param('DevID'));

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
	        console.log('Không có quyền truy cập dữ liệu');
	        return res.forbidden("Không có quyền truy cập dữ liệu");
	      }

	      Device.findOne(req.param('DevID')).exec(function(err, foundOne) {
		      if (err) return res.negotiate(err);
		      if (foundOne.length === 0) return res.notFound();
		      console.log('\nGot Dev:  ' + JSON.stringify(foundOne) + ' info\n');
		      return res.json(foundOne);
	    	}); //Device.find()
	  	});//User.findOne

	},//GetDevList

	AddDevice: function(req, res){
		console.log( 'debug:  enter DeviceController/AddDevice\n');
		var DeviceInfo = {};
		DeviceInfo.devid = req.param('devid');
		DeviceInfo.devname = req.param('devname');
		DeviceInfo.parameter = req.param('parameter');
		
	    Device.create(DeviceInfo).exec(function(err, createdDevice) {
          if (err) {
            // Check for duplicate devid
            if (err.invalidAttributes && err.invalidAttributes.devid && err.invalidAttributes.devid[0] && err.invalidAttributes.devid[0].rule === 'unique') {
              return res.alreadyInUse(err);
            }
            // Check for duplicate devname
            if (err.invalidAttributes && err.invalidAttributes.devname && err.invalidAttributes.devname[0] && err.invalidAttributes.username[0].rule === 'unique') {
              return res.alreadyInUse(err);
            }
            return res.negotiate(err);
          }
          console.log('> Device: '+req.param('devid')+ ' added\n');
          return res.json({
            devid: createdDevice.devid
          }); //res.json
        }); //User.create
	},

	RemoveDevice: function(req, res) {
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
	          return res.badRequest("Không có quyền truy cập CSDL");
	        }
	        else if(foundUser.admin){
	        	Device.findOne({devid: req.param('devid')}, function(err, foundOne){
	        		if(err) return res.negotiate(err);
	        		if(!foundOne) res.notFound("Thiết bị không tồn tại!");

		        	Device.destroy({devid: req.param('devid')}, function(err, foundOne){
		        		if(err){
		        			return res.negotiate(err);
		        		}
		        		return res.ok();
		        	});/*Device.destroy*/
		        });/*Device.findOne*/
	        }//else if(foundUser.admin)
	      });//User.findOne
	},/*RemoveDevice*/


};

