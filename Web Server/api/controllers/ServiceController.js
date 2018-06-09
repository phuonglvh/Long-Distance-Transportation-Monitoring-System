/**
 * ServiceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  AddService: function(req, res){
  	console.log( 'debug: enter ServiceController/AddService/' + req.param('devid'));
  	Service.findOne({
      devid: req.param('devid'),
      valid: true,
    }).exec(function (err, existingService){
      if (err) 
      {
        console.log(err);
        return res.negotiate(err);
      }

      if(existingService){
        console.log('Thiết bị này đang được khách hàng sử dụng');
        return res.created("Thiết bị này đang được khách hàng sử dụng!");    
      }
	     User.findOne({email: req.param('RenterEmail')}).exec(function(err, foundUserByRenterEmail){
	   		if(err){
          		return res.negotiate(err);
	   		}
        console.log('foundUserByRenterEmail \n'+foundUserByRenterEmail);

        var ValidService = {};
          ValidService.devid = req.param('devid');
          ValidService.dep_Lat = req.param('dep_Lat');
          ValidService.dep_Long = req.param('dep_Long');
          ValidService.des_Lat = req.param('des_Lat');
          ValidService.des_Long = req.param('des_Long');
          ValidService.note = req.param('note');
  	   		ValidService.renter = foundUserByRenterEmail.id;

        Service.create(ValidService).exec(function(err, createdRecord) {
            if (err) {
              console.log('AddService.create error is: ', err.invalidAttributes);
              return res.negotiate(err);
            }//if
            console.log('AddService.created: \n', JSON.stringify(createdRecord) + '\n');
            return res.json(createdRecord); //json
        }); //Service.create
	   });
    }); //Service.findOne
  }, //AddService

  GetServiceList: function(req, res){
    /*check if logged in*/
    if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }

    User.findOne({id: req.session.userId}, function(err, foundUser) {
      if (err) {
          return res.negotiate(err);
      }//if(err)

      /*session of another user*/
      if (!foundUser) {
        sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang!');
        return res.view('homepage', {   
            me: null
        });
      }//if (!foundUser)
      if(!foundUser.admin){
        Service.find({renter: req.session.userId}).sort({devid: 'ASC'})
        .exec(function(err, foundServices){
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
                    createdAt: foundServices[i].createdAt,
                    updatedAt: foundServices[i].updatedAt,
                    valid: foundServices[i].valid,
                  }); //updatedReturn.push
                }//if
              } //for
            } //for
            return res.json(updatedReturn);
          });/*Device.find*/
        }); //Service.find()
      }
      else if(foundUser.admin){
        Service.find({valid: true}).sort({devid: 'ASC'}).exec(function(err, foundServices){
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
                    renter: foundServices[i].renter,
                    dep_Lat: foundServices[i].dep_Lat,
                    dep_Long: foundServices[i].dep_Long,
                    des_Lat: foundServices[i].des_Lat,
                    des_Long: foundServices[i].des_Long,
                    note: foundServices[i].note,
                    createdAt: foundServices[i].createdAt,
                    updatedAt: foundServices[i].updatedAt,
                    valid: foundServices[i].valid,
                  }); //updatedReturn.push
                }//if
              } //for
            } //for
            return res.json(updatedReturn);
          }); /*Device.find*/
        }); //Service.find()
      }
      

    });//User.findOne

  }, //GetServiceList

  GetServiceDataByID: function(req, res){
     /*check if logged in*/
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
      }//if (!foundUser)

      var criteria={};
      if(!foundUser.admin){
        criteria.renter = req.session.userId;
        // criteria.valid = true;
      }

      Service.findOne(criteria, function(err, foundOne){
        if (err) return res.negotiate(err);
        if (!foundOne) return res.notFound();
        //debug 

        Device.findOne({devid: req.param('DevId')}).exec(function (err, foundOneDevice){
          return res.json(200, {
            id: foundOne.id, 
            devid: foundOneDevice.devid,
            devname: foundOneDevice.devname,
            parameter: foundOneDevice.parameter,
            note: foundOne.note,
            createdAt: foundOne.createdAt,
            updatedAt: foundOne.updatedAt,
            valid: foundOne.valid,
          }); /*return*/
        }); /*Device.findOne*/
      }); /*Service.findOne*/
    });//User.findOne

  }, /*GetServiceDataByID*/

  GetHistoryList: function(req, res){
    console.log( 'debug: enter ServiceController/GetHistoryList\n');

    /*check if logged in*/
    if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }//if

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
      }//if (!foundUser)

      if(!foundUser.admin){
        return res.forbidden("Không được phép truy cập CSDL!");
      }

      Service.find().sort({devid: 'ASC'}).exec(function(err, foundServices){
        if (err) return res.negotiate(err);
        if (foundServices.length === 0) return res.notFound();

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
                  renter: foundServices[i].renter,
                  valid: foundServices[i].valid,
                  createdAt: foundServices[i].createdAt,
                  updatedAt: foundServices[i].updatedAt,
                  dep_Lat: foundServices[i].dep_Lat,
                  dep_Long: foundServices[i].dep_Long,
                  des_Lat: foundServices[i].des_Lat,
                  des_Long: foundServices[i].des_Long,
                  note: foundServices[i].note,
                }); //updatedReturn.push
              }//if
            } //for
          } //for
          console.log(JSON.stringify(updatedReturn) + '\n');
          return res.json(200, updatedReturn);
        }); //Device.find()
      }); //Service.find()
    });//User.findOne
  }, //GetHistoryList

  GetHistoryListByDevID: function(req, res){
    console.log( 'debug: enter ServiceController/GetHistoryListByDevID\n');
    /*check if logged in*/
    if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }//if

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
      }//if (!foundUser)

      if(!foundUser.admin){
        return res.forbidden("Không được phép truy cập CSDL!");
      }

      Service.find({devid: req.param('DevID')}).sort({devid: 'ASC'}).exec(function(err, foundServices){
        if (err) return res.negotiate(err);
        if (foundServices.length === 0) return res.notFound();

        Device.find({devid: req.param('DevID')}).exec(function (err, foundAll){
          var updatedReturn = [];
          for (var i = 0; i < foundServices.length; i++) {
            for (var j = 0; j < foundAll.length; j++) {
              if(foundServices[i].devid == foundAll[j].devid){
                updatedReturn.push({
                  id: foundServices[i].id,
                  devid: foundAll[j].devid,
                  devname: foundAll[j].devname,
                  parameter: foundAll[j].parameter,
                  renter: foundServices[i].renter,
                  valid: foundServices[i].valid,
                  createdAt: foundServices[i].createdAt,
                  updatedAt: foundServices[i].updatedAt,
                  dep_Lat: foundServices[i].dep_Lat,
                  dep_Long: foundServices[i].dep_Long,
                  des_Lat: foundServices[i].des_Lat,
                  des_Long: foundServices[i].des_Long,
                  note: foundServices[i].note,
                }); //updatedReturn.push
              }//if
            } //for
          } //for
          console.log(JSON.stringify(updatedReturn) + '\n');
          return res.json(200, updatedReturn);
        }); //Device.find()

      }); //Service.find()

    });//User.findOne

  }, //GetHistoryList

  GetHistoryListByRenter_Email_ID: function(req, res){
    console.log( 'debug: enter ServiceController/GetHistoryListByRenter_Email_ID\n');
    /*check if logged in*/
    if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }//if

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
      }//if (!foundUser)

      if(!foundUser.admin){
        return res.forbidden("Không được phép truy cập CSDL!");
      }

      /*that is admin*/     
      console.log({Email: req.param('email')}, {id: req.param('id')});
      User.findOne({
        or: [{
          Email: req.param('email')
        },{
            id: req.param('id')
          },{
            username: req.param('username')
          }]
          }).exec(function(err, foundUser){

          if(err){
            console.log(err);
            return res.negotiate(err);
          }

          if(!foundUser){
            console.log('!foundUser');
            return res.notFound();
          }

          console.log(JSON.stringify(foundUser));

          Service.find({renter: foundUser.id}).sort({devid: 'ASC'}).exec(function(err, foundServices){
            if (err) return res.negotiate(err);
            if (foundServices.length === 0) return res.notFound();

            return res.json(foundServices);

          }); //Service.find()

      });
    });//User.findOne

  }, //GetHistoryList

  AdminUpdateValid: function(req, res) {
    console.log('\n .., enter ServiceController/AdminUpdateValid/' + req.param('id'));
      if (!req.session.userId || req.session.userId == 'undefined') {
        return res.view('homepage', {
          me: null
        });
      }

      if(!req.param('id') || req.param('id') == 'undefined'){
        return res.badRequest("Missing Service ID");
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
            /*check if service existing*/
            Service.findOne({id: req.param('id')}, function(err, foundService){
              if(err){
                return res.negotiate(err);
              }
              if(!foundService){
                return res.badRequest("Admin did not refered to any services");
              }
            });

          /*check disable admin itself*/
            Service.update(req.param('id'), {
              valid: req.param('valid')
              }).exec(function(err, update) {
              if (err) return res.negotiate(err);
              console.log({updated: req.param('id')});
              return res.ok();
            });//Service.update
        
        }//else if(foundUser.admin)

      });//User.findOne

  },//updateBanned

};

