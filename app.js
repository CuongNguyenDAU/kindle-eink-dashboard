(function () {
  "use strict";

  /* ========================================================================
     CẤU HÌNH & DỮ LIỆU TĨNH
     ======================================================================== */
  var CITIES = [
    { id: "danang", name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
    { id: "hanoi", name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
    { id: "hcm", name: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
    { id: "hue", name: "Huế", lat: 16.4637, lon: 107.5909 },
    { id: "dalat", name: "Đà Lạt", lat: 11.9404, lon: 108.4583 },
    { id: "cantho", name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
    { id: "haiphong", name: "Hải Phòng", lat: 20.8449, lon: 106.6881 },
    { id: "nhatrang", name: "Nha Trang", lat: 12.2388, lon: 109.1967 }
  ];

  var STORAGE_KEYS = {
    CITY: "kindle_dash_city_v1",
    WEATHER_CACHE: "kindle_dash_weather_v1",
    TODOS: "kindle_dash_todos_v1",
    INVERT: "kindle_dash_invert_v1",
    LANDSCAPE: "kindle_dash_landscape_v1"
  };

  var WEEKDAYS_VI = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy"
  ];

  var WEEKDAYS_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  var CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  var CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  var state = {
    cityId: "danang",
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth(),
    todos: [],
    lastClockDayKey: ""
  };

  /* ========================================================================
     TIỆN ÍCH CHUNG (ES5 AN TOÀN CHO KINDLE)
     ======================================================================== */
  function pad2(num) {
    return num < 10 ? "0" + num : String(num);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function storageGet(key, fallback) {
    try {
      var val = window.localStorage.getItem(key);
      return val === null ? fallback : val;
    } catch (e) {
      return fallback;
    }
  }

  function storageSet(key, val) {
    try {
      window.localStorage.setItem(key, val);
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }

  function hasClass(el, cls) {
    return (" " + el.className + " ").indexOf(" " + cls + " ") !== -1;
  }

  function addClass(el, cls) {
    if (!hasClass(el, cls)) {
      el.className = el.className ? el.className + " " + cls : cls;
    }
  }

  function removeClass(el, cls) {
    var updated = (" " + el.className + " ").replace(" " + cls + " ", " ");
    el.className = updated.replace(/^\s+|\s+$/g, "");
  }

  function toggleClass(el, cls) {
    if (hasClass(el, cls)) {
      removeClass(el, cls);
      return false;
    }
    addClass(el, cls);
    return true;
  }

  function findCityById(id) {
    var i;
    for (i = 0; i < CITIES.length; i++) {
      if (CITIES[i].id === id) {
        return CITIES[i];
      }
    }
    return CITIES[0];
  }

  /* ========================================================================
     THUẬT TOÁN ÂM LỊCH VIỆT NAM (MÚI GIỜ UTC+7 - HỒ NGỌC ĐỨC)
     ======================================================================== */
  function INT(d) {
    return Math.floor(d);
  }

  function jdFromDate(dd, mm, yy) {
    var a = INT((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
  }

  function newMoon(k) {
    var T = k / 1236.85;
    var T2 = T * T;
    var T3 = T2 * T;
    var dr = Math.PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var deltat;
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    return Jd1 + C1 - deltat;
  }

  function sunLongitude(jdn) {
    var T = (jdn - 2451545.0) / 36525;
    var T2 = T * T;
    var dr = Math.PI / 180;
    var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    var L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * (INT(L / (Math.PI * 2)));
    return L;
  }

  function getNewMoonDay(k, timeZone) {
    return INT(newMoon(k) + 0.5 + timeZone / 24);
  }

  function getSunLongitude(dayNumber, timeZone) {
    return INT(sunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI * 6);
  }

  function getLunarMonth11(yy, timeZone) {
    var off = jdFromDate(31, 12, yy) - 2415021;
    var k = INT(off / 29.530588853);
    var nm = getNewMoonDay(k, timeZone);
    var sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  function getLeapMonthOffset(a11, timeZone) {
    var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    var last = 0;
    var i = 1;
    var arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function convertSolar2Lunar(dd, mm, yy, timeZone) {
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }
    var a11 = getLunarMonth11(yy, timeZone);
    var b11 = a11;
    var lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = INT((monthStart - a11) / 29);
    var lunarLeap = 0;
    var lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      leap: lunarLeap,
      jd: dayNumber
    };
  }

  function getCanChiInfo(lunar) {
    var dayCan = CAN[(lunar.jd + 9) % 10];
    var dayChi = CHI[(lunar.jd + 1) % 12];
    var monthCan = CAN[(lunar.year * 12 + lunar.month + 3) % 10];
    var monthChi = CHI[(lunar.month + 1) % 12];
    var yearCan = CAN[(lunar.year + 6) % 10];
    var yearChi = CHI[(lunar.year + 8) % 12];
    return {
      dayName: dayCan + " " + dayChi,
      monthName: monthCan + " " + monthChi,
      yearName: yearCan + " " + yearChi
    };
  }

  /* ========================================================================
     1. ĐỒNG HỒ & NGÀY ÂM DƯƠNG
     ======================================================================== */
  function updateClock() {
    var now = new Date();
    var hours = pad2(now.getHours());
    var minutes = pad2(now.getMinutes());
    document.getElementById("clock-time").textContent = hours + ":" + minutes;

    var dd = now.getDate();
    var mm = now.getMonth() + 1;
    var yy = now.getFullYear();
    var dayKey = yy + "-" + mm + "-" + dd;

    if (dayKey !== state.lastClockDayKey) {
      state.lastClockDayKey = dayKey;
      var weekday = WEEKDAYS_VI[now.getDay()];
      document.getElementById("solar-date").textContent =
        weekday + ", ngày " + pad2(dd) + "/" + pad2(mm) + "/" + yy;

      var lunar = convertSolar2Lunar(dd, mm, yy, 7);
      var canChi = getCanChiInfo(lunar);
      var monthText = lunar.month === 1 ? "Giêng" : String(lunar.month);
      if (lunar.leap === 1) {
        monthText += " (Nhuận)";
      }

      document.getElementById("lunar-date").textContent =
        "Âm lịch: " + pad2(lunar.day) + " tháng " + monthText + " năm " + canChi.yearName;

      document.getElementById("canchi-date").textContent =
        "Ngày " + canChi.dayName + " · Tháng " + canChi.monthName;

      renderCalendar();
    }

    // Lên lịch vẽ lại đúng vào giây 00 của phút kế tiếp để tiết kiệm pin E-Ink
    var msUntilNextMinute = (60 - now.getSeconds()) * 1000 + 60;
    window.setTimeout(updateClock, msUntilNextMinute);
  }

  /* ========================================================================
     2. THỜI TIẾT (OPEN-METEO API QUA XMLHTTPREQUEST)
     ======================================================================== */
  function getWeatherMeta(code) {
    if (code === 0) {
      return { label: "Trời quang nắng", icon: "sun" };
    }
    if (code === 1 || code === 2) {
      return { label: "Ít mây", icon: "partly" };
    }
    if (code === 3) {
      return { label: "Nhiều mây", icon: "cloud" };
    }
    if (code === 45 || code === 48) {
      return { label: "Có sương mù", icon: "fog" };
    }
    if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
      return { label: "Mưa phùn", icon: "rain" };
    }
    if (code === 61 || code === 63 || code === 80 || code === 81) {
      return { label: "Có mưa rào", icon: "rain" };
    }
    if (code === 65 || code === 66 || code === 67 || code === 82) {
      return { label: "Mưa to", icon: "heavy-rain" };
    }
    if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
      return { label: "Tuyết / Mưa lạnh", icon: "cloud" };
    }
    if (code >= 95) {
      return { label: "Có dông sét", icon: "storm" };
    }
    return { label: "Nhiều mây", icon: "cloud" };
  }

  function getWeatherSvg(iconType) {
    var open = '<svg viewBox="0 0 64 64" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none">';
    var close = "</svg>";

    if (iconType === "sun") {
      return open +
        '<circle cx="32" cy="32" r="12"></circle>' +
        '<line x1="32" y1="6" x2="32" y2="14"></line>' +
        '<line x1="32" y1="50" x2="32" y2="58"></line>' +
        '<line x1="6" y1="32" x2="14" y2="32"></line>' +
        '<line x1="50" y1="32" x2="58" y2="32"></line>' +
        '<line x1="13" y1="13" x2="19" y2="19"></line>' +
        '<line x1="45" y1="45" x2="51" y2="51"></line>' +
        '<line x1="51" y1="13" x2="45" y2="19"></line>' +
        '<line x1="19" y1="45" x2="13" y2="51"></line>' +
        close;
    }

    if (iconType === "partly") {
      return open +
        '<circle cx="24" cy="22" r="9"></circle>' +
        '<line x1="24" y1="6" x2="24" y2="10"></line>' +
        '<line x1="8" y1="22" x2="12" y2="22"></line>' +
        '<line x1="13" y1="11" x2="16" y2="14"></line>' +
        '<line x1="35" y1="11" x2="32" y2="14"></line>' +
        '<path d="M20 48h26a10 10 0 0 0 0-20 13 13 0 0 0-25-2 9 9 0 0 0-1 22z"></path>' +
        close;
    }

    if (iconType === "fog") {
      return open +
        '<path d="M16 34h32a9 9 0 0 0 0-18 12 12 0 0 0-23-2 8 8 0 0 0-9 20z"></path>' +
        '<line x1="12" y1="44" x2="52" y2="44"></line>' +
        '<line x1="16" y1="53" x2="48" y2="53"></line>' +
        close;
    }

    if (iconType === "rain") {
      return open +
        '<path d="M16 38h32a9 9 0 0 0 0-18 12 12 0 0 0-23-2 8 8 0 0 0-9 20z"></path>' +
        '<line x1="22" y1="46" x2="18" y2="56"></line>' +
        '<line x1="34" y1="46" x2="30" y2="56"></line>' +
        '<line x1="46" y1="46" x2="42" y2="56"></line>' +
        close;
    }

    if (iconType === "heavy-rain") {
      return open +
        '<path d="M16 36h32a9 9 0 0 0 0-18 12 12 0 0 0-23-2 8 8 0 0 0-9 18z"></path>' +
        '<line x1="18" y1="43" x2="13" y2="57"></line>' +
        '<line x1="28" y1="43" x2="23" y2="57"></line>' +
        '<line x1="38" y1="43" x2="33" y2="57"></line>' +
        '<line x1="48" y1="43" x2="43" y2="57"></line>' +
        close;
    }

    if (iconType === "storm") {
      return open +
        '<path d="M16 36h32a9 9 0 0 0 0-18 12 12 0 0 0-23-2 8 8 0 0 0-9 18z"></path>' +
        '<polyline points="35 38 26 50 34 50 28 60"></polyline>' +
        close;
    }

    return open +
      '<path d="M16 44h32a10 10 0 0 0 0-20 13 13 0 0 0-25-2 9 9 0 0 0-7 22z"></path>' +
      close;
  }

  function formatShortDateLabel(isoDate, index) {
    if (index === 1) {
      return "Ngày mai";
    }
    var parts = isoDate.split("-");
    if (parts.length !== 3) {
      return isoDate;
    }
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return WEEKDAYS_SHORT[d.getDay()] + " (" + parts[2] + "/" + parts[1] + ")";
  }

  function renderWeather(data, isOfflineCache, cacheTimeStr) {
    if (!data || !data.current) {
      return;
    }
    var cur = data.current;
    var meta = getWeatherMeta(cur.weather_code);

    document.getElementById("weather-icon").innerHTML = getWeatherSvg(meta.icon);
    document.getElementById("weather-temp").textContent = Math.round(cur.temperature_2m) + "°C";
    document.getElementById("weather-desc").textContent = meta.label;
    document.getElementById("weather-feels").textContent = Math.round(cur.apparent_temperature) + "°C";
    document.getElementById("weather-humidity").textContent = Math.round(cur.relative_humidity_2m) + "%";
    document.getElementById("weather-wind").textContent = Math.round(cur.wind_speed_10m) + " km/h";

    var forecastEl = document.getElementById("weather-forecast");
    var html = "";
    if (data.daily && data.daily.time && data.daily.time.length > 1) {
      var i;
      var limit = data.daily.time.length < 4 ? data.daily.time.length : 4;
      for (i = 1; i < limit; i++) {
        var dayMeta = getWeatherMeta(data.daily.weather_code[i]);
        var tMin = Math.round(data.daily.temperature_2m_min[i]);
        var tMax = Math.round(data.daily.temperature_2m_max[i]);
        html += '<div class="forecast-item">' +
          '<div class="forecast-day">' + escapeHtml(formatShortDateLabel(data.daily.time[i], i)) + "</div>" +
          '<div class="forecast-icon">' + getWeatherSvg(dayMeta.icon) + "</div>" +
          '<div class="forecast-range">' + tMin + "° - " + tMax + "°</div>" +
          "</div>";
      }
    }
    forecastEl.innerHTML = html;

    var statusEl = document.getElementById("weather-sync-status");
    if (isOfflineCache) {
      statusEl.textContent = "Lưu tạm (" + cacheTimeStr + ")";
    } else {
      statusEl.textContent = "Cập nhật: " + cacheTimeStr;
    }
  }

  function loadCachedWeatherForCity(cityId) {
    var raw = storageGet(STORAGE_KEYS.WEATHER_CACHE, "");
    if (!raw) {
      return null;
    }
    try {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.cityId === cityId && parsed.data) {
        return parsed;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function fetchWeather() {
    var city = findCityById(state.cityId);
    document.getElementById("location-label").textContent = city.name;
    document.getElementById("weather-sync-status").textContent = "Đang đồng bộ...";

    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + city.lat +
      "&longitude=" + city.lon +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=Asia%2FHo_Chi_Minh&forecast_days=4";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 12000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          var now = new Date();
          var timeStr = pad2(now.getHours()) + ":" + pad2(now.getMinutes());
          storageSet(STORAGE_KEYS.WEATHER_CACHE, JSON.stringify({
            cityId: city.id,
            timeStr: timeStr,
            data: data
          }));
          renderWeather(data, false, timeStr);
          return;
        } catch (e) {
          // Rơi xuống nhánh dùng cache
        }
      }
      handleWeatherFallback(city.id);
    };

    xhr.ontimeout = function () {
      handleWeatherFallback(city.id);
    };

    xhr.onerror = function () {
      handleWeatherFallback(city.id);
    };

    try {
      xhr.send();
    } catch (e) {
      handleWeatherFallback(city.id);
    }
  }

  function handleWeatherFallback(cityId) {
    var cached = loadCachedWeatherForCity(cityId);
    if (cached) {
      renderWeather(cached.data, true, cached.timeStr || "--:--");
    } else {
      document.getElementById("weather-desc").textContent = "Không có kết nối Wi-Fi";
      document.getElementById("weather-sync-status").textContent = "Ngoại tuyến";
    }
  }

  /* ========================================================================
     3. LỊCH THÁNG (THỨ 2 -> CHỦ NHẬT)
     ======================================================================== */
  function renderCalendar() {
    var year = state.viewYear;
    var month = state.viewMonth;
    document.getElementById("calendar-month-title").textContent =
      "THÁNG " + pad2(month + 1) + " / " + year;

    var firstDayJs = new Date(year, month, 1).getDay();
    // Chuyển Chủ Nhật (0) thành 6, Thứ Hai (1) thành 0
    var startOffset = (firstDayJs + 6) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var today = new Date();
    var isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);
    var todayDate = today.getDate();

    var tbody = document.getElementById("calendar-body");
    var html = "";
    var day = 1;
    var row, col;

    for (row = 0; row < 6; row++) {
      if (day > daysInMonth) {
        break;
      }
      html += "<tr>";
      for (col = 0; col < 7; col++) {
        if ((row === 0 && col < startOffset) || day > daysInMonth) {
          html += '<td class="day-empty">&nbsp;</td>';
        } else {
          var cls = (isCurrentMonth && day === todayDate) ? ' class="day-today"' : "";
          html += "<td" + cls + ">" + day + "</td>";
          day++;
        }
      }
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  /* ========================================================================
     4. LỊCH BIỂU & VIỆC CẦN LÀM (LOCALSTORAGE)
     ======================================================================== */
  function loadTodos() {
    var raw = storageGet(STORAGE_KEYS.TODOS, null);
    if (raw === null) {
      state.todos = [
        { id: 1, time: "07:30", text: "Đọc tin tức & kiểm tra lịch trình", done: false },
        { id: 2, time: "14:00", text: "Xử lý công việc trọng tâm buổi chiều", done: false },
        { id: 3, time: "21:00", text: "Đọc sách 30 phút trước khi ngủ", done: false }
      ];
      saveTodos();
      return;
    }
    try {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.length >= 0) {
        state.todos = parsed;
      } else {
        state.todos = [];
      }
    } catch (e) {
      state.todos = [];
    }
  }

  function saveTodos() {
    storageSet(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
  }

  function sortTodos() {
    state.todos.sort(function (a, b) {
      var ta = a.time || "99:99";
      var tb = b.time || "99:99";
      if (ta < tb) {
        return -1;
      }
      if (ta > tb) {
        return 1;
      }
      return a.id - b.id;
    });
  }

  function renderTodos() {
    var listEl = document.getElementById("todo-list");
    if (state.todos.length === 0) {
      listEl.innerHTML = '<li class="todo-empty">Chưa có lịch trình nào. Hãy thêm công việc mới ở trên.</li>';
      return;
    }

    sortTodos();
    var html = "";
    var i;
    for (i = 0; i < state.todos.length; i++) {
      var item = state.todos[i];
      var doneCls = item.done ? " is-done" : "";
      var mark = item.done ? "[x]" : "[ ]";
      var timeBadge = item.time
        ? '<span class="todo-time-badge">' + escapeHtml(item.time) + "</span>"
        : "";

      html += '<li class="todo-item' + doneCls + '">' +
        '<div class="todo-toggle" data-action="toggle" data-id="' + item.id + '">' +
          '<span class="todo-check">' + mark + "</span>" +
          timeBadge +
          '<span class="todo-label">' + escapeHtml(item.text) + "</span>" +
        "</div>" +
        '<div class="todo-del-wrap">' +
          '<button type="button" class="btn btn-del" data-action="delete" data-id="' + item.id + '" aria-label="Xóa">×</button>' +
        "</div>" +
      "</li>";
    }
    listEl.innerHTML = html;
  }

  function addTodo(timeVal, textVal) {
    var cleanText = textVal.replace(/^\s+|\s+$/g, "");
    if (!cleanText) {
      return;
    }
    var cleanTime = timeVal.replace(/^\s+|\s+$/g, "");
    state.todos.push({
      id: new Date().getTime(),
      time: cleanTime,
      text: cleanText,
      done: false
    });
    saveTodos();
    renderTodos();
  }

  function toggleTodoById(id) {
    var i;
    for (i = 0; i < state.todos.length; i++) {
      if (state.todos[i].id === id) {
        state.todos[i].done = !state.todos[i].done;
        break;
      }
    }
    saveTodos();
    renderTodos();
  }

  function deleteTodoById(id) {
    var next = [];
    var i;
    for (i = 0; i < state.todos.length; i++) {
      if (state.todos[i].id !== id) {
        next.push(state.todos[i]);
      }
    }
    state.todos = next;
    saveTodos();
    renderTodos();
  }

  function clearDoneTodos() {
    var next = [];
    var i;
    for (i = 0; i < state.todos.length; i++) {
      if (!state.todos[i].done) {
        next.push(state.todos[i]);
      }
    }
    state.todos = next;
    saveTodos();
    renderTodos();
  }

  /* ========================================================================
     5. CÔNG CỤ E-INK & HỘP THOẠI
     ======================================================================== */
  function cleanGhosting() {
    var cleaner = document.getElementById("ghost-cleaner");
    cleaner.style.display = "block";
    window.setTimeout(function () {
      cleaner.style.display = "none";
    }, 200);
  }

  function renderCityModalList() {
    var container = document.getElementById("city-list");
    var html = "";
    var i;
    for (i = 0; i < CITIES.length; i++) {
      var c = CITIES[i];
      var activeCls = (c.id === state.cityId) ? " is-active" : "";
      html += '<button type="button" class="btn city-btn' + activeCls + '" data-city="' + c.id + '">' +
        escapeHtml(c.name) +
        (c.id === state.cityId ? " (Đang chọn)" : "") +
        "</button>";
    }
    container.innerHTML = html;
  }

  function openModal(id) {
    addClass(document.getElementById(id), "is-open");
  }

  function closeModal(id) {
    removeClass(document.getElementById(id), "is-open");
  }

  /* ========================================================================
     6. KHỞI TẠO & GẮN SỰ KIỆN
     ======================================================================== */
  function restorePreferences() {
    var savedCity = storageGet(STORAGE_KEYS.CITY, "danang");
    state.cityId = findCityById(savedCity).id;

    if (storageGet(STORAGE_KEYS.INVERT, "0") === "1") {
      addClass(document.body, "invert-mode");
    }
    if (storageGet(STORAGE_KEYS.LANDSCAPE, "0") === "1") {
      addClass(document.body, "landscape-mode");
    }
  }

  function bindEvents() {
    document.getElementById("btn-refresh-weather").onclick = function () {
      fetchWeather();
    };

    document.getElementById("btn-prev-month").onclick = function () {
      state.viewMonth -= 1;
      if (state.viewMonth < 0) {
        state.viewMonth = 11;
        state.viewYear -= 1;
      }
      renderCalendar();
    };

    document.getElementById("btn-next-month").onclick = function () {
      state.viewMonth += 1;
      if (state.viewMonth > 11) {
        state.viewMonth = 0;
        state.viewYear += 1;
      }
      renderCalendar();
    };

    document.getElementById("todo-form").onsubmit = function (e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      var timeInput = document.getElementById("todo-time");
      var textInput = document.getElementById("todo-text");
      addTodo(timeInput.value, textInput.value);
      textInput.value = "";
      return false;
    };

    document.getElementById("todo-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      while (target && target.id !== "todo-list") {
        var action = target.getAttribute("data-action");
        if (action) {
          var id = parseInt(target.getAttribute("data-id"), 10);
          if (action === "toggle") {
            toggleTodoById(id);
          } else if (action === "delete") {
            deleteTodoById(id);
          }
          return;
        }
        target = target.parentNode;
      }
    };

    document.getElementById("btn-clear-done").onclick = function () {
      clearDoneTodos();
    };

    document.getElementById("btn-clean-ghost").onclick = function () {
      cleanGhosting();
    };

    document.getElementById("btn-toggle-invert").onclick = function () {
      var isInvert = toggleClass(document.body, "invert-mode");
      storageSet(STORAGE_KEYS.INVERT, isInvert ? "1" : "0");
    };

    document.getElementById("btn-toggle-layout").onclick = function () {
      var isLandscape = toggleClass(document.body, "landscape-mode");
      storageSet(STORAGE_KEYS.LANDSCAPE, isLandscape ? "1" : "0");
    };

    document.getElementById("btn-city-modal").onclick = function () {
      renderCityModalList();
      openModal("city-modal");
    };

    document.getElementById("btn-close-city").onclick = function () {
      closeModal("city-modal");
    };

    document.getElementById("city-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      if (target && target.getAttribute("data-city")) {
        state.cityId = target.getAttribute("data-city");
        storageSet(STORAGE_KEYS.CITY, state.cityId);
        closeModal("city-modal");
        fetchWeather();
      }
    };

    document.getElementById("btn-help-modal").onclick = function () {
      openModal("help-modal");
    };

    document.getElementById("btn-close-help").onclick = function () {
      closeModal("help-modal");
    };
  }

  function init() {
    restorePreferences();
    loadTodos();
    bindEvents();
    updateClock();
    renderTodos();

    var cached = loadCachedWeatherForCity(state.cityId);
    if (cached) {
      renderWeather(cached.data, true, cached.timeStr || "--:--");
    }
    fetchWeather();

    // Tự động cập nhật thời tiết mỗi 30 phút
    window.setInterval(fetchWeather, 30 * 60 * 1000);
  }

  init();
})();
