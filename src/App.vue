<template>
  <el-container class="container">
    <el-header>欢迎使用 Excel To JSON</el-header>
    <el-container>
      <el-aside width="300px">
        <el-form class="form" label-position="top" size="mini">
          <el-form-item>
            <el-button @click="selectExcel()">选择Excel</el-button>
            <el-button @click="reloadWin()">刷新</el-button>
            <el-button @click="saveJSON()" v-if="excelData">保存JSON</el-button>
            <p v-if="excelPath" class="excelPath">
              选择文件
              <br />
              <el-input v-model="excelPath" readonly></el-input>
            </p>
            <p v-if="saveExcelPath" class="excelPath">
              已保存文件
              <br />
              <el-input v-model="saveExcelPath" readonly></el-input>
            </p>
          </el-form-item>
          <template v-if="excelData">
            <el-form-item label="选择工作表">
              <el-select v-model="worksheetId" placeholder="请选择工作表">
                <el-option
                  v-for="item in wordSheets"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择列">
              <el-select v-model="excelCols" multiple placeholder="请选择">
                <el-option
                  v-for="item in  firstRow"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="首行设为Key">
              <el-select v-model="firstKey">
                <el-option label="是" :value="2"></el-option>
                <el-option label="否" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择JSON格式">
              <el-select v-model="jsonType">
                <el-option label="数组" value="array"></el-option>
                <el-option label="对象" value="object"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择Key" v-if="jsonType ==='object'">
              <el-select v-model="jsonTypeKey">
                <el-option label="自增key" value="autoIdKey"></el-option>
                <el-option
                  v-for="item in  firstRow"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
          </template>
        </el-form>
      </el-aside>
      <el-main>
        <pre v-if="excelData"><code>{{jsonData}}</code></pre>
      </el-main>
    </el-container>
    <el-footer>by:春风Coding</el-footer>
  </el-container>
</template>
 
<script>
import app from './app.ts'
export default {
  data() {
    return {
      excelData: null,
      worksheetId: 1,
      excelPath: '',
      saveExcelPath: '',
      firstKey: 2,
      excelCols: [],
      jsonTypeKey: 'autoIdKey',
      jsonType: 'array',
    }
  },
  mounted() {},
  methods: {
    reloadWin() {
      app.reloadWin()
    },
    selectExcel() {
      app.selectExcel().then((res) => {
        if (!res.canceled && res.filePaths[0]) {
          this.excelPath = res.filePaths[0]
          this.readExcel()
        }
      })
    },
    readExcel() {
      app.readExcel(this.excelPath).then((res) => {
        this.excelData = res
        this.excelCols = this.firstRow.map((item) => item.id)
      })
    },
    saveJSON() {
      app.choosePath(this.worksheet.name).then((result) => {
        if (!result.canceled && result.filePath) {
          app.saveJSON(result.filePath, JSON.stringify(this.jsonData))
          this.saveExcelPath = result.filePath
          this.$notify({
            title: '文件已保存',
            type: 'success',
            message: result.filePath,
          })
        }
      })
    },
  },
  computed: {
    wordSheets() {
      return this.excelData.worksheets.map((item) => ({
        id: item.id,
        name: item.name,
      }))
    },
    worksheet() {
      return this.excelData.getWorksheet(this.worksheetId)
    },
    firstRow() {
      const temp = []
      this.worksheet.getRow(1).eachCell((cell, id) => {
        if (cell.value) {
          temp.push({
            id: id,
            value: cell.value,
          })
        }
      })
      return temp
    },
    jsonData() {
      if (!this.excelCols.length) {
        return {}
      }
      const firstIsKey = this.firstKey > 1
      const worksheet = this.excelData.getWorksheet(this.worksheetId)
      let _data = this.jsonType === 'array' ? [] : {}
      let keys = worksheet.getRow(1)
      let autoKey = 1
      for (let i = this.firstKey; i < worksheet.rowCount + 1; i++) {
        const row = firstIsKey ? {} : []
        const excelRow = worksheet.getRow(i)
        excelRow.eachCell({ includeEmpty: true }, (cell, id) => {
          if (this.excelCols.includes(id)) {
            const col = cell.value || ''
            if (firstIsKey) {
              row[keys.getCell(id).value] = col
            } else {
              row.push(col)
            }
          }
        })

        if (this.jsonType === 'array') {
          _data.push(row)
        } else {
          let idKey = autoKey++
          if (this.jsonTypeKey !== 'autoIdKey') {
            idKey = excelRow.getCell(this.jsonTypeKey)
          }
          _data[idKey] = row
          //
        }
      }
      return {
        [worksheet.name]: _data,
      }
    },
  },
}
</script>
