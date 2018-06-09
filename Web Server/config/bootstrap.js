/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  const os = require('os');
  var async = require('async');
  var Passwords = require('machinepack-passwords');
  var Gravatar = require('machinepack-gravatar');
  var request = require('request');


  /*FAKE USER*/
  var BOOTSTRAP_USER = [
    {
      id: 1,
      email: 'hoangphuongle1997@gmail.com',
      username: 'hoangphuongle1997',
      password: '123456',
      admin: true,
      company: 'BKU',
      gravatarURL: 'https://www.musictalentindia.com/upload/default.png',
      address: '268 LTK, District 10, HCMC, Vietnam',
      phone: 0981908904
    }, 
    {
      id: 2,
      email: 'phuonglevanhoangbk@gmail.com',
      username: 'phuonglevanhoangbk',
      password: '123456',
      admin: true,
      company: 'BKU',
      gravatarURL: 'https://www.musictalentindia.com/upload/default.png',
      address: '268 LTK, District 10, HCMC, Vietnam',
      phone: 0981908904
    },

    {
      id: 3,
      email: 'anonymous@gmail.com',
      username: 'anonymous',
      password: '123456',
      admin: false,
      company: 'hp company',
      gravatarURL: 'http://1.bp.blogspot.com/-aK4ZmDm6-Ic/VCKCugXazRI/AAAAAAAAAKU/r5o_5-XNXtQ/s1600/Sp.png',
      address: '268 LTK, District 10, HCMC, Vietnam',
      phone: 0981908904
    }
  ];
  async.each(BOOTSTRAP_USER, function findOrCreateEachFakeUser(fakeUser, next){
    User.findOne({
      email: fakeUser.email
      }).exec(function (err, existingUser){
      if (err) return next(err);
      if (existingUser) {
        return next();
      }
      Passwords.encryptPassword({
        password: fakeUser.password,
      }).exec({
        error: function(err) {
          return next(err);
        },
        success: function(encryptedPassword) {
          // Get the gravatar url for the fakeUser
          var gravatarURL;
          try {
            gravatarURL = Gravatar.getImageUrl({
              emailAddress: fakeUser.email
            }).execSync();

          } catch (err) {
            return next(err);
          }

          // Create a new user record with various stuff we just built
          User.create({
            id: fakeUser.id,
            gravatarURL: fakeUser.gravatarURL,
            encryptedPassword: encryptedPassword,
            email: fakeUser.email,
            username: fakeUser.username,
            deleted: false,
            admin: fakeUser.admin,
            banned: false,
            company: fakeUser.company,
            address: fakeUser.address,
            phone: fakeUser.phone
          }).exec(function(err, createdUser) {
            if (err) {
              return next(err);
            }
            return next();
          }); //</User.create()>
        }
      }); //</Passwords.encryptPassword>
    }); // </ User.find
  }, function afterwards(err){
    if (err) {
      return cb(err);
    }

    //BOOTSTRAP DATA_COLLECT
    var BOOTSTRAP_DATA_COLLECT = [
      {
        devid: 1,
        packetid: 1,
        timestamp: new Date().toLocaleString(),
        humid: 50.1,
        temp: 20.1,
        Lat: 10.746994,
        Long: 106.676301,
        locked: true
      }, 
      {
        devid: 1,
        packetid: 2,
        timestamp: new Date().toLocaleString(),
        humid: 50.2,
        temp: 20.2,
        Lat: 10.74634,
        Long: 106.674778,
        locked: true
      }, 
      {
        devid: 1,
        packetid: 3,
        timestamp: new Date().toLocaleString(),
        humid: 50.3,
        temp: 20.3,
        Lat: 10.745644,
        Long: 106.672847,
        locked: true
      }, 
        {
        devid: 1,
        packetid: 4,
        timestamp: new Date().toLocaleString(),
        humid: 50.4,
        temp: 20.4,
        Lat: 10.746524,
        Long: 106.672745,
        locked: true
      },
      {
        devid: 1,
        packetid: 5,
        timestamp: new Date().toLocaleString(),
        humid: 50.5,
        temp: 20.5,
        Lat: 10.746978,
        Long: 106.6726,
        locked: true
      },
       {
        devid: 1,
        packetid: 6,
        timestamp: new Date().toLocaleString(),
        humid: 50.6,
        temp: 20.6,
        Lat: 10.74688,
        Long: 106.672173,
        locked: true
      },
      {
        devid: 1,
        packetid: 7,
        timestamp: new Date().toLocaleString(),
        humid: 50.7,
        temp: 20.7,
        Lat: 10.746785994000412,
        Long: 106.67152209850042,
        locked: true
      },
      {
        devid: 2,
        packetid: 2,
        timestamp: new Date().toLocaleString(),
        humid: 50.2,
        temp: 20.2,
        Lat: 10.746747050756964,
        Long: 106.67136614214246,
        locked: true
      },

      {
        devid: 3,
        packetid: 3,
        timestamp: new Date().toLocaleString(),
        humid: 50.3,
        temp: 20.3,
        Lat: 10.746598973462232,
        Long: 106.67140835562452,
        locked: true
      },

      {
        devid: 4,
        packetid: 4,
        timestamp: new Date().toLocaleString(),
        humid: 50.4,
        temp: 20.4,
        Lat: 10.746332453515235,
        Long: 106.67147875110186,
        locked: true
      },

      {
        devid: 5,
        packetid: 5,
        timestamp: new Date().toLocaleString(),
        humid: 50.5,
        temp: 20.5,
        Lat: 10.746292110418823,
        Long: 106.67128531943808,
        locked: true
      },

      {
        devid: 6,
        packetid: 6,
        timestamp: new Date().toLocaleString(),
        humid: 50.6,
        temp: 20.6,
        Lat: 10.746145351140644,
        Long: 106.67060841559373,
        locked: true
      },

      {
        devid: 7,
        packetid: 7,
        timestamp: new Date().toLocaleString(),
        humid: 50.7,
        temp: 20.7,
        Lat: 10.745164625469632,
        Long: 106.67081813372488,
        locked: true
      },
      {
        devid: 3,
        packetid: 2,
        timestamp: new Date().toLocaleString(),
        humid: 50.7,
        temp: 20.7,
        Lat: 10.745127704561064,
        Long: 106.67044387886824,
        locked: true
      },

      {
        devid: 3,
        packetid: 3,
        timestamp: new Date().toLocaleString(),
        humid: 50.7,
        temp: 20.7,
        Lat: 10.744855903250231,
        Long: 106.66887440667006,
        locked: true
      },

      {
        devid: 10,
        packetid: 1,
        timestamp: new Date().toLocaleString(),
        humid: 51.0,
        temp: 21.0,
        Lat: 10.74624382543962,
        Long: 106.66896170575558,
        locked: true
      },
    ];
    async.each(BOOTSTRAP_DATA_COLLECT, function findOrCreateEachfakeData(fakeData, next){

      Data_collect.findOne({
        devid: fakeData.devid
      }).exec(function (err, existingData){
        if (err) return next(err);
        if (existingData) {
          return next();
        }
      });

      Data_collect.create({
            devid: fakeData.devid,
            packetid: fakeData.packetid,
            timestamp: fakeData.timestamp,
            humid: fakeData.humid,
            temp: fakeData.temp,
            Lat: fakeData.Lat,
            Long: fakeData.Long,
            locked: fakeData.locked,
        }).exec(function(err, createdData) {
            if (err) {
              return next(err);
            }
            return next();
      }); //</Data_collect.create()>
    }); 

    //fake Dev List
    var BOOTSTRAP_DEVICE_LIST = [
      {
        devid: 1,
        devname: 'Fast1',
        parameter: 'C7NDZ51',
      },
      {
        devid: 2,
        devname: 'Fast2',
        parameter: 'C7NDZ52',
      }, 
      {
        devid: 3,
        devname: 'Fast3',
        parameter: 'C7NDZ53',
      }, 
      {
        devid: 4,
        devname: 'Fast4',
        parameter: 'C7NDZ54',
      }, 
      {
        devid: 5,
        devname: 'Fast5',
        parameter: 'C7NDZ55',
      },  
      {
        devid: 6,
        devname: 'Fast6',
        parameter: 'C7NDZ56',
      },
      {
        devid: 7,
        devname: 'Fast7',
        parameter: 'C7NDZ57',
      },
      {
        devid: 8,
        devname: 'Fast8',
        parameter: 'C7NDZ58',
      },
    ];
    async.each(BOOTSTRAP_DEVICE_LIST, function findOrCreateEachfakeData(fakeData, next){
      Device.findOne({
        devid: fakeData.devid
      }).exec(function (err, existingData){
        if (err) return next(err);
        if (existingData) {
          return next();
        }
      });
      Device.create({
            devid: fakeData.devid,
            devname: fakeData.devname,
            parameter: fakeData.parameter,
          }).exec(function(err, createdData) {
            if (err) {
              return next(err);
            }
            return next();
          }); //</Data_collect.create()>
    }); 


    //fake services  
    var BOOTSTRAP_SERVICE_LIST = [
      {
        devid: 1,
        renter: 3,
        dep_Lat: 121.1,
        dep_Long: 121.1,
        des_Lat: 121.1,
        des_Long: 121.1,
      },
      {
        devid: 2,
        renter: 2,
        dep_Lat: 122.2,
        dep_Long: 122.2,
        des_Lat: 122.2,
        des_Long: 122.2,
      },
      {
        devid: 3,
        renter: 3,
        dep_Lat: 123.3,
        dep_Long: 123.3,
        des_Lat: 123.3,
        des_Long: 123.3,
      },
      {
        devid: 4,
        renter: 4,
        dep_Lat: 124.4,
        dep_Long: 124.4,
        des_Lat: 124.4,
        des_Long: 124.4,
      },
      {
        devid: 5,
        renter: 5,
        dep_Lat: 124.5,
        dep_Long: 124.5,
        des_Lat: 124.5,
        des_Long: 124.5,
      },
      {
        devid: 6,
        renter: 6,
        dep_Lat: 124.6,
        dep_Long: 124.6,
        des_Lat: 124.6,
        des_Long: 124.6,
      },
    ];
     async.each(BOOTSTRAP_SERVICE_LIST, function findOrCreateEachfakeData(fakeData, next){
      Device.findOne({
        devid: fakeData.devid
      }).exec(function (err, existingData){
        if (err) return next(err);
        if (existingData) {
          return next();
        }
        Service.create({
          devid: fakeData.devid,
          renter: fakeData.renter,
          dep_Lat: fakeData.dep_Lat,
          dep_Long: fakeData.dep_Long,
          des_Lat: fakeData.des_Lat,
          des_Long: fakeData.des_Long,
        }).exec(function(err, createdData) {
            if (err) {
              return next(err);
            }
            return next();
        });/*Service.create*/
      });
    }); 

    //fake Threshold List
    var BOOTSTRAP_THRESHOLD_LIST = [
      {
        devid: 1,
        renter: 3,
        upperHumid: 91,
        lowerHumid: 71,
        upperTemp: 41,
        lowerTemp: 21,
      },
      {
        devid: 2,
        upperHumid: 92,
        lowerHumid: 72,
        upperTemp: 42,
        lowerTemp: 22,
      },
      {
        devid: 3,
        renter: 3,
        upperHumid: 93,
        lowerHumid: 73,
        upperTemp: 43,
        lowerTemp: 23,
      },
      {
        devid: 4,
        renter: 2,
        upperHumid: 94,
        lowerHumid: 74,
        upperTemp: 44,
        lowerTemp: 24,
      },
      {
        devid: 5,
        renter: 1,
        upperHumid: 95,
        lowerHumid: 75,
        upperTemp: 45,
        lowerTemp: 25,
      },
      {
        devid: 6,
        renter: 6,
        upperHumid: 96,
        lowerHumid: 76,
        upperTemp: 46,
        lowerTemp: 26,
      },
      {
        devid: 7,
        renter: 5,
        upperHumid: 97,
        lowerHumid: 77,
        upperTemp: 47,
        lowerTemp: 27,
      },
      {
        devid: 8,
        renter: 6,
        upperHumid: 98,
        lowerHumid: 78,
        upperTemp: 48,
        lowerTemp: 28,
      },
    ];/*BOOTSTRAP_THRESHOLD_LIST*/

    async.each(BOOTSTRAP_THRESHOLD_LIST, function findOrCreateEachfakeData(fakeData, next){
      Threshold.findOne({
        devid: fakeData.devid
      }).exec(function (err, existingData){
        if (err) return next(err);
        if (existingData) {
          return next();
        }
      });/*Threshold.findOne*/
      Threshold.create({
            devid: fakeData.devid,
            // renter: fakeData.renter,
            upperHumid: fakeData.upperHumid,
            lowerHumid: fakeData.lowerHumid,
            upperTemp: fakeData.upperTemp,
            lowerTemp: fakeData.lowerTemp,
          }).exec(function(err, createdData) {
            if (err) {
              return next(err);
            }
            return next();
          }); //</Threshold.create()>
    });/*async.each*/

    ///Finally
    console.log('------------------------------------------------------------------\nServer powered by: ' + os.platform() + ' ' +os.release() + ' ' + os.arch() + '\n');
    console.log('------------------------------------------------------------------\nServer hardware info: \n\n'  + JSON.stringify(os.cpus())+ '\n');
    console.log('------------------------------------------------------------------\nUser info: \n' + JSON.stringify(os.userInfo('username')));
   
   //GET Public IP address
   request('https://api.ipify.org', function (error, response, body) {
      if(error) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      }

      console.log('Server IP:', body); // Print the HTML for the Google homepage.
      console.log('------------------------------------------------------------------\nGet access to homepage: http://' + body + ':'+ 8000)
      console.log('\n------------------------------------------------------------------\n')
    });
    return cb();
   });

};
