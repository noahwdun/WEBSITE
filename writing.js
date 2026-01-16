/* writing.js
   Loads articles from writing.csv and displays them formatted as:
   "Article Title" in <i>Outlet</i> (hyperlinked to the article)
*/
(function(){
  function loadWriting() {
    fetch('/writing.csv')
      .then(response => response.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Find column indices
        const yearIndex = headers.findIndex(h => h.trim() === 'year');
        const titleIndex = headers.findIndex(h => h.trim() === 'title');
        const linkIndex = headers.findIndex(h => h.trim() === 'link');
        const outletIndex = headers.findIndex(h => h.trim() === 'outlet');
        const typeIndex = headers.findIndex(h => h.trim() === 'type');
        
        // Parse CSV with proper quote handling
        function parseCSVLine(line) {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim().replace(/^"|"$/g, ''));
          return result;
        }
        
        // Parse data rows
        const articles = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const cells = parseCSVLine(lines[i]);
            articles.push({
              year: cells[yearIndex],
              title: cells[titleIndex],
              link: cells[linkIndex],
              outlet: cells[outletIndex],
              type: typeIndex !== -1 ? cells[typeIndex] : ''
            });
          }
        }
        
        // Find the article element and insert the formatted list
        const article = document.querySelector('article');
        if (article) {
          const preElement = article.querySelector('pre');
          if (preElement) {
            // Group articles by year and format as HTML
            let html = '';
            let lastYear = null;
            articles.forEach((article, idx) => {
              if (article.year !== lastYear) {
                if (lastYear !== null) html += '</ul>';
                  html += `<div class="writing-year">${article.year}</div><ul style="margin-top:0">`;
                lastYear = article.year;
              }
              html += `<li><a href="${article.link}" target="_blank" rel="noopener noreferrer">"${article.title}"</a>`;
              if (article.type && article.type.trim()) {
                html += ` (${article.type.trim()})`;
              }
              html += ` in <i>${article.outlet}</i></li>`;
            });
            if (lastYear !== null) html += '</ul>';
            preElement.innerHTML = html;
          }
        }
      })
      .catch(error => console.error('Error loading writing.csv:', error));
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWriting);
  } else {
    loadWriting();
  }
})();
