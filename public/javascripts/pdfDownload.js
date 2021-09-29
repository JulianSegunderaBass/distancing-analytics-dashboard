// For downloading pdfs
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