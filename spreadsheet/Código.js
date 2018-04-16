// falta la validacion de cuando es solo numero, no se puede convertir a toLowerCase
function doPost(e) {
  //-------------------------------------------------------------------------------------------
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("draft");
  sheet.getRange('B5').setValue(Utilities.jsonStringify(e.parameter));
  sheet.getRange('B6').setValue(e.parameter);
  //var json_parse= JSON.parse(Utilities.jsonStringify(e.parameter));
  
  var order_val= e.parameter;
  if( typeof(order_val['order[0][column]']) != "undefined"){
    sheet.getRange('B7').setValue(order_val['order[0][column]']);
    sheet.getRange('C7').setValue(order_val['order[0][dir]']);
    sheet.getRange('C8').setValue('if');
  }else{
   sheet.getRange('B7').setValue("undefined12");
    sheet.getRange('C7').setValue("undefined13");
    sheet.getRange('C8').setValue('else');
  }

  //-------------------------------------------------------------------------------------------
  
    
    var result = validation(e);

    // else, use page parameter to pick an html file from the script
    //return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
    //var result = data();
    var total = count_total();
    var filtered = (result[0].list_1).length; // deberia ser el conteo de los filtrados por longitud de mostrados
    return ContentService
        .createTextOutput(JSON.stringify({"draw":null, "recordsTotal":total,"recordsFiltered":filtered, "data":result[0].list_2}))
        .setMimeType(ContentService.MimeType.JSON);
  

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
function data(){
    // la estructura de la tabla es id, email, first_name, last_name, employee_id, status
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var lastRow = sheet.getLastRow();
    var range = 'A2:F'+lastRow;

    /* aqui se aplican los filtros, la data que se retorna ya debe estar filtrada "setFilter()"
       o con toda la data obtenida se hacen if con las condiciones de los input
    */
    var data = sheet.getRange(range).getValues();
    
    //var json = JSON.stringify(data);
    //Logger.log(data);
    return data;
}

function validation(e){
    //validar los 15 campos
    var parameters = e.parameter;
    var result = data();
    
    var start = parameters.start; //verificar si se envia
	var draw = parameters.draw; //verificar si se envia
	var length = parameters.length; //verificar si se envia
	//var order = parameters['order[0][column]']; //verificar si se envia
    var column_order = new Array('id', 'email', 'first_name', 'last_name', 'employee_id', 'status');
    var order_by = new Array(0,'desc');
  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("draft");
    //var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    //var nextRow = sheet.getLastRow()+1;
    //var row = []; 
     //var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var order;
    var order_2;

    if( typeof(parameters['order[0][column]']) != "undefined" ){
        order = parameters['order[0][column]'];
        order_2 = parameters['order[0][dir]'];
    }else{
        order = '0';
        order_2 = 'desc';
    }
    sheet.getRange('B1').setValue(order);
  sheet.getRange('C1').setValue(order_2);
  sheet.getRange('B2').setValue(start);
  sheet.getRange('B3').setValue(length);
  sheet.getRange('B4').setValue(draw);
    //sheet.getRange().setValues([row]);
  /*
  rows es para la consulta a la BD para el select, se podria crear para ponerle los index de las columnas
  */
    var keys = [
        ['email', parameters.email, 'radioEmail', parameters.radioEmail, 'radioEmail2', parameters.radioEmail2],
        ['first_name', parameters.first_name, 'radioFirstname', parameters.radioFirstname, 'radioFirstname2', parameters.radioFirstname2],
        ['last_name', parameters.last_name, 'radioLastname', parameters.radioLastname, 'radioLastname2', parameters.radioLastname2],
        ['employee_id', parameters.employee_id, 'radioEmployee_id', parameters.radioEmployee_id, 'radioEmployee_id2', parameters.radioEmployee_id2],
        ['status', parameters.status, 'radioStatus', parameters.radioStatus, 'radioStatus2', parameters.radioStatus2]
    ];
    
    var selector;
  
    selector = 1;
    var list_1 = server_side(selector, keys, length, start, order, column_order, result, order_2);//server_side(selector, keys, length, start, order, column_order, order_by, data);
    
    selector = 2;
    var list_2 = server_side(selector, keys, length, start, order, column_order, result, order_2);
  
    var abc = [{list_1: list_1, list_2: list_2}];
    
    return abc;
    
}

function server_side(selector, keys, length, start, order, column_order, data, order_2){
    for (var i=0; i<keys.length; i++) { //0-4
        var k = i+1;
        if(keys[i][1] != ""){ //verifica si el input esta vacio
          
          if(keys[i][3] === "C"){
              if(keys[i][5] === "A"){
                  data = search_contains_matchCase(k, keys[i][1], data);
              }else{
                  data = search_contains(k, keys[i][1], data);
              }
          }else if(keys[i][3] === "S"){
              if(keys[i][5] === "A"){
                  data = search_start_matchCase(k, keys[i][1], data);
              }else{
                  data = search_contains(k, keys[i][1], data);
              }
          }else if(keys[i][3] === "F"){
              if(keys[i][5] === "A"){
                  data = search_finish_matchCase(k, keys[i][1], data);
              }else{
                  data = search_finish(k, keys[i][1], data);
              }
          }else if($keys[$i][3] === "W"){
              if(keys[i][5] === "A"){
                  data = search_wholeword_matchCase(k, keys[i][1], data);
              }else{
                  data = search_wholeword(k, keys[i][1], data);
              }
          }
          
        }else{
            data = data;
        }
    }
  
    var data_reorder = reorder_and_length(data, column_order, order, selector, start, length, order_2);
    return data_reorder;
}

function reorder_and_length(data, column_order, order, selector, start, length, order_2){
    var data1;
    var column;
    var dir;
    //var start = (draw-1)*length;
    var finish = parseInt(start)+parseInt(length); //0+5 5+5 10+5 0-5 5-10 10-15
    /*
    primero codigo para orderar por columna
    se utiliza .toString() para evitar el error de cuando se compara un numero con un caracter
    */

    if(order != 0){
        column = order; //columna a ordenar, int
        dir = order_2;//'desc'; // asc o desc
        if(dir === "desc"){
            data.sort(function (a, b) {
              if (a[column].toString() === b[column].toString()) {
                return 0;
              }
              else {
                return (a[column].toString() < b[column].toString()) ? 1 : -1;
              }
            });
        }else{
            data.sort(function (a, b) {
              if (a[column].toString() === b[column].toString()) {
                return 0;
              }
              else {
                return (a[column].toString() < b[column].toString()) ? -1 : 1;
              }
            });
        }
    }else{
        column = order; //columna a ordenar, int
        dir = order_2; // asc o desc
        data.sort(function (a, b) {
          if (a[column] === b[column]) {
            return 0;
          }
          else {
            return (a[column] < b[column]) ? 1 : -1;
          }
        });
    }
    /*
    segundo el codigo para limitarlo como un switch del selector
    */
    switch(selector){
        case 1:
            data1 = data;
            return data1;
            break;
        case 2:
            if(length>0){
                //aplica el limite
                data1 = data.slice(start,finish);
                return data1;
            }else{
                //devuelve toda la data
                data1 = data;
                return data1;
            }
            break;
        default:
            if(length>0){
                //aplica el limite
                data1 = data.slice(start,finish);
              return data1;
            }else{
                //devuelve toda la data
                data1 = data;
                return data1;
            }
            break;
    }
    
    return data;
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

function count_total(){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var lastRow = sheet.getLastRow();
    var count = lastRow - 1;
    
    return count;
}

function search_start(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().toLowerCase().substring(0, filter.length));
        if(data[i][column].toString().toLowerCase().substring(0, filter.length) == filter.toLowerCase()){
            array.push(data[i]);
        }
    }
  
    return array;
    Logger.log(array);
}

