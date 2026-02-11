function response(metadata) {
  return ContentService.createTextOutput(JSON.stringify(metadata))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  return JSON.parse(e.postData.contents);
}

function thisExists(sheet, content) {
  return content.some(info => {
    const found = sheet.createTextFinder(info).matchEntireCell(true).findNext();
    return found !== null;
  });
}

function getEmptyCells(sheet) {
  let lastRow = sheet.getLastRow() + 1;
  return sheet.getRangeList([`A${lastRow}`, `B${lastRow}`, `C${lastRow}`]);
}

function getRowsFromContent(sheet, look_for) {
  try {
    // Search for phone specifically as per your logic
    let finder = sheet.createTextFinder(look_for.phone).matchEntireCell(true).findNext();
    return finder ? finder.getRow() : undefined;
  } catch (err) {
    return undefined;
  }
}

function handleCreating(sheet, info) {
  try {
    if (thisExists(sheet, [info.phone])) {
      return response({ response: "Já existe um registro!", done: false });
    }
    let ranges = getEmptyCells(sheet).getRanges();
    ranges[0].setValue(info.name);
    ranges[1].setValue(info.mail);
    ranges[2].setValue(info.phone);
    return response({ message: "Sucesso", done: true });
  } catch (err) {
    return response({ message: err.toString(), done: false });
  }
}

function handleDeleting(sheet, info) {
  try {
    let row_num = getRowsFromContent(sheet, info);
    if (row_num) {
      sheet.deleteRow(row_num);
      return response({ message: "Removido", done: true });
    }
    return response({ message: "Não encontrado", done: false });
  } catch (err) {
    return response({ message: err.toString(), done: false });
  }
}

function handleEditing(sheet, info, new_values) {
  try {
    let num_row = getRowsFromContent(sheet, info);
    if (num_row) {
      if(thisExists(sheet, [new_values.phone])){return response({'message': 'Já existe um registro com esse telefone', 'done': false})}else{

      sheet.getRange(num_row, 1, 1, 3).setValues([[new_values.name, new_values.mail, new_values.phone]]);
      return response({ message: "Editado", done: true });
      }
    }
    return response({ message: "Não encontrado", done: false });
  } catch (err) {
    return response({ message: err.toString(), done: false });
  }
}

function doPost(e) {
  try {
    const data = parseBody(e);
    // Open the specific sheet tab (index 0) to avoid object errors
    const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1wamdhJrBA0LjrhZ5akJ9kpGbOnfJcXDy4cf7_p-FgyY/edit');
    const sheet = ss.getSheets()[0];

    switch (data.operation) {
      case "Creating": return handleCreating(sheet, data.info);
      case "Editing":  return handleEditing(sheet, data.info, data.new_values);
      case "Deleting": return handleDeleting(sheet, data.info);
      default:         return response({ message: "Operação inválida", done: false });
    }
  } catch (err) {
    return response({ message: err.toString(), done: false });
  }
}