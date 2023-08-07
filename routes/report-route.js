const router = require('express').Router();
const excelJs = require('exceljs');

const { Random } = require('../models/testData')

router.get('/excel', async (req, res) => {
    await Random.find({}).then((data) => {

        let workBook = new excelJs.Workbook();
        const sheet = workBook.addWorksheet("Temperature");
        sheet.columns = [
            { header: "Id", key: "_id", width: 50 },
            { header: "Temperature", key: "temp", width: 30 }
        ]

        let temp = [];
        data.forEach((obj) => {
            temp.push({ _id: obj._id, temp: obj.temp });
        });
        sheet.addRows(temp)
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            // cell.alignment = { vertical: 'middle', wrapText: true };
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-disposition", "attachment;filename=temp.xls")
        workBook.xlsx.write(res).then(() => res.status(200))
            .catch((err) => res.status(500).send(err.message))
    })
})

router.get('/pdf', async (req, res) => {
    await Random.find({}).then((data) => {

        let workBook = new excelJs.Workbook();
        const sheet = workBook.addWorksheet("Temperature");
        sheet.columns = [
            { header: "Id", key: "_id", width: 50 },
            { header: "Temperature", key: "temp", width: 30 }
        ]

        let temp = [];
        data.forEach((obj) => {
            temp.push({ _id: obj._id, temp: obj.temp });
        });
        sheet.addRows(temp)
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            // cell.alignment = { vertical: 'middle', wrapText: true };
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-disposition", "attachment;filename=temp.xls")
        workBook.xlsx.write(res).then(() => res.status(200))
            .catch((err) => res.status(500).send(err.message))
    })
})

module.exports = { reportRoute: router };