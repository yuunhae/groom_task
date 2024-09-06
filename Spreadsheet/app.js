const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportBtn = document.querySelector('#export-btn');
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
    'O','P','Q','R','S','T','U','V','W','X','Y','Z'];


function initSpreadSheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j <COLS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            //첫 번째 column 모든 row에 숫자 넣기
            if( j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }
            //첫 번째 row 모든 열에 알파벳 넣기 but, A 한 칸 오른쪽으로 밀기
            if (i === 0 ){
                cellData = alphabets[j-1];
                isHeader = true;
                disabled = true;
            }
            //0번째 row의 column은 낫띵
            if(cellData <= 0) {
                cellData = '';
            }
            //undefiend처리   
            if(!cellData) {
                cellData='';
            }

            const rowName = i;
            const colName = alphabets[j-1];

            const cell = new Cell(isHeader, disabled ,cellData,i,j,rowName, colName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    // console.log(spreadsheet);
}

class Cell {
    constructor(isHeader, disabled, data, row, column,rowName,colName, active=false){
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.colName = colName;
        this.active = active;
    }
}

exportBtn.onclick = function (e) {
    let csv = '';
    for(let i =0; i< spreadsheet.length;i++) {
        if(i===0) continue;
        csv +=
            spreadsheet[i]
                .filter((item) => !item.isHeader) //헤더는 들어가면 안됨. -> 헤더가 아닌 것만 새로운 배열 생성.
                .map((item)=>item.data) // 객체에서 필요한 속성은 데이터 밖에 없기에 데이터만 return
                .join(',') + "\r\n"; //줄바꿈
    }
    console.log(csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log(csvUrl);

    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

function createCellEl (cell) { //셀 객체 -> cell 클래스에서 생성자로 만들었던 객체 하나하나의 속성에 대해서 
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader) {
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange  = (e) => handleOnChange(e.target.value, cell);

    return cellEl; 
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderActiveState();
    const colHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const colHeaderEl = getElFromRowCol(colHeader.row, colHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    // console.log('clicked cell',colHeaderEl, rowHeaderEl);

    colHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

    document.querySelector('#cell-status').innerHTML = cell.colName + cell.rowName;
    
}
 //1번 클릭할 때 하나의 행과 하나의 열에만 하이라이트가 들어오도록
function clearHeaderActiveState() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header)=>{
        header.classList.remove('active');
    })
    
}

function getElFromRowCol(row, col) {
    return document.querySelector('#cell_'+ row+col);
}


function drawSheet() {
    for(let i = 0;i<spreadsheet.length; i++) {
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = 'cell-row';

        for (let j = 0; j< spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
    
}

initSpreadSheet();


