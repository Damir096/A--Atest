/**
 * Google Apps Script для обработки ответов RSVP.
 * Разверните этот код как "Веб-приложение" (Web App).
 * Установите доступ: "Anyone" (даже анонимный).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter || {};
    
    // Если данные пришли как JSON (из fetch), парсим их
    if (e.postData && e.postData.contents) {
      try {
        var jsonData = JSON.parse(e.postData.contents);
        for (var key in jsonData) {
          data[key] = jsonData[key];
        }
      } catch(err) {}
    }
    
    // 1. Получаем номер по порядку
    var lastRow = sheet.getLastRow();
    var rowNumber = lastRow > 0 ? lastRow : 1;
    
    // 2. Добавляем данные в таблицу: Номер, Фамилия, Имя, Количество, Статус
    sheet.appendRow([
      rowNumber, 
      data.lastName || data.surname || "", 
      data.firstName || data.name || "", 
      data.persons || data.count || 0,
      data.attendance || ""
    ]);
    
    // 3. Автоматическое обновление формулы "Итог" в ячейке E1
    sheet.getRange("E1").setFormula('= "ИТОГО ГОСТЕЙ: " & SUM(D:D)');
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    // В случае ошибки возвращаем сообщение об ошибке
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Тестовая функция для проверки разрешений
 */
function test() {
  Logger.log("Script is running!");
}
