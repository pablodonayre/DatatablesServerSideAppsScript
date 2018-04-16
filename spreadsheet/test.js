function test1() {
  var text = 'draw=2&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=5&order%5B0%5D%5Bdir%5D=asc&start=0&length=5&search%5Bvalue%5D=&search%5Bregex%5D=false&email=&first_name=&last_name=&employee_id=&status=&radioEmail=C&radioFirstname=C&radioLastname=C&radioEmployee_id=C&radioStatus=C&radioEmail2=a&radioFirstname2=a&radioLastname2=a&radioEmployee_id2=a&radioStatus2=a';
   Logger.log(JSON.parse(text));
}



function prueba(){
  for(var i=0; i<500;i++){
    create(i);
  }
}
function create(k){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja 1");
  //var lastRow = sheet.getLastRow();
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 
    var code = "";
    // acquiring previous correlative number
    var previous_correlative =sheet.getRange(nextRow-1,2).getValue(); 
    var cor_num= Number(previous_correlative) + 1;

    // loop through the header columns

    for (i in headers){
      if (headers[i] == "id"){ // special case if you include a 'timestamp' column
        row.push(k);
      }
      if (headers[i] == "email"){ // special case (add +1 to previous correlative number)
        row.push("email"+k+"@gmail.com");
      }
      if (headers[i] == "first_name"){ // special case (generate document code number)
        row.push("first"+k);
      }      
      if (headers[i] == "last_name"){ // special case if you include a 'timestamp' column
        row.push("last"+k);
      }
      if (headers[i] == "employee_id"){ // special case (add +1 to previous correlative number)
        row.push("a"+k);
      }
      if (headers[i] == "status"){ // special case (generate document code number)
        row.push("Inactive");
      }      
      if(headers[i] != "id" && headers[i] != "email" && headers[i] != "first_name" && headers[i] != "last_name" && headers[i] != "employee_id" && headers[i] != "status"){ // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }

    // more efficient to set values as [][] array than individually [Sheet.getRange(row, column, numRows, numColumns)]
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

}


function run(){
    var result1 = data();
    //search_start(1, "EMAIL1",result1);
    //search_start_matchCase(1, "EMAIL1",result1);
    //search_finish(1, "emailxaa@gmail.com",result1);
    //search_contains(4, "4",result1);
    //search_wholeword(1, "4",result1);
    search_wholeword_matchCase(4, 1,result1);
}