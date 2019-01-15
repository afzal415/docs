var express = require('express'),multer = require('multer');
var router = express.Router();
var jsonfile = require('jsonfile');
var userAccess = require('../db_process.js');
var fs = require('fs');


//Remove the below code , once moving to production , this is just to handle CORS
router.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        //cb(null,  Date.now() + '.' + file.mimetype);
        cb(null,  Date.now() + '.jpg');
    }
  });

//Image fetching module Path,still in testing 
router.post('/Image', function (req, res, next) {
    var upload = multer({ storage: storage }).single('Capture');
        upload(req,res,function(err){
            if(err){
                console.log("reques body : ",req.body)
                console.log("request file : ",req.file)
                var obj = {status : 'failed',
                message : 'Error while loading image Capture' ,
                error :   err
                }
                return res.status(200).json(obj)
            } else {
                console.log("reques body : ",req.body)
                console.log("request file : ",req.file)
                var onlyPath = require('path').dirname(process.mainModule.filename)
                var obj = {status : 'success',
                message : 'Image  loaded successfully' ,
                path :   onlyPath +"\\"+ req.file.path
                }
                return res.status(200).json(obj)
            }
        })    
    
});

//Users/login
router.post('/login', function (req, res, next) {
    
        //userAccess.authenticate(req.query.Username)
        userAccess.authenticate(req.body)
       .then(function (data, err) {
            //res.status(200)

            console.log('data returned from Query',data)
             if (data === null ) {                                   
                console.log('User id NOT FOUND',req.body.email)
                var obj = {status : 'failed',
                data : data,
                message : 'User Not found'        
                       }            
             } else {
                console.log('User id found and logged in',req.body.email)                
                var obj = {status : 'success',
                data : data,
                message : 'User retrived'        
                          }
             }
             //return res.send(obj);
             res.send(obj);
            });    
});




//Customer Update
router.post('/UpdateCust', function (req, res, next) {
    var users = userAccess.UpdateCust(req.body)
        .then(function (err) {
            res.status(200)
             var obj = {status : 'success',
                        data : users,
                        message : 'Customer is Registered'        
            }      
            //  console.log('register success',req.body)      
        return res.send(obj);
          
        })
        .catch(function (err) {
            console.log('error while Customer register ')
               var obj = {status : 'failed',
                        data : 'Error while registerting the Customer data in Table',
                        message : err        
            }
               console.log(err)
             return res.send(obj);
         
            return next(err);
        });
        return res;
});


//Upload Image Testing,still in testing 
router.post('/Upload', function (req, res, next) {
    //var users = userAccess.body
    console.log(req.body)
    var Content = '';
    req.on('readable', function(){
        content += chunk;
      });
      req.on('end', function() {
        content = content.toString('base64');
        console.log(content);
        //content returns {"name": "Fred","age": 23};
    
        res.end();
      });
    var obj = {status : 'success',
                        data : '/public/Images/Fooditems/1.jpg',
                        message : 'image received'        
            }      
              console.log('image received',req.body)      
        return res.sendFile('/Users/hi/Desktop/Teen Solutions Ltd/Project X/Nodejs server/RestaurantService/public/Images/Fooditems/2.jpg');

});



//Delete records in tables
router.get('/Delete', function (req, res, next) {

    userAccess.Delete(req.query.switch,req.query.primekey,req.query.tblno)
    .then(function(data,err){
        res.status(200);
        var obj = {status : 'success',
                        data : data,
                        message : 'Deleted'        
            }
            
        console.log('Data Deleted',req.query.primekey)
        console.log('Data after Deleted',data)
        return res.send(obj);
    })
    .catch(function (err) {
        console.log('Error while deleting table',req.query.switch)
        console.log('Error details',err);
        var obj = {status : 'failed',
                        data : 'error while deleting',
                        message : err        
            }
        return res.end();
    });

});

//retireve sum for the users
router.get('/Retrievesum1', function (req, res, next) {

    userAccess.Retrievesum1(req.query.switch, req.query.takuser, req.query.tprice, req.query.itemname)
    .then(function(data,err){
        res.status(200);
        var obj = {status : 'success',
                        data : data,
                        message : 'Retrieved'        
        }    
        console.log('Data Retrieved',req.query.switch, data[0].sum)
        return res.send(obj);

    })
    .catch(function (err) {
            console.log('Error while Retrieving table',req.query.switch,req.query.takuser)
             var obj = {status : 'failed',
                        data : 'error while Retrieving',
                        message : err        
            }
            console.log('Error while Retrieving table',obj.message)
            
            return res.end();
    });
});




//Retrieve data from table
router.get('/Retrieve', function (req, res, next) {

    userAccess.Retrieve(req.query.switch)
    .then(function(data,err){
        res.status(200);
        var obj = {status : 'success',
                        data : data,
                        message : 'Retrieved'        
              }
        console.log('Data Retrieved',req.query.switch)
        return res.send(obj);
    })
    .catch(function (err) {
        console.log('Error while Retrieving table',req.query.switch)
        var obj = {status : 'failed',
                        data : 'error while Retrieving',
                        message : err        
            }
        console.log('error message',obj)
        return res.end();
    });
});

//singel item modify code
router.post('/UpdateItem', function (req, res, next) {
    var datareceived = req.body;
    var casevar = datareceived[0]
    var id = datareceived[1]
    var updatedata = datareceived[2]
    var final = updatedata[0].tdata
    var price = datareceived[3]
    var users = userAccess.Updateitem(casevar,id,final,price)
        .then(function (err) {
            res.status(200)
             var obj = {status : 'success',
                        data : users,
                        message : 'Update done success'        
            }       
        return res.send(obj);
          
        })
        .catch(function (err) {
            console.log('error while update single item ')
               var obj = {
                        status : 'failed',
                        data : 'Error while updating single item update',
                        message : err        
            }
               console.log(err)
             return res.send(obj);
         
            return next(err);
        });
        return res;
});



//Detailed data from table
router.get('/Detaildata', function (req, res, next) {

    userAccess.DetailData(req.query.switch,req.query.primekey)
    .then(function(data,err){
        res.status(200);
        var obj = {status : 'success',
                        data : data,
                        message : 'Retrieved'        
            }
            
        console.log('Data Retrieved',req.query.primekey);
        console.log('Data Retrieved',obj)

        return res.send(obj);
    })
    .catch(function (err) {
        console.log('Error while Retrieving table',req.query.switch)
        var obj = {status : 'failed',
                   data : 'error while Retrieving',
                   message : err        
             }
        console.log('Error message',obj.message)
        return res.end();
    });
});

//Logging Transaction
router.post('/Trans', function (req, res, next) {
    var casevar = req.body.key

    var users = userAccess.Transaction(casevar,req.body)
        .then(function (err) {
            res.status(200)
            var obj = {status : 'success',
                data : users,
                message : 'Takeaway Transactio is Registered'
            }
            console.log('Takeaway Transactio success',req.body)
            return res.send(obj);

        })
        .catch(function (err) {
            console.log('error while  Takeaway Transactio ')
            var obj = {status : 'failed',
                data : 'Error while Takeaway Transactio the data in Table',
                message : err
            }
            console.log(err)
            return res.send(obj);
            return next(err);
        });
    return res;
});

//Register data from table
router.post('/RegisterData', function (req, res, next) {
    var casevar = req.body.key
    var price = req.body.price
    var users = userAccess.RegisterData(casevar,req.body,req.body,price)
        .then(function (result) {
            console.log("tran result :",result)
            res.status(200)
            if (casevar == 'tran'){
                if(result == 'success'){
                    var obj = {status : 'success',
                            data : users,
                            message : 'Data is Registered'        
                    }
                }else{
                    var obj = {status : 'failed',
                                data : 'Error while registerting the data in Table',
                                message : result        
                            }   
                }    
            }else{
                var obj = {status : 'success',
                            data : users,
                            message : 'Data is Registered'        
                    }
            }
            
        return res.send(obj);
          
        })
        .catch(function (err) {
            console.log('error while  register ')
               var obj = {status : 'failed',
                        data : 'Error while registerting the data in Table',
                        message : err        
            }
               console.log(err)
             return res.send(obj);
         
            return next(err);
        });
        console.log('AFTER FUNCTIONS')
        return res;
});

//Report Data
router.get('/Reportdata', function (req, res, next) {
    var sdate = req.query.sdate
    var edate = req.query.edate
    var option = req.query.option
    if(option == 'full'){
        userAccess.FullReport(sdate,edate)
        .then(function(data){
            var obj = {status : 'success',
                                data : data,
                                message : 'Report Data received'
                            }
            return res.send(obj);
        })
        .catch(function(data){
            console.log(data)
        })
    }
    if(option !== 'full'){
    var users = userAccess.ReportData(sdate,edate,option)
        .then(function (data) {
            
            res.status(200)
            if(option == 'sale'){
                var itemfunction
                var reportdata = []
                data.forEach(CategoryData => {
                    var catergoryName = CategoryData.category
                    itemfunction = userAccess.Itemsum(sdate,edate,catergoryName)
                    .then(function(data){
                        var saledata = {
                            category : catergoryName,
                            categorySum : CategoryData.categorytotal,
                            itemdata : data
                        }
                        reportdata.push(saledata)
                    })
                });
                
                new Promise((resolve,reject)=>{
                    Promise.all([itemfunction])
                    .then(function(data){
                        var obj = {status : 'success',
                                data : reportdata,
                                message : 'Report Data received'
                            }
                        return res.send(obj);
                    })
                    .catch(function(err){
                        reject(err)
                      })  
                })
                    
            }else{
                var obj = {status : 'success',
                data : data,
                option : option,
                message : 'Report Data received'
            }
            console.log('report data sent is : ',data)
            return res.send(obj);
            }
        })
        .catch(function (err) {
            console.log('error while  Takeaway Transactio ')
            var obj = {status : 'failed',
                data : 'Error while Takeaway Transactio the data in Table',
                message : err
            }
            console.log(err)
            return res.send(obj);
            return next(err);
        });
    }
        
});


router.get('/download_customer', function (req, res, next) {
    var image_names = []
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + '/public/assest/img/customer/';
    fs.readdir(appDir, function(err, items) {
        for (var i=0; i<items.length; i++) {
            image_names.push(items[i])
        } 
        res.send(image_names)
    });
    
});

router.get('/download_category', function (req, res, next) {
    var image_names = []
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + '/public/assest/img/category/';
    fs.readdir(appDir, function(err, items) {
        for (var i=0; i<items.length; i++) {
            image_names.push(items[i])
        } 
        res.send(image_names)
    });
});

router.get('/download_customer_image', function (req, res, next) {
    var img_name = req.query.name
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + '/public/assest/img/customer/' + img_name;
    res.sendFile(appDir)
    
});

router.get('/download_category_image', function (req, res, next) {
    var img_name = req.query.name
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + '/public/assest/img/category/' + img_name;
    res.sendFile(appDir)
    
});
module.exports = router;