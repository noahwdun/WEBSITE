/* parallax.js
   Small script to move the layered background at a fraction of the scroll speed
   so it appears to scroll at half the speed of the foreground content.
*/
(function(){
  const speed = 0.2; // 0.5 => background moves at half the scroll speed
  let ticking = false;

  function update(){
    // Use a negative value so the background moves in the same visual
    // direction as the content when the page is scrolled.
    const y = -window.scrollY * speed;
    // Two background layers — set the same offset for both
    document.body.style.backgroundPosition = `0px ${y}px, 0px ${y}px`;
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Set initial position on load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    update();
  } else {
    window.addEventListener('DOMContentLoaded', update, { once: true });
  }
})();
