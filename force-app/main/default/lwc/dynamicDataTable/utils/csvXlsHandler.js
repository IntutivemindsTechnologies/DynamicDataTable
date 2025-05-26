let handleCsvData = (selectedRows,globalData,tableHeaderLabel,tableHeaders) => {
    let downloadRecords = [];
    if (selectedRows.length > 0) {
        downloadRecords = [...selectedRows];
    }
    else {
        downloadRecords = [...globalData];
    }

    let csvFile = convertToCsvFile(downloadRecords,tableHeaderLabel,tableHeaders);
    createDownload(csvFile);
}


let convertToCsvFile = (downloadRecords,tableHeaderLabel,tableHeaders) => {
    let csvHeader = tableHeaderLabel.toString();
    let csvBody = downloadRecords.map(currItem => {
        return tableHeaders.map(header => {
            let value = currItem[header];
            if ((value === null || value === undefined) && (!header.includes('.'))) {
                value = '';
                return `"${value}"`;
            }

            if (header.includes('.')) {
                let head = header.split('.');
                value = currItem[head[0]][head[1]];
                return `"${value}"`;

            }
            return `"${value}"`;
        })
            .join(',');
    });

    let csvData = csvHeader + '\n' + csvBody.join('\n');
    return csvData;
}


let createDownload = (csvFile) => {
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
    link.target = "_blank";
    link.download = "data.csv";
    link.click();
}


let handleExcelData = (selectedRows,globalData,tableHeaderLabel,tableHeaders) => {
    let downloadRecords = [];
    if (selectedRows.length > 0) {
        downloadRecords = [...selectedRows];
    }
    else {
        downloadRecords = [...globalData];
    }

    let doc = '<table>';
    doc += '<style>';
    doc += 'table, th, td{';
    doc += 'border: 1px solid black;';
    doc += '}';
    doc += '</style>';
    doc += '<tr>';
    tableHeaderLabel.forEach(header => {
        doc += '<td>' + header + '</td>';
    })
    doc += '</tr>';

    downloadRecords.map(currItem => {
        doc += '<tr>';
        tableHeaders.map(header => {
            let value = currItem[header];
            if (!header.includes('.')) {
                if (value == null || value === undefined) {
                    doc += '<td>' + '' + '</td>';
                }
                else {
                    doc += '<td>' + value + '</td>';
                }
            }
            else {
                let head = header.split('.');
                doc += '<td>' + currItem[head[0]][head[1]] + '</td>';
            }
        })
        doc += '</tr>';
    })
    doc += '</table>';
    createXlsDownload(doc);
}

let createXlsDownload = (doc) =>{
    const link = document.createElement("a");
    link.href = "data:application/vnd.ms-excel," + encodeURIComponent(doc);
    link.target = "_blank";
    link.download = "data.xls";
    link.click();
}

export {handleCsvData,convertToCsvFile,createDownload,handleExcelData,createXlsDownload};