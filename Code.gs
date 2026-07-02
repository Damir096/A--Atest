/**
 * Google Apps Script для обработки ответов RSVP.
 * Разверните этот код как "Веб-приложение" (Web App).
 * Установите доступ: "Anyone" (даже анонимный).
 */

function doPost(e) {
  try {
    // Парсим входящие данные
    var data = JSON.parse(e.postData.contents);
    
    // Получаем активную таблицу
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // Используем первый лист
    
    // Если заголовков еще нет, можно их добавить (опционально)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Время", "Имя", "Статус присутствия", "Напитки"]);
    }
    
    // Добавляем новую строку
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.attendance,
      data.drinks
    ]);
    
    // Возвращаем успех
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
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
