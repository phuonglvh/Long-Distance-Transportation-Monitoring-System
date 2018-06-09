/**
 * Data_collectController
 *
 * @description :: Server-side logic for managing data_collects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var isFloat = require('is-float');
var isInt = require('is-int');
var parseDecimalNumber = require('parse-decimal-number');
var async = require('async');


module.exports = {
  GetDevDataByID: function(req, res){
    console.log('debug: entered GetDevDataByID\n');
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
        sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang?');
        return res.view('homepage', {   
            me: null
        });
      }//if

      if(foundUser.admin){
        console.log('QTV không được truy cập\n');
        return res.forbidden("QTV không được truy cập");
      }
      Service.findOne({devid: req.param('DevId')}).populate('renter').exec(function(err, foundServiceRenter){
        if(err){
          return negotiate(err);
        }
        console.log(foundServiceRenter);
        /*not found Device or not found renter*/
        if(!foundServiceRenter || !foundServiceRenter.renter || foundServiceRenter.renter.id == 'undefined'){
          return res.notFound();
        }
        /* session refer to another one is not allowed */
        if(foundServiceRenter.renter.id != req.session.userId){
          return res.forbidden("Không được phép truy cập CSDL!");
        }
        Data_collect.find({devid: req.param('DevId')}).sort({packetid: 'ASC'}).exec(function(err, foundDevById) {

          if (err) return res.negotiate(err);
          if (foundDevById.length === 0) return res.notFound();
          //debug 
          console.log('\n Got Dev: ' + foundDevById + ' data\n');
          return res.json(foundDevById);
        });//Data_collect.find
      });
    });//User.findOne
  },//GetDevDataByID

  PostDevDataByID: function(req, res){
    //debug
    console.log('debug: entered PostDevDataByID/' + req.param('devid'));
    console.log({
      devid: req.param('devid'),
      start: req.param('start'),
      end: req.param('end'),
    });
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
        sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang?');
        return res.view('homepage', {   
            me: null
        });
      }//if

      if(foundUser.admin){
        console.log('QTV không được truy cập\n');
        return res.forbidden("QTV không được truy cập");
      }

      Service.findOne({devid: req.param('devid')}).populate('renter').exec(function(err, foundServiceRenter){
        if(err){
          return negotiate(err);
        }
        // console.log(foundServiceRenter);
        /*not found Device or not found renter*/
        if(!foundServiceRenter || !foundServiceRenter.renter || foundServiceRenter.renter.id == 'undefined'){
          return res.notFound();
        }
        /* session refer to another one is not allowed */
        if(foundServiceRenter.renter.id != req.session.userId){
          return res.forbidden("Không được phép truy cập CSDL!");
        }

        Data_collect.find({
          where: {
            devid: req.param('devid'),
            timestamp: { 
              '>=': new Date(req.param('start')).toLocaleString(),
              '<=': new Date(req.param('end')).toLocaleString(),
            },
          }
        }).sort({packetid: 'ASC'}).exec(function(err, foundDevById) {

          if (err) return res.negotiate(err);
          if (foundDevById.length === 0) return res.notFound();
          //debug 
          console.log('\n' + foundDevById + '\n');
          return res.json(foundDevById);
        });//Data_collect.find

      });

    });//User.findOne
  },//GetDevDataByID

  Get_x_LastestRecord_ByDevId: function(req, res){
    //debug
    console.log('\n... entered Data_collectController/Get_x_LastestRecord_ByDevId/'+ req.param('devid') + ' : ' + req.param('LastPacketid'));
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
        sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang?');
        return res.view('homepage', {   
            me: null
        });
      }//if
      if(foundUser.admin){
        console.log('QTV không được truy cập\n');
        return res.forbidden("QTV không được truy cập");
      }
      Service.findOne({devid: req.param('devid')}).populate('renter').exec(function(err, foundServiceRenter){
        if(err){
          return negotiate(err);
        }
        console.log(foundServiceRenter);
        /*not found Device or not found renter*/
        if(!foundServiceRenter || !foundServiceRenter.renter || foundServiceRenter.renter.id == 'undefined'){
          return res.notFound();
        }
        /* session refer to another one is not allowed */
        if(foundServiceRenter.renter.id != req.session.userId){
          return res.forbidden("Không được phép truy cập CSDL!");
        }

        Data_collect.find({devid: req.param('devid'), packetid: {'>': req.param('LastPacketid')} }).exec(function(err, foundDataBydevid) {

          if (err) return res.negotiate(err);
          if (foundDataBydevid.length === 0) return res.notFound();

          //debug 
          console.log('\n' + JSON.stringify(foundDataBydevid) + '\n');
          return res.json(foundDataBydevid);
        });//Data_collect.find
      });
    });//User.findOne
  },

  collectData: function(req, res){ //POST
    console.log("... entered Data_collectController.collectData\n");
    console.log('Received data: \n');
    console.log({
            devid : req.param('devid'),
            packetid : req.param('packetid'),
            humid : req.param('curr_Humid'),
            temp : req.param('curr_Temp'),
            Lat : req.param('curr_Lat'),
            Long : req.param('curr_Long'),
            locked : req.param('locked'),
            timestamp : new Date(req.param('timestamp')).toLocaleString(),
    });
    /*Check if valid service containing this device*/
    Service.findOne({devid: req.param('devid')}, function(err, foundOne){
      if(err) return res.negotiate(err);
      if(!foundOne) return res.badRequest('Device not valid!');
       Data_collect.findOne({
          devid: req.param('devid'),
          packetid: req.param('packetid'),
        }).exec(function (err, existingPacketId){
          if (err) 
          {
            console.log(err);
            return res.negotiate(err);
          }
          if (existingPacketId) 
          {
            console.log('\n FAILS: Packet: ' + req.param('packetid') + ' already saved!\n')
            return res.created("Record already saved!");    
          }

          var validData = {};
            validData.devid = req.param('devid');
            validData.packetid = req.param('packetid');
            validData.humid = req.param('curr_Humid');
            validData.temp = req.param('curr_Temp');
            validData.Lat = req.param('curr_Lat');
            validData.Long = req.param('curr_Long');
            validData.locked = req.param('locked');
            validData.timestamp = new Date(req.param('timestamp')).toLocaleString();

            Threshold.findOne({devid: validData.devid},  function(err, foundOne){
              if(!foundOne){}
              if( !((foundOne.upperHumid == 0.0) && (foundOne.lowerHumid == 0.0)) ){
                if(validData.humid > foundOne.upperHumid){
                  Warning.create({
                    devid: validData.devid,
                    packetid: validData.packetid,
                    timestamp: validData.timestamp,
                    message: 'Vượt quá ngưỡng độ ẩm lớn nhất',
                  }, function(err, createdRecord){
                    console.log({WARNING : createdRecord.message});
                    if(err) return res.negotiate(err);
                  });
                }

                if(validData.humid < foundOne.lowerHumid){
                  Warning.create({
                    devid: validData.devid,
                    packetid: validData.packetid,
                    timestamp: validData.timestamp,
                    message: 'Vượt quá ngưỡng độ ẩm thấp nhất',
                  }, function(err, createdRecord){
                    console.log({WARNING : createdRecord.message});

                    if(err) return res.negotiate(err);
                  });
                }
              }//if
              if( !((foundOne.upperTemp == 0.0) && (foundOne.lowerTemp == 0.0)) ) {
                if(validData.temp > foundOne.upperTemp){ //
                  Warning.create({
                    devid: validData.devid,
                    packetid: validData.packetid,
                    timestamp: validData.timestamp,
                    message: 'Vượt quá ngưỡng nhiệt độ lớn nhất',
                  }, function(err, createdRecord){
                    console.log({WARNING : createdRecord.message});
                    if(err) return res.negotiate(err);
                  });
                }

                if(validData.temp < foundOne.lowerTemp){ //
                  Warning.create({
                    devid: validData.devid,
                    packetid: validData.packetid,
                    timestamp: validData.timestamp,
                    message: 'Vượt quá ngưỡng nhiệt độ thấp nhất',
                  }, function(err, createdRecord){
                    console.log({WARNING : createdRecord.message});
                    if(err) return res.negotiate(err);
                  });
                }//if

                if(validData.locked != true){ //
                  Warning.create({
                    devid: validData.devid,
                    packetid: validData.packetid,
                    timestamp: validData.timestamp,
                    message: 'Cửa đang mở!',
                  }, function(err, createdRecord){
                    console.log({WARNING : createdRecord.message});
                    if(err) return res.negotiate(err);
                  });
                }//if
              }//if

              Data_collect.create(validData).exec(function(err, createdRecord) {
                if (err) {
                  console.log('Data_collect.create error is: ', err.invalidAttributes);
                  return res.negotiate(err);
                }//if
                console.log('\n SUCCESS: Packet: ' + createdRecord.packetid + ' saved!\n')
                return res.json(200,{okId: validData.packetid});
              }); //Data_collect.create
            }); /*Threshold.findOne*/
      }); //Data_collect.findOne
    }); /*Device.findOne*/

  }, //collectData

  GetMapDataByID: function(req, res) {
    console.log('enter Data_collectController/GetMapData: ' + req.param('DevId'));

    /*Check if user logged in*/
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
        sails.log.verbose('Phiên làm việc không tồn tại, vui lòng tải lại trang?');
        return res.view('homepage', {   
            me: null
        });
      }

      Service.findOne({devid: req.param('DevId')}).populate('renter').exec(function(err, foundServiceRenter){
        if(err){
          return negotiate(err);
        }
        console.log(foundServiceRenter);
        /*not found Device or not found renter*/
        if(!foundServiceRenter || !foundServiceRenter.renter || foundServiceRenter.renter.id == 'undefined'){
          return res.notFound();
        }
        /* session refer to another one is not allowed */
        if(foundServiceRenter.renter.id != req.session.userId){
          return res.forbidden("Không được phép truy cập CSDL!");
        }

        /*exact user and device*/
        Data_collect.find({devid: req.param('DevId')}).sort({packetid: 'ASC'}).exec(function(err, foundMapDataByID) {
          if (err) return res.negotiate(err);
          if (foundMapDataByID.length === 0) return res.notFound();
          for (var i = 0; i < foundMapDataByID.length; i++) {
            console.log(foundMapDataByID[i].Lat + ' ' +  foundMapDataByID[i].Long);
          }
          return res.json(200, foundMapDataByID);
        }); //data_collect.find()
      }); //Service.findOne    
    }); //User.findOne
  },//GetMapData

};


