const inquierer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();

// start connect to the mysql database

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PW,
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  starter();
});

// end connecting to mysql function

// start starter function
function starter(){
  var query = "SELECT * FROM products"
  connection.query(query, function(err, tableRes){
    if (err)throw err;
    console.table(tableRes);
    itemLookUp(tableRes);
  });
  
}
// end starter function

// start prompt for item look-up
function itemLookUp (tableRes){
  // start inquirer questions
  inquierer.prompt([
    {
      name: "lookup_id",
      type: "input",
      message: "Type in the Item ID number you're looking for",
      validate: function(IdValidate){
        if (!isNaN(IdValidate)){
          return true;
        }
        else {
          return "Please input a number"
        }
      }
    },
    {
      name: "stock_wanted",
      type: "input",
      message: "How many of this item do you want?",
      validate: function(stockValidate){
        if (!isNaN(stockValidate)){
          return true;
        }
        else {
          return "Please input a number"
        }
      }
    }
  ]).then(function(productSearchInput){
    // end inquirer questions, start of .then
    const selectedProduct = tableRes.find(function(product){
      
      return product.item_id == productSearchInput.lookup_id
      
    })
    console.log(selectedProduct)
    // make if statement that compares selectedPRoduct.instock < productSearchInput.stock_wanted
    if (selectedProduct.instock < productSearchInput.stock_wanted){
      console.log("Not enough in stock");
      oneLastThing();
    }
    // else subtract selectedProduct.instock, create a variabe to save the new stock 
    else {
      const newStock = selectedProduct.instock - productSearchInput.stock_wanted;

  

      const queryString = "UPDATE  products SET ? WHERE ?"
      const queryParam = [{instock: newStock}, {item_id: selectedProduct.item_id}];
      connection.query(queryString, queryParam, function(err, res){
        if (err) throw err;
        console.log("Successfully updated Stock Quantity");
        oneLastThing();
      })
    }
  })
  

  // end .then
}
function oneLastThing (){
  inquierer.prompt([
    {
      name: "action",
      type: "list",
      message: "What's next?",
      choices: [
        "Purchase something else",
        "Exit"
      ]

    }
  ]).then(function(endInput){
    if (endInput.action === "Purchase something else"){
      starter();
    }
    else {
      process.exit();
    }
  })
}
// end prompt for item lookup