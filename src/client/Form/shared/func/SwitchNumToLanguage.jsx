// 此函式主要使用於轉換資料庫中的數字，轉換成對應的文字，以利於顯示在表單上
// 第一個SwitchNumToLanguage函式，是用於轉換病人的語言，因為資料庫中的語言是用數字表示，所以要轉換成文字
function SwitchNumToLanguage(languageNum) {
  const languages = {
    1: '國語',
    2: '台語',
    3: '英文',
    4: '英文',
    5: '越南文',
    6: '泰文',
    7: '印尼語',
    8: '菲律賓語',
  };

  return languages[languageNum] || '';
}
// 第二個SwitchNumToType函式，是用於轉換衛教資訊的類型，因為資料庫中的類型是用數字表示，所以要轉換成文字
function SwitchNumToType(TypeNum) {
  const types = {
    1: '疾病照護',
    2: '活動',
    3: '進食',
    4: '管路照護及異常處理',
    5: '皮膚照護',
    6: '傷口照護',
    7: '預防合併症',
  };

  return types[TypeNum] || '';
}

export { SwitchNumToLanguage, SwitchNumToType };
