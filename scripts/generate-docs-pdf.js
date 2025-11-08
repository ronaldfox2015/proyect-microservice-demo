const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

(async () => {
  try {
    const outputPath = path.join(process.cwd(), 'documentation');
    const indexPath = path.join(outputPath, 'index.html');

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const html = await fs.readFile(indexPath, 'utf8');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: 'documentation.pdf',
      format: 'A4',
      printBackground: true,
    });

    console.log('✅ PDF generado en documentation.pdf');
    await browser.close();
  } catch (err) {
    console.error('❌ Error al generar el PDF:', err.message);
  }
})();
