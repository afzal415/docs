	// db instance
var db = require('./restaurantdb.js');
var base64ToImage = require('base64-to-image');

//Public Variables
var StausCode,CatCode,ModCode,ModGrpCode,ItemCode ;

//To check the login 
function isRegisteredUser(Username) {
          //return db.oneOrNone('select * from "login" where "username"= $1',Username);
          return db.oneOrNone("select * from login where username = $(email) and logindata ->>'password' = $(password)",Username);
}

//to fetch images for the category
function fetchImage(categ) {
      console.log('Image from app ',categ)
        return db.any('select * from category where categoryname like $1',categ);
}

//Update
function UpdateCust(user) {
      return db.none('update customer  SET custdata = $(custdata) where custname = $(custname)',user);
}


//modify item
function Updateitem(casevar,id,data,price) {
      var r = [];
      r.push(id,data,price);
      switch (casevar) {
            case "takeaway":
                  return db.none('update takeaway SET  tdata =  $2 , tprice = $3 where id = $1',r);
                  break;
      
            case "table":
                  return db.none('update tableorder SET  tdata =  $2 , tprice = $3 where id = $1',r);
                  break;
      }
}

//Get details data of the request 
function DetailData(casevar,primekey)
{
    switch(casevar)
      {
        case "category" :
            return db.oneOrNone('select * from category where categoryname= $1',primekey);
            break;

        case "modgrp" :
            return db.oneOrNone('select * from modifiergroup where modgrpname= $1',primekey);
            break;

        case "item" :
            return db.oneOrNone('select * from items where itemname= $1',primekey);
            break;

        case "modifier":
            return db.oneOrNone('select * from modifier where modname= $1',primekey);
            break;

        case "customer":
            return db.oneOrNone('select * from customer where custname= $1',primekey);
            break;

        case "items":
            return db.any('select * from items where itemcategory= $1',primekey);
            break;

        case "mmodifier":
            return db.any('select * from modifier where modgrpname= $1',primekey);
            break;
		
	  case "mmodifier1":
            return db.any('select * from modifier');
            break;
			
        case "reviewparcel":
            return db.any('select tdata,id from takeaway where takewaytable= $1',primekey);
            break;

        case "reviewtable":
            var table_no = primekey.split(",")
            var final = table_no.map(d => `'${d}'`).join(',')
            return db.any("select tdata,id,tableno  from tableorder where tableno in (" + final +")");
            break;

        case "reviewmerger":
            //console.log("type of value received",type(primekey));
            var table_no = primekey.split(",")
            var final = table_no.map(d => `'${d}'`).join(',')
            var sql = "select tdata,id,tableno  from tableorder where tableno in (" + final +")";
            return db.any(sql);
            break;
        
        case "modifyparcel":
            return db.any('select tdata  from takeaway where id= $1',primekey);
            break;

        case "modifytable":
            return db.any('select tdata  from tableorder where id= $1',primekey);
            break;

        case "users":
            return db.any('select * from login where username= $1',primekey);
            break;

        default :
             return ErrorEvent;
             break;
      }

}

