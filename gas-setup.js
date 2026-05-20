/**
 * MOODINSHOP · Google Apps Script
 * ─────────────────────────────────────────────
 * 설치 방법:
 * 1. Google 시트 새로 만들기 → 시트 ID 복사 (URL에서 /d/ 뒤 긴 문자열)
 * 2. 확장 프로그램 → Apps Script → 아래 코드 전체 붙여넣기
 * 3. SPREADSHEET_ID 에 복사한 ID 입력
 * 4. 저장 → 배포 → 새 배포 → 웹 앱
 *    - 실행 계정: 나 (Me)
 *    - 액세스 권한: 모든 사용자 (Anyone)
 * 5. 배포 URL 복사 → main.js 의 GAS_URL 에 붙여넣기
 * ─────────────────────────────────────────────
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // ← 여기에 시트 ID 입력

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ts   = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    let sheet, row;

    if (data.type === 'popup-alert') {
      sheet = getOrCreateSheet(ss, '팝업 알림', ['접수일시', '이메일']);
      row   = [ts, data.email];

    } else if (data.type === 'popup-store') {
      sheet = getOrCreateSheet(ss, '팝업스토어 신청', ['접수일시', '이름', '연락처', '이메일', '방문 희망', '인원', '무드 한 줄']);
      row   = [ts, data.name, data.phone, data.email, data.date, data.people, data.message];

    } else if (data.type === 'magazine') {
      sheet = getOrCreateSheet(ss, '매거진 구독', ['접수일시', '이름', '이메일', '전화번호']);
      row   = [ts, data.name, data.email, data.phone];

    } else if (data.type === 'join') {
      sheet = getOrCreateSheet(ss, '협업 신청', ['접수일시', '이름/브랜드명', '이메일', '전화번호', '협업 유형', 'SNS/링크', '내용']);
      row   = [ts, data.name, data.email, data.phone, data.collab, data.url, data.message];
    }

    if (sheet && row) sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}
