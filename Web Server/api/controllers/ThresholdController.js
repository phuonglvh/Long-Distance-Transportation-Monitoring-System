/**
 * ThresholdController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var async = require('async');

module.exports = {
    GetThresholdList: function(req, res){
   console.log('... entered ThresholdController/GetThresholdList/' + req.session.userId);

   if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }

    Service.findOne({renter: req.session.userId}, function(err, foundRenter) {
      if (err) {
          return res.negotiate(err);
      }//if(err)

      /*session of another user*/
      if (!foundRenter) {
        sails.log.verbose('Không phải phiên làm việc của bạn, vui lòng tải lại trang');
        return res.view('homepage', {   
            me: null
        });
      }//if


      Threshold.find({
          select: ['devid', 'upperTemp', 'lowerTemp', 'upperHumid', 'lowerHumid'],
        }).exec(function(err, founds){
        // console.log('ThresholList of renter' + req.session.userId +' : \n' + JSON.stringify(founds));
        
        /*copy to allThreshold*/
        var allThreshold = [];
        Service.find({
          where: {renter: req.session.userId},
          select: ['devid'],
        }).sort({'devid' : 'ASC'}).exec(function(err, foundDevbyRenter){
          for (var i = 0; i < foundDevbyRenter.length; i++) {
            for (var j = 0; j < founds.length; j++) {
              if(founds[j].devid == foundDevbyRenter[i].devid){
                allThreshold.push(founds[j]);
              }
            }//for
          }//for
          return res.json(allThreshold);
        }); /*Service.find*/
      }); /*Threshold.find*/
    }); /*Service.findOne*/  
  }, /*GetThresholdList*/

  UpdateThreshold: function(req, res){
	console.log('... entered ThresholdController/UpdateThreshold/' + req.param('devid'));
	console.log({
  			devid: req.param('devid'),
  			upperTemp: req.param('upperTemp'),
  			lowerTemp: req.param('lowerTemp'),
  			upperHumid: req.param('upperHumid'),
  			lowerHumid: req.param('lowerHumid'),
  	});

    if (!req.session.userId || req.session.userId == 'undefined') {
      return res.view('homepage', {
        me: null
      });
    }

    Service.findOne({renter: req.session.userId}, function(err, foundRenter) {
      if (err) {
          return res.negotiate(err);
      }//if(err)

      /*session of another user*/
      if (!foundRenter) {
        sails.log.verbose('Không phải phiên làm việc của bạn, vui lòng tải lại trang');
        return res.view('homepage', {   
            me: null
        });
      }//if

      Threshold.findOne({devid: req.param('devid')}, function(err, foundOne){
          if(err) return res.negotitate(err);
          if(!foundOne) {
            console.log("ThresholdController/UpdateThreshold/" + req.param('devid') + 'not successfully!');
            return res.notFound();
        }
          Threshold.update({devid: req.param('devid')}, {
            upperTemp: req.param('upperTemp'),
            lowerTemp: req.param('lowerTemp'),
            upperHumid: req.param('upperHumid'),
            lowerHumid: req.param('lowerHumid'),
          }, function(err, updatedOne){
            if(err) return res.negotitate(err);
            console.log(updatedOne);
            return res.ok();
          }); /*Threshold.update*/
      }); /*Threshold.findOne*/

    }); /*Service.findOne*/

  },/*Threshold*/

  RemoveThreshold: function(req, res){
		console.log('... entered ThresholdController/RemoveThreshold/' + req.param('devid'));

      if (!req.session.userId || req.session.userId == 'undefined') {
        return res.view('homepage', {
          me: null
        });
      }

      Service.findOne({renter: req.session.userId}, function(err, foundRenter) {
        if (err) {
            return res.negotiate(err);
        }//if(err)

        /*session of another user*/
        if (!foundRenter) {
          sails.log.verbose('Không phải phiên làm việc của bạn, vui lòng tải lại trang');
          return res.view('homepage', {   
              me: null
          });
        }//if

        Threshold.findOne({devid: req.param('devid'), renter: req.session.userId}, function(err, foundOne){

          if(err) return res.negotitate(err);
          if(!foundOne) {
            console.log("ThresholdController/RemoveThreshold/" + req.param('devid') + 'not successfully!');
            return res.notFound();
          }//badRequest("Thiết bị được yêu cầu xóa ngưỡng không tồn tại");

          Threshold.update({devid: req.param('devid')}, {
            upperTemp: 0,
            lowerTemp: 0,
            upperHumid: 0,
            lowerHumid: 0,
          }, function(err, updatedOne){
            if(err) return res.negotitate(err);
            console.log('Removed Threshold of devid: '+  req.param('devid'));
            return res.ok();
          }); /*Threshold.update*/

        }); /*Threshold.findOne*/

      });/*Service.findOne*/
  },/*RemoveThreshold*/

};

