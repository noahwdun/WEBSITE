/* nav-loader.js
   Loads the nav bar from nav.html and footer from footer.html into all pages
*/
(function(){
  function loadNav() {
    // Determine the path to nav.html based on current page location
    const isSubpage = window.location.pathname.includes('/photo/');
    const navPath = isSubpage ? '../nav.html' : '/nav.html';
    const footerPath = isSubpage ? '../footer.html' : '/footer.html';
    
    fetch(navPath)
      .then(response => response.text())
      .then(html => {
        const navContainer = document.querySelector('nav.nav');
        if (navContainer) {
          navContainer.innerHTML = html;
        }
      })
      .catch(error => console.error('Error loading nav:', error));
    
    fetch(footerPath)
      .then(response => response.text())
      .then(html => {
        const footerContainer = document.querySelector('.site-footer');
        if (footerContainer) {
          footerContainer.innerHTML = html;
        }
      })
      .catch(error => console.error('Error loading footer:', error));
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNav);
  } else {
    loadNav();
  }
})();
