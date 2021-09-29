// const puppeteer = require('puppeteer');
// // Getting path to home directory
// const os = require('os');
// const homeDir = os.homedir();
// const downloadsDir = `${homeDir}//Downloads`;

// module.exports.savePDF = async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('http://localhost:3000/reportView?', {
//       waitUntil: 'networkidle2',
//     });
//     await page.pdf({ 
//         path: `${downloadsDir}/report.pdf`, 
//         landscape: true,
//         width: 1920
//     });
//     console.log("PDF has been saved");
  
//     await page.close();
//     await browser.close();
// }

const pdfBtn = document.getElementById('download-pdf');
pdfBtn.addEventListener('click', () => {
    const reportContent = this.document.getElementById('report-content');
    var opt = {
        margin:       0.5,
        filename:     'distancingReport.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        jsPDF:        { unit: 'px', format: [1720, 980], orientation: 'landscape' }
    };
    html2pdf().from(reportContent).set(opt).save();
});