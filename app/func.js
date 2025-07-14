// All header appear
function renderTable(data) {
    const container = document.getElementById("table-container");
    if (data.length === 0) {
        container.innerHTML = "<p>No data available.</p>";
        return;
    }
    let tableHTML = `<table class="table table-bordered table-striped table-hover">
        <thead class="table-dark"><tr>`;
    // Table Headers
    Object.keys(data[0]).forEach(key => {
        tableHTML += `<th>${key}</th>`;
    });
    var table_data = "";
    data.forEach(element => {
        table_data += `<tr>`;
        Object.keys(element).forEach(key => {
            if(key == "Address")
            {
                table_data  += `<td>${element[key]["address_line_1"]}</td>`;
            }
            else
            {
                table_data  += `<td>${element[key]}</td>`;
            }
        });
        table_data += `</tr>`;
    });
    tableHTML += `</tr></thead><tbody>`;
    tableHTML += table_data;
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}
// Custom header appear
function renderTableCustom(data){
    const custConatiner = document.getElementById("table-containerCust");
    if(data.length == 0){
        custConatiner.innerHTML = "No, data available";
        return;
    }
    const headerMap = {
        "Company": "Company_Name",
        "Email": "Email",
        "Joining Date": "Joining_Date",
        "Phone": "Phone_Number",
        "Address": "Address",
        "Status": "Status"
    };
    const headers = Object.keys(headerMap)
    let table = `<table class="table table-bordered table-striped table-hover">
    <thead class="table-warning"><tr>`;
    headers.forEach(key => {
        
        table += `<th>${key} 
                        <i class="bi bi-sort-alpha-down-alt" onclick="TableSort('${headerMap[key]}','desc')"></i>
                        <i class="bi bi-sort-alpha-down" onclick="TableSort('${headerMap[key]}','asce')"></i>
                </th>`;
    });
    table += `</tr></thead>`;
    // data.sort()
    data.forEach(item => {
        table += `<tr>`;
        headers.forEach(header => {
            const key = headerMap[header];
            const value = item[key];
            if (value && typeof value === "object" && value.display_value !== undefined) {
                table += `<td>${value.display_value}</td>`;
            } else {
                table += `<td>${value !== undefined ? value : ""}</td>`;
            }
        });
        table += `</tr>`;
    });
    table += `</tbody></table>`;
    custConatiner.innerHTML= table;
}

// Table Sort Filters
function TableSort(columnName, sortType){
    console.log("colunmName = "+columnName)
    fetchRecords(appName, "All_Companies").then((data) => {
        for(let key of Object.keys(data[0])) {
            if (key === columnName) {
                let custConatiner = document.getElementById("table-containerCust");
                custConatiner.innerHTML = "";
                console.log("check - "+key + "==="+columnName)
                if(typeof data[0][columnName] === "string"){
                    // data.sort((a, b) => b[columnName].localeCompare(a[columnName]));
                    data.sort((a, b) => {
                        return sortType === "desc"
                        ? b[columnName].localeCompare(a[columnName]) 
                        : a[columnName].localeCompare(b[columnName]) 
                    });
                    console.log("reverse Sortys Data:", data);
                    renderTableCustom(data)
                    break;
                }
                else{
                     data.sort((a, b) =>{
                        return sortType === "desc"
                        ? a[columnName] - b[columnName]
                        : b[columnName] - a[columnName] 
                    });
                     console.log("reverse Sortys int Data:", data);
                     break;
                }
                
            }
        }
    });
}
