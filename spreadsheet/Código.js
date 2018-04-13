function doGet(e) {
    //Logger.log(Utilities.jsonStringify(e));
    //if (!e.parameter.email) {
    // When no specific page requested, return "home page"
    //return HtmlService.createTemplateFromFile('index').evaluate();
    //}else{
    Logger.log(e.parameter.email); // lo envio a otra funcion para validarlo
    var parameters = e.parameter
    var result = validation(parameters);
    //}
    // else, use page parameter to pick an html file from the script
    //return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
    //var result = data();
    var total = count_total();
    var filtered = (result[0].list_1).length; // deberia ser el conteo de los filtrados por longitud de mostrados
    return ContentService
        .createTextOutput(JSON.stringify({"draw":null, "recordsTotal":total,"recordsFiltered":filtered, "data":result[0].list_2}))
        .setMimeType(ContentService.MimeType.JSON);
  

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

function validation(parameters){
    //validar los 15 campos
    var result = data();
  
    var start = parameters.start; //verificar si se envia
	var draw = parameters.draw; //verificar si se envia
	var length = parameters.length; //verificar si se envia
	var order = parameters.order; //verificar si se envia
    var column_order = new Array('id', 'email', 'first_name', 'last_name', 'employee_id', 'status');
    ////var order_by = new Array('email' => 'asc');
    
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
    var list_1 = server_side(selector, keys, length, start, order, column_order, result);//server_side(selector, keys, length, start, order, column_order, order_by, data);
    
    selector = 2;
    var list_2 = server_side(selector, keys, length, start, order, column_order, result);
  
    var abc = [{list_1: list_1, list_2: list_2}];
    
    return abc;
    
}

function server_side(selector, keys, length, start, order, column_order, data){
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
              //$sql_b = $sql_b.$keys[$i][0]." = '".$keys[$i][1]."' ";
          }
          
        }else{
            data = data;
        }
    }
  
    var data_reorder = reorder_and_length(data, column_order, order, selector,start, length);
    return data_reorder;
}

function reorder_and_length(data, column_order, order, selector, start, length){
    /*
    primero codigo para porderar por columna
    
    segundo el codigo para limitarlo como un switch del selector
    switch(selector){
        case 1:
        case 2:
        default:
    }
    */
    return data;
}

function run(){
    //var result1 = data();
    //search_start(1, "EMAIL1",result1);
    //search_start_matchCase(1, "EMAIL1",result1);
    //search_finish(1, "emailxaa@gmail.com",result1);
    //search_contains(1, "mail1",result1);
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
        Logger.log(data[i][column].toLowerCase().substring(0, filter.length));
        if(data[i][column].toLowerCase().substring(0, filter.length) == filter.toLowerCase()){
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
        Logger.log(data[i][column].substring(0, filter.length));
        if(data[i][column].substring(0, filter.length) == filter){
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
        Logger.log(data[i][column].toLowerCase().substring(data[i][column].length - filter.length, data[i][column].length));
        if(data[i][column].toLowerCase().substring(data[i][column].length - filter.length, data[i][column].length) == filter.toLowerCase()){
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
        Logger.log(data[i][column].substring(data[i][column].length - filter.length, data[i][column].length));
        if(data[i][column].substring(data[i][column].length - filter.length, data[i][column].length) == filter){
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
        Logger.log(data[i][column].toLowerCase().indexOf(filter.toLowerCase()));
        if(data[i][column].toLowerCase().indexOf(filter.toLowerCase()) >= 0){
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
        Logger.log(data[i][column].indexOf(filter));
        if(data[i][column].indexOf(filter.toLowerCase()) >= 0){
            array.push(data[i]);
        }
    }
    return array;
    Logger.log(array);
}