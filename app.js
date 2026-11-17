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
    ROTATION: "kindle_dash_rotation_v1",
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
    RSS_ART_FONT: "kindle_dash_rss_artfont_v1",
    PC_ROOM: "kindle_dash_pc_room_v1",
    PC_INBOX: "kindle_dash_pc_inbox_v1",
    PC_AUTO_POLL: "kindle_dash_pc_autopoll_v1",
    PC_DISMISSED: "kindle_dash_pc_dismissed_v1",
    LAST_WEB_URL: "kindle_dash_last_url_v1"
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
    rotationDeg: 0,
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
      articlePageIndex: 0,
      readerHistory: []
    },
    pcSync: {
      roomCode: "",
      inboxList: [],
      autoPoll: true,
      pollTimerId: null,
      lanAvailable: false,
      syncing: false,
      dismissedIds: {},
      fetchedNtfyIds: {}
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

    var city = findCityById(state.cityId);
    var tempRounded = Math.round(cur.temperature_2m);
    var feelsRounded = Math.round(cur.apparent_temperature);
    var humRounded = Math.round(cur.relative_humidity_2m);
    var windRounded = Math.round(cur.wind_speed_10m);
    var briefRain = (data.daily && data.daily.precipitation_probability_max && data.daily.precipitation_probability_max.length > 0)
      ? " · Mưa " + Math.round(data.daily.precipitation_probability_max[0]) + "%"
      : "";
    document.getElementById("zen-weather-icon").innerHTML = getWeatherSvg(meta.icon);
    document.getElementById("zen-weather-main").textContent =
      city.name + " · " + tempRounded + "°C · " + meta.label;
    document.getElementById("zen-weather-sub").textContent =
      "Cảm giác " + feelsRounded + "°C · Độ ẩm " + humRounded + "% · Gió " + windRounded + " km/h" + briefRain;

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
      var city = findCityById(cityId);
      document.getElementById("weather-desc").textContent = "Không có kết nối Wi-Fi";
      document.getElementById("weather-sync-status").textContent = "Ngoại tuyến";
      document.getElementById("zen-weather-icon").innerHTML = "";
      document.getElementById("zen-weather-main").textContent = city.name + " · Ngoại tuyến";
      document.getElementById("zen-weather-sub").textContent = "Không có dữ liệu thời tiết lưu tạm";
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

  function updatePcCountBadges() {
    var countStr = String(state.pcSync.inboxList.length);
    var rssPc = document.getElementById("rss-pc-count");
    if (rssPc) { rssPc.textContent = countStr; }
    var modalPc = document.getElementById("pc-modal-count");
    if (modalPc) { modalPc.textContent = countStr; }
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
    } else if (state.rss.filterMode === "pc") {
      sourceItems = state.pcSync.inboxList;
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
        var hay = ((item.title || "") + " " + (item.snippet || "") + " " + (item.sourceName || "") + " " + (item.fileName || "")).toLowerCase();
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
    updatePcCountBadges();

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
      var emptyMsg = "Không có bài viết nào phù hợp bộ lọc.";
      if (state.rss.filterMode === "saved") {
        emptyMsg = "Chưa có bài báo nào được lưu đọc offline.";
      } else if (state.rss.filterMode === "pc") {
        emptyMsg = "Hộp thư từ PC đang trống. Bấm 'Gửi/Nhận PC' để đặt mã kết nối hoặc gửi link/file.";
      } else if (state.rss.loadingFeed) {
        emptyMsg = "Đang tải tin tức...";
      }
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

      var badges = '<span class="rss-badge">' + escapeHtml(item.sourceName || "RSS") + "</span>";
      if (item.fileUrl || item.fileName) {
        badges += '<span class="rss-badge is-solid">FILE</span>';
      }
      if (isSaved) {
        badges += '<span class="rss-badge is-solid">ĐÃ LƯU</span>';
      }
      if (isRead) {
        badges += '<span class="rss-badge">ĐÃ ĐỌC</span>';
      }

      var rawSnip = item.snippet || "";
      var snippetShort = rawSnip.length > 150 ? rawSnip.slice(0, 147) + "..." : rawSnip;
      var openBtnText = (item.fileUrl && (!item.fullParagraphs || item.fullParagraphs.length === 0) && !item.link) ? "Mở mục" : "Đọc bài";

      html += '<li class="rss-item' + itemCls + '">' +
        '<div class="rss-item-main" data-rss-open="' + escapeHtml(item.id) + '">' +
          '<div class="rss-item-title">' + escapeHtml(item.title) + "</div>" +
          (snippetShort ? '<div class="rss-item-snippet">' + escapeHtml(snippetShort) + "</div>" : "") +
          '<div class="rss-item-meta">' + badges + (item.pubText ? " · " + escapeHtml(item.pubText) : "") + "</div>" +
        "</div>" +
        '<div class="rss-item-actions">' +
          '<button type="button" class="btn btn-small" data-rss-open="' + escapeHtml(item.id) + '">' + openBtnText + "</button>" +
          '<button type="button" class="btn btn-small" data-rss-toggle-save="' + escapeHtml(item.id) + '">' +
            (isSaved ? "Bỏ lưu" : "Lưu offline") +
          "</button>" +
          (item.fileUrl ? '<a class="btn btn-small" href="' + escapeHtml(item.fileUrl) + '" target="_blank" rel="noopener noreferrer" download>Tải file</a>' : "") +
        "</div>" +
      "</li>";
    }

    listEl.innerHTML = html;
    document.getElementById("rss-page-info").textContent =
      "Trang " + state.rss.currentPage + " / " + totalPages + " (" + items.length + " mục)";
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
    if (state.rss.activeArticle && state.rss.activeArticle.id === id) {
      return state.rss.activeArticle;
    }
    for (i = 0; i < state.rss.savedList.length; i++) {
      if (state.rss.savedList[i].id === id) {
        return state.rss.savedList[i];
      }
    }
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      if (state.pcSync.inboxList[i].id === id) {
        return state.pcSync.inboxList[i];
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

  function cloneArticleForStorage(art) {
    return {
      id: art.id,
      title: art.title,
      link: art.link || "",
      pubDate: art.pubDate || "",
      pubText: art.pubText || "",
      snippet: art.snippet || "",
      rawContent: art.rawContent || "",
      sourceId: art.sourceId || "",
      sourceName: art.sourceName || "WEB E-INK",
      fullParagraphs: art.fullParagraphs || null,
      extractedLinks: art.extractedLinks || [],
      fileName: art.fileName || "",
      fileUrl: art.fileUrl || "",
      itemType: art.itemType || ""
    };
  }

  function toggleSaveArticle(id) {
    var idx = isArticleSaved(id);
    if (idx !== -1) {
      state.rss.savedList.splice(idx, 1);
    } else {
      var art = findArticleById(id);
      if (art) {
        state.rss.savedList.unshift(cloneArticleForStorage(art));
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
     7. ĐỌC TRANG WEB BẤT KỲ, TRÍCH XUẤT ĐA TẦNG & LẬT TRANG KIỂU KINDLE
     ======================================================================== */
  function normalizeWebUrl(rawUrl) {
    var s = trimStr(rawUrl);
    if (!s) { return ""; }
    if (!/^https?:\/\//i.test(s)) {
      s = "https://" + s;
    }
    if (/^https?:\/\/[^\/\s]+\.[^\/\s]+/i.test(s) || /^https?:\/\/localhost(:\d+)?(\/|$)/i.test(s)) {
      return s;
    }
    return "";
  }

  function resolveRelativeUrl(href, baseUrl) {
    var raw = trimStr(href);
    if (!raw || raw.indexOf("#") === 0) { return ""; }
    var low = raw.toLowerCase();
    if (low.indexOf("javascript:") === 0 || low.indexOf("mailto:") === 0 || low.indexOf("tel:") === 0 || low.indexOf("data:") === 0) {
      return "";
    }
    if (typeof URL === "function") {
      try {
        return new URL(raw, baseUrl).href;
      } catch (e) { /* fallback */ }
    }
    if (/^https?:\/\//i.test(raw)) { return raw; }
    var mOrigin = String(baseUrl || "").match(/^(https?:)\/\/([^\/?#]+)/i);
    if (!mOrigin) { return ""; }
    var protocol = mOrigin[1];
    var origin = protocol + "//" + mOrigin[2];
    if (raw.indexOf("//") === 0) { return protocol + raw; }
    if (raw.indexOf("/") === 0) { return origin + raw; }
    var cleanBase = String(baseUrl).split(/[?#]/)[0];
    var slashIdx = cleanBase.lastIndexOf("/");
    var baseDir = slashIdx > 8 ? cleanBase.slice(0, slashIdx + 1) : (origin + "/");
    return baseDir + raw;
  }

  function isBoilerplateLinkText(text) {
    var low = trimStr(text).toLowerCase();
    if (low.length < 6) { return true; }
    var bad = [
      "trang chủ", "đăng nhập", "đăng ký", "chính sách", "điều khoản",
      "quảng cáo", "liên hệ", "về chúng tôi", "chia sẻ", "theo dõi",
      "login", "sign in", "sign up", "register", "privacy", "terms", "cookie"
    ];
    var i;
    for (i = 0; i < bad.length; i++) {
      if (low === bad[i] || (low.length < 22 && low.indexOf(bad[i]) !== -1)) {
        return true;
      }
    }
    return false;
  }

  function cleanMarkdownLine(line) {
    var s = trimStr(line);
    // Bỏ hình ảnh markdown ![alt](url)
    s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
    // Chuyển link markdown [text](url) -> text
    s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    // Bỏ đánh dấu in đậm / nghiêng / code thừa
    s = s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/`([^`]+)`/g, "$1");
    s = trimStr(s);
    return s;
  }

  function extractLinksFromMarkdown(body, baseUrl) {
    var links = [];
    var seen = {};
    var normBase = String(baseUrl || "").replace(/\/$/, "");
    var re = /(!?)\[([^\]]{4,140})\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    var m;
    while ((m = re.exec(body)) !== null) {
      if (m[1] === "!") { continue; }
      var label = trimStr(m[2].replace(/\s+/g, " "));
      var resolved = resolveRelativeUrl(m[3], baseUrl);
      if (!resolved || !/^https?:\/\//i.test(resolved)) { continue; }
      if (/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)(\?|$)/i.test(resolved)) { continue; }
      if (resolved.replace(/\/$/, "") === normBase) { continue; }
      if (isBoilerplateLinkText(label)) { continue; }
      if (!seen[resolved]) {
        seen[resolved] = 1;
        links.push({ text: label, url: resolved });
        if (links.length >= 15) { break; }
      }
    }
    return links;
  }

  function parseJinaResponse(rawText, articleTitle, baseUrl) {
    var jinaTitle = "";
    var titleMatch = String(rawText || "").match(/^Title:\s*(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      jinaTitle = trimStr(titleMatch[1]);
    }

    var marker = "Markdown Content:";
    var idx = rawText.indexOf(marker);
    var body = idx !== -1 ? rawText.slice(idx + marker.length) : rawText;
    var links = extractLinksFromMarkdown(body, baseUrl);
    var lines = body.split(/\r?\n/);
    var blocks = [];
    var totalChars = 0;
    var i;

    for (i = 0; i < lines.length; i++) {
      var rawLine = trimStr(lines[i]);
      if (!rawLine) { continue; }
      if (/^[-=*_]{3,}$/.test(rawLine)) { continue; }
      if (/^!\[.*\]\(.*\)$/.test(rawLine)) { continue; }
      if (/^[\*\-]\s+\[/.test(rawLine)) { continue; }

      var bType = "p";
      if (rawLine.indexOf("##") === 0 || rawLine.indexOf("# ") === 0) {
        bType = "h";
        rawLine = rawLine.replace(/^#+\s*/, "");
      } else if (rawLine.indexOf("> ") === 0) {
        bType = "q";
        rawLine = rawLine.slice(2);
      } else if (/^[\*\-\+]\s+/.test(rawLine) || /^\d+\.\s+/.test(rawLine)) {
        bType = "li";
        rawLine = rawLine.replace(/^([\*\-\+]|\d+\.)\s+/, "");
      }

      var cleaned = cleanMarkdownLine(rawLine);
      if (!cleaned) { continue; }
      if (blocks.length === 0 && articleTitle && cleaned === trimStr(articleTitle)) {
        continue;
      }
      if (bType !== "h" && cleaned.length < 25 && (
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

      blocks.push({ type: bType, text: cleaned });
      totalChars += cleaned.length;
    }

    if (blocks.length === 0 && links.length >= 3) {
      blocks.push({
        type: "p",
        text: "Trang web này chủ yếu chứa danh sách liên kết. Hãy chọn một liên kết bên dưới để đọc tiếp ở chế độ E-Ink."
      });
      totalChars = 120;
    }

    if (totalChars < 100 && blocks.length < 3 && links.length < 3) {
      return null;
    }
    return {
      title: jinaTitle,
      blocks: blocks,
      links: links
    };
  }

  function hasAncestorTag(el, stopRoot, tagMap) {
    var cur = el.parentNode;
    while (cur && cur !== stopRoot) {
      var tn = cur.tagName ? cur.tagName.toLowerCase() : "";
      if (tagMap[tn]) { return true; }
      cur = cur.parentNode;
    }
    return false;
  }

  function removeNodesBySelector(rootEl, selector) {
    try {
      var found = rootEl.querySelectorAll(selector);
      var i;
      for (i = 0; i < found.length; i++) {
        if (found[i] && found[i].parentNode) {
          found[i].parentNode.removeChild(found[i]);
        }
      }
    } catch (e) { /* ignore */ }
  }

  function parseHtmlToArticle(htmlStr, pageUrl) {
    var doc = null;
    try {
      if (window.DOMParser) {
        var parser = new window.DOMParser();
        doc = parser.parseFromString(htmlStr, "text/html");
      }
    } catch (e) { doc = null; }

    if ((!doc || !doc.body) && document.implementation && document.implementation.createHTMLDocument) {
      try {
        doc = document.implementation.createHTMLDocument("extract");
        doc.documentElement.innerHTML = htmlStr;
      } catch (e2) { doc = null; }
    }

    if (!doc || !doc.body) {
      var plain = stripHtml(htmlStr);
      var plainLines = plain.split(/\n+/);
      var plainBlocks = [];
      var pi;
      for (pi = 0; pi < plainLines.length; pi++) {
        var pl = trimStr(plainLines[pi]);
        if (pl.length > 20) { plainBlocks.push({ type: "p", text: pl }); }
      }
      return { title: "", blocks: plainBlocks, links: [] };
    }

    var pageTitle = "";
    var h1El = doc.querySelector("h1");
    if (h1El) { pageTitle = trimStr(h1El.textContent || ""); }
    if (!pageTitle && doc.title) { pageTitle = trimStr(doc.title); }

    var selectors = [
      "article", "main", "[role='main']", ".fck_detail", "#main-detail",
      ".singular-content", ".detail-content", ".post-content",
      ".article-content", ".entry-content", "#content"
    ];
    var root = null;
    var si;
    for (si = 0; si < selectors.length; si++) {
      var cand = doc.querySelector(selectors[si]);
      if (cand && trimStr(cand.textContent || "").length >= 160) {
        root = cand.cloneNode(true);
        break;
      }
    }
    var usedBody = false;
    if (!root) {
      root = doc.body.cloneNode(true);
      usedBody = true;
    }

    // Lấy liên kết trước khi dọn dẹp (ưu tiên trong vùng nội dung chính, nếu ít thì lấy thêm ở body)
    var links = [];
    var seenLinks = {};
    var normBase = String(pageUrl || "").replace(/\/$/, "");
    function collectLinksFrom(containerEl) {
      if (!containerEl) { return; }
      var anchors = containerEl.getElementsByTagName("a");
      var ai;
      for (ai = 0; ai < anchors.length; ai++) {
        var a = anchors[ai];
        var txt = trimStr((a.textContent || "").replace(/\s+/g, " "));
        var resolved = resolveRelativeUrl(a.getAttribute("href") || "", pageUrl);
        if (!resolved || !/^https?:\/\//i.test(resolved)) { continue; }
        if (/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)(\?|$)/i.test(resolved)) { continue; }
        if (resolved.replace(/\/$/, "") === normBase) { continue; }
        if (isBoilerplateLinkText(txt)) { continue; }
        if (!seenLinks[resolved]) {
          seenLinks[resolved] = 1;
          links.push({ text: txt.slice(0, 110), url: resolved });
          if (links.length >= 15) { break; }
        }
      }
    }
    collectLinksFrom(root);
    if (links.length < 5 && !usedBody) {
      collectLinksFrom(doc.body);
    }

    removeNodesBySelector(root, "script, style, noscript, iframe, svg, nav, footer, aside, form, button, input, select, textarea, .ads, .advertisement, .social-share");
    if (usedBody) {
      removeNodesBySelector(root, "header");
    }

    var blocks = [];
    var totalChars = 0;
    var skipAncestors = { table: 1, blockquote: 1, pre: 1, li: 1 };
    var nodes = root.querySelectorAll("h1, h2, h3, h4, p, li, blockquote, pre, table");
    var ni;
    for (ni = 0; ni < nodes.length; ni++) {
      var node = nodes[ni];
      var tag = node.tagName ? node.tagName.toLowerCase() : "";
      if (hasAncestorTag(node, root, skipAncestors)) { continue; }

      if (tag === "table") {
        var trs = node.getElementsByTagName("tr");
        var rows = [];
        var r;
        var maxRows = trs.length < 30 ? trs.length : 30;
        for (r = 0; r < maxRows; r++) {
          var cells = trs[r].querySelectorAll("th, td");
          var rowVals = [];
          var c;
          var maxCols = cells.length < 8 ? cells.length : 8;
          for (c = 0; c < maxCols; c++) {
            rowVals.push(trimStr((cells[c].textContent || "").replace(/\s+/g, " ")));
          }
          if (rowVals.length > 0) {
            rows.push(rowVals);
            totalChars += rowVals.join(" ").length;
          }
        }
        if (rows.length > 0) {
          blocks.push({ type: "table", rows: rows });
        }
        continue;
      }

      var txtVal = trimStr((node.textContent || "").replace(/\s+/g, " "));
      if (!txtVal) { continue; }
      if (blocks.length === 0 && pageTitle && txtVal === pageTitle && (tag === "h1" || tag === "h2")) {
        continue;
      }

      var blockType = "p";
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
        blockType = "h";
      } else if (tag === "li") {
        if (txtVal.length < 4) { continue; }
        blockType = "li";
      } else if (tag === "blockquote") {
        blockType = "q";
      }

      blocks.push({ type: blockType, text: txtVal });
      totalChars += txtVal.length;
      if (blocks.length >= 600) { break; }
    }

    if (blocks.length === 0 && links.length >= 3) {
      blocks.push({
        type: "p",
        text: "Trang web này chủ yếu là danh sách liên kết. Hãy bấm vào các liên kết bên dưới để đọc tiếp."
      });
      totalChars = 100;
    }

    return {
      title: pageTitle,
      blocks: blocks,
      links: links,
      totalChars: totalChars
    };
  }

  function fetchHtmlViaProxies(url, candidates, index, onDone) {
    if (index >= candidates.length) {
      onDone({ ok: false });
      return;
    }
    var cand = candidates[index];
    var xhr = new XMLHttpRequest();
    xhr.open("GET", cand.endpoint, true);
    xhr.timeout = 13000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
        var htmlStr = "";
        var finalUrl = url;
        if (cand.kind === "lan") {
          try {
            var lanRes = JSON.parse(xhr.responseText);
            if (lanRes && lanRes.ok && lanRes.html) {
              htmlStr = lanRes.html;
              finalUrl = lanRes.url || url;
            }
          } catch (e) { htmlStr = ""; }
        } else if (cand.kind === "allorigins") {
          try {
            var aoRes = JSON.parse(xhr.responseText);
            if (aoRes && aoRes.contents) {
              htmlStr = aoRes.contents;
            }
          } catch (e2) { htmlStr = ""; }
        } else {
          htmlStr = xhr.responseText;
        }

        if (htmlStr && htmlStr.length > 80) {
          var parsed = parseHtmlToArticle(htmlStr, finalUrl);
          if ((parsed.blocks && parsed.blocks.length >= 2) || (parsed.totalChars && parsed.totalChars >= 100) || (parsed.links && parsed.links.length >= 3)) {
            onDone({
              ok: true,
              title: parsed.title,
              blocks: parsed.blocks,
              links: parsed.links,
              via: cand.label
            });
            return;
          }
        }
      }
      fetchHtmlViaProxies(url, candidates, index + 1, onDone);
    };

    xhr.ontimeout = function () { fetchHtmlViaProxies(url, candidates, index + 1, onDone); };
    xhr.onerror = function () { fetchHtmlViaProxies(url, candidates, index + 1, onDone); };
    try { xhr.send(); } catch (e) { fetchHtmlViaProxies(url, candidates, index + 1, onDone); }
  }

  function extractWebPageContent(url, currentTitle, onDone) {
    var jinaUrl = "https://r.jina.ai/" + url;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jinaUrl, true);
    try {
      xhr.setRequestHeader("Accept", "application/json");
    } catch (e) { /* bỏ qua nếu trình duyệt cũ không cho phép */ }
    xhr.timeout = 14000;

    function runHtmlFallback() {
      var candidates = [];
      if (state.pcSync.lanAvailable) {
        candidates.push({
          kind: "lan",
          label: "LAN Proxy",
          endpoint: "/api/extract?url=" + encodeURIComponent(url)
        });
      }
      candidates.push({
        kind: "allorigins",
        label: "AllOrigins",
        endpoint: "https://api.allorigins.win/get?url=" + encodeURIComponent(url)
      });
      candidates.push({
        kind: "codetabs",
        label: "CodeTabs",
        endpoint: "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(url)
      });
      fetchHtmlViaProxies(url, candidates, 0, onDone);
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
        var mdText = xhr.responseText;
        var jsonTitle = "";
        try {
          var jsonRes = JSON.parse(xhr.responseText);
          if (jsonRes && jsonRes.data && jsonRes.data.content) {
            mdText = jsonRes.data.content;
            jsonTitle = trimStr(jsonRes.data.title || "");
          }
        } catch (e) { /* giữ nguyên dạng văn bản thô */ }

        var parsed = parseJinaResponse(mdText, currentTitle, url);
        if (parsed && parsed.blocks && parsed.blocks.length > 0) {
          onDone({
            ok: true,
            title: jsonTitle || parsed.title,
            blocks: parsed.blocks,
            links: parsed.links,
            via: "Jina Reader"
          });
          return;
        }
      }
      runHtmlFallback();
    };

    xhr.ontimeout = runHtmlFallback;
    xhr.onerror = runHtmlFallback;
    try { xhr.send(); } catch (e) { runHtmlFallback(); }
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
      if (article.fileUrl && !article.link) {
        blocks.push({ type: "p", text: "Đây là file đính kèm từ PC. Hãy bấm nút 'Tải file' ở phía trên để tải về máy Kindle." });
      } else {
        blocks.push({ type: "p", text: "Bài viết chưa có nội dung xem trước. Hãy bấm 'Tải toàn văn' hoặc 'Mở link gốc'." });
      }
    }
    return blocks;
  }

  function getBlockCharLength(block) {
    if (!block) { return 0; }
    if (block.type === "table" && block.rows) {
      var len = 0;
      var r;
      for (r = 0; r < block.rows.length; r++) {
        len += block.rows[r].join(" ").length + 20;
      }
      return len;
    }
    return (block.text || "").length;
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
      var bLen = getBlockCharLength(b);
      if (currentPage.length > 0 && currentLen + bLen > limit) {
        pages.push(currentPage);
        currentPage = [];
        currentLen = 0;
      }
      currentPage.push(b);
      currentLen += bLen;
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

  function renderArticleLinksBox(art) {
    var box = document.getElementById("article-links-box");
    if (!box) { return; }
    if (!art || !art.extractedLinks || art.extractedLinks.length === 0) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }
    var html = '<div class="article-links-title">LIÊN KẾT TRONG TRANG (CHẠM ĐỂ ĐỌC E-INK):</div>';
    var i;
    for (i = 0; i < art.extractedLinks.length; i++) {
      var lnk = art.extractedLinks[i];
      html += '<button type="button" class="btn btn-small article-link-btn" data-reader-link="' +
        escapeHtml(lnk.url) + '" data-reader-link-title="' + escapeHtml(lnk.text) + '">' +
        (i + 1) + ". " + escapeHtml(lnk.text) +
        "</button>";
    }
    box.innerHTML = html;
    box.style.display = "block";
  }

  function renderArticleBlocksHtml(renderBlocks) {
    var html = "";
    var inList = false;
    var i;
    for (i = 0; i < renderBlocks.length; i++) {
      var b = renderBlocks[i];
      if (b.type === "li") {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += "<li>" + escapeHtml(b.text) + "</li>";
        continue;
      }
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (b.type === "h") {
        html += '<h3 class="article-subhead">' + escapeHtml(b.text) + "</h3>";
      } else if (b.type === "q") {
        html += "<blockquote>" + escapeHtml(b.text) + "</blockquote>";
      } else if (b.type === "table" && b.rows) {
        html += '<div class="article-table-wrap"><table class="article-table">';
        var r, c;
        for (r = 0; r < b.rows.length; r++) {
          html += "<tr>";
          var cellTag = (r === 0) ? "th" : "td";
          for (c = 0; c < b.rows[r].length; c++) {
            html += "<" + cellTag + ">" + escapeHtml(b.rows[r][c]) + "</" + cellTag + ">";
          }
          html += "</tr>";
        }
        html += "</table></div>";
      } else {
        html += "<p>" + escapeHtml(b.text) + "</p>";
      }
    }
    if (inList) {
      html += "</ul>";
    }
    return html;
  }

  function renderArticleReader() {
    var art = state.rss.activeArticle;
    if (!art) { return; }

    var backBtn = document.getElementById("btn-article-back");
    if (backBtn) {
      backBtn.style.display = state.rss.readerHistory.length > 0 ? "table-cell" : "none";
    }

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

    contentEl.innerHTML = renderArticleBlocksHtml(renderBlocks);
    renderArticleLinksBox(art);
    document.getElementById("article-modal").scrollTop = 0;
  }

  function syncExtractedBackToStores(art) {
    var savedIdx = isArticleSaved(art.id);
    if (savedIdx !== -1) {
      state.rss.savedList[savedIdx].title = art.title;
      state.rss.savedList[savedIdx].fullParagraphs = art.fullParagraphs;
      state.rss.savedList[savedIdx].extractedLinks = art.extractedLinks || [];
      storageSet(STORAGE_KEYS.RSS_SAVED, JSON.stringify(state.rss.savedList));
    }
    var i;
    var updatedInbox = false;
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      if (state.pcSync.inboxList[i].id === art.id) {
        state.pcSync.inboxList[i].title = art.title;
        state.pcSync.inboxList[i].fullParagraphs = art.fullParagraphs;
        state.pcSync.inboxList[i].extractedLinks = art.extractedLinks || [];
        updatedInbox = true;
      }
    }
    if (updatedInbox) {
      storageSet(STORAGE_KEYS.PC_INBOX, JSON.stringify(state.pcSync.inboxList));
    }
  }

  function fetchArticleFullText(art) {
    var statusEl = document.getElementById("article-status");
    if (!art || !art.link) {
      statusEl.textContent = "Mục này không có liên kết web để trích xuất toàn văn.";
      return;
    }
    statusEl.textContent = "Đang trích xuất nội dung sạch cho E-Ink (Jina + Proxy dự phòng)...";

    extractWebPageContent(art.link, art.title, function (res) {
      if (res && res.ok && res.blocks && res.blocks.length > 0) {
        if (res.title && (!art.title || art.title === art.link || art.title.indexOf("http") === 0)) {
          art.title = res.title;
        }
        art.fullParagraphs = res.blocks;
        art.extractedLinks = res.links || [];
        syncExtractedBackToStores(art);

        if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
          state.rss.articlePageIndex = 0;
          document.getElementById("article-title").textContent = art.title;
          statusEl.textContent = "Đã tải toàn văn qua " + res.via + " (" + res.blocks.length + " đoạn · sạch quảng cáo).";
          renderArticleReader();
        }
        return;
      }
      if (state.rss.activeArticle && state.rss.activeArticle.id === art.id) {
        statusEl.textContent = "Không trích xuất được toàn văn (trang chặn bot hoặc cần đăng nhập) — thử 'Mở link gốc'.";
      }
    });
  }

  function openArticleObject(art, options) {
    if (!art) { return; }
    var opts = options || {};
    if (opts.pushHistory && state.rss.activeArticle && state.rss.activeArticle.id !== art.id) {
      state.rss.readerHistory.push(state.rss.activeArticle);
      if (state.rss.readerHistory.length > 20) {
        state.rss.readerHistory.shift();
      }
    } else if (opts.resetHistory) {
      state.rss.readerHistory = [];
    }

    if (art.id) {
      state.rss.readMap[art.id] = 1;
      storageSet(STORAGE_KEYS.RSS_READ, JSON.stringify(state.rss.readMap));
      renderRssList();
    }

    state.rss.activeArticle = art;
    state.rss.articlePageIndex = 0;

    document.getElementById("article-source-badge").textContent = art.sourceName || "E-INK READER";
    document.getElementById("article-title").textContent = art.title || art.link || "Nội dung E-Ink";
    document.getElementById("article-meta").textContent =
      (art.sourceName || "Web") + (art.pubText ? " · " + art.pubText : "");

    var urlInput = document.getElementById("article-url-input");
    if (urlInput) { urlInput.value = art.link || ""; }

    var origLink = document.getElementById("article-original-link");
    if (art.link && /^https?:\/\//i.test(art.link)) {
      origLink.href = art.link;
      origLink.style.display = "inline-block";
    } else {
      origLink.href = "#";
      origLink.style.display = "none";
    }

    var dlLink = document.getElementById("article-download-link");
    if (dlLink) {
      if (art.fileUrl) {
        dlLink.href = art.fileUrl;
        dlLink.textContent = "Tải file" + (art.fileName ? " (" + art.fileName + ")" : "");
        dlLink.style.display = "inline-block";
      } else {
        dlLink.href = "#";
        dlLink.style.display = "none";
      }
    }

    var fetchBtn = document.getElementById("btn-article-fetch-full");
    if (fetchBtn) {
      fetchBtn.style.display = (art.link && /^https?:\/\//i.test(art.link)) ? "inline-block" : "none";
    }

    updateArticleSaveButton();

    var statusEl = document.getElementById("article-status");
    if (art.fullParagraphs && art.fullParagraphs.length > 0) {
      statusEl.textContent = "Đang đọc nội dung sạch (" + art.fullParagraphs.length + " đoạn).";
      renderArticleReader();
    } else if (art.link && /^https?:\/\//i.test(art.link)) {
      statusEl.textContent = "Đang chuẩn bị và tự động trích xuất toàn văn...";
      renderArticleReader();
      fetchArticleFullText(art);
    } else {
      statusEl.textContent = art.fileUrl
        ? "File đính kèm từ PC — bấm 'Tải file' ở trên để tải về Kindle."
        : "Đang hiển thị nội dung.";
      renderArticleReader();
    }

    openModal("article-modal");
  }

  function openArticleModal(id) {
    var art = findArticleById(id);
    if (!art) { return; }
    openArticleObject(art, { resetHistory: true });
  }

  function openWebUrlInReader(rawUrl, pushHistory, optionalTitle) {
    var url = normalizeWebUrl(rawUrl);
    if (!url) {
      var rssStat = document.getElementById("rss-status");
      if (rssStat) { rssStat.textContent = "Địa chỉ web chưa hợp lệ (VD: https://vnexpress.net/...)."; }
      return;
    }

    storageSet(STORAGE_KEYS.LAST_WEB_URL, url);
    var topUrlInput = document.getElementById("web-url-input");
    if (topUrlInput) { topUrlInput.value = url; }

    var existing = null;
    var i;
    for (i = 0; i < state.rss.savedList.length; i++) {
      if (state.rss.savedList[i].link === url) { existing = state.rss.savedList[i]; break; }
    }
    if (!existing) {
      for (i = 0; i < state.pcSync.inboxList.length; i++) {
        if (state.pcSync.inboxList[i].link === url) { existing = state.pcSync.inboxList[i]; break; }
      }
    }

    var art = existing || {
      id: "web::" + url,
      title: optionalTitle || url,
      link: url,
      pubDate: "",
      pubText: "Đọc Web E-Ink",
      snippet: "Đang trích xuất nội dung từ " + url,
      rawContent: "",
      sourceId: "web-reader",
      sourceName: "WEB E-INK",
      fullParagraphs: null,
      extractedLinks: []
    };

    openArticleObject(art, {
      pushHistory: Boolean(pushHistory),
      resetHistory: !pushHistory
    });
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
    if (idx === -1) { return; }
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
     7B. GỬI & NHẬN LINK / FILE TỪ PC TỚI KINDLE (LAN + CLOUD RELAY)
     ======================================================================== */
  function foldVietnamese(str) {
    var s = String(str || "").toLowerCase();
    s = s.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a");
    s = s.replace(/[èéẹẻẽêềếệểễ]/g, "e");
    s = s.replace(/[ìíịỉĩ]/g, "i");
    s = s.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o");
    s = s.replace(/[ùúụủũưừứựửữ]/g, "u");
    s = s.replace(/[ỳýỵỷỹ]/g, "y");
    s = s.replace(/đ/g, "d");
    return s;
  }

  function sanitizeRoomTopic(raw) {
    var folded = foldVietnamese(trimStr(raw));
    var slug = folded.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) { return ""; }
    return "keink-" + slug.slice(0, 48);
  }

  function sanitizeCloudFilename(name) {
    var clean = foldVietnamese(name || "document.bin").replace(/[^a-z0-9._-]+/g, "_");
    clean = clean.replace(/^_+|_+$/g, "");
    return clean || "document.bin";
  }

  function formatPcNowText() {
    var d = new Date();
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + " · " + pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1);
  }

  function setPcStatus(msg) {
    var el = document.getElementById("pc-sync-status");
    if (el) { el.textContent = msg; }
  }

  function updatePcConnUi() {
    var badge = document.getElementById("pc-conn-badge");
    if (badge) {
      if (state.pcSync.lanAvailable && state.pcSync.roomCode) {
        badge.textContent = "LAN Wi-Fi + Cloud (" + state.pcSync.roomCode + ")";
      } else if (state.pcSync.lanAvailable) {
        badge.textContent = "LAN Server (Wi-Fi)";
      } else if (state.pcSync.roomCode) {
        badge.textContent = "Cloud Relay (" + state.pcSync.roomCode + ")";
      } else {
        badge.textContent = "Chưa đặt Mã kết nối";
      }
    }

    var pollBtn = document.getElementById("btn-pc-auto-poll");
    if (pollBtn) {
      pollBtn.textContent = "Tự động nhận (30s): " + (state.pcSync.autoPoll ? "Bật" : "Tắt");
      if (state.pcSync.autoPoll) { addClass(pollBtn, "is-active"); } else { removeClass(pollBtn, "is-active"); }
    }
  }

  function savePcInboxState() {
    if (state.pcSync.inboxList.length > 50) {
      state.pcSync.inboxList = state.pcSync.inboxList.slice(0, 50);
    }
    var slimList = [];
    var i;
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      var copy = cloneArticleForStorage(state.pcSync.inboxList[i]);
      if (i >= 20) {
        copy.fullParagraphs = null;
      }
      slimList.push(copy);
    }
    storageSet(STORAGE_KEYS.PC_INBOX, JSON.stringify(slimList));
    updatePcCountBadges();
    renderPcInboxModal();
    if (state.rss.filterMode === "pc") {
      renderRssList();
    }
  }

  function saveDismissedIds() {
    var keys = [];
    var k;
    for (k in state.pcSync.dismissedIds) {
      if (state.pcSync.dismissedIds.hasOwnProperty(k)) { keys.push(k); }
    }
    if (keys.length > 120) {
      for (var i = 0; i < keys.length - 120; i++) {
        delete state.pcSync.dismissedIds[keys[i]];
      }
    }
    storageSet(STORAGE_KEYS.PC_DISMISSED, JSON.stringify(state.pcSync.dismissedIds));
  }

  function mergePcInboxItems(incomingItems) {
    if (!incomingItems || incomingItems.length === 0) { return; }
    var mapById = {};
    var i;
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      mapById[state.pcSync.inboxList[i].id] = state.pcSync.inboxList[i];
    }

    var added = [];
    for (i = 0; i < incomingItems.length; i++) {
      var inc = incomingItems[i];
      if (!inc || !inc.id) { continue; }
      if (state.pcSync.dismissedIds[inc.id]) { continue; }
      var existing = mapById[inc.id];
      if (existing) {
        if ((!existing.fullParagraphs || existing.fullParagraphs.length === 0) && inc.fullParagraphs && inc.fullParagraphs.length > 0) {
          existing.fullParagraphs = inc.fullParagraphs;
        }
        if (!existing.fileUrl && inc.fileUrl) { existing.fileUrl = inc.fileUrl; }
        if ((!existing.title || existing.title === existing.link) && inc.title) { existing.title = inc.title; }
      } else {
        mapById[inc.id] = inc;
        added.push(inc);
      }
    }

    if (added.length > 0) {
      state.pcSync.inboxList = added.concat(state.pcSync.inboxList);
    }
    savePcInboxState();
  }

  function renderPcInboxModal() {
    var listEl = document.getElementById("pc-inbox-list");
    if (!listEl) { return; }
    updatePcCountBadges();

    var items = state.pcSync.inboxList;
    if (items.length === 0) {
      listEl.innerHTML = '<div class="todo-empty">Hộp thư đang trống. Nhập Mã kết nối và gửi Link/File từ PC sang!</div>';
      return;
    }

    var html = "";
    var i;
    for (i = 0; i < items.length; i++) {
      var it = items[i];
      var isSaved = (isArticleSaved(it.id) !== -1);
      var badges = '<span class="rss-badge">' + escapeHtml(it.sourceName || "Từ PC") + "</span>";
      if (it.fileUrl || it.fileName) {
        badges += '<span class="rss-badge is-solid">FILE</span>';
      }
      if (it.fullParagraphs && it.fullParagraphs.length > 0) {
        badges += '<span class="rss-badge">' + it.fullParagraphs.length + " đoạn</span>";
      }
      if (isSaved) {
        badges += '<span class="rss-badge is-solid">ĐÃ LƯU</span>';
      }

      var origBtn = "";
      if (it.fileUrl) {
        origBtn = '<a class="btn btn-small" href="' + escapeHtml(it.fileUrl) + '" target="_blank" rel="noopener noreferrer" download>Tải file</a>';
      } else if (it.link && /^https?:\/\//i.test(it.link)) {
        origBtn = '<a class="btn btn-small" href="' + escapeHtml(it.link) + '" target="_blank" rel="noopener noreferrer">Link gốc</a>';
      }

      html += '<div class="pc-inbox-item">' +
        '<div class="pc-inbox-title">' + escapeHtml(it.title || it.fileName || it.link || "Mục từ PC") + "</div>" +
        '<div class="pc-inbox-meta">' + badges + (it.pubText ? " · " + escapeHtml(it.pubText) : "") + "</div>" +
        '<div class="pc-inbox-item-actions">' +
          '<button type="button" class="btn btn-small" data-pc-open="' + escapeHtml(it.id) + '">Đọc E-Ink</button>' +
          origBtn +
          '<button type="button" class="btn btn-small" data-pc-save="' + escapeHtml(it.id) + '">' + (isSaved ? "Bỏ lưu" : "Lưu offline") + "</button>" +
          '<button type="button" class="btn btn-small" data-pc-del="' + escapeHtml(it.id) + '">Xóa</button>' +
        "</div>" +
      "</div>";
    }
    listEl.innerHTML = html;
  }

  function dismissPcItem(id) {
    state.pcSync.dismissedIds[id] = 1;
    var next = [];
    var i;
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      var cur = state.pcSync.inboxList[i];
      if (cur.id === id) {
        if (cur.ntfyEventId) {
          state.pcSync.dismissedIds["ntfy-" + cur.ntfyEventId] = 1;
        }
      } else {
        next.push(cur);
      }
    }
    saveDismissedIds();
    state.pcSync.inboxList = next;
    savePcInboxState();

    if (state.pcSync.lanAvailable) {
      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/api/inbox?id=" + encodeURIComponent(id), true);
      try { xhr.send(); } catch (e) { /* ignore */ }
    }
  }

  function clearPcInbox() {
    var i;
    for (i = 0; i < state.pcSync.inboxList.length; i++) {
      state.pcSync.dismissedIds[state.pcSync.inboxList[i].id] = 1;
      if (state.pcSync.inboxList[i].ntfyEventId) {
        state.pcSync.dismissedIds["ntfy-" + state.pcSync.inboxList[i].ntfyEventId] = 1;
      }
    }
    saveDismissedIds();
    state.pcSync.inboxList = [];
    savePcInboxState();

    if (state.pcSync.lanAvailable) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/inbox/clear", true);
      try { xhr.send(); } catch (e) { /* ignore */ }
    }
    setPcStatus("Đã xóa sạch hộp thư trên thiết bị này.");
  }

  function checkLanServer(onDone) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/ping", true);
    xhr.timeout = 2500;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      var ok = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res && res.ok && res.mode === "lan") { ok = true; }
        } catch (e) { ok = false; }
      }
      state.pcSync.lanAvailable = ok;
      updatePcConnUi();
      applyPcAutoPollTimer();
      if (onDone) { onDone(ok); }
    };
    xhr.ontimeout = function () {
      state.pcSync.lanAvailable = false;
      updatePcConnUi();
      if (onDone) { onDone(false); }
    };
    xhr.onerror = function () {
      state.pcSync.lanAvailable = false;
      updatePcConnUi();
      if (onDone) { onDone(false); }
    };
    try { xhr.send(); } catch (e) {
      state.pcSync.lanAvailable = false;
      updatePcConnUi();
      if (onDone) { onDone(false); }
    }
  }

  function fetchLanInbox(onDone) {
    if (!state.pcSync.lanAvailable) {
      onDone([]);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/inbox", true);
    xhr.timeout = 6000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res && res.ok && res.items) {
            onDone(res.items);
            return;
          }
        } catch (e) { /* ignore */ }
      }
      onDone([]);
    };
    xhr.ontimeout = function () { onDone([]); };
    xhr.onerror = function () { onDone([]); };
    try { xhr.send(); } catch (e) { onDone([]); }
  }

  function normalizeCloudItem(rawObj, fallbackId, fallbackPub) {
    return {
      id: rawObj.id || ("ntfy-" + fallbackId),
      title: rawObj.title || rawObj.fileName || rawObj.link || "Nội dung từ PC",
      link: rawObj.link || "",
      pubDate: rawObj.pubDate || "",
      pubText: rawObj.pubText || fallbackPub || formatPcNowText(),
      snippet: rawObj.snippet || "",
      rawContent: rawObj.rawContent || "",
      sourceId: "pc-sync",
      sourceName: rawObj.sourceName || "Từ PC (Cloud)",
      fullParagraphs: rawObj.fullParagraphs || null,
      extractedLinks: rawObj.extractedLinks || [],
      fileName: rawObj.fileName || "",
      fileUrl: rawObj.fileUrl || "",
      itemType: rawObj.itemType || "link"
    };
  }

  function textLinesToBlocks(rawText, isHtml) {
    if (isHtml) {
      var parsed = parseHtmlToArticle(rawText, "");
      return parsed.blocks || [];
    }
    var lines = String(rawText || "").split(/\r?\n/);
    var blocks = [];
    var i;
    for (i = 0; i < lines.length; i++) {
      var line = trimStr(lines[i].replace(/\s+/g, " "));
      if (!line) { continue; }
      var isH = false;
      if (line.indexOf("#") === 0) {
        isH = true;
        line = trimStr(line.replace(/^#+\s*/, ""));
      }
      if (line) {
        blocks.push({ type: isH ? "h" : "p", text: line });
      }
      if (blocks.length >= 900) { break; }
    }
    return blocks;
  }

  function fetchNtfyAttachmentItem(ev, fallbackPub, onDone) {
    var att = ev.attachment;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", att.url, true);
    xhr.timeout = 12000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
        try {
          var parsed = JSON.parse(xhr.responseText);
          if (parsed && parsed.type === "keink_item_v1") {
            onDone(normalizeCloudItem(parsed, ev.id, fallbackPub));
            return;
          }
        } catch (e) { /* không phải JSON gói tin */ }

        var blocks = textLinesToBlocks(xhr.responseText, false);
        var snip = blocks.length > 0 ? blocks[0].text.slice(0, 150) : "";
        onDone({
          id: "ntfy-" + ev.id,
          title: att.name || "Văn bản từ PC",
          link: "",
          pubDate: "",
          pubText: fallbackPub,
          snippet: snip,
          rawContent: "",
          sourceId: "pc-sync",
          sourceName: "Từ PC (Cloud)",
          fullParagraphs: blocks.length > 0 ? blocks : null,
          extractedLinks: [],
          fileName: att.name || "attachment.txt",
          fileUrl: att.url,
          itemType: "file"
        });
        return;
      }
      onDone({
        id: "ntfy-" + ev.id,
        title: att.name || "File từ PC",
        link: "",
        pubDate: "",
        pubText: fallbackPub,
        snippet: "File đính kèm (" + (att.size || 0) + " bytes)",
        rawContent: "",
        sourceId: "pc-sync",
        sourceName: "Từ PC (Cloud)",
        fullParagraphs: null,
        extractedLinks: [],
        fileName: att.name || "file",
        fileUrl: att.url,
        itemType: "file"
      });
    };
    xhr.ontimeout = function () { onDone(null); };
    xhr.onerror = function () { onDone(null); };
    try { xhr.send(); } catch (e) { onDone(null); }
  }

  function fetchNtfyInbox(onDone) {
    var topic = sanitizeRoomTopic(state.pcSync.roomCode);
    if (!topic) {
      onDone([]);
      return;
    }
    var url = "https://ntfy.sh/" + encodeURIComponent(topic) + "/json?poll=1&since=48h";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 10000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status < 200 || xhr.status >= 300 || !xhr.responseText) {
        onDone([]);
        return;
      }

      var lines = xhr.responseText.split(/\r?\n/);
      var events = [];
      var i;
      for (i = lines.length - 1; i >= 0; i--) {
        var ln = trimStr(lines[i]);
        if (!ln) { continue; }
        try {
          var ev = JSON.parse(ln);
          if (ev && ev.event === "message") {
            events.push(ev);
            if (events.length >= 25) { break; }
          }
        } catch (e) { /* skip */ }
      }

      if (events.length === 0) {
        onDone([]);
        return;
      }

      var results = [];
      var pending = 0;
      var finishedLoop = false;

      function checkDone() {
        if (finishedLoop && pending === 0) {
          onDone(results);
        }
      }

      for (i = 0; i < events.length; i++) {
        (function (evObj) {
          var pubStr = formatPcNowText();
          if (evObj.time) {
            var dt = new Date(evObj.time * 1000);
            pubStr = pad2(dt.getHours()) + ":" + pad2(dt.getMinutes()) + " · " + pad2(dt.getDate()) + "/" + pad2(dt.getMonth() + 1);
          }

          var msgText = trimStr(evObj.message || "");
          var handledJson = false;
          if (msgText.indexOf("{") === 0) {
            try {
              var msgJson = JSON.parse(msgText);
              if (msgJson && msgJson.type === "keink_item_v1") {
                var norm = normalizeCloudItem(msgJson, evObj.id, pubStr);
                if (!state.pcSync.dismissedIds[norm.id]) {
                  results.push(norm);
                }
                handledJson = true;
              }
            } catch (e) { handledJson = false; }
          }
          if (handledJson) { return; }

          if (evObj.attachment && evObj.attachment.url) {
            var attId = "ntfy-" + evObj.id;
            if (state.pcSync.dismissedIds[attId] || state.pcSync.fetchedNtfyIds[evObj.id]) { return; }
            var already = findArticleById(attId);
            if (already && already.id === attId) { return; }

            var attType = String(evObj.attachment.type || "").toLowerCase();
            var attName = String(evObj.attachment.name || "").toLowerCase();
            var isTextPayload = (attName === "attachment.txt" || attType.indexOf("text/plain") === 0 || attType.indexOf("application/json") !== -1);
            if (isTextPayload) {
              pending += 1;
              state.pcSync.fetchedNtfyIds[evObj.id] = 1;
              fetchNtfyAttachmentItem(evObj, pubStr, function (itemRes) {
                if (itemRes) {
                  itemRes.ntfyEventId = evObj.id;
                  if (!state.pcSync.dismissedIds[itemRes.id]) {
                    results.push(itemRes);
                  }
                }
                pending -= 1;
                checkDone();
              });
            } else {
              results.push({
                id: attId,
                title: evObj.attachment.name || "File từ PC",
                link: "",
                pubDate: "",
                pubText: pubStr,
                snippet: "File đính kèm (" + (evObj.attachment.size || 0) + " bytes)",
                rawContent: "",
                sourceId: "pc-sync",
                sourceName: "Từ PC (Cloud)",
                fullParagraphs: null,
                extractedLinks: [],
                fileName: evObj.attachment.name || "file",
                fileUrl: evObj.attachment.url,
                itemType: "file"
              });
            }
            return;
          }

          if (msgText) {
            var plainId = "ntfy-" + evObj.id;
            if (state.pcSync.dismissedIds[plainId]) { return; }
            var isUrl = /^https?:\/\/\S+$/i.test(msgText);
            results.push({
              id: plainId,
              title: isUrl ? msgText : msgText.slice(0, 72),
              link: isUrl ? msgText : "",
              pubDate: "",
              pubText: pubStr,
              snippet: isUrl ? "Đường dẫn gửi từ PC" : msgText.slice(0, 160),
              rawContent: "",
              sourceId: "pc-sync",
              sourceName: "Từ PC (Cloud)",
              fullParagraphs: isUrl ? null : textLinesToBlocks(msgText, false),
              extractedLinks: [],
              fileName: "",
              fileUrl: "",
              itemType: isUrl ? "link" : "note"
            });
          }
        })(events[i]);
      }

      finishedLoop = true;
      checkDone();
    };
    xhr.ontimeout = function () { onDone([]); };
    xhr.onerror = function () { onDone([]); };
    try { xhr.send(); } catch (e) { onDone([]); }
  }

  function fetchPcInbox(silent) {
    if (state.pcSync.syncing) { return; }
    state.pcSync.syncing = true;
    if (!silent) {
      setPcStatus("Đang đồng bộ hộp thư từ PC...");
    }

    var lanItems = [];
    var cloudItems = [];
    var doneCount = 0;

    function finishBoth() {
      doneCount += 1;
      if (doneCount < 2) { return; }
      state.pcSync.syncing = false;
      var combined = lanItems.concat(cloudItems);
      if (combined.length > 0) {
        mergePcInboxItems(combined);
      } else {
        renderPcInboxModal();
      }
      if (!silent) {
        if (!state.pcSync.lanAvailable && !state.pcSync.roomCode) {
          setPcStatus("Hãy nhập Mã kết nối (hoặc chạy run_server.bat trong cùng Wi-Fi) để đồng bộ.");
        } else {
          var now = new Date();
          setPcStatus("Đã đồng bộ lúc " + pad2(now.getHours()) + ":" + pad2(now.getMinutes()) + " (" + state.pcSync.inboxList.length + " mục).");
        }
      }
    }

    fetchLanInbox(function (items) {
      lanItems = items || [];
      finishBoth();
    });

    fetchNtfyInbox(function (items) {
      cloudItems = items || [];
      finishBoth();
    });
  }

  function applyPcAutoPollTimer() {
    if (state.pcSync.pollTimerId) {
      window.clearInterval(state.pcSync.pollTimerId);
      state.pcSync.pollTimerId = null;
    }
    if (state.pcSync.autoPoll && (state.pcSync.lanAvailable || state.pcSync.roomCode)) {
      state.pcSync.pollTimerId = window.setInterval(function () {
        fetchPcInbox(true);
      }, 30000);
    }
  }

  function publishItemToDestinations(item, onComplete) {
    mergePcInboxItems([item]);

    var topic = sanitizeRoomTopic(state.pcSync.roomCode);
    var useLan = state.pcSync.lanAvailable;
    var useCloud = Boolean(topic);

    if (!useLan && !useCloud) {
      setPcStatus("Đã lưu vào máy này. Hãy nhập Mã kết nối ở mục 1 để gửi sang Kindle qua Internet.");
      if (onComplete) { onComplete(); }
      return;
    }

    var tasks = 0;
    var lanOk = false;
    var cloudOk = false;

    function checkDone() {
      tasks -= 1;
      if (tasks > 0) { return; }
      var via = [];
      if (lanOk) { via.push("LAN Wi-Fi"); }
      if (cloudOk) { via.push("Cloud Relay"); }
      if (via.length > 0) {
        setPcStatus("Đã gửi sang Kindle thành công (" + via.join(" + ") + "): " + item.title);
      } else {
        setPcStatus("Không gửi được lên kênh trung gian (kiểm tra mạng hoặc Mã kết nối).");
      }
      if (onComplete) { onComplete(); }
    }

    if (useLan) {
      tasks += 1;
      var xhrLan = new XMLHttpRequest();
      xhrLan.open("POST", "/api/inbox", true);
      xhrLan.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhrLan.timeout = 10000;
      xhrLan.onreadystatechange = function () {
        if (xhrLan.readyState !== 4) { return; }
        if (xhrLan.status >= 200 && xhrLan.status < 300) { lanOk = true; }
        checkDone();
      };
      xhrLan.ontimeout = checkDone;
      xhrLan.onerror = checkDone;
      try { xhrLan.send(JSON.stringify(item)); } catch (e) { checkDone(); }
    }

    if (useCloud) {
      tasks += 1;
      var cloudPayload = cloneArticleForStorage(item);
      cloudPayload.type = "keink_item_v1";
      cloudPayload.sourceName = "Từ PC (Cloud)";
      var xhrCloud = new XMLHttpRequest();
      xhrCloud.open("POST", "https://ntfy.sh/" + encodeURIComponent(topic), true);
      xhrCloud.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhrCloud.timeout = 15000;
      xhrCloud.onreadystatechange = function () {
        if (xhrCloud.readyState !== 4) { return; }
        if (xhrCloud.status >= 200 && xhrCloud.status < 300) { cloudOk = true; }
        checkDone();
      };
      xhrCloud.ontimeout = checkDone;
      xhrCloud.onerror = checkDone;
      try { xhrCloud.send(JSON.stringify(cloudPayload)); } catch (e) { checkDone(); }
    }
  }

  function sendLinkOrTextFromPc() {
    var rawUrlField = trimStr(document.getElementById("pc-send-url").value);
    var rawTextField = trimStr(document.getElementById("pc-send-text").value);
    if (!rawUrlField && !rawTextField) {
      setPcStatus("Vui lòng nhập đường dẫn URL hoặc nội dung văn bản cần gửi.");
      return;
    }

    var maybeUrl = normalizeWebUrl(rawUrlField);
    var nowId = "pc-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);

    if (maybeUrl && !rawTextField) {
      setPcStatus("Đang trích xuất trước nội dung trang web trên PC để gửi bản sạch sang Kindle...");
      extractWebPageContent(maybeUrl, maybeUrl, function (res) {
        var hasBlocks = res && res.ok && res.blocks && res.blocks.length > 0;
        var title = (res && res.title) ? res.title : maybeUrl;
        var snippet = hasBlocks ? res.blocks[0].text.slice(0, 160) : ("Đường dẫn web: " + maybeUrl);
        var item = {
          id: nowId,
          title: title,
          link: maybeUrl,
          pubDate: "",
          pubText: formatPcNowText(),
          snippet: snippet,
          rawContent: "",
          sourceId: "pc-sync",
          sourceName: state.pcSync.lanAvailable ? "Từ PC (LAN)" : "Từ PC (Cloud)",
          fullParagraphs: hasBlocks ? res.blocks : null,
          extractedLinks: (res && res.links) ? res.links : [],
          fileName: "",
          fileUrl: "",
          itemType: "link"
        };
        publishItemToDestinations(item, function () {
          document.getElementById("pc-send-url").value = "";
        });
      });
      return;
    }

    var blocks = rawTextField ? textLinesToBlocks(rawTextField, false) : null;
    var titleText = rawUrlField || (blocks && blocks.length > 0 ? blocks[0].text.slice(0, 72) : "Ghi chú từ PC");
    var itemObj = {
      id: nowId,
      title: titleText,
      link: maybeUrl || "",
      pubDate: "",
      pubText: formatPcNowText(),
      snippet: rawTextField ? rawTextField.slice(0, 160) : ("Đường dẫn: " + maybeUrl),
      rawContent: "",
      sourceId: "pc-sync",
      sourceName: state.pcSync.lanAvailable ? "Từ PC (LAN)" : "Từ PC (Cloud)",
      fullParagraphs: blocks,
      extractedLinks: [],
      fileName: "",
      fileUrl: "",
      itemType: maybeUrl ? "link" : "note"
    };
    publishItemToDestinations(itemObj, function () {
      document.getElementById("pc-send-url").value = "";
      document.getElementById("pc-send-text").value = "";
    });
  }

  function readUint16LE(bytes, offset) {
    return bytes[offset] | (bytes[offset + 1] << 8);
  }

  function readUint32LE(bytes, offset) {
    return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
  }

  function decodeBytesUtf8(bytes) {
    if (typeof TextDecoder === "function") {
      try {
        return new TextDecoder("utf-8").decode(bytes);
      } catch (e) { /* fallback */ }
    }
    var out = "";
    var i;
    for (i = 0; i < bytes.length; i++) {
      out += String.fromCharCode(bytes[i]);
    }
    try {
      return decodeURIComponent(escape(out));
    } catch (e2) {
      return out;
    }
  }

  function parseDocxXmlToBlocks(xmlText) {
    var blocks = [];
    if (!window.DOMParser || !xmlText) { return blocks; }
    try {
      var parser = new window.DOMParser();
      var xmlDoc = parser.parseFromString(xmlText, "text/xml");
      var allEls = xmlDoc.getElementsByTagName("*");
      var i;
      for (i = 0; i < allEls.length; i++) {
        var el = allEls[i];
        var lname = el.localName || el.tagName;
        if (lname !== "p" && lname !== "w:p") { continue; }
        var pChildren = el.getElementsByTagName("*");
        var texts = [];
        var isHeading = false;
        var j;
        for (j = 0; j < pChildren.length; j++) {
          var ch = pChildren[j];
          var cn = ch.localName || ch.tagName;
          if (cn === "pStyle" || cn === "w:pStyle") {
            var val = ch.getAttribute("w:val") || ch.getAttribute("val") || "";
            if (val.toLowerCase().indexOf("heading") !== -1 || val.toLowerCase().indexOf("title") !== -1) {
              isHeading = true;
            }
          } else if ((cn === "t" || cn === "w:t") && ch.textContent) {
            texts.push(ch.textContent);
          }
        }
        var line = trimStr(texts.join("").replace(/\s+/g, " "));
        if (line) {
          blocks.push({ type: isHeading ? "h" : "p", text: line });
          if (blocks.length >= 1200) { break; }
        }
      }
    } catch (e) {
      return [];
    }
    return blocks;
  }

  function extractDocxBlocksClientSide(arrayBuffer, onDone) {
    try {
      var bytes = new Uint8Array(arrayBuffer);
      var eocdPos = -1;
      var minStart = Math.max(0, bytes.length - 65557);
      var i;
      for (i = bytes.length - 22; i >= minStart; i--) {
        if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
          eocdPos = i;
          break;
        }
      }
      if (eocdPos === -1) {
        onDone([]);
        return;
      }
      var cdCount = readUint16LE(bytes, eocdPos + 10);
      var cdOffset = readUint32LE(bytes, eocdPos + 16);
      var pos = cdOffset;

      for (i = 0; i < cdCount; i++) {
        if (pos + 46 > bytes.length) { break; }
        if (bytes[pos] !== 0x50 || bytes[pos + 1] !== 0x4b || bytes[pos + 2] !== 0x01 || bytes[pos + 3] !== 0x02) {
          break;
        }
        var compMethod = readUint16LE(bytes, pos + 10);
        var compSize = readUint32LE(bytes, pos + 20);
        var nameLen = readUint16LE(bytes, pos + 28);
        var extraLen = readUint16LE(bytes, pos + 30);
        var commentLen = readUint16LE(bytes, pos + 32);
        var localOffset = readUint32LE(bytes, pos + 42);
        var entryName = decodeBytesUtf8(bytes.subarray(pos + 46, pos + 46 + nameLen));

        if (entryName === "word/document.xml") {
          var lNameLen = readUint16LE(bytes, localOffset + 26);
          var lExtraLen = readUint16LE(bytes, localOffset + 28);
          var dataStart = localOffset + 30 + lNameLen + lExtraLen;
          var slice = bytes.subarray(dataStart, dataStart + compSize);

          if (compMethod === 0) {
            onDone(parseDocxXmlToBlocks(decodeBytesUtf8(slice)));
            return;
          }
          if (compMethod === 8 && typeof DecompressionStream === "function" && typeof Response === "function" && typeof Blob === "function") {
            var ds = new DecompressionStream("deflate-raw");
            var stream = new Blob([slice]).stream().pipeThrough(ds);
            new Response(stream).text().then(function (xmlStr) {
              onDone(parseDocxXmlToBlocks(xmlStr));
            })["catch"](function () {
              onDone([]);
            });
            return;
          }
          onDone([]);
          return;
        }
        pos += 46 + nameLen + extraLen + commentLen;
      }
      onDone([]);
    } catch (e) {
      onDone([]);
    }
  }

  function extractClientFileBlocks(file, onDone) {
    var nameLower = String(file.name || "").toLowerCase();
    var dotIdx = nameLower.lastIndexOf(".");
    var ext = dotIdx !== -1 ? nameLower.slice(dotIdx) : "";

    if (typeof FileReader === "undefined") {
      onDone(null);
      return;
    }

    if (ext === ".txt" || ext === ".md" || ext === ".csv" || ext === ".json" || ext === ".log" || ext === ".html" || ext === ".htm") {
      var textReader = new FileReader();
      textReader.onload = function () {
        var blocks = textLinesToBlocks(textReader.result || "", ext === ".html" || ext === ".htm");
        onDone(blocks.length > 0 ? blocks : null);
      };
      textReader.onerror = function () { onDone(null); };
      textReader.readAsText(file, "UTF-8");
      return;
    }

    if (ext === ".docx") {
      var binReader = new FileReader();
      binReader.onload = function () {
        extractDocxBlocksClientSide(binReader.result, function (blocks) {
          onDone(blocks && blocks.length > 0 ? blocks : null);
        });
      };
      binReader.onerror = function () { onDone(null); };
      binReader.readAsArrayBuffer(file);
      return;
    }

    onDone(null);
  }

  function uploadFileToLan(file, onDone) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
    xhr.timeout = 30000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res && res.ok) {
            onDone(res);
            return;
          }
        } catch (e) { /* ignore */ }
      }
      onDone(null);
    };
    xhr.ontimeout = function () { onDone(null); };
    xhr.onerror = function () { onDone(null); };
    try { xhr.send(file); } catch (e) { onDone(null); }
  }

  function uploadFileToCloudBin(file, topic, onDone) {
    if (file.size > 14 * 1024 * 1024) {
      onDone("");
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ntfy.sh/" + encodeURIComponent(topic + "-bin"), true);
    xhr.setRequestHeader("Filename", sanitizeCloudFilename(file.name));
    xhr.timeout = 30000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          if (res && res.attachment && res.attachment.url) {
            onDone(res.attachment.url);
            return;
          }
        } catch (e) { /* ignore */ }
      }
      onDone("");
    };
    xhr.ontimeout = function () { onDone(""); };
    xhr.onerror = function () { onDone(""); };
    try { xhr.send(file); } catch (e) { onDone(""); }
  }

  function sendFileFromPc() {
    var input = document.getElementById("pc-file-input");
    var file = (input && input.files && input.files.length > 0) ? input.files[0] : null;
    if (!file) {
      setPcStatus("Vui lòng chọn một file trên máy tính trước.");
      return;
    }
    if (!state.pcSync.lanAvailable && !state.pcSync.roomCode) {
      setPcStatus("Hãy nhập Mã kết nối ở mục 1 (hoặc chạy run_server.bat trong cùng Wi-Fi) trước khi gửi file.");
      return;
    }

    setPcStatus("Đang xử lý và gửi file '" + file.name + "'...");
    extractClientFileBlocks(file, function (clientBlocks) {
      var topic = sanitizeRoomTopic(state.pcSync.roomCode);
      var lanDone = !state.pcSync.lanAvailable;
      var cloudDone = !topic;
      var lanRes = null;
      var cloudFileUrl = "";

      function finalizeFilePublish() {
        if (!lanDone || !cloudDone) { return; }
        var finalBlocks = (lanRes && lanRes.fullParagraphs && lanRes.fullParagraphs.length > 0)
          ? lanRes.fullParagraphs
          : clientBlocks;
        var finalFileUrl = (lanRes && lanRes.fileUrl) ? lanRes.fileUrl : cloudFileUrl;
        var snippet = (finalBlocks && finalBlocks.length > 0)
          ? finalBlocks[0].text.slice(0, 160)
          : ("File " + file.name + " (" + Math.round(file.size / 1024) + " KB)");

        if (!finalBlocks && !finalFileUrl) {
          setPcStatus("Không tải lên được file (file vượt giới hạn 14MB trên Cloud hoặc lỗi mạng). Hãy dùng LAN Server cho file nặng.");
          return;
        }

        var item = {
          id: "file-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000),
          title: file.name,
          link: "",
          pubDate: "",
          pubText: formatPcNowText(),
          snippet: snippet,
          rawContent: "",
          sourceId: "pc-sync",
          sourceName: state.pcSync.lanAvailable ? "File từ PC (LAN)" : "File từ PC (Cloud)",
          fullParagraphs: finalBlocks,
          extractedLinks: [],
          fileName: file.name,
          fileUrl: finalFileUrl,
          itemType: "file"
        };

        publishItemToDestinations(item, function () {
          input.value = "";
        });
      }

      if (state.pcSync.lanAvailable) {
        uploadFileToLan(file, function (res) {
          lanRes = res;
          lanDone = true;
          finalizeFilePublish();
        });
      }

      if (topic) {
        uploadFileToCloudBin(file, topic, function (url) {
          cloudFileUrl = url;
          cloudDone = true;
          finalizeFilePublish();
        });
      }
    });
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
    if (state.rotationDeg !== 0) {
      parts.push("Xoay: " + state.rotationDeg + "°");
    }
    if (state.autoNightEnabled) {
      parts.push("Đêm tự động: Bật");
    }
    document.getElementById("eink-status-pill").textContent = parts.join(" · ");
  }

  function updateRotatedInset() {
    var scrollEl = document.getElementById("rotator-scroll");
    var toolbar = document.getElementById("bottom-toolbar");
    if (!scrollEl || !toolbar) { return; }
    if (state.rotationDeg === 0) {
      scrollEl.style.bottom = "";
    } else {
      scrollEl.style.bottom = (toolbar.offsetHeight || 58) + "px";
    }
  }

  function applyRotation(deg, autoAdjustLayout) {
    var d = parseInt(deg, 10);
    if (d !== 0 && d !== 90 && d !== 180 && d !== 270) {
      d = 0;
    }
    state.rotationDeg = d;
    storageSet(STORAGE_KEYS.ROTATION, String(d));

    var stage = document.getElementById("rotator-stage");
    var scrollEl = document.getElementById("rotator-scroll");
    var vw = window.innerWidth || document.documentElement.clientWidth || 600;
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;

    if (d === 0) {
      removeClass(document.body, "is-rotated");
      stage.style.width = "";
      stage.style.height = "";
      stage.style.left = "";
      stage.style.top = "";
      stage.style.webkitTransformOrigin = "";
      stage.style.transformOrigin = "";
      stage.style.webkitTransform = "";
      stage.style.transform = "";
      scrollEl.style.bottom = "";
    } else {
      addClass(document.body, "is-rotated");
      if (d === 90) {
        stage.style.width = vh + "px";
        stage.style.height = vw + "px";
        stage.style.left = vw + "px";
        stage.style.top = "0px";
        stage.style.webkitTransformOrigin = "0 0";
        stage.style.transformOrigin = "0 0";
        stage.style.webkitTransform = "rotate(90deg)";
        stage.style.transform = "rotate(90deg)";
      } else if (d === 270) {
        stage.style.width = vh + "px";
        stage.style.height = vw + "px";
        stage.style.left = "0px";
        stage.style.top = vh + "px";
        stage.style.webkitTransformOrigin = "0 0";
        stage.style.transformOrigin = "0 0";
        stage.style.webkitTransform = "rotate(-90deg)";
        stage.style.transform = "rotate(-90deg)";
      } else {
        stage.style.width = vw + "px";
        stage.style.height = vh + "px";
        stage.style.left = "0px";
        stage.style.top = "0px";
        stage.style.webkitTransformOrigin = "50% 50%";
        stage.style.transformOrigin = "50% 50%";
        stage.style.webkitTransform = "rotate(180deg)";
        stage.style.transform = "rotate(180deg)";
      }
      updateRotatedInset();
    }

    if (autoAdjustLayout) {
      var wantLandscape = (d === 90 || d === 270);
      if (wantLandscape) {
        addClass(document.body, "landscape-mode");
      } else {
        removeClass(document.body, "landscape-mode");
      }
      storageSet(STORAGE_KEYS.LANDSCAPE, wantLandscape ? "1" : "0");
      updateRotatedInset();
    }

    var rotBtn = document.getElementById("btn-rotate-screen");
    if (rotBtn) {
      rotBtn.textContent = "Xoay: " + d + "°";
      if (d !== 0) { addClass(rotBtn, "is-active"); } else { removeClass(rotBtn, "is-active"); }
    }
    updateEinkStatusPill();
    syncSettingsModalUi();
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
    updateRotatedInset();
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

    var rotBtns = document.getElementById("settings-rotate-options").getElementsByTagName("button");
    for (i = 0; i < rotBtns.length; i++) {
      var deg = parseInt(rotBtns[i].getAttribute("data-rotate-deg"), 10);
      if (deg === state.rotationDeg) {
        addClass(rotBtns[i], "is-active");
      } else {
        removeClass(rotBtns[i], "is-active");
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
    applyRotation(storageGet(STORAGE_KEYS.ROTATION, "0"), false);

    state.rss.customFeeds = storageGetJson(STORAGE_KEYS.RSS_CUSTOM, []);
    state.rss.activeFeedId = findFeedById(storageGet(STORAGE_KEYS.RSS_ACTIVE, "vne-new")).id;
    state.rss.cache = storageGetJson(STORAGE_KEYS.RSS_CACHE, {});
    state.rss.readMap = storageGetJson(STORAGE_KEYS.RSS_READ, {});
    state.rss.savedList = storageGetJson(STORAGE_KEYS.RSS_SAVED, []);
    state.rss.articleMode = storageGet(STORAGE_KEYS.RSS_PAGE_MODE, "page");
    state.rss.articleFont = storageGet(STORAGE_KEYS.RSS_ART_FONT, "md");

    state.pcSync.roomCode = storageGet(STORAGE_KEYS.PC_ROOM, "");
    state.pcSync.inboxList = storageGetJson(STORAGE_KEYS.PC_INBOX, []);
    state.pcSync.autoPoll = (storageGet(STORAGE_KEYS.PC_AUTO_POLL, "1") !== "0");
    state.pcSync.dismissedIds = storageGetJson(STORAGE_KEYS.PC_DISMISSED, {});

    var pcRoomInput = document.getElementById("pc-room-input");
    if (pcRoomInput && state.pcSync.roomCode) {
      pcRoomInput.value = state.pcSync.roomCode;
    }
    var lastWebUrl = storageGet(STORAGE_KEYS.LAST_WEB_URL, "");
    var webUrlInput = document.getElementById("web-url-input");
    if (webUrlInput && lastWebUrl) {
      webUrlInput.value = lastWebUrl;
    }
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

    // Đọc trang web bất kỳ & RSS Reader danh sách & bộ lọc
    document.getElementById("btn-read-url-go").onclick = function () {
      openWebUrlInReader(document.getElementById("web-url-input").value, false);
    };
    document.getElementById("web-url-input").onkeydown = function (e) {
      var evt = e || window.event;
      if (evt && evt.keyCode === 13) {
        if (evt.preventDefault) { evt.preventDefault(); }
        openWebUrlInReader(this.value, false);
      }
    };
    document.getElementById("btn-rss-fullscreen").onclick = function () { toggleRssFullscreen(); };
    document.getElementById("btn-rss-toolbar").onclick = function () { toggleRssFullscreen(); };
    document.getElementById("btn-rss-refresh").onclick = function () {
      if (state.rss.filterMode === "pc") {
        fetchPcInbox(false);
      } else {
        fetchRssFeed(state.rss.activeFeedId);
      }
    };
    document.getElementById("rss-source-tabs").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var fid = target ? target.getAttribute("data-feed-id") : null;
      if (fid) {
        if (state.rss.filterMode === "saved" || state.rss.filterMode === "pc") {
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
    document.getElementById("btn-rss-filter-pc").onclick = function () {
      state.rss.filterMode = "pc";
      state.rss.currentPage = 1;
      renderRssList();
      fetchPcInbox(true);
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

    // Trình đọc bài viết & trang web toàn văn
    document.getElementById("btn-close-article").onclick = function () { closeModal("article-modal"); };
    document.getElementById("btn-article-back").onclick = function () {
      if (state.rss.readerHistory.length > 0) {
        var prev = state.rss.readerHistory.pop();
        openArticleObject(prev, { resetHistory: false });
      }
    };
    document.getElementById("btn-article-url-go").onclick = function () {
      openWebUrlInReader(document.getElementById("article-url-input").value, true);
    };
    document.getElementById("article-url-input").onkeydown = function (e) {
      var evt = e || window.event;
      if (evt && evt.keyCode === 13) {
        if (evt.preventDefault) { evt.preventDefault(); }
        openWebUrlInReader(this.value, true);
      }
    };
    document.getElementById("article-links-box").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      while (target && target.id !== "article-links-box") {
        var lnkUrl = target.getAttribute("data-reader-link");
        if (lnkUrl) {
          var lnkTitle = target.getAttribute("data-reader-link-title") || "";
          openWebUrlInReader(lnkUrl, true, lnkTitle);
          return;
        }
        target = target.parentNode;
      }
    };
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

    // Gửi / Nhận Link & File từ PC tới Kindle
    function openPcModalAndSync() {
      updatePcConnUi();
      renderPcInboxModal();
      openModal("pc-sync-modal");
      checkLanServer(function () {
        if (state.pcSync.lanAvailable || state.pcSync.roomCode) {
          fetchPcInbox(false);
        }
      });
    }
    document.getElementById("btn-open-pc-modal").onclick = openPcModalAndSync;
    document.getElementById("btn-pc-toolbar").onclick = openPcModalAndSync;
    document.getElementById("btn-close-pc-modal").onclick = function () { closeModal("pc-sync-modal"); };
    function applyPcRoomCodeAndSync() {
      var raw = trimStr(document.getElementById("pc-room-input").value);
      if (raw && !sanitizeRoomTopic(raw)) {
        setPcStatus("Mã kết nối phải chứa chữ cái hoặc số (VD: cuong-kindle).");
        return;
      }
      state.pcSync.roomCode = raw;
      storageSet(STORAGE_KEYS.PC_ROOM, raw);
      updatePcConnUi();
      applyPcAutoPollTimer();
      fetchPcInbox(false);
    }
    document.getElementById("btn-pc-save-room").onclick = applyPcRoomCodeAndSync;
    document.getElementById("pc-room-input").onkeydown = function (e) {
      var evt = e || window.event;
      if (evt && evt.keyCode === 13) {
        if (evt.preventDefault) { evt.preventDefault(); }
        applyPcRoomCodeAndSync();
      }
    };
    document.getElementById("btn-pc-auto-poll").onclick = function () {
      state.pcSync.autoPoll = !state.pcSync.autoPoll;
      storageSet(STORAGE_KEYS.PC_AUTO_POLL, state.pcSync.autoPoll ? "1" : "0");
      updatePcConnUi();
      applyPcAutoPollTimer();
    };
    document.getElementById("btn-pc-send-item").onclick = function () { sendLinkOrTextFromPc(); };
    document.getElementById("pc-send-url").onkeydown = function (e) {
      var evt = e || window.event;
      if (evt && evt.keyCode === 13) {
        if (evt.preventDefault) { evt.preventDefault(); }
        sendLinkOrTextFromPc();
      }
    };
    document.getElementById("btn-pc-send-file").onclick = function () { sendFileFromPc(); };
    document.getElementById("btn-pc-refresh-inbox").onclick = function () {
      checkLanServer(function () { fetchPcInbox(false); });
    };
    document.getElementById("btn-pc-clear-inbox").onclick = function () { clearPcInbox(); };
    document.getElementById("pc-inbox-list").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      while (target && target.id !== "pc-inbox-list") {
        var openId = target.getAttribute("data-pc-open");
        if (openId) {
          var art = findArticleById(openId);
          if (art) {
            closeModal("pc-sync-modal");
            openArticleObject(art, { resetHistory: true });
          }
          return;
        }
        var saveId = target.getAttribute("data-pc-save");
        if (saveId) {
          toggleSaveArticle(saveId);
          renderPcInboxModal();
          return;
        }
        var delId = target.getAttribute("data-pc-del");
        if (delId) {
          dismissPcItem(delId);
          return;
        }
        target = target.parentNode;
      }
    };

    // Thanh công cụ dưới cùng & Cài đặt E-Ink
    document.getElementById("btn-clean-ghost").onclick = function () { cleanGhosting(); };
    document.getElementById("btn-rotate-screen").onclick = function () {
      var order = [0, 90, 270, 180];
      var idx = indexInArray(order, state.rotationDeg);
      var nextDeg = order[(idx + 1) % order.length];
      applyRotation(nextDeg, true);
    };
    document.getElementById("btn-font-down").onclick = function () { stepFontScale(-1); };
    document.getElementById("btn-font-up").onclick = function () { stepFontScale(1); };
    document.getElementById("btn-toggle-invert").onclick = function () {
      var isInvert = toggleClass(document.body, "invert-mode");
      storageSet(STORAGE_KEYS.INVERT, isInvert ? "1" : "0");
    };
    document.getElementById("btn-toggle-layout").onclick = function () {
      var isLandscape = toggleClass(document.body, "landscape-mode");
      storageSet(STORAGE_KEYS.LANDSCAPE, isLandscape ? "1" : "0");
      updateRotatedInset();
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
    document.getElementById("settings-rotate-options").onclick = function (e) {
      var target = e ? (e.target || e.srcElement) : window.event.srcElement;
      var deg = target ? target.getAttribute("data-rotate-deg") : null;
      if (deg !== null) { applyRotation(parseInt(deg, 10), true); }
    };
    document.getElementById("btn-setting-layout").onclick = function () {
      var isLandscape = toggleClass(document.body, "landscape-mode");
      storageSet(STORAGE_KEYS.LANDSCAPE, isLandscape ? "1" : "0");
      updateRotatedInset();
    };
    document.getElementById("btn-setting-invert").onclick = function () {
      var isInvert = toggleClass(document.body, "invert-mode");
      storageSet(STORAGE_KEYS.INVERT, isInvert ? "1" : "0");
    };

    document.getElementById("btn-help-modal").onclick = function () { openModal("help-modal"); };
    document.getElementById("btn-close-help").onclick = function () { closeModal("help-modal"); };

    window.onresize = function () {
      if (state.rotationDeg !== 0) {
        applyRotation(state.rotationDeg, false);
      }
    };
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
    updatePcConnUi();
    updatePcCountBadges();
    renderPcInboxModal();
    checkLanServer(function () {
      if (state.pcSync.lanAvailable || state.pcSync.roomCode) {
        fetchPcInbox(true);
      }
      applyPcAutoPollTimer();
    });

    // Tự động cập nhật thời tiết mỗi 30 phút và RSS mỗi 60 phút
    window.setInterval(fetchWeather, 30 * 60 * 1000);
    window.setInterval(function () {
      fetchRssFeed(state.rss.activeFeedId);
    }, 60 * 60 * 1000);
  }

  init();
})();
