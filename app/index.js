// ZOHO.CREATOR.init().then(function () {
//     console.log("Zoho SDK Initialized Successfully");
//     var config = {
//         appName : "passive-foreign-investment-company-pfic",
//         reportName : "All_Companies",
//         };
//        ZOHO.CREATOR.API.getAllRecords(config).then(function(response){
//        var data = response.data;
//     //    renderTable(data);
//        renderTableCustom(data)
// });
// }).catch(function(error) {
//     console.error("Zoho SDK initianilization failed",error)
// })
const appName = "passive-foreign-investment-company-pfic";
async function fetchRecords(appname, reportname, type ) {
  try {
    await ZOHO.CREATOR.init();
    const config = {
      appName: appname,
      reportName: reportname,
    };
    const response = await ZOHO.CREATOR.API.getAllRecords(config);
    const data = response.data;
     console.log(data)
    if(reportname == "All_Companies" && type == "renderTable")
    {
      renderTableCustom(data)
    }
    return data
  } catch (error) {
    console.error("Error initializing or fetching:", error);
    return error
  }
}
fetchRecords(appName,"All_Companies", "renderTable");    