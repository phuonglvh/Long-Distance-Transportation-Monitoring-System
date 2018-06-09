/**
 * WarningController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	GetWarningList: function(req, res){
		console.log('... entered WarningController/GetWarningList');
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

	      	Warning.find().sort({devid: 'ASC'}).exec(function(err, founds){
		  		if(err) return res.negotitate(err);
		  		if(founds.length == 0) return res.json(204, {});

		  		 /*copy to allWarning*/
		        var allWarning = [];
		        Service.find({
		          where: {renter: req.session.userId},
		          select: ['devid'],
		        }).sort({devid : 'ASC'}).exec(function(err, foundDevbyRenter){
		          for (var i = 0; i < foundDevbyRenter.length; i++) {
		            for (var j = 0; j < founds.length; j++) {
		              if(founds[j].devid == foundDevbyRenter[i].devid){
		                allWarning.push(founds[j]);
		              }//if
		            }//for
		          }//for
		          return res.json(allWarning);
		        }); /*Service.find*/
	  		});/*Warning.find*/
	    }); /*Service.findOne*/
  	}, /*GetWarningList*/

};

