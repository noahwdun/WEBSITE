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
        const titleIndex = headers.findIndex(h => h.trim() === 'title');
        const linkIndex = headers.findIndex(h => h.trim() === 'link');
        const outletIndex = headers.findIndex(h => h.trim() === 'outlet');
        
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
              title: cells[titleIndex],
              link: cells[linkIndex],
              outlet: cells[outletIndex]
            });
          }
        }
        
        // Find the article element and insert the formatted list
        const article = document.querySelector('article');
        if (article) {
          const preElement = article.querySelector('pre');
          if (preElement) {
            // Create the formatted list
            let html = '<ul>';
            articles.forEach(article => {
              html += `<li><a href="${article.link}">"${article.title}"</a> in <i>${article.outlet}</i></li>`;
            });
            html += '</ul>';
            
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