function search_start_matchCase(column, filter, data) {
    var array = [];
    //Logger.log(filter);
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().substring(0, filter.length));
        if(data[i][column].toString().substring(0, filter.length) == filter){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}

function search_finish(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().toLowerCase().substring(data[i][column].length - filter.length, data[i][column].length));
        if(data[i][column].toString().toLowerCase().substring(data[i][column].length - filter.length, data[i][column].length) == filter.toLowerCase()){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}

function search_finish_matchCase(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().substring(data[i][column].length - filter.length, data[i][column].length));
        if(data[i][column].toString().substring(data[i][column].length - filter.length, data[i][column].length) == filter){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}

function search_contains(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().toLowerCase().indexOf(filter.toLowerCase()));
        if(data[i][column].toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}

function search_contains_matchCase(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        Logger.log(data[i][column].toString().indexOf(filter));
        if(data[i][column].toString().indexOf(filter.toLowerCase()) >= 0){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}

function search_wholeword(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        //Logger.log(data[i][column].toLowerCase().indexOf(filter.toLowerCase()));
        if(data[i][column].toString().toLowerCase() === filter.toLowerCase()){
            array.push(data[i]);
        }
    }
    
    Logger.log(array);
    return array;
}

function search_wholeword_matchCase(column, filter, data) {
    var array = [];
    //Logger.log(filter.toLowerCase());
    for(var i=0; i<data.length; i++){
        //Logger.log(data[i][column].indexOf(filter));
        if(data[i][column] === filter){
            array.push(data[i]);
        }
    }
    Logger.log(array);
    return array;
}