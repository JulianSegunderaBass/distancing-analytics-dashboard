const puppeteer = require('puppeteer');

module.exports.savePDF = async () => {
    const downloadDate = new Date();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://distancing-analytics-dashboard.herokuapp.com/', {
      waitUntil: 'networkidle2',
    });
    await page.pdf({ 
        path: 'report.pdf', 
        landscape: true,
        width: 1920,
        headerTemplate: `<p>${downloadDate}</p>`
    });
    console.log("PDF has been saved");
  
    await browser.close();
}