//Delete data for the request
function Delete(casevar,primekey,tblno)
{
      switch(casevar)
      {
         case "category" :
            return db.oneOrNone('delete from category where categoryname = $1',primekey)
            break;

         case "modgrp" :
            return db.oneOrNone('delete from modifiergroup where modgrpname = $1',primekey)
            break;

         case "item" :
            return db.oneOrNone('delete from items where itemname = $1',primekey)
            break;

         case "modifier":
            return db.oneOrNone('delete from modifier where modname = $1',primekey)
            break;

         case "customer":
            return db.oneOrNone('delete from customer where custname = $1',primekey)
            break;

         case "users":
            return db.oneOrNone('delete from login where username = $1',primekey)
            break;
            
         case "menuitem":
            return db.oneOrNone('delete from takeaway where id = $1',primekey)
            break;

         case "tableitem":
            return db.oneOrNone('delete from tableorder where id = $1',primekey)
            break;

         case "takeaway":
            if(primekey !== 'A'){
                  return new Promise((resolve,reject) => {
                        var sql = 'delete from takeaway where id in (' + primekey + ')';
                                   db.none(sql)
                                           .then(function(AllPromise){
                                              resolve()
                                           })
                                           .catch(function(err){
                                             reject(err)
                                           })                                 
                    })
            } else {
                  var DeleteTakeaway = db.oneOrNone('delete from takeaway');
                  var Resettakeaway = db.oneOrNone('ALTER SEQUENCE takeaway_id_seq RESTART WITH 1');
                  return new Promise((resolve,reject) => {
                  Promise.all([DeleteTakeaway,Resettakeaway])
                                     .then(function(AllPromise){
                                        resolve()
                                     })
                                     .catch(function(err){
                                       reject(err)
                                     })                                 
              })
            }    
            break;

         case "tableno":
            if(primekey !== 'A'){
                  return new Promise((resolve,reject) => {
                        var sql = 'delete from tableorder where id in (' + primekey + ')';
                                   db.none(sql)
                                   .then(function(AllPromise){
                                          resolve()
                                    })
                                    .catch(function(err){
                                          reject(err)
                                    })                                 
                    })
            } else {
                  
                  return new Promise((resolve,reject) => {
                  var table_no = tblno.split(",")
                  var final = table_no.map(d => `'${d}'`).join(',')
                  var sql = "delete from tableorder where tableno in (" + final +")";      
                                    db.none(sql)
                                     .then(function(AllPromise){
                                        resolve()
                                     })
                                     .catch(function(err){
                                       reject(err)
                                     })                                 
              })
            }
            break;

         case "ClearStock" :
            var catpromise = db.oneOrNone('delete from category')
            var ModGrppromise = db.oneOrNone('delete from modifiergroup')
            var Itempromise = db.oneOrNone('delete from items')                                                                           
            var Modpromise = db.oneOrNone('delete from modifier')

            return new Promise((resolve,reject) => {
                Promise.all([catpromise,ModGrppromise,Itempromise,Modpromise])
                                   .then(function(AllPromise){
                                      resolve()
                                   })
                                   .catch(function(err){
                                     reject(err)
                                   })                                 
            })
                  //return AllPromise
                  break;
                                
         case "DefaultSetting" :
                  return db.any('select DefaultSettings()') ;   
                  break;

         case "FactoryReset" :
                  return db.any('select resetall()') ;   
                  break;                  
                
            default :
             return ErrorEvent;
             break;
      }
    
}

//retireval sum
function Retrievesum1(casevar,takuser,tprice,itemname,item)
{
      switch(casevar)
      {
         case "sum":
            return db.any('select SUM(tprice) from takeaway where takewaytable= $1' ,takuser);
            break; 
            
         case "sumtable":
            var table_no = takuser.split(",")
            var final = table_no.map(d => `'${d}'`).join(',')
            var sql = "select SUM(tprice) from tableorder where tableno in (" + final +")";
            return db.any(sql);
            break;

         case "deleteitem":
            var r = [];
            r.push(takuser,tprice,itemname);
            return db.oneOrNone('delete from takeaway where takewaytable = $1 AND tprice = $2 AND itemname = $3',r);
            break;      
            
	   case "updateitem":
            var r = [];
            r.push(takuser,tprice,itemname);
            return db.oneOrNone('update takeaway SET takewaytable = $(takewaytable), takeawaydata = $(takeawaydata), tprice = $(tprice), itemname = $(itemname)  where takewaytable = $1 AND tprice = $2 AND itemname = $3',r);
            break;

         default :
            return ErrorEvent;
            break;
      }
}


function Retrieve(casevar,takuser)
{
      switch(casevar)
      {
         case "category" :
            return db.any('select * from category');
            break;

         case "modgrp" :
            return db.any('select * from modifiergroup');
            break;

         case "item" :
            return db.any('select * from items');
            break;

         case "modifier":
            return db.any('select * from modifier');
            break;

         case "customer":
            return db.any('select * from customer');
            break;

         case "printer":
            //return db.any('select * from printer order by printername asc');
            var key ='printer'
            return db.any('select * from generalsettings where settings = $1', key);
            break;

         case "users":
            return db.any('select * from Login');
            break;

         case "menuitem":
            return db.any('select * from category');
            break;

         case "settings":
            var key = 'settings'
            return db.any('select * from generalsettings where settings = $1', key );

         case "GST":
            var key ='gst'
            return db.any('select * from generalsettings where settings = $1', key);

         case "voidreason":
            var key ='voidreason'
            return db.any('select * from generalsettings where settings = $1', key);

         case "table_details" :
            return db.any('select * from table_details');
            break;

         default :
             return ErrorEvent;
             break;
      }
}


function RegisterData(casevar,primekey,price,itemname)
{
      var pprice = price;
      switch(casevar)
      {
         case "category" :
            var name = primekey.categoryname +".jpeg"
            var path = require('path');
            var appDir = path.dirname(require.main.filename) + '/public/assest/img/category/';
            var base64Str = primekey.categorydata.url;
            var path = appDir;
            var optionalObj = {'fileName': name, 'type':'png'};
            if (base64Str == 'string' || base64Str == ""){
               primekey.categorydata.url = 'category/default.png'
            }else{
               base64ToImage(base64Str,path,optionalObj); 
               primekey.categorydata.url = 'category/' +name
            }
            
            return db.none('insert into category (categoryname,categorydata) values(${categoryname}, ${categorydata})',primekey)
            break;

         case "categoryupdate" :
            var name = primekey.categoryname +".jpeg"
            var path = require('path');
            var appDir = path.dirname(require.main.filename) + '/public/assest/img/category/';
            var base64Str = primekey.categorydata.url;
            var path = appDir;
            var optionalObj = {'fileName': name, 'type':'png'};
            if (base64Str == 'string'){
               primekey.categorydata.url = 'category/default.png'
            }else{
               base64ToImage(base64Str,path,optionalObj); 
               primekey.categorydata.url = 'category/' +name
            }
            return db.none('update category  SET categorydata = $(categorydata) where categoryname = $(categoryname)',primekey);
            break;

         case "modgrp" :
            return db.none('insert into modifiergroup (modgrpname,modgrpdata) values(${modgrpname}, ${modgrpdata})',primekey);
            break;

         case "modgrpupdate" :
            return db.none('update modifiergroup  SET modgrpdata = $(modgrpdata) where modgrpname = $(modgrpname)',primekey);
            break;

         case "item" :
            return db.none('insert into items (itemname,itemcategory,itemdata) values(${itemname}, ${itemcategory}, ${itemdata})',primekey);
            break;

         case "itemupdate" :
            return db.none('update items  SET itemdata = $(itemdata),itemcategory = $(itemcategory) where itemname = $(itemname)',primekey);
            break;

         case "modifier":
            return db.none('insert into modifier (modname,modgrpname,moddata) values(${modname}, ${modgrpname},${moddata})',primekey);
            break;

         case "modifierupdate":
            return db.none('update modifier  SET moddata = $(moddata),modgrpname = $(modgrpname) where modname = $(modname)',primekey);
            break;

         case "customer":
            //var picture = primekey.custdata.PictureUrl
            var name = primekey.custname +".jpeg"
            //var base64Data = picture.replace(/^data:image\/png;base64,/, "");
            var path = require('path');
            var appDir = path.dirname(require.main.filename) + '/public/assest/img/customer/';
            var base64Str = primekey.custdata.PictureUrl;
            var path = appDir;
            var optionalObj = {'fileName': name, 'type':'png'};
            if (base64Str == 'customer/default.png'){
               primekey.custdata.PictureUrl = 'customer/default.png'
            }else{
               base64ToImage(base64Str,path,optionalObj); 
               primekey.custdata.PictureUrl = 'customer/' +name
            }
            return db.oneOrNone('insert into customer (custname,custdata) values(${custname}, ${custdata})',primekey)
                  .then(function(result){
                        console.log('customer insert data : ',result)
                        primekey.custdata.RewardPoint = true
                        let Amount =  parseFloat(primekey.custdata.AccountBal)
                        Amount = Amount.toFixed(2)
                        let name = primekey.custname
                        let status = true
                        db.none("insert into table_details (table_no,occupied,sum) values('"+ name +"',"+ status +","+ Amount +")")
                  })
            break;

         case "users":
            return db.none('insert into Login (Username,LoginData) values(${Username}, ${LoginData})',primekey);
            break;

         case "usersupdate":
            return db.none('update login  SET logindata = $(logindata) where username = $(username)',primekey);
            break;


         case "takeaway":
            return db.none('insert into takeaway (takewaytable,tdata,tprice,itemname) values(${takewaytable}, ${takeawaydata}, $(price), $(itemname))',primekey );
            break;
            
         case "tableorder":
            return db.none('insert into tableorder (tableno,tdata,tprice,itemname) values(${tableno}, ${tableitem}, $(price), $(itemname))',primekey );
            break;

         case "updateitem":
            var r = [];
            r.push(takuser,tprice,itemname);
            return db.oneOrNone('update takeaway SET takewaytable = $(takewaytable), tdata = $(tdata), tprice = $(tprice), itemname = $(itemname)  where takewaytable = $1 AND tprice = $2 AND itemname = $3',r);
            break;

         case "settings":
            return db.none('update generalsettings  SET settingsdata = $(settingsdata) where settings = $(settings)',primekey);
            break;

         case "gst":
            return db.none('update generalsettings  SET settingsdata = $(gstdata) where settings = $(gst)',primekey);
            break;

         case "voidreason":
            return db.none('update generalsettings  SET settingsdata = $(voiddata) where settings = $(voidreason)',primekey);
            break;

         case "printer":
            return db.none('update generalsettings  SET settingsdata = $(printerdata) where settings = $(printers)',primekey);
            break;

         case "table_details":
            var table_no = primekey.table_no
            Array.isArray(table_no)
            if(Array.isArray(table_no)){
                  final = table_no.map(d => `'${d}'`).join(',')
            }else{
                  final = "'" + table_no + "'"
            }
            
            var sql = "update table_details  SET occupied = $(occupied) ,sum = $(sum) where table_no in (" + final +")";
            return db.none(sql,primekey);
            break;   
          
         case "credit" :
            if(primekey.tran == 'DEBIT'){
                  primekey.amount = primekey.amount * -1
            }
            return db.none('insert into tran_details("user",amount,customer) values(${user}, ${amount}, ${customer})',primekey)
                  .then(function(){
                        db.one("select sum from table_details where table_no = ${customer}",primekey)
                        .then(function(result){
                              let sum = result.sum - 0
                              let amount = primekey.amount - 0
                              let total = (sum + amount ) - 0
                              var sql = "update table_details  SET sum = " + total + " where table_no ='"+ primekey.customer+"'";
                              db.none(sql)
                        })
                  })
            break;

          case "stock" :
          primekey.data.forEach(item => {
             return db.oneOrNone("insert into stock_details_log(item_name,qty,price,total) values('"+ item.tdata.itemname+"',"+item.tdata.itemdata.qty +","+item.tdata.itemdata.price +","+item.tdata.sum +")")
             .then(function(){
                   db.oneOrNone("select qty from stock_details where item_name='"+ item.tdata.itemname +"'")
                   .then(function(result){
                        let update_qty = 0
                        let add_qty = 0
                        if(result != null){
                              add_qty = item.tdata.itemdata.qty - 0
                              let exist_qty = result.qty - 0
                              update_qty = (exist_qty + add_qty) - 0
                        }else {
                              update_qty =  item.tdata.itemdata.qty - 0
                        }
                        db.oneOrNone("insert into stock_details(item_name,qty) values ('"+item.tdata.itemname +"',"+ update_qty+")")
                        .then(function(){
                              db.oneOrNone("delete from tableorder where id="+item.id)
                        })
                   })
             })
          });
           console.log('items received are : ',primekey.data)
            /*db.none('insert into tran_details("user",amount,customer) values(${user}, ${amount}, ${customer})',primekey)
                  .then(function(){
                        db.one("select sum from table_details where table_no = ${customer}",primekey)
                        .then(function(result){
                              let sum = result.sum - 0
                              let amount = primekey.amount - 0
                              let total = (sum + amount ) - 0
                              var sql = "update table_details  SET sum = " + total + " where table_no ='"+ primekey.customer+"'";
                              db.none(sql)
                        })
                  })*/
            break;  

         case "tran":
         var arrayPromise = []
         var finaldata
             var receiptPromise = db.one("insert into receipt (receipt_id,total,total_paid,balance,tax,discount,table_no,payment_type,date,order_by,customer)"+
            "VALUES ("+primekey.billnumber+","+primekey.trandata.total+","+primekey.trandata.paid+","+primekey.trandata.balance.toFixed(2)+","+primekey.trandata.gst.toFixed(2)+",0,'"+primekey.trandata.tblno+"','cash',NOW(),'"+primekey.trandata.user+"',' ') RETURNING id")
                  .then(function(result,err){
                        var message = ''
                        if(result){ 
                              var inserted_id = result.id;
                              var items = []
                              var gst = primekey.trandata.gst_rate
                              items = primekey.trandata.itemdetails
                              var item_message
                              items.forEach(item => {
                                    var tax = item.itemprice * gst
                                    tax = parseFloat(tax)
                                    tax = tax.toFixed(2)
                                    
                                    var sale_price = parseFloat(item.itemprice + tax) 
                                          sale_price =sale_price.toFixed(2) 
                                     var itemPromise = db.one("insert into receipt_items (receipt_id,item_name,item_price,item_qty,sale_price,discount,tax,category)"+
                                    "VALUES ("+ inserted_id+",'"+ item.itemname+"',"+ item.itemprice+","+ item.qty+","+ sale_price +",0,"+ tax +",'"+ item.category +"') RETURNING id")
                                          .then(function(item_result){
                                                var modifier_message
                                                var item_id = item_result.id
                                                var modifiers = []
                                                modifiers = item.modifier
                                                var category = "modtest"
                                                modifiers.forEach(mod => {
                                                      var mod_tax = gst * mod.modifierprice
                                                            mod_tax = parseFloat(mod_tax)
                                                            mod_tax = mod_tax.toFixed(2)
                                                            var modPromise = db.none("insert into receipt_modifiers (item_id,receipt_id,mod_name,mod_price,mod_tax,mod_category)"+
                                                                  "VALUES ("+item_id+","+inserted_id +",'"+mod.modifiername+"',"+mod.modifierprice+","+mod_tax+",'"+mod.category+"')")
                                                                  arrayPromise.push(modPromise)
                                                                  // .then(function(resolve){
                                                                  //       return "success"
                                                                  // })
                                                                  // .catch(function(err){
                                                                  //       return "modifier_error:"+err
                                                                  // })
                                                      });
                                                // if (modifier_message == 'success'){
                                                //       return "success"
                                                // }else{
                                                //       return modifier_message
                                                // }
                                          })
                                          .catch(function(err){
                                                console.log("item insert err :",err)
                                                return "item_error:"+err
                                          })   
                                          arrayPromise.push(itemPromise)   
                              });
                        }
                        // if(item_message == 'success'){
                        //       return "success"
                        // }else{
                        //       return item_message
                        // }
                        arrayPromise.push(receiptPromise)
                        
                  })
                  .catch(function(err){
                        console.log("tran insert err :",err)
                        return "receipt_error:"+err
                  })
                  new Promise((resolve,reject)=>{
                        finaldata =  Promise.all(arrayPromise)
                            .then(function(data){
                                  finaldata = "success"
                                  return finaldata
                            })
                            .catch(function(err){
                                  reject(err)
                            })
                            return finaldata 
                })
                return finaldata
            break;

         default :
             return ErrorEvent;
             break;
      }
}

