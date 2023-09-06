// 此函式用於將中文姓名轉換為隱藏姓名
// 利用判斷姓名長度，來決定顯示O的位置
// 並且使用slice()來取得姓名的最後一個字
// 若中文姓名為兩個字，則顯示第二個字為＊，例如：王明 => 王O
// 若中文姓名為三個字，則顯示中間字為＊，例如：王小明 => 王O明
// 若中文姓名為四個字以上，則顯示中間兩個字為＊，例如：王小明 => 王OO明
function ConvertNameToHide(name) {
  if (name.length > 1 && name.length <= 4) {
    name =
      name[0] +
      'O' +
      (name.length > 3 ? 'O' : '') +
      (name.length > 2 ? name.slice(-1) : '');
  }
  return name;
}
export default ConvertNameToHide;
