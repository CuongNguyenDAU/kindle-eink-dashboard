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

  var DEFAULT_RSS_FEEDS = [
    { id: "vne-new", name: "VnExpress Mới", url: "https://vnexpress.net/rss/tin-moi-nhat.rss", builtin: true },
    { id: "vne-tech", name: "VnE Công nghệ", url: "https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss", builtin: true },
    { id: "vne-edu", name: "VnE Giáo dục", url: "https://vnexpress.net/rss/giao-duc.rss", builtin: true },
    { id: "vne-biz", name: "VnE Kinh doanh", url: "https://vnexpress.net/rss/kinh-doanh.rss", builtin: true },
    { id: "vne-world", name: "VnE Thế giới", url: "https://vnexpress.net/rss/the-gioi.rss", builtin: true },
    { id: "tt-new", name: "Tuổi Trẻ", url: "https://tuoitre.vn/rss/tin-moi-nhat.rss", builtin: true },
    { id: "tn-new", name: "Thanh Niên", url: "https://thanhnien.vn/rss/thoi-su.rss", builtin: true },
    { id: "dt-new", name: "Dân Trí", url: "https://dantri.com.vn/rss/su-kien.rss", builtin: true },
    { id: "hn-front", name: "Hacker News", url: "https://hnrss.org/frontpage", builtin: true }
  ];

  var STORAGE_KEYS = {
    CITY: "kindle_dash_city_v1",
    WEATHER_CACHE: "kindle_dash_weather_v1",
    AQI_CACHE: "kindle_dash_aqi_v1",
    TODOS: "kindle_dash_todos_v1",
    TODO_SYNC_URL: "kindle_dash_todo_sync_url_v1",
    INVERT: "kindle_dash_invert_v1",
    LANDSCAPE: "kindle_dash_landscape_v1",
    ZEN_MODE: "kindle_dash_zen_v1",
    FONT_SCALE: "kindle_dash_font_scale_v1",
    AUTO_CLEAN: "kindle_dash_auto_clean_v1",
    AUTO_NIGHT: "kindle_dash_auto_night_v1",
    RSS_CUSTOM: "kindle_dash_rss_custom_v1",
    RSS_ACTIVE: "kindle_dash_rss_active_v1",
    RSS_CACHE: "kindle_dash_rss_cache_v1",
    RSS_READ: "kindle_dash_rss_read_v1",
    RSS_SAVED: "kindle_dash_rss_saved_v1",
    RSS_PAGE_MODE: "kindle_dash_rss_pagemode_v1",
    RSS_ART_FONT: "kindle_dash_rss_artfont_v1"
  };

  var WEEKDAYS_VI = [
    "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
  ];
  var WEEKDAYS_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  var CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  var CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  var SOLAR_TERMS = [
    "Xuân Phân", "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng",
    "Hạ Chí", "Tiểu Thử", "Đại Thử", "Lập Thu", "Xử Thử", "Bạch Lộ",
    "Thu Phân", "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết",
    "Đông Chí", "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập"
  ];

  var FONT_SCALES = ["sm", "md", "lg", "xl"];

  var nowInit = new Date();
  var state = {
    cityId: "danang",
    viewYear: nowInit.getFullYear(),
    viewMonth: nowInit.getMonth(),
    selectedYear: nowInit.getFullYear(),
    selectedMonth: nowInit.getMonth(),
    selectedDay: nowInit.getDate(),
    todos: [],
    lastClockDayKey: "",
    lastAutoNightState: null,
    fontScale: "md",
    autoCleanMinutes: 0,
    autoCleanTimerId: null,
    autoNightEnabled: false,
    zenMode: false,
    rssFullscreen: false,
    pomo: {
      presetMinutes: 25,
      label: "Pomodoro",
      remainingMinutes: 25,
      running: false,
      endTimeMs: 0,
      timerId: null
    },
    rss: {
      customFeeds: [],
      activeFeedId: "vne-new",
      filterMode: "all",
      searchQuery: "",
      currentPage: 1,
      cache: {},
      readMap: {},
      savedList: [],
      loadingFeed: false,
      filteredItems: [],
      activeArticle: null,
      articleFont: "md",
      articleMode: "page",
      articlePages: [],
      articlePageIndex: 0
    }
  };

  /* ========================================================================
     TIỆN ÍCH CHUNG (ES5 AN TOÀN CHO KINDLE)
     ======================================================================== */
  function pad2(num) {
    return num < 10 ? "0" + num : String(num);
  }

  function trimStr(str) {
    return String(str || "").replace(/^\s+|\s+$/g, "");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function decodeEntities(str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = String(str || "");
    return txt.value;
  }

  function stripHtml(str) {
    var clean = String(str || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ");
    clean = decodeEntities(clean);
    return clean.replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").replace(/^\s+|\s+$/g, "");
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
      // Bỏ qua nếu bộ nhớ đầy hoặc bị chặn
    }
  }

  function storageGetJson(key, fallback) {
    var raw = storageGet(key, "");
    if (!raw) {
      return fallback;
    }
    try {
      var parsed = JSON.parse(raw);
      return parsed === null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function hasClass(el, cls) {
    return (" " + el.className + " ").indexOf(" " + cls + " ") !== -1;
  }

  function addClass(el, cls) {
    if (el && !hasClass(el, cls)) {
      el.className = el.className ? el.className + " " + cls : cls;
    }
  }

  function removeClass(el, cls) {
    if (!el) {
      return;
    }
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

  function indexInArray(arr, val) {
    var i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return i;
      }
    }
    return -1;
  }

  /* ========================================================================
     THUẬT TOÁN ÂM LỊCH, 24 TIẾT KHÍ & NGÀY LỄ VIỆT NAM (UTC+7)
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

  function getSolarTermInfo(dd, mm, yy, timeZone) {
    var jd = jdFromDate(dd, mm, yy);
    var step = Math.PI / 12;
    var idx0 = INT(sunLongitude(jd - 0.5 - timeZone / 24) / step) % 24;
    var idx1 = INT(sunLongitude(jd + 0.5 - timeZone / 24) / step) % 24;
    if (idx1 !== idx0) {
      return { name: SOLAR_TERMS[idx1], isStart: true };
    }
    return { name: SOLAR_TERMS[idx0], isStart: false };
  }

  function getHolidaysForDate(dd, mm, lunar) {
    var list = [];
    var sKey = dd + "/" + mm;
    if (sKey === "1/1") { list.push("Tết Dương lịch"); }
    if (sKey === "14/2") { list.push("Lễ Tình nhân"); }
    if (sKey === "8/3") { list.push("Quốc tế Phụ nữ"); }
    if (sKey === "30/4") { list.push("Giải phóng miền Nam"); }
    if (sKey === "1/5") { list.push("Quốc tế Lao động"); }
    if (sKey === "1/6") { list.push("Quốc tế Thiếu nhi"); }
    if (sKey === "2/9") { list.push("Quốc khánh Việt Nam"); }
    if (sKey === "20/10") { list.push("Phụ nữ Việt Nam"); }
    if (sKey === "20/11") { list.push("Nhà giáo Việt Nam"); }
    if (sKey === "22/12") { list.push("Thành lập QĐND VN"); }
    if (sKey === "25/12") { list.push("Lễ Giáng Sinh"); }

    if (lunar.leap === 0) {
      var lKey = lunar.day + "/" + lunar.month;
      if (lKey === "1/1") { list.push("Mùng 1 Tết Nguyên Đán"); }
      if (lKey === "2/1") { list.push("Mùng 2 Tết Nguyên Đán"); }
      if (lKey === "3/1") { list.push("Mùng 3 Tết Nguyên Đán"); }
      if (lKey === "15/1") { list.push("Tết Nguyên Tiêu"); }
      if (lKey === "3/3") { list.push("Tết Hàn Thực"); }
      if (lKey === "10/3") { list.push("Giỗ Tổ Hùng Vương"); }
      if (lKey === "15/4") { list.push("Lễ Phật Đản"); }
      if (lKey === "5/5") { list.push("Tết Đoan Ngọ"); }
      if (lKey === "15/7") { list.push("Lễ Vu Lan"); }
      if (lKey === "15/8") { list.push("Tết Trung Thu"); }
      if (lKey === "23/12") { list.push("Ông Công Ông Táo"); }
    }
    return list;
  }

  /* ========================================================================
     1. ĐỒNG HỒ, LỊCH ÂM DƯƠNG & AUTO NIGHT MODE
     ======================================================================== */
  function checkAutoNightMode(now) {
    if (!state.autoNightEnabled) {
      return;
    }
    var h = now.getHours();
    var shouldInvert = (h >= 19 || h < 6);
    if (state.lastAutoNightState !== shouldInvert) {
      state.lastAutoNightState = shouldInvert;
      if (shouldInvert) {
        addClass(document.body, "invert-mode");
      } else {
        removeClass(document.body, "invert-mode");
      }
      storageSet(STORAGE_KEYS.INVERT, shouldInvert ? "1" : "0");
    }
  }

  function updateClock() {
    var now = new Date();
    var hours = pad2(now.getHours());
    var minutes = pad2(now.getMinutes());
    document.getElementById("clock-time").textContent = hours + ":" + minutes;

    checkAutoNightMode(now);

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

      var term = getSolarTermInfo(dd, mm, yy, 7);
      document.getElementById("solar-term-badge").textContent =
        (term.isStart ? "Đầu tiết: " : "Tiết khí: ") + term.name;

      var holidays = getHolidaysForDate(dd, mm, lunar);
      var banner = document.getElementById("holiday-banner");
      if (holidays.length > 0) {
        banner.textContent = "Hôm nay: " + holidays.join(" · ");
        addClass(banner, "is-visible");
      } else {
        banner.textContent = "";
        removeClass(banner, "is-visible");
      }

      renderCalendar();
      renderSelectedDayDetail();
    }

    var msUntilNextMinute = (60 - now.getSeconds()) * 1000 + 60;
    window.setTimeout(updateClock, msUntilNextMinute);
  }

  /* ========================================================================
     2. THỜI TIẾT, KHÔNG KHÍ (AQI/UV) & BIỂU ĐỒ 12 GIỜ (OPEN-METEO)
     ======================================================================== */
  function getWeatherMeta(code) {
    if (code === 0) { return { label: "Trời quang nắng", icon: "sun" }; }
    if (code === 1 || code === 2) { return { label: "Ít mây", icon: "partly" }; }
    if (code === 3) { return { label: "Nhiều mây", icon: "cloud" }; }
    if (code === 45 || code === 48) { return { label: "Có sương mù", icon: "fog" }; }
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
    if (code >= 95) { return { label: "Có dông sét", icon: "storm" }; }
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

  function extractTimePart(isoDateTime) {
    if (!isoDateTime) { return "--:--"; }
    var idx = isoDateTime.indexOf("T");
    return idx !== -1 ? isoDateTime.slice(idx + 1, idx + 6) : isoDateTime;
  }

  function getUvLabel(uv) {
    if (uv < 3) { return "Thấp"; }
    if (uv < 6) { return "Vừa"; }
    if (uv < 8) { return "Cao"; }
    return "Rất cao";
  }

  function getAqiLabel(aqi) {
    if (aqi <= 50) { return "Tốt"; }
    if (aqi <= 100) { return "TB"; }
    if (aqi <= 150) { return "Kém"; }
    return "Xấu";
  }

  function renderHourlyChart(hourly) {
    var container = document.getElementById("weather-hourly-chart");
    if (!hourly || !hourly.time || !hourly.temperature_2m || hourly.time.length === 0) {
      container.innerHTML = '<div class="chart-empty">Chưa có dữ liệu theo giờ.</div>';
      return;
    }

    var now = new Date();
    var targetKey = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate()) + "T" + pad2(now.getHours()) + ":00";
    var startIdx = 0;
    var i;
    for (i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i] >= targetKey) {
        startIdx = i;
        break;
      }
    }

    var slots = [];
    for (i = 0; i < 6; i++) {
      var idx = startIdx + i * 2;
      if (idx < hourly.time.length) {
        var rainP = (hourly.precipitation_probability && hourly.precipitation_probability[idx] !== undefined)
          ? Math.round(hourly.precipitation_probability[idx])
          : 0;
        slots.push({
          hour: hourly.time[idx].slice(11, 13) + "h",
          temp: Math.round(hourly.temperature_2m[idx]),
          rain: rainP
        });
      }
    }

    if (slots.length === 0) {
      container.innerHTML = '<div class="chart-empty">Không có dữ liệu dự báo giờ.</div>';
      return;
    }

    var minT = slots[0].temp;
    var maxT = slots[0].temp;
    for (i = 1; i < slots.length; i++) {
      if (slots[i].temp < minT) { minT = slots[i].temp; }
      if (slots[i].temp > maxT) { maxT = slots[i].temp; }
    }
    var span = maxT - minT;
    if (span < 1) { span = 1; }

    var html = "";
    for (i = 0; i < slots.length; i++) {
      var pct = 24 + Math.round(((slots[i].temp - minT) / span) * 70);
      html += '<div class="chart-col">' +
        '<div class="chart-temp">' + slots[i].temp + "°</div>" +
        '<div class="chart-bar-track">' +
          '<div class="chart-bar-fill" style="height:' + pct + '%;"></div>' +
        "</div>" +
        '<div class="chart-rain">' + slots[i].rain + "%</div>" +
        '<div class="chart-hour">' + escapeHtml(slots[i].hour) + "</div>" +
      "</div>";
    }
    container.innerHTML = html;
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

    if (cur.uv_index !== undefined && cur.uv_index !== null) {
      var uvVal = Math.round(cur.uv_index * 10) / 10;
      document.getElementById("weather-uv").textContent = uvVal + " (" + getUvLabel(uvVal) + ")";
    } else {
      document.getElementById("weather-uv").textContent = "--";
    }

    if (data.daily) {
      var rainProb = (data.daily.precipitation_probability_max && data.daily.precipitation_probability_max.length > 0)
        ? Math.round(data.daily.precipitation_probability_max[0]) + "%"
        : "--%";
      document.getElementById("weather-rain-prob").textContent = rainProb;

      var sunrise = (data.daily.sunrise && data.daily.sunrise.length > 0) ? extractTimePart(data.daily.sunrise[0]) : "--";
      var sunset = (data.daily.sunset && data.daily.sunset.length > 0) ? extractTimePart(data.daily.sunset[0]) : "--";
      document.getElementById("weather-sun").textContent = sunrise + " / " + sunset;
    }

    renderHourlyChart(data.hourly);

    var forecastEl = document.getElementById("weather-forecast");
    var html = "";
    if (data.daily && data.daily.time && data.daily.time.length > 1) {
      var i;
      var limit = data.daily.time.length < 4 ? data.daily.time.length : 4;
      for (i = 1; i < limit; i++) {
        var dayMeta = getWeatherMeta(data.daily.weather_code[i]);
        var tMin = Math.round(data.daily.temperature_2m_min[i]);
        var tMax = Math.round(data.daily.temperature_2m_max[i]);
        var dayRain = (data.daily.precipitation_probability_max && data.daily.precipitation_probability_max[i] !== undefined)
          ? Math.round(data.daily.precipitation_probability_max[i]) + "% mưa"
          : "";
        html += '<div class="forecast-item">' +
          '<div class="forecast-day">' + escapeHtml(formatShortDateLabel(data.daily.time[i], i)) + "</div>" +
          '<div class="forecast-icon">' + getWeatherSvg(dayMeta.icon) + "</div>" +
          '<div class="forecast-range">' + tMin + "° - " + tMax + "°</div>" +
          (dayRain ? '<div class="forecast-extra">' + dayRain + "</div>" : "") +
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

  function renderAirQuality(aqiData) {
    var el = document.getElementById("weather-aqi");
    if (!aqiData || !aqiData.current) {
      el.textContent = "--";
      return;
    }
    var aqi = aqiData.current.us_aqi !== undefined ? Math.round(aqiData.current.us_aqi) : null;
    var pm25 = aqiData.current.pm2_5 !== undefined ? Math.round(aqiData.current.pm2_5) : null;
    if (aqi !== null && pm25 !== null) {
      el.textContent = aqi + " (" + getAqiLabel(aqi) + ") · " + pm25 + "µg";
    } else if (aqi !== null) {
      el.textContent = aqi + " (" + getAqiLabel(aqi) + ")";
    } else {
      el.textContent = "--";
    }
  }

  function loadCachedForCity(storageKey, cityId) {
    var parsed = storageGetJson(storageKey, null);
    if (parsed && parsed.cityId === cityId && parsed.data) {
      return parsed;
    }
    return null;
  }

  function fetchAirQuality(city) {
    var url = "https://air-quality-api.open-meteo.com/v1/air-quality" +
      "?latitude=" + city.lat +
      "&longitude=" + city.lon +
      "&current=us_aqi,pm2_5&timezone=Asia%2FHo_Chi_Minh";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 10000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var aqiData = JSON.parse(xhr.responseText);
          storageSet(STORAGE_KEYS.AQI_CACHE, JSON.stringify({
            cityId: city.id,
            data: aqiData
          }));
          renderAirQuality(aqiData);
          return;
        } catch (e) { /* fallback */ }
      }
      var cached = loadCachedForCity(STORAGE_KEYS.AQI_CACHE, city.id);
      if (cached) { renderAirQuality(cached.data); }
    };
    try { xhr.send(); } catch (e) { /* ignore */ }
  }

  function fetchWeather() {
    var city = findCityById(state.cityId);
    document.getElementById("location-label").textContent = city.name;
    document.getElementById("weather-sync-status").textContent = "Đang đồng bộ...";

    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + city.lat +
      "&longitude=" + city.lon +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index" +
      "&hourly=temperature_2m,precipitation_probability,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max" +
      "&timezone=Asia%2FHo_Chi_Minh&forecast_days=4";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 12000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
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
        } catch (e) { /* fallback */ }
      }
      handleWeatherFallback(city.id);
    };

    xhr.ontimeout = function () { handleWeatherFallback(city.id); };
    xhr.onerror = function () { handleWeatherFallback(city.id); };
    try { xhr.send(); } catch (e) { handleWeatherFallback(city.id); }

    fetchAirQuality(city);
  }

  function handleWeatherFallback(cityId) {
    var cached = loadCachedForCity(STORAGE_KEYS.WEATHER_CACHE, cityId);
    if (cached) {
      renderWeather(cached.data, true, cached.timeStr || "--:--");
    } else {
      document.getElementById("weather-desc").textContent = "Không có kết nối Wi-Fi";
      document.getElementById("weather-sync-status").textContent = "Ngoại tuyến";
    }
  }

  /* ========================================================================
     3. ĐỒNG HỒ POMODORO / ĐẾM NGƯỢC E-INK
     ======================================================================== */
  function flashGhostingAlert(times) {
    var count = 0;
    var maxFlashes = times * 2;
    var cleaner = document.getElementById("ghost-cleaner");

    function step() {
      if (count >= maxFlashes) {
        cleaner.style.display = "none";
        return;
      }
      cleaner.style.display = (count % 2 === 0) ? "block" : "none";
      count += 1;
      window.setTimeout(step, 260);
    }
    step();
  }

  function renderPomodoro() {
    var mins = state.pomo.remainingMinutes;
    if (mins < 0) { mins = 0; }
    document.getElementById("pomo-time").textContent = pad2(mins) + ":00";
    document.getElementById("pomo-mode-label").textContent = state.pomo.label;
    document.getElementById("btn-pomo-toggle").textContent = state.pomo.running ? "Tạm dừng" : "Bắt đầu";
  }

  function schedulePomodoroTick() {
    if (state.pomo.timerId) {
      window.clearTimeout(state.pomo.timerId);
      state.pomo.timerId = null;
    }
    if (!state.pomo.running) {
      return;
    }

    var nowMs = new Date().getTime();
    var diffMs = state.pomo.endTimeMs - nowMs;
    if (diffMs <= 0) {
      state.pomo.running = false;
      state.pomo.remainingMinutes = 0;
      renderPomodoro();
      document.getElementById("pomo-status").textContent = "Hết giờ! (" + state.pomo.label + ")";
      flashGhostingAlert(3);
      return;
    }

    var nextMins = Math.ceil(diffMs / 60000);
    if (nextMins !== state.pomo.remainingMinutes) {
      state.pomo.remainingMinutes = nextMins;
      renderPomodoro();
    }

    // Chờ đúng đến lúc chuyển sang phút tiếp theo để hạn chế làm mới E-Ink
    var remainderMs = diffMs % 60000;
    var waitMs = remainderMs > 0 ? remainderMs + 80 : 60080;
    state.pomo.timerId = window.setTimeout(schedulePomodoroTick, waitMs);
  }

  function setPomodoroPreset(mins, label) {
    if (state.pomo.timerId) {
      window.clearTimeout(state.pomo.timerId);
      state.pomo.timerId = null;
    }
    state.pomo.running = false;
    state.pomo.presetMinutes = mins;
    state.pomo.remainingMinutes = mins;
    state.pomo.label = label;
    document.getElementById("pomo-status").textContent = "Sẵn sàng (" + mins + " phút · cập nhật mỗi phút)";

    var btns = document.getElementById("pomo-presets").getElementsByTagName("button");
    var i;
    for (i = 0; i < btns.length; i++) {
      var bMins = parseInt(btns[i].getAttribute("data-pomo-mins"), 10);
      if (bMins === mins) {
        addClass(btns[i], "is-active");
      } else {
        removeClass(btns[i], "is-active");
      }
    }
    renderPomodoro();
  }

  /* ========================================================================
     4. LỊCH THÁNG KÈM ÂM LỊCH, TIẾT KHÍ & SỰ KIỆN VIỆT NAM
     ======================================================================== */
  function renderSelectedDayDetail() {
    var dd = state.selectedDay;
    var mm = state.selectedMonth + 1;
    var yy = state.selectedYear;
    var dObj = new Date(yy, mm - 1, dd);
    var weekday = WEEKDAYS_VI[dObj.getDay()];
    var lunar = convertSolar2Lunar(dd, mm, yy, 7);
    var canChi = getCanChiInfo(lunar);
    var term = getSolarTermInfo(dd, mm, yy, 7);
    var holidays = getHolidaysForDate(dd, mm, lunar);

    var lunarMonthStr = lunar.month === 1 ? "Giêng" : String(lunar.month);
    if (lunar.leap === 1) { lunarMonthStr += " (Nhuận)"; }

    var html = "<strong>" + escapeHtml(weekday + ", " + pad2(dd) + "/" + pad2(mm) + "/" + yy) + "</strong>" +
      " — Âm lịch: <strong>" + pad2(lunar.day) + "/" + lunarMonthStr + "</strong>" +
      " (Năm " + escapeHtml(canChi.yearName) + ")" +
      "<br>Ngày " + escapeHtml(canChi.dayName) + " · Tháng " + escapeHtml(canChi.monthName) +
      " · " + (term.isStart ? "Đầu tiết " : "Tiết ") + "<strong>" + escapeHtml(term.name) + "</strong>";

    if (holidays.length > 0) {
      html += '<br><span class="detail-holiday-tag">Ngày lễ: ' + escapeHtml(holidays.join(", ")) + "</span>";
    }
    document.getElementById("calendar-day-detail").innerHTML = html;
  }

  function renderCalendar() {
    var year = state.viewYear;
    var month = state.viewMonth;
    document.getElementById("calendar-month-title").textContent =
      "THÁNG " + pad2(month + 1) + " / " + year;

    var firstDayJs = new Date(year, month, 1).getDay();
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
          var lunar = convertSolar2Lunar(day, month + 1, year, 7);
          var holidays = getHolidaysForDate(day, month + 1, lunar);
          var classes = ["day-cell"];
          if (isCurrentMonth && day === todayDate) {
            classes.push("day-today");
          }
          if (year === state.selectedYear && month === state.selectedMonth && day === state.selectedDay) {
            classes.push("day-selected");
          }
          if (lunar.day === 1 || lunar.day === 15) {
            classes.push("day-lunar-special");
          }
          if (holidays.length > 0) {
            classes.push("day-holiday");
          }

          var lunarLabel = (lunar.day === 1 || day === 1)
            ? lunar.day + "/" + lunar.month + (lunar.leap ? "N" : "")
            : String(lunar.day);

          html += '<td class="' + classes.join(" ") + '" data-cal-day="' + day + '">' +
            '<span class="cal-solar">' + day + "</span>" +
            '<span class="cal-lunar">' + lunarLabel + "</span>" +
            "</td>";
          day++;
        }
      }
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  /* ========================================================================
     5. TRÌNH ĐỌC TIN TỨC RSS CHUYÊN SÂU CHO E-INK
     ======================================================================== */
  function getAllRssFeeds() {
    var list = [];
    var i;
    for (i = 0; i < DEFAULT_RSS_FEEDS.length; i++) {
      list.push(DEFAULT_RSS_FEEDS[i]);
    }
    for (i = 0; i < state.rss.customFeeds.length; i++) {
      list.push(state.rss.customFeeds[i]);
    }
    return list;
  }

  function findFeedById(id) {
    var all = getAllRssFeeds();
    var i;
    for (i = 0; i < all.length; i++) {
      if (all[i].id === id) {
        return all[i];
      }
    }
    return all[0];
  }

  function formatRssDate(dateStr) {
    if (!dateStr) { return ""; }
    var d = new Date(dateStr.replace(" ", "T"));
    if (isNaN(d.getTime())) {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) {
      return String(dateStr).slice(0, 16);
    }
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + " · " + pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1);
  }

  function getArticleId(item, feedName) {
    return item.guid || item.link || (feedName + "::" + item.title);
  }

  function isArticleSaved(id) {
    var i;
    for (i = 0; i < state.rss.savedList.length; i++) {
      if (state.rss.savedList[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  function updateSavedCountBadge() {
    document.getElementById("rss-saved-count").textContent = String(state.rss.savedList.length);
  }

  function renderRssSourceTabs() {
    var container = document.getElementById("rss-source-tabs");
    var feeds = getAllRssFeeds();
    var html = "";
    var i;
    for (i = 0; i < feeds.length; i++) {
      var f = feeds[i];
      var cls = (f.id === state.rss.activeFeedId) ? " is-active" : "";
      html += '<button type="button" class="btn btn-small rss-source-btn' + cls + '" data-feed-id="' + escapeHtml(f.id) + '">' +
        escapeHtml(f.name) + "</button>";
    }
    container.innerHTML = html;
  }

  function getFilteredRssItems() {
    var sourceItems = [];
    if (state.rss.filterMode === "saved") {
      sourceItems = state.rss.savedList;
    } else {
      var feedData = state.rss.cache[state.rss.activeFeedId];
      sourceItems = (feedData && feedData.items) ? feedData.items : [];
    }

    var query = trimStr(state.rss.searchQuery).toLowerCase();
    var result = [];
    var i;
    for (i = 0; i < sourceItems.length; i++) {
      var item = sourceItems[i];
      if (state.rss.filterMode === "unread" && state.rss.readMap[item.id]) {
        continue;
      }
      if (query) {
        var hay = (item.title + " " + item.snippet + " " + item.sourceName).toLowerCase();
        if (hay.indexOf(query) === -1) {
          continue;
        }
      }
      result.push(item);
    }
    return result;
  }

  function renderRssList() {
    updateSavedCountBadge();

    var filterBtns = document.getElementById("rss-card").querySelectorAll("[data-rss-filter]");
    var i;
    for (i = 0; i < filterBtns.length; i++) {
      if (filterBtns[i].getAttribute("data-rss-filter") === state.rss.filterMode) {
        addClass(filterBtns[i], "is-active");
      } else {
        removeClass(filterBtns[i], "is-active");
      }
    }

    var items = getFilteredRssItems();
    state.rss.filteredItems = items;

    var perPage = state.rssFullscreen ? 8 : 5;
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));
    if (state.rss.currentPage > totalPages) { state.rss.currentPage = totalPages; }
    if (state.rss.currentPage < 1) { state.rss.currentPage = 1; }

    var start = (state.rss.currentPage - 1) * perPage;
    var end = Math.min(items.length, start + perPage);
    var listEl = document.getElementById("rss-list");

    if (items.length === 0) {
      var emptyMsg = state.rss.filterMode === "saved"
        ? "Chưa có bài báo nào được lưu đọc offline."
        : (state.rss.loadingFeed ? "Đang tải tin tức..." : "Không có bài viết nào phù hợp bộ lọc.");
      listEl.innerHTML = '<li class="todo-empty">' + escapeHtml(emptyMsg) + "</li>";
      document.getElementById("rss-page-info").textContent = "Trang 1 / 1";
      return;
    }

    var html = "";
    for (i = start; i < end; i++) {
      var item = items[i];
      var isRead = Boolean(state.rss.readMap[item.id]);
      var isSaved = (isArticleSaved(item.id) !== -1);
      var itemCls = isRead ? " is-read" : "";

      var badges = '<span class="rss-badge">' + escapeHtml(item.sourceName) + "</span>";
      if (isSaved) {
        badges += '<span class="rss-badge is-solid">ĐÃ LƯU</span>';
      }
      if (isRead) {
        badges += '<span class="rss-badge">ĐÃ ĐỌC</span>';
      }

      var snippetShort = item.snippet.length > 150 ? item.snippet.slice(0, 147) + "..." : item.snippet;

      html += '<li class="rss-item' + itemCls + '">' +
        '<div class="rss-item-main" data-rss-open="' + escapeHtml(item.id) + '">' +
          '<div class="rss-item-title">' + escapeHtml(item.title) + "</div>" +
          (snippetShort ? '<div class="rss-item-snippet">' + escapeHtml(snippetShort) + "</div>" : "") +
          '<div class="rss-item-meta">' + badges + (item.pubText ? " · " + escapeHtml(item.pubText) : "") + "</div>" +
        "</div>" +
        '<div class="rss-item-actions">' +
          '<button type="button" class="btn btn-small" data-rss-open="' + escapeHtml(item.id) + '">Đọc bài</button>' +
          '<button type="button" class="btn btn-small" data-rss-toggle-save="' + escapeHtml(item.id) + '">' +
            (isSaved ? "Bỏ lưu" : "Lưu offline") +
          "</button>" +
        "</div>" +
      "</li>";
    }

    listEl.innerHTML = html;
    document.getElementById("rss-page-info").textContent =
      "Trang " + state.rss.currentPage + " / " + totalPages + " (" + items.length + " tin)";
  }

  function parseXmlRssItems(xmlStr, feed) {
    var items = [];
    if (!window.DOMParser) { return items; }
    try {
      var parser = new window.DOMParser();
      var doc = parser.parseFromString(xmlStr, "text/xml");
      var nodes = doc.getElementsByTagName("item");
      var isAtom = false;
      if (!nodes || nodes.length === 0) {
        nodes = doc.getElementsByTagName("entry");
        isAtom = true;
      }
      var i;
      var maxCount = nodes.length < 20 ? nodes.length : 20;
      for (i = 0; i < maxCount; i++) {
        var node = nodes[i];
        var titleEl = node.getElementsByTagName("title")[0];
        var title = titleEl ? trimStr(titleEl.textContent || "") : "";
        var link = "";
        var linkEl = node.getElementsByTagName("link")[0];
        if (linkEl) {
          link = isAtom ? (linkEl.getAttribute("href") || linkEl.textContent || "") : (linkEl.textContent || "");
        }
        var descEl = node.getElementsByTagName("description")[0] || node.getElementsByTagName("summary")[0] || node.getElementsByTagName("content")[0];
        var descRaw = descEl ? (descEl.textContent || "") : "";
        var dateEl = node.getElementsByTagName("pubDate")[0] || node.getElementsByTagName("updated")[0] || node.getElementsByTagName("published")[0];
        var pubDate = dateEl ? (dateEl.textContent || "") : "";
        var guidEl = node.getElementsByTagName("guid")[0] || node.getElementsByTagName("id")[0];
        var guid = guidEl ? (guidEl.textContent || "") : link;

        if (title) {
          var snippet = stripHtml(descRaw);
          var art = {
            id: guid || link || (feed.id + "-" + i),
            title: decodeEntities(title),
            link: trimStr(link),
            pubDate: pubDate,
            pubText: formatRssDate(pubDate),
            snippet: snippet,
            rawContent: descRaw,
            sourceId: feed.id,
            sourceName: feed.name,
            fullParagraphs: null
          };
          items.push(art);
        }
      }
    } catch (e) {
      return [];
    }
    return items;
  }

  function saveRssCache(feedId, items, timeStr) {
    state.rss.cache[feedId] = {
      timeStr: timeStr,
      items: items
    };
    // Giữ tối đa 5 nguồn gần nhất trong localStorage để tiết kiệm dung lượng
    var keys = [];
    var k;
    for (k in state.rss.cache) {
      if (state.rss.cache.hasOwnProperty(k)) { keys.push(k); }
    }
    if (keys.length > 5) {
      for (var i = 0; i < keys.length - 5; i++) {
        if (keys[i] !== feedId) {
          delete state.rss.cache[keys[i]];
        }
      }
    }
    storageSet(STORAGE_KEYS.RSS_CACHE, JSON.stringify(state.rss.cache));
  }

  function fetchRssViaAllOrigins(feed) {
    var statusEl = document.getElementById("rss-status");
    var proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(feed.url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", proxyUrl, true);
    xhr.timeout = 12000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      state.rss.loadingFeed = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res && res.contents) {
            var items = parseXmlRssItems(res.contents, feed);
            if (items.length > 0) {
              var now = new Date();
              var tStr = pad2(now.getHours()) + ":" + pad2(now.getMinutes());
              saveRssCache(feed.id, items, tStr);
              statusEl.textContent = feed.name + " · Cập nhật lúc " + tStr + " (" + items.length + " tin)";
              renderRssList();
              return;
            }
          }
        } catch (e) { /* ignore */ }
      }
      var cached = state.rss.cache[feed.id];
      if (cached && cached.items && cached.items.length > 0) {
        statusEl.textContent = feed.name + " · Đang dùng bản lưu tạm (" + (cached.timeStr || "--:--") + ")";
      } else {
        statusEl.textContent = "Không tải được nguồn " + feed.name + " (kiểm tra Wi-Fi hoặc URL RSS).";
      }
      renderRssList();
    };
    try { xhr.send(); } catch (e) {
      state.rss.loadingFeed = false;
      renderRssList();
    }
  }

  function fetchRssFeed(feedId) {
    var feed = findFeedById(feedId || state.rss.activeFeedId);
    state.rss.activeFeedId = feed.id;
    storageSet(STORAGE_KEYS.RSS_ACTIVE, feed.id);
    renderRssSourceTabs();

    var statusEl = document.getElementById("rss-status");
    state.rss.loadingFeed = true;
    statusEl.textContent = "Đang tải " + feed.name + "...";

    var cached = state.rss.cache[feed.id];
    if (cached && cached.items) {
      renderRssList();
    }

    var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feed.url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true);
    xhr.timeout = 12000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && data.status === "ok" && data.items && data.items.length > 0) {
            state.rss.loadingFeed = false;
            var mapped = [];
            var i;
            for (i = 0; i < data.items.length; i++) {
              var it = data.items[i];
              var snippet = stripHtml(it.description || it.content || "");
              mapped.push({
                id: getArticleId(it, feed.name),
                title: decodeEntities(trimStr(it.title || "Không có tiêu đề")),
                link: trimStr(it.link || ""),
                pubDate: it.pubDate || "",
                pubText: formatRssDate(it.pubDate || ""),
                snippet: snippet,
                rawContent: it.content || it.description || "",
                sourceId: feed.id,
                sourceName: feed.name,
                fullParagraphs: null
              });
            }
            var now = new Date();
            var tStr = pad2(now.getHours()) + ":" + pad2(now.getMinutes());
            saveRssCache(feed.id, mapped, tStr);
            statusEl.textContent = feed.name + " · Cập nhật lúc " + tStr + " (" + mapped.length + " tin)";
            renderRssList();
            return;
          }
        } catch (e) { /* fallback */ }
      }
      fetchRssViaAllOrigins(feed);
    };

    xhr.ontimeout = function () { fetchRssViaAllOrigins(feed); };
    xhr.onerror = function () { fetchRssViaAllOrigins(feed); };
    try { xhr.send(); } catch (e) { fetchRssViaAllOrigins(feed); }
  }

  function findArticleById(id) {
    var i;
    for (i = 0; i < state.rss.savedList.length; i++) {
      if (state.rss.savedList[i].id === id) {
        return state.rss.savedList[i];
      }
    }
    var k;
    for (k in state.rss.cache) {
      if (state.rss.cache.hasOwnProperty(k)) {
        var arr = state.rss.cache[k].items || [];
        for (i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            return arr[i];
          }
        }
      }
    }
    return null;
  }

  function toggleSaveArticle(id) {
    var idx = isArticleSaved(id);
    if (idx !== -1) {
      state.rss.savedList.splice(idx, 1);
    } else {
      var art = findArticleById(id);
      if (art) {
        var copy = {
          id: art.id,
          title: art.title,
          link: art.link,
          pubDate: art.pubDate,
          pubText: art.pubText,
          snippet: art.snippet,
          rawContent: art.rawContent,
          sourceId: art.sourceId,
          sourceName: art.sourceName,
          fullParagraphs: art.fullParagraphs || null
        };
        state.rss.savedList.unshift(copy);
        if (state.rss.savedList.length > 30) {
          state.rss.savedList.pop();
        }
      }
    }
    storageSet(STORAGE_KEYS.RSS_SAVED, JSON.stringify(state.rss.savedList));
    renderRssList();
    if (state.rss.activeArticle && state.rss.activeArticle.id === id) {
      updateArticleSaveButton();
    }
  }

  /* ========================================================================
     7. TRÌNH ĐỌC BÁO TOÀN VĂN & LẬT TRANG KIỂU KINDLE
     ======================================================================== */
  function cleanMarkdownLine(line) {
    var s = trimStr(line);
    // Bỏ hình ảnh markdown ![alt](url)
    s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
    // Chuyển link markdown [text](url) -> text
    s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    // Bỏ đánh dấu in đậm / nghiêng thừa ở dạng ký tự thô
    s = s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1");
    s = trimStr(s);
    return s;
  }

  function parseJinaMarkdown(rawText, articleTitle) {
    var marker = "Markdown Content:";
    var idx = rawText.indexOf(marker);
    var body = idx !== -1 ? rawText.slice(idx + marker.length) : rawText;
    var lines = body.split(/\r?\n/);
    var blocks = [];
    var totalChars = 0;
    var i;

    for (i = 0; i < lines.length; i++) {
      var rawLine = trimStr(lines[i]);
      if (!rawLine) { continue; }
      if (/^[-=*_]{3,}$/.test(rawLine)) { continue; }
      if (/^!\[.*\]\(.*\)$/.test(rawLine)) { continue; }
      if (/^\*\s+\[/.test(rawLine)) { continue; }

      var isHeading = false;
      if (rawLine.indexOf("##") === 0 || rawLine.indexOf("# ") === 0) {
        isHeading = true;
        rawLine = rawLine.replace(/^#+\s*/, "");
      } else if (rawLine.indexOf("> ") === 0) {
        rawLine = rawLine.slice(2);
      }

      var cleaned = cleanMarkdownLine(rawLine);
      if (!cleaned) { continue; }
      // Bỏ dòng trùng với tiêu đề bài báo ở đầu
      if (blocks.length === 0 && articleTitle && cleaned === trimStr(articleTitle)) {
        continue;
      }
      // Bỏ các dòng rác điều hướng ngắn cuối/đầu trang
      if (!isHeading && cleaned.length < 25 && (
        cleaned.indexOf("Trang chủ") !== -1 ||
        cleaned.indexOf("Tin mới") !== -1 ||
        cleaned.indexOf("Xem thêm") !== -1 ||
        cleaned.indexOf("Đăng nhập") !== -1 ||
        cleaned.indexOf("Chia sẻ") !== -1 ||
        cleaned.indexOf("Theo dõi") !== -1
      )) {
        continue;
      }
      if (/^https?:\/\/\S+$/.test(cleaned)) { continue; }

      blocks.push({
        type: isHeading ? "h" : "p",
        text: cleaned
      });
      totalChars += cleaned.length;
    }

    if (totalChars < 120) {
      return null;
    }
    return blocks;
  }

  function buildFallbackBlocks(article) {
    var text = stripHtml(article.rawContent || article.snippet || "");
    var lines = text.split(/\n+/);
    var blocks = [];
    var i;
    for (i = 0; i < lines.length; i++) {
      var s = trimStr(lines[i]);
      if (s) {
        blocks.push({ type: "p", text: s });
      }
    }
    if (blocks.length === 0) {
      blocks.push({ type: "p", text: "Bài viết chỉ cung cấp tiêu đề trên RSS. Hãy bấm 'Tải toàn văn' hoặc 'Mở link gốc'." });
    }
    return blocks;
  }

  function buildArticlePages(blocks) {
    var limit = 950;
    if (state.rss.articleFont === "lg") { limit = 760; }
    if (state.rss.articleFont === "xl") { limit = 620; }
    if (state.rss.articleFont === "sm") { limit = 1150; }

    var pages = [];
    var currentPage = [];
    var currentLen = 0;
    var i;

    for (i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (currentPage.length > 0 && currentLen + b.text.length > limit) {
        pages.push(currentPage);
        currentPage = [];
        currentLen = 0;
      }
      currentPage.push(b);
      currentLen += b.text.length;
    }
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    if (pages.length === 0) {
      pages.push([{ type: "p", text: "Không có nội dung." }]);
    }
    return pages;
  }

  function updateArticleSaveButton() {
    if (!state.rss.activeArticle) { return; }
    var saved = (isArticleSaved(state.rss.activeArticle.id) !== -1);
    var btn = document.getElementById("btn-article-save");
    btn.textContent = saved ? "Đã lưu offline" : "Lưu offline";
    if (saved) { addClass(btn, "is-active"); } else { removeClass(btn, "is-active"); }
  }

  function renderArticleReader() {
    var art = state.rss.activeArticle;
    if (!art) { return; }

    var blocks = (art.fullParagraphs && art.fullParagraphs.length > 0)
      ? art.fullParagraphs
      : buildFallbackBlocks(art);

    var contentEl = document.getElementById("article-content");
    contentEl.className = "article-content art-font-" + state.rss.articleFont;

    var modeBtn = document.getElementById("btn-article-mode-toggle");
    var pageNav = document.getElementById("article-page-nav");

    var renderBlocks;
    if (state.rss.articleMode === "page") {
      modeBtn.textContent = "Kiểu: Lật trang";
      pageNav.style.display = "table";
      state.rss.articlePages = buildArticlePages(blocks);
      if (state.rss.articlePageIndex >= state.rss.articlePages.length) {
        state.rss.articlePageIndex = state.rss.articlePages.length - 1;
      }
      if (state.rss.articlePageIndex < 0) {
        state.rss.articlePageIndex = 0;
      }
      renderBlocks = state.rss.articlePages[state.rss.articlePageIndex];
      document.getElementById("article-page-indicator").textContent =
        "Trang " + (state.rss.articlePageIndex + 1) + " / " + state.rss.articlePages.length;
    } else {
      modeBtn.textContent = "Kiểu: Cuộn liền mạch";
      pageNav.style.display = "none";
      renderBlocks = blocks;
    }

    var html = "";
    var i;
    for (i = 0; i < renderBlocks.length; i++) {
      var b = renderBlocks[i];
      if (b.type === "h") {
        html += '<h3 class="article-subhead">' + escapeHtml(b.text) + "</h3>";
      } else {
        html += "<p>" + escapeHtml(b.text) + "</p>";
      }
    }
    contentEl.innerHTML = html;
    document.getElementById("article-modal").scrollTop = 0;
  }

  function fetchArticleFullText(art) {
    var statusEl = document.getElementById("article-status");
    if (!art || !art.link) {
      statusEl.textContent = "Bài viết không có liên kết gốc để trích xuất toàn văn.";
      return;
    }
    statusEl.textContent = "Đang trích xuất toàn văn bài báo cho E-Ink...";

    var url = "https://r.jina.ai/" + art.link;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    try {
      xhr.setRequestHeader("Accept", "application/json");
    } catch (e) { /* bỏ qua nếu trình duyệt cũ không cho phép */ }
    xhr.timeout = 15000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
        var mdText = xhr.responseText;
        try {
          var jsonRes = JSON.parse(xhr.responseText);
          if (jsonRes && jsonRes.data && jsonRes.data.content) {
            mdText = jsonRes.data.content;
          }
        } catch (e) {
          // Giữ nguyên dạng văn bản thô nếu không phải JSON
        }
        var blocks = parseJinaMarkdown(mdText, art.title);
        if (blocks && blocks.length > 0) {
          art.fullParagraphs = blocks;
          // Cập nhật lại nếu bài này đã lưu offline
          var savedIdx = isArticleSaved(art.id);
          if (savedIdx !== -1) {
            state.rss.savedList[savedIdx].fullParagraphs = blocks;
            storageSet(STORAGE_KEYS.RSS_SAVED, JSON.stringify(state.rss.savedList));
          }
          if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
            state.rss.articlePageIndex = 0;
            statusEl.textContent = "Đã tải toàn văn (" + blocks.length + " đoạn · chế độ E-Ink sạch quảng cáo).";
            renderArticleReader();
          }
          return;
        }
      }
      if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
        statusEl.textContent = "Không trích xuất được toàn văn trang này — đang hiển thị tóm tắt RSS.";
      }
    };

    xhr.ontimeout = function () {
      if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
        statusEl.textContent = "Hết thời gian tải toàn văn — đang hiển thị tóm tắt RSS.";
      }
    };
    xhr.onerror = function () {
      if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
        statusEl.textContent = "Không có mạng hoặc trang nguồn chặn trích xuất — hiển thị tóm tắt RSS.";
      }
    };
    try { xhr.send(); } catch (e) { /* ignore */ }
  }

  function openArticleModal(id) {
    var art = findArticleById(id);
    if (!art) { return; }

    state.rss.readMap[art.id] = 1;
    storageSet(STORAGE_KEYS.RSS_READ, JSON.stringify(state.rss.readMap));
    renderRssList();

    state.rss.activeArticle = art;
    state.rss.articlePageIndex = 0;

    document.getElementById("article-source-badge").textContent = art.sourceName;
    document.getElementById("article-title").textContent = art.title;
    document.getElementById("article-meta").textContent =
      art.sourceName + (art.pubText ? " · " + art.pubText : "");

    var origLink = document.getElementById("article-original-link");
    origLink.href = art.link || "#";
    updateArticleSaveButton();

    var statusEl = document.getElementById("article-status");
    if (art.fullParagraphs && art.fullParagraphs.length > 0) {
      statusEl.textContent = "Đang đọc toàn văn đã lưu (" + art.fullParagraphs.length + " đoạn).";
      renderArticleReader();
    } else {
      statusEl.textContent = "Đang hiển thị tóm tắt RSS và tự động tải toàn văn...";
      renderArticleReader();
      fetchArticleFullText(art);
    }

    openModal("article-modal");
  }

  function navigateArticleInFeed(delta) {
    if (!state.rss.activeArticle || state.rss.filteredItems.length === 0) { return; }
    var idx = -1;
    var i;
    for (i = 0; i < state.rss.filteredItems.length; i++) {
      if (state.rss.filteredItems[i].id === state.rss.activeArticle.id) {
        idx = i;
        break;
      }
    }
    var nextIdx = idx + delta;
    if (nextIdx >= 0 && nextIdx < state.rss.filteredItems.length) {
      openArticleModal(state.rss.filteredItems[nextIdx].id);
    }
  }

  function renderRssManageModal() {
    var listEl = document.getElementById("rss-manage-list");
    var all = getAllRssFeeds();
    var html = "";
    var i;
    for (i = 0; i < all.length; i++) {
      var f = all[i];
      var delBtn = f.builtin
        ? ""
        : '<button type="button" class="btn btn-small" data-rss-del-feed="' + escapeHtml(f.id) + '">Xóa</button>';
      html += '<div class="rss-manage-item">' +
        '<div class="rss-manage-info">' +
          "<strong>" + escapeHtml(f.name) + "</strong>" +
          (f.id === state.rss.activeFeedId ? " (Đang chọn)" : "") +
          '<div class="rss-manage-url">' + escapeHtml(f.url) + "</div>" +
        "</div>" +
        '<div class="rss-manage-actions">' +
          '<button type="button" class="btn btn-small" data-rss-pick-feed="' + escapeHtml(f.id) + '">Đọc ngay</button>' +
          delBtn +
        "</div>" +
      "</div>";
    }
    listEl.innerHTML = html;
  }

  /* ========================================================================
     8. CÔNG CỤ E-INK, CÀI ĐẶT TỰ ĐỘNG & CỠ CHỮ
     ======================================================================== */
  function cleanGhosting() {
    var cleaner = document.getElementById("ghost-cleaner");
    cleaner.style.display = "block";
    window.setTimeout(function () {
      cleaner.style.display = "none";
    }, 200);
  }

  function applyAutoCleanTimer() {
    if (state.autoCleanTimerId) {
      window.clearInterval(state.autoCleanTimerId);
      state.autoCleanTimerId = null;
    }
    if (state.autoCleanMinutes > 0) {
      state.autoCleanTimerId = window.setInterval(cleanGhosting, state.autoCleanMinutes * 60 * 1000);
    }
    updateEinkStatusPill();
  }

  function updateEinkStatusPill() {
    var parts = [];
    parts.push("Làm mới: " + (state.autoCleanMinutes > 0 ? state.autoCleanMinutes + "p" : "Tắt"));
    if (state.autoNightEnabled) {
      parts.push("Đêm tự động: Bật");
    }
    document.getElementById("eink-status-pill").textContent = parts.join(" · ");
  }

  function applyFontScale(scale) {
    if (indexInArray(FONT_SCALES, scale) === -1) {
      scale = "md";
    }
    state.fontScale = scale;
    storageSet(STORAGE_KEYS.FONT_SCALE, scale);
    var i;
    for (i = 0; i < FONT_SCALES.length; i++) {
      removeClass(document.body, "font-" + FONT_SCALES[i]);
    }
    addClass(document.body, "font-" + scale);
    syncSettingsModalUi();
  }

  function stepFontScale(delta) {
    var idx = indexInArray(FONT_SCALES, state.fontScale);
    if (idx === -1) { idx = 1; }
    var nextIdx = idx + delta;
    if (nextIdx < 0) { nextIdx = 0; }
    if (nextIdx >= FONT_SCALES.length) { nextIdx = FONT_SCALES.length - 1; }
    applyFontScale(FONT_SCALES[nextIdx]);
  }

  function stepArticleFont(delta) {
    var idx = indexInArray(FONT_SCALES, state.rss.articleFont);
    if (idx === -1) { idx = 1; }
    var nextIdx = idx + delta;
    if (nextIdx < 0) { nextIdx = 0; }
    if (nextIdx >= FONT_SCALES.length) { nextIdx = FONT_SCALES.length - 1; }
    state.rss.articleFont = FONT_SCALES[nextIdx];
    storageSet(STORAGE_KEYS.RSS_ART_FONT, state.rss.articleFont);
    renderArticleReader();
  }

  function toggleZenMode(forceVal) {
    if (typeof forceVal === "boolean") {
      state.zenMode = forceVal;
    } else {
      state.zenMode = !state.zenMode;
    }
    if (state.zenMode) {
      state.rssFullscreen = false;
      removeClass(document.body, "rss-fullscreen-mode");
      addClass(document.body, "zen-mode");
    } else {
      removeClass(document.body, "zen-mode");
    }
    storageSet(STORAGE_KEYS.ZEN_MODE, state.zenMode ? "1" : "0");
    document.getElementById("btn-zen-mode").textContent = state.zenMode ? "Thu gọn" : "Toàn màn hình";
    document.getElementById("btn-zen-toolbar").textContent = state.zenMode ? "Thoát Zen" : "Toàn màn hình";
    document.getElementById("btn-rss-fullscreen").textContent = "Mở rộng";
  }

  function toggleRssFullscreen(forceVal) {
    if (typeof forceVal === "boolean") {
      state.rssFullscreen = forceVal;
    } else {
      state.rssFullscreen = !state.rssFullscreen;
    }
    if (state.rssFullscreen) {
      state.zenMode = false;
      removeClass(document.body, "zen-mode");
      storageSet(STORAGE_KEYS.ZEN_MODE, "0");
      addClass(document.body, "rss-fullscreen-mode");
    } else {
      removeClass(document.body, "rss-fullscreen-mode");
    }
    document.getElementById("btn-rss-fullscreen").textContent = state.rssFullscreen ? "Thu gọn" : "Mở rộng";
    document.getElementById("btn-rss-toolbar").textContent = state.rssFullscreen ? "Về Dashboard" : "Đọc báo RSS";
    document.getElementById("btn-zen-mode").textContent = "Toàn màn hình";
    document.getElementById("btn-zen-toolbar").textContent = "Toàn màn hình";
    state.rss.currentPage = 1;
    renderRssList();
  }

  function syncSettingsModalUi() {
    var cleanBtns = document.getElementById("settings-clean-options").getElementsByTagName("button");
    var i;
    for (i = 0; i < cleanBtns.length; i++) {
      var mins = parseInt(cleanBtns[i].getAttribute("data-auto-clean"), 10);
      if (mins === state.autoCleanMinutes) {
        addClass(cleanBtns[i], "is-active");
      } else {
        removeClass(cleanBtns[i], "is-active");
      }
    }

    var nightBtn = document.getElementById("btn-setting-autonight");
    nightBtn.textContent = state.autoNightEnabled ? "Đang Bật (19:00–06:00)" : "Đang Tắt";
    if (state.autoNightEnabled) { addClass(nightBtn, "is-active"); } else { removeClass(nightBtn, "is-active"); }

    var fontBtns = document.getElementById("settings-font-options").getElementsByTagName("button");
    for (i = 0; i < fontBtns.length; i++) {
      var sc = fontBtns[i].getAttribute("data-font-scale");
      if (sc === state.fontScale) {
        addClass(fontBtns[i], "is-active");
      } else {
        removeClass(fontBtns[i], "is-active");
      }
    }
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
     9. KHỞI TẠO & GẮN SỰ KIỆN
     ======================================================================== */
  function restorePreferences() {
    state.cityId = findCityById(storageGet(STORAGE_KEYS.CITY, "danang")).id;

    if (storageGet(STORAGE_KEYS.INVERT, "0") === "1") {
      addClass(document.body, "invert-mode");
    }
    if (storageGet(STORAGE_KEYS.LANDSCAPE, "0") === "1") {
      addClass(document.body, "landscape-mode");
    }

    state.autoNightEnabled = (storageGet(STORAGE_KEYS.AUTO_NIGHT, "0") === "1");
    state.autoCleanMinutes = parseInt(storageGet(STORAGE_KEYS.AUTO_CLEAN, "0"), 10) || 0;
    applyAutoCleanTimer();

    applyFontScale(storageGet(STORAGE_KEYS.FONT_SCALE, "md"));
    toggleZenMode(storageGet(STORAGE_KEYS.ZEN_MODE, "0") === "1");

    state.rss.customFeeds = storageGetJson(STORAGE_KEYS.RSS_CUSTOM, []);
    state.rss.activeFeedId = findFeedById(storageGet(STORAGE_KEYS.RSS_ACTIVE, "vne-new")).id;
    state.rss.cache = storageGetJson(STORAGE_KEYS.RSS_CACHE, {});
    state.rss.readMap = storageGetJson(STORAGE_KEYS.RSS_READ, {});
    state.rss.savedList = storageGetJson(STORAGE_KEYS.RSS_SAVED, []);
    state.rss.articleMode = storageGet(STORAGE_KEYS.RSS_PAGE_MODE, "page");
    state.rss.articleFont = storageGet(STORAGE_KEYS.RSS_ART_FONT, "md");
  }

  function bindEvents() {
    // Đồng hồ & Zen Mode
    document.getElementById("btn-zen-mode").onclick = function () { toggleZenMode(); };
    document.getElementById("btn-zen-toolbar").onclick = function () { toggleZenMode(); };
    document.getElementById("clock-time").onclick = function () { toggleZenMode(); };

    // Thời tiết
    document.getElementById("btn-refresh-weather").onclick = function () { fetchWeather(); };

    // Pomodoro
    document.getElementById("pomo-presets").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      if (!target) { return; }
      var minsAttr = target.getAttribute("data-pomo-mins");
      if (minsAttr) {
        setPomodoroPreset(parseInt(minsAttr, 10), target.getAttribute("data-pomo-label") || "Đếm ngược");
      }
    };
    document.getElementById("btn-pomo-plus5").onclick = function () {
      state.pomo.remainingMinutes += 5;
      if (state.pomo.running) {
        state.pomo.endTimeMs += 5 * 60000;
        schedulePomodoroTick();
      }
      renderPomodoro();
    };
    document.getElementById("btn-pomo-toggle").onclick = function () {
      if (state.pomo.running) {
        var diff = state.pomo.endTimeMs - new Date().getTime();
        state.pomo.remainingMinutes = Math.max(1, Math.ceil(diff / 60000));
        state.pomo.running = false;
        if (state.pomo.timerId) {
          window.clearTimeout(state.pomo.timerId);
          state.pomo.timerId = null;
        }
        document.getElementById("pomo-status").textContent = "Đã tạm dừng ở mức " + state.pomo.remainingMinutes + " phút";
      } else {
        if (state.pomo.remainingMinutes <= 0) {
          state.pomo.remainingMinutes = state.pomo.presetMinutes;
        }
        state.pomo.running = true;
        state.pomo.endTimeMs = new Date().getTime() + state.pomo.remainingMinutes * 60000;
        document.getElementById("pomo-status").textContent = "Đang chạy · Tự báo bằng nháy E-Ink 3 lần";
        schedulePomodoroTick();
      }
      renderPomodoro();
    };
    document.getElementById("btn-pomo-reset").onclick = function () {
      setPomodoroPreset(state.pomo.presetMinutes, state.pomo.label);
    };

    // Lịch tháng
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
    document.getElementById("calendar-body").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      while (target && target.id !== "calendar-body") {
        var dAttr = target.getAttribute("data-cal-day");
        if (dAttr) {
          state.selectedYear = state.viewYear;
          state.selectedMonth = state.viewMonth;
          state.selectedDay = parseInt(dAttr, 10);
          renderCalendar();
          renderSelectedDayDetail();
          return;
        }
        target = target.parentNode;
      }
    };

    // RSS Reader danh sách & bộ lọc
    document.getElementById("btn-rss-fullscreen").onclick = function () { toggleRssFullscreen(); };
    document.getElementById("btn-rss-toolbar").onclick = function () { toggleRssFullscreen(); };
    document.getElementById("btn-rss-refresh").onclick = function () { fetchRssFeed(state.rss.activeFeedId); };
    document.getElementById("rss-source-tabs").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var fid = target ? target.getAttribute("data-feed-id") : null;
      if (fid) {
        if (state.rss.filterMode === "saved") {
          state.rss.filterMode = "all";
        }
        state.rss.currentPage = 1;
        fetchRssFeed(fid);
      }
    };
    document.getElementById("btn-rss-filter-all").onclick = function () {
      state.rss.filterMode = "all";
      state.rss.currentPage = 1;
      renderRssList();
    };
    document.getElementById("btn-rss-filter-unread").onclick = function () {
      state.rss.filterMode = "unread";
      state.rss.currentPage = 1;
      renderRssList();
    };
    document.getElementById("btn-rss-filter-saved").onclick = function () {
      state.rss.filterMode = "saved";
      state.rss.currentPage = 1;
      renderRssList();
    };
    document.getElementById("btn-rss-mark-all-read").onclick = function () {
      var feedData = state.rss.cache[state.rss.activeFeedId];
      if (feedData && feedData.items) {
        var i;
        for (i = 0; i < feedData.items.length; i++) {
          state.rss.readMap[feedData.items[i].id] = 1;
        }
        storageSet(STORAGE_KEYS.RSS_READ, JSON.stringify(state.rss.readMap));
        renderRssList();
      }
    };
    document.getElementById("rss-search-input").oninput = function () {
      state.rss.searchQuery = this.value || "";
      state.rss.currentPage = 1;
      renderRssList();
    };
    document.getElementById("btn-rss-clear-search").onclick = function () {
      document.getElementById("rss-search-input").value = "";
      state.rss.searchQuery = "";
      state.rss.currentPage = 1;
      renderRssList();
    };
    document.getElementById("btn-rss-prev-page").onclick = function () {
      if (state.rss.currentPage > 1) {
        state.rss.currentPage -= 1;
        renderRssList();
      }
    };
    document.getElementById("btn-rss-next-page").onclick = function () {
      state.rss.currentPage += 1;
      renderRssList();
    };
    document.getElementById("rss-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      while (target && target.id !== "rss-list") {
        var saveId = target.getAttribute("data-rss-toggle-save");
        if (saveId) {
          toggleSaveArticle(saveId);
          return;
        }
        var openId = target.getAttribute("data-rss-open");
        if (openId) {
          openArticleModal(openId);
          return;
        }
        target = target.parentNode;
      }
    };

    // Quản lý nguồn RSS
    document.getElementById("btn-rss-manage").onclick = function () {
      document.getElementById("rss-manage-status").textContent = "";
      renderRssManageModal();
      openModal("rss-manage-modal");
    };
    document.getElementById("btn-close-rss-manage").onclick = function () { closeModal("rss-manage-modal"); };
    document.getElementById("btn-rss-add-source").onclick = function () {
      var name = trimStr(document.getElementById("rss-add-name").value);
      var url = trimStr(document.getElementById("rss-add-url").value);
      var statusEl = document.getElementById("rss-manage-status");
      if (!name || !url || url.indexOf("http") !== 0) {
        statusEl.textContent = "Vui lòng nhập Tên nguồn và đường dẫn RSS bắt đầu bằng http:// hoặc https://.";
        return;
      }
      var newFeed = {
        id: "custom-" + new Date().getTime(),
        name: name,
        url: url,
        builtin: false
      };
      state.rss.customFeeds.push(newFeed);
      storageSet(STORAGE_KEYS.RSS_CUSTOM, JSON.stringify(state.rss.customFeeds));
      document.getElementById("rss-add-name").value = "";
      document.getElementById("rss-add-url").value = "";
      statusEl.textContent = "Đã thêm nguồn: " + name;
      renderRssSourceTabs();
      renderRssManageModal();
    };
    document.getElementById("rss-manage-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var pickId = target ? target.getAttribute("data-rss-pick-feed") : null;
      if (pickId) {
        closeModal("rss-manage-modal");
        state.rss.filterMode = "all";
        state.rss.currentPage = 1;
        fetchRssFeed(pickId);
        return;
      }
      var delId = target ? target.getAttribute("data-rss-del-feed") : null;
      if (delId) {
        var next = [];
        var i;
        for (i = 0; i < state.rss.customFeeds.length; i++) {
          if (state.rss.customFeeds[i].id !== delId) {
            next.push(state.rss.customFeeds[i]);
          }
        }
        state.rss.customFeeds = next;
        storageSet(STORAGE_KEYS.RSS_CUSTOM, JSON.stringify(state.rss.customFeeds));
        if (state.rss.activeFeedId === delId) {
          state.rss.activeFeedId = DEFAULT_RSS_FEEDS[0].id;
        }
        renderRssSourceTabs();
        renderRssManageModal();
      }
    };

    // Trình đọc bài viết toàn văn
    document.getElementById("btn-close-article").onclick = function () { closeModal("article-modal"); };
    document.getElementById("btn-article-font-down").onclick = function () { stepArticleFont(-1); };
    document.getElementById("btn-article-font-up").onclick = function () { stepArticleFont(1); };
    document.getElementById("btn-article-save").onclick = function () {
      if (state.rss.activeArticle) { toggleSaveArticle(state.rss.activeArticle.id); }
    };
    document.getElementById("btn-article-fetch-full").onclick = function () {
      if (state.rss.activeArticle) { fetchArticleFullText(state.rss.activeArticle); }
    };
    document.getElementById("btn-article-mode-toggle").onclick = function () {
      state.rss.articleMode = (state.rss.articleMode === "page") ? "scroll" : "page";
      storageSet(STORAGE_KEYS.RSS_PAGE_MODE, state.rss.articleMode);
      renderArticleReader();
    };
    document.getElementById("btn-article-page-prev").onclick = function () {
      if (state.rss.articlePageIndex > 0) {
        state.rss.articlePageIndex -= 1;
        renderArticleReader();
      }
    };
    document.getElementById("btn-article-page-next").onclick = function () {
      if (state.rss.articlePageIndex < state.rss.articlePages.length - 1) {
        state.rss.articlePageIndex += 1;
        renderArticleReader();
      }
    };
    document.getElementById("btn-article-item-prev").onclick = function () { navigateArticleInFeed(-1); };
    document.getElementById("btn-article-item-next").onclick = function () { navigateArticleInFeed(1); };

    // Thanh công cụ dưới cùng & Cài đặt E-Ink
    document.getElementById("btn-clean-ghost").onclick = function () { cleanGhosting(); };
    document.getElementById("btn-font-down").onclick = function () { stepFontScale(-1); };
    document.getElementById("btn-font-up").onclick = function () { stepFontScale(1); };
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
    document.getElementById("btn-close-city").onclick = function () { closeModal("city-modal"); };
    document.getElementById("city-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      if (target && target.getAttribute("data-city")) {
        state.cityId = target.getAttribute("data-city");
        storageSet(STORAGE_KEYS.CITY, state.cityId);
        closeModal("city-modal");
        fetchWeather();
      }
    };

    document.getElementById("btn-settings-modal").onclick = function () {
      syncSettingsModalUi();
      openModal("settings-modal");
    };
    document.getElementById("btn-close-settings").onclick = function () { closeModal("settings-modal"); };
    document.getElementById("settings-clean-options").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var mins = target ? target.getAttribute("data-auto-clean") : null;
      if (mins !== null) {
        state.autoCleanMinutes = parseInt(mins, 10) || 0;
        storageSet(STORAGE_KEYS.AUTO_CLEAN, String(state.autoCleanMinutes));
        applyAutoCleanTimer();
        syncSettingsModalUi();
      }
    };
    document.getElementById("btn-setting-autonight").onclick = function () {
      state.autoNightEnabled = !state.autoNightEnabled;
      state.lastAutoNightState = null;
      storageSet(STORAGE_KEYS.AUTO_NIGHT, state.autoNightEnabled ? "1" : "0");
      if (state.autoNightEnabled) {
        checkAutoNightMode(new Date());
      }
      updateEinkStatusPill();
      syncSettingsModalUi();
    };
    document.getElementById("settings-font-options").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var sc = target ? target.getAttribute("data-font-scale") : null;
      if (sc) { applyFontScale(sc); }
    };
    document.getElementById("btn-setting-layout").onclick = function () {
      var isLandscape = toggleClass(document.body, "landscape-mode");
      storageSet(STORAGE_KEYS.LANDSCAPE, isLandscape ? "1" : "0");
    };
    document.getElementById("btn-setting-invert").onclick = function () {
      var isInvert = toggleClass(document.body, "invert-mode");
      storageSet(STORAGE_KEYS.INVERT, isInvert ? "1" : "0");
    };

    document.getElementById("btn-help-modal").onclick = function () { openModal("help-modal"); };
    document.getElementById("btn-close-help").onclick = function () { closeModal("help-modal"); };
  }

  function init() {
    restorePreferences();
    bindEvents();
    updateClock();
    renderPomodoro();
    renderRssSourceTabs();
    renderRssList();

    var cachedWeather = loadCachedForCity(STORAGE_KEYS.WEATHER_CACHE, state.cityId);
    if (cachedWeather) {
      renderWeather(cachedWeather.data, true, cachedWeather.timeStr || "--:--");
    }
    var cachedAqi = loadCachedForCity(STORAGE_KEYS.AQI_CACHE, state.cityId);
    if (cachedAqi) {
      renderAirQuality(cachedAqi.data);
    }
    fetchWeather();
    fetchRssFeed(state.rss.activeFeedId);

    // Tự động cập nhật thời tiết mỗi 30 phút và RSS mỗi 60 phút
    window.setInterval(fetchWeather, 30 * 60 * 1000);
    window.setInterval(function () {
      fetchRssFeed(state.rss.activeFeedId);
    }, 60 * 60 * 1000);
  }

  init();
})();