//retireval sum
function ReportData(sdate,edate,option)
{
      switch(option)
      {
         case "tran":
            if(sdate == edate){
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  receipt_id,total, total_paid, balance, tax,payment_type,order_by from receipt where date='"+sdate+"'");
            }else{
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  var edate = new Date(edate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  receipt_id,total, total_paid, balance, tax,payment_type,order_by from receipt where date between '"+sdate+"' AND '"+edate+"'");
            }
            break;      
            
	   case "table":
            if(sdate == edate){
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  table_no,SUM(total) as Total from receipt where date='"+sdate+"' GROUP BY table_no");
            }else{
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  var edate = new Date(edate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  table_no,SUM(total) as Total from receipt where date between '"+sdate+"' AND '"+edate+"' GROUP BY table_no");
            }
            break;
         
         case "void":
            return db.any('select SUM(tprice) from takeaway where takewaytable= $1' ,takuser);
            break; 

         case "payment":
            if(sdate == edate){
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  payment_type,SUM(total) as Total from receipt where date='"+sdate+"' GROUP BY payment_type");
            }else{
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
                  var edate = new Date(edate).toISOString().slice(0, 10).replace('T', ' ');
                  return db.any("SELECT  payment_type,SUM(total) as Total from receipt where date between '"+sdate+"' AND '"+edate+"' GROUP BY payment_type");
            }
            break; 

      case "sale":
            if(sdate == edate){
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 00:00:00";
                  var edate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 24:00:00";
                  return db.any("SELECT  category,SUM(sale_price) as CategoryTotal from receipt_items where timestamp between '"+sdate+"' AND '"+edate+"' GROUP BY category");
            }else{
                  var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 00:00:00";
                  var edate = new Date(edate).toISOString().slice(0, 10).replace('T', ' ') + " 24:00:00";
                  return db.any("SELECT  category,SUM(sale_price) as CategoryTotal from receipt_items where timestamp between '"+sdate+"' AND '"+edate+"' GROUP BY category");
            }
            break; 

         default :
            return "ERRORR";
            break;
      }
}

function Itemsum(sdate,edate,category)
{
      if(sdate == edate){
            var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 00:00:00";
            var edate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 24:00:00";
            return db.any("SELECT  item_name,SUM(sale_price) as itemTotal from receipt_items where timestamp between '"+sdate+"' AND '"+edate+"' AND category = '"+category+"' GROUP BY item_name");
      }else{
            var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ') + " 00:00:00";
                  var edate = new Date(edate).toISOString().slice(0, 10).replace('T', ' ') + " 24:00:00";
            return db.any("SELECT  item_name,SUM(sale_price) as itemTotal from receipt_items where timestamp between '"+sdate+"' AND '"+edate+"' AND category = '"+category+"' GROUP BY item_name");
      }

}

function FullReport(sdate,edate)
{
      var dateCondition
      if(sdate == edate){
            dateCondition = "date = '"+sdate
      }else{
            dateCondition  = "date between '"+sdate+"' AND '" +edate
      }
            
            var finaldata
            var salesReport,taxReport,Receipt
            var sdate = new Date(sdate).toISOString().slice(0, 10).replace('T', ' ');
            var salesquery = db.any("SELECT SUM(total) as Net_Sale, SUM(discount) as Discount, SUM(tax) as Total_Tax,SUM(total) + SUM(tax) as Sale_Tax_All FROM receipt as receipt_sum WHERE "+ dateCondition +"'")
                              .then(function(data){
                                    salesReport =  data[0]
                              })
            var taxquery =  db.any("WITH tax_sale as (" +
                              "SELECT SUM(total) as total_tax" +
                              "      FROM receipt " +
                              "WHERE tax > 0 AND "+ dateCondition + "'),nontax_sale as (SELECT SUM(total) as total_nontax" +
                              "      FROM receipt " +
                              "      WHERE tax = 0 AND "+ dateCondition+"')" +
                              "SELECT  tax_sale.total_tax,nontax_sale.total_nontax FROM tax_sale, nontax_sale")
                              .then(function(data){
                                    taxReport = data[0]
                              })
            var receiptquery = db.any("WITH first_receipt as (" +
                              "SELECT receipt_id as first "+
                              "FROM receipt "+
                              "WHERE "+dateCondition+"'"+
                              "ORDER BY timestamp ASC LIMIT 1),"+
                              "last_receipt as (SELECT receipt_id as last "+
                              "FROM receipt " +
                              "WHERE "+dateCondition+"'" +
                              "ORDER BY timestamp DESC LIMIT 1),"+
                              "total_receipt as (SELECT Count(receipt_id) as total "+
                              "FROM receipt "+
                              "WHERE "+dateCondition +"'),"+
                              "total as ("+
                              "SELECT SUM(total) as Total "+
                              "FROM receipt "+
                              "WHERE "+dateCondition +"')"+
                              "SELECT  first_receipt.first as firstReceipt,"+
                              "  last_receipt.last as lastReceipt ,"+
                              "      total_receipt.total as NoOfReceipt,"+
                              "      total.total/total_receipt.total as average "+
                              "FROM first_receipt, last_receipt,total_receipt,total")
                              .then(function(data){
                                    Receipt = data[0]
                              })
            new Promise((resolve,reject)=>{
                    finaldata =  Promise.all([salesquery,taxquery,receiptquery])
                        .then(function(data){
                              finaldata = {salesreport : salesReport,
                                    taxReport : taxReport,
                                    Receipt : Receipt
                                    }
                              return finaldata
                        })
                        .catch(function(err){
                              reject(err)
                        })
                        return finaldata 
            })
                  return finaldata
}

module.exports = {
    getImage: fetchImage,  
    authenticate: isRegisteredUser,
    UpdateCust : UpdateCust,
    Delete : Delete,
    Retrieve : Retrieve,
    DetailData : DetailData,
    RegisterData : RegisterData,
    Retrievesum1 : Retrievesum1,
    Updateitem : Updateitem,
    ReportData : ReportData,
    Itemsum : Itemsum,
    FullReport : FullReport
      


}
