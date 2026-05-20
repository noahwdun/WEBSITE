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
        const sectionIndex = headers.findIndex(h => h.trim() === 'section');
        
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
              type: typeIndex !== -1 ? cells[typeIndex] : '',
              section: sectionIndex !== -1 ? cells[sectionIndex].toLowerCase().trim() : ''
            });
          }
        }
        
        // Find the article element and insert the formatted list
        const article = document.querySelector('article');
        if (article) {
          const preElement = article.querySelector('pre');
          if (preElement) {
            // Group articles by section and format as HTML
            const groups = {
              'academic': [],
              'the miscellany news': [],
              'creative': []
            };

            articles.forEach(article => {
              const section = (article.section || '').toLowerCase();
              if (groups[section]) {
                groups[section].push(article);
              } else {
                groups['the miscellany news'].push(article);
              }
            });

            const renderSection = (name, items) => {
              let sectionHtml = `<div class="writing-section"><t>${name}</t>`;
              if (items.length === 0) {
                sectionHtml += '<p><em>' + (name === 'academic' ? 'Academic work placeholder (coming soon).' : 'No entries yet.') + '</em></p>';
              } else {
                sectionHtml += '<ul style="margin-top:0">';
                items.forEach(item => {
                  let line = `<li><a href="${item.link}" target="_blank" rel="noopener noreferrer">"${item.title}"</a>`;
                  if (name !== 'the miscellany news') {
                    line += ` in <i>${item.outlet}</i>`;
                  }
                  if (name === 'creative' && item.type && item.type.trim()) {
                    line += ` (${item.type.trim()}) (${item.year})`;
                  } else {
                    line += ` (${item.year})`;
                    if (item.type && item.type.trim()) {
                      line += ` (${item.type.trim()})`;
                    }
                  }
                  line += '</li>';
                  sectionHtml += line;
                });
                sectionHtml += '</ul>';
              }
              sectionHtml += '</div>';
              return sectionHtml;
            };

            let html = '';
            html += renderSection('academic', groups['academic']);
            html += renderSection('the miscellany news', groups['the miscellany news']);
            html += renderSection('creative', groups['creative']);
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
