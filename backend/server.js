const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.post('/scrape-gifts', async (req, res) => {
    const puppeteer = require('puppeteer');
    const description = req.body.description;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.presentpicker.ai');
        await page.type('textarea[name="userPrompt"]', description);
        await page.click('button[type="submit"]');
        await page.waitForSelector('.p-datatable-wrapper', { timeout: 10000 });

        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.p-datatable-table a')).map(link => ({
                name: link.textContent.trim(),
                url: link.href,
            }));
        });

        await browser.close();
        res.json(results);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Scraping failed.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
