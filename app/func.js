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
    let table = `<table class="table table-bordered table-hover">
    <thead class="table-light"><tr>`;
    headers.forEach(key => {
        
        table += `<th style = "white-space:nowrap;width: 10rem;">${key} 
                    <div class="float-right">
                        <i class="bi bi-sort-alpha-down-alt" style="display:inline;" id="${headerMap[key]}-desc" onclick="TableSort('${headerMap[key]}','desc')"></i>
                        <i class="bi bi-sort-alpha-down" style="display:none;" id="${headerMap[key]}-asce" onclick="TableSort('${headerMap[key]}','asce')"></i>
                    </div>
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
            } 
            else if(key === "Status"){
                table += value !==undefined && value === "Active" ? `<td style="color:green">${value}</td>`: `<td style="color:red">${value}</td>`;
            }
            else {
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
    fetchRecords(appName, "All_Companies","renderTable").then((data) => {
        for(let key of Object.keys(data[0])) {
            if (key === columnName) {
                let custConatiner = document.getElementById("table-containerCust");
                custConatiner.innerHTML = "";
                if(typeof data[0][columnName] === "string"){
                    data.sort((a, b) => {
                        return sortType === "desc"
                        ? b[columnName].localeCompare(a[columnName]) 
                        : a[columnName].localeCompare(b[columnName]) 
                    });
                    renderTableCustom(data)
                    const ascIcon = document.getElementById(columnName+'-asce');
                    const descIcon = document.getElementById(columnName+'-desc');
                    if (sortType === "asce") {
                        ascIcon.style.display = "none";
                        descIcon.style.display = "inline";
                    } else {
                        ascIcon.style.display = "inline";
                        descIcon.style.display = "none";
                    }
                    break;
                }
                else{
                     data.sort((a, b) =>{
                        return sortType === "desc"
                        ? a[columnName] - b[columnName]
                        : b[columnName] - a[columnName] 
                    });
                    const ascIcon = document.getElementById(columnName+'-asce');
                    const descIcon = document.getElementById(columnName+'-desc');
                    if (sortType === "asce") {
                        ascIcon.style.display = "none";
                        descIcon.style.display = "inline";
                    } else {
                        ascIcon.style.display = "inline";
                        descIcon.style.display = "none";
                    }
                     break;
                }
            }
        }
    });
}
// Is or Contains filters
function selectFilter(value) {
  document.getElementById("filterDropdown").textContent = value;
  return value;
}
// Searching
function searchAPI(event){
    event.preventDefault();
    const filtervalue = document.getElementById("filterDropdown").textContent;
    const companyname = document.getElementById("companyID").value;
    console.log(companyname+">>>"+filtervalue.trim())
    FetchCriteriaData( "All_Companies", companyname, filtervalue.trim());
}
//Fetch Data based on criteria
function FetchCriteriaData( ReportName, SearchColunmValue, filtervalue){
    console.log("filtervalue = "+filtervalue)
    if(filtervalue == 'Is'){
        criteriais = "(Company_Name==\""+SearchColunmValue+"\")"
    }
    else{
        criteriais = "(Company_Name.contains("+"\""+SearchColunmValue+"\"))"
    }
    var config = { 
        appName : appName,
        reportName : ReportName, 
        criteria : criteriais,
        page : 1,
        pageSize : 10
    }
    console.log(config);
    ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
    if (response.data && response.data.length === 0) {
      console.warn("No records found.");
      alert("No records found for the given criteria.");
      return;
    }
    console.log("Records:", response.data);
    renderTableCustom(response.data);
    HideSerachNav()
  })
  .catch(function (error) {
    const custConatiner = document.getElementById("table-containerCust");
    try {
      const err = JSON.parse(error.responseText);
      if (err.code === 3100) {
        custConatiner.innerHTML = "No, data available";
        HideSerachNav()
        return;
      } else {
        custConatiner.innerHTML = "Error: " + err.message;
        HideSerachNav()
      }
    } catch (e) {
      custConatiner.innerHTML = "Unexpected error:", error;
      HideSerachNav()
    }
  });   
}
// Hide Search Nav Once submitted.
function HideSerachNav(){
   const offcanvasElement = document.getElementById("offcanvasRight");
   const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) 
                  || new bootstrap.Offcanvas(offcanvasElement);
  offcanvas.hide();
}