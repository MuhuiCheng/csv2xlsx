const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

//解析需要遍历的文件夹
const filePath = path.resolve(process.argv[2]);
const newPath = process.argv[3];
const row1 = process.argv[4] || 0;
const row2 = process.argv[5] || 1;

let writeData = [];

//调用文件遍历方法
fileDisplay(filePath);

let xlsData = [
    {
        name: 'sheet',
        data: writeData
    }
];
let buffer = xlsx.build(xlsData);

fs.writeFile(newPath, buffer, function (err)
{
    if (err)
        throw err;
    console.log('Write to xls has finished');
})

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    let files = fs.readdirSync(filePath);
    if (!files) return;
    //遍历读取到的文件列表
    files.forEach(function(filename){
        //获取当前文件的绝对路径
        var filedir = path.join(filePath,filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        let stats = fs.statSync(filedir);
        if (!stats) return;

        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if(isFile){
            let data = fs.readFileSync(filedir, {encoding: 'UCS2'});
            //toxls(filedir);
            data = data.toString();

            let table = new Array();

            let rows = new Array();

            rows = data.split("\n");
            for (let i = 0; i < rows.length; i++) {
                table.push(rows[i].split(","));
            }
            
            writeData[0] = ['SchoolId', 'SchoolName'];

            for (let i=1; i<table.length-1; i++) {
                let tableItem = table[i][0].split("\t")
                writeData.push([tableItem[row1], tableItem[row2]])
                
            }
            
        }
        if(isDir){
            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}
