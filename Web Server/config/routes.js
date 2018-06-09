/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  /////////////////////////////////////////////////////////////////
  // PAGE
  /////////////////////////////////////////////////////////////////
  /*PAGE CONTROLLER*/
  'GET /': 'PageController.showHomePage',
  'GET /dashboard': 'PageController.showDashboardPage',
  'GET /signup': 'PageController.showSignupPage',
  'GET /forgotPassword': 'PageController.showForgotPasswordPage',
  'GET /tabview/user/map': 'PageController.showMapPage',


  /////////////////////////////////////////////////////////////////
  // USER
  /////////////////////////////////////////////////////////////////
  /*USER CONTROLLER*/
  'PUT /user/login' : 'UserController.login',
  'GET /user/admin' : 'UserController.adminUsers',
  'PUT /user/update-admin/:id' : 'UserController.updateAdmin',
  'PUT /user/update-banned/:id' : 'UserController.updateBanned',
  'PUT /user/update-deleted/:id' : 'UserController.updateDeleted',
  'PUT /user/change-password' : 'UserController.changePassword',
  'PUT /user/update-gravatarUrl' : 'UserController.updateGravatarUrl',
  'PUT /user/remove-profile' : 'UserController.removeProfile',
  'POST /user/signup' : 'UserController.signup',

  /*IN DASHBOARD*/
  'POST /logout': 'UserController.logout',
  'GET /:username': 'PageController.showProfilePage',
  'GET /profile/:username' : {
    controller: 'PageController',
    action: 'showProfilePage',
    skipAssets: true 
  },


  /* TEST ADD DEVICE*/
  'POST /device/adddevice' : 'DeviceController.adddevice',

  /////////////////////////////////////////////////////////////////
  //DATA_COLLECT
  /////////////////////////////////////////////////////////////////
  /* MC60 */
  'POST /data_collect/collectData' : 'Data_collectController.collectData',
  
  /* MAP TAB */
  'GET /data_collect/GetDevDataByID/:DevId': 'Data_collectController.GetDevDataByID',
  'POST /data_collect/PostMapDataByID': 'Data_collectController.PostDevDataByID',

  /* MAP TAB */
  'GET /data_collect/GetMapDataByID/:DevId': 'Data_collectController.GetMapDataByID',

  /*CHART TAB*/
  'POST /data_collect/PostDevDataByID': 'Data_collectController.PostDevDataByID',


  /////////////////////////////////////////////////////////////////
  //DEVICE
  /////////////////////////////////////////////////////////////////
  /* TABLE TAB */
  'GET /device/GetDevList' : 'DeviceController.GetDevList',
  'POST /device/AddDevice' : 'DeviceController.AddDevice',
  'GET /device/GetDevInfoByDevId/:DevID' : 'DeviceController.GetDevInfoByDevId',
  'PUT /device/RemoveDevice' : 'DeviceController.RemoveDevice',


  /////////////////////////////////////////////////////////////////
  //SERVICE
  /////////////////////////////////////////////////////////////////
  'GET /service/GetServiceList' : 'ServiceController.GetServiceList',
  'GET /service/GetServiceDataByID/:DevId' : 'ServiceController.GetServiceDataByID',

  'GET /service/GetHistoryList' : 'ServiceController.GetHistoryList',
  'POST /service/GetHistoryListByRenter_Email_ID' : 'ServiceController.GetHistoryListByRenter_Email_ID',
  'GET /service/GetHistoryListByDevID/:DevID' : 'ServiceController.GetHistoryListByDevID',

  'POST /service/AddService' : 'ServiceController.AddService',
  'PUT /service/AdminUpdateValid' : 'ServiceController.AdminUpdateValid',

  /////////////////////////////////////////////////////////////////
  //THRESHOLD
  /////////////////////////////////////////////////////////////////
  'GET /threshold/GetThresholdList' : 'ThresholdController.GetThresholdList',
  'PUT /threshold/UpdateThreshold' : 'ThresholdController.UpdateThreshold',
  'PUT /threshold/RemoveThreshold' : 'ThresholdController.RemoveThreshold',

  /////////////////////////////////////////////////////////////////
  //WARNING
  /////////////////////////////////////////////////////////////////
  'GET /warning/GetWarningList' : 'WarningController.GetWarningList',

};

