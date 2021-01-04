import ExcelJs from 'exceljs';
import fs from 'fs';
/* eslint-disable */
const { dialog, getCurrentWindow } = require('electron').remote;

function selectExcel() {
  return dialog.showOpenDialog({
    properties: ['openFile'], filters: [{ name: 'Excel', extensions: ['xlsx'] },]
  })
}
function readExcel(excelPath: string) {
  const workbook = new ExcelJs.Workbook();
  return workbook.xlsx.load(fs.readFileSync(excelPath))
}
function choosePath(name: string) {
  return dialog.showSaveDialog({
    title: "选择JSON文件保存位置",
    defaultPath: name + '.json',
    filters: [
      { name: '文件类型', extensions: ['json'] },
    ]
  })
}
function saveJSON(filePath: string, jsonData: string) {
  fs.writeFileSync(filePath, jsonData)
}
function reloadWin() {
  getCurrentWindow().reload()
}
export default { selectExcel, readExcel, saveJSON, choosePath, reloadWin }