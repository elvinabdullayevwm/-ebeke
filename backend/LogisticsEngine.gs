/**
 * YOLASAL - MƏRKƏZİ LOGISTICS ENGINE (2026)
 * Location: backend/logisticsengine
 * Description: Sifarişlər və reyslər arası məntiqi analiz, filtrləmə və 
 * dashboard fəaliyyət statistikasının emalı modulu.
 */

// Mərkəzi Baza Qoşulması
const ENGINE_SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const ENGINE_SHEET_USERS = "Users";
const ENGINE_SHEET_ORDERS = "Orders";
const ENGINE_SHEET_TRIPS = "Trips";

/**
 * 1. Müştərinin Dashboard-u üçün Canlı Statistika Məlumatları (Mərkəzi Analiz)
 * Bu funksiya istifadəçinin ID-sinə əsasən onun neçə aktiv sifarişi və ya reysi olduğunu sayır.
 */
function getCustomerDashboardStats(customerID) {
  try {
    const ss = SpreadsheetApp.openById(ENGINE_SPREADSHEET_ID);
    const orderSheet = ss.getSheetByName(ENGINE_SHEET_ORDERS);
    const tripSheet = ss.getSheetByName(ENGINE_SHEET_TRIPS);
    
    let stats = {
      activeOrders: 0,
      inProgressOrders: 0,
      deliveredOrders: 0,
      activeTrips: 0,
      inProgressTrips: 0,
      completedTrips: 0
    };

    // Sifarişlərin analizi
    if (orderSheet) {
      const orderData = orderSheet.getDataRange().getValues();
      for (let i = 1; i < orderData.length; i++) {
        if (orderData[i][1] == customerID) { // Column 1: Customer ID
          let status = orderData[i][19] ? orderData[i][19].toString().toLowerCase() : "active"; // Column 19: Status (əgər varsa)
          
          if (status === "active" || status === "aktiv") stats.activeOrders++;
          else if (status === "in-progress" || status === "icrada") stats.inProgressOrders++;
          else if (status === "delivered" || status === "təslim") stats.deliveredOrders++;
        }
      }
    }

    // Reyslərin (Trips) analizi
    if (tripSheet) {
      const tripData = tripSheet.getDataRange().getValues();
      for (let i = 1; i < tripData.length; i++) {
        if (tripData[i][1] == customerID) { // Column 1: Driver/Customer ID
          let status = tripData[i][19] ? tripData[i][19].toString().toLowerCase() : "active"; // Column 19: Status
          
          if (status === "active" || status === "aktiv") stats.activeTrips++;
          else if (status === "in-progress" || status === "icrada") stats.inProgressTrips++;
          else if (status === "completed" || status === "tamamlandı") stats.completedTrips++;
        }
      }
    }

    return { status: "Success", data: stats };

  } catch (error) {
    return { status: "Error", message: "Logistics Engine xətası: " + error.toString() };
  }
}

/**
 * 2. İntellektual Sifariş Uyğunlaşdırma Paneli (Smart Matcher)
 * Müvafiq reys üçün eyni marşrutda (Haradan -> Haraya) olan uyğun yükləri tapır.
 */
function findMatchingOrdersForTrip(tripID) {
  try {
    const ss = SpreadsheetApp.openById(ENGINE_SPREADSHEET_ID);
    const tripSheet = ss.getSheetByName(ENGINE_SHEET_TRIPS);
    const orderSheet = ss.getSheetByName(ENGINE_SHEET_ORDERS);
    
    if (!tripSheet || !orderSheet) return { status: "Error", message: "Baza vərəqləri tapılmadı!" };

    const trips = tripSheet.getDataRange().getValues();
    let targetTrip = null;

    // Hədəf reysi tapırıq
    for (let i = 1; i < trips.length; i++) {
      if (trips[i][0] == tripID) {
        targetTrip = {
          fromCity: trips[i][14], // Haradan
          toCity: trips[i][15],   // Haraya
          maxWeight: trips[i][13] // Tutum/Çəki limiti
        };
        break;
      }
    }

    if (!targetTrip) return { status: "Error", message: "Reys tapılmadı!" };

    const orders = orderSheet.getDataRange().getValues();
    let matchingOrders = [];

    // Marşruta uyğun gələn sifarişləri filtrləyirik
    for (let j = 1; j < orders.length; j++) {
      let orderFrom = orders[j][11]; // Sifariş Haradan
      let orderTo = orders[j][13];   // Sifariş Haraya
      
      if (orderFrom === targetTrip.fromCity && orderTo === targetTrip.toCity) {
        matchingOrders.push({
          orderID: orders[j][0],
          customerID: orders[j][1],
          goodName: orders[j][4],
          weight: orders[j][7],
          budget: orders[j][17]
        });
      }
    }

    return { status: "Success", matches: matchingOrders };

  } catch (error) {
    return { status: "Error", message: error.toString() };
  }
}

/**
 * 3. Qlobal Axtarış və Filtr Sistemi (Müştərilər üçün Ümumi Siyahı)
 * Sayt üzərindəki aktiv reyslərin və ya yüklərin axtarışı üçün arxa fon dəstəyi.
 */
function globalLogisticsSearch(type, fromCity, toCity) {
  try {
    const ss = SpreadsheetApp.openById(ENGINE_SPREADSHEET_ID);
    const sheetName = (type === "orders") ? ENGINE_SHEET_ORDERS : ENGINE_SHEET_TRIPS;
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) return { status: "Error", message: "Məlumat tapılmadı." };
    
    const rows = sheet.getDataRange().getValues();
    let results = [];

    const fromIndex = (type === "orders") ? 11 : 14;
    const toIndex = (type === "orders") ? 13 : 15;

    for (let i = 1; i < rows.length; i++) {
      let rowFrom = rows[i][fromIndex];
      let rowTo = rows[i][toIndex];

      // Əgər şəhər seçilibsə filtr qoy, seçilməyibsə hamısını gətir
      let matchFrom = !fromCity || rowFrom.toLowerCase() === fromCity.toLowerCase();
      let matchTo = !toCity || rowTo.toLowerCase() === toCity.toLowerCase();

      if (matchFrom && matchTo) {
        if (type === "orders") {
          results.push({
            id: rows[i][0],
            goodName: rows[i][4],
            from: rowFrom,
            to: rowTo,
            date: rows[i][15],
            budget: rows[i][17]
          });
        } else {
          results.push({
            id: rows[i][0],
            truckBrand: rows[i][4],
            plateNumber: rows[i][5],
            from: rowFrom,
            to: rowTo,
            date: rows[i][16]
          });
        }
      }
    }

    return { status: "Success", results: results };

  } catch (error) {
    return { status: "Error", message: error.toString() };
  }
}
