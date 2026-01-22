document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.gallery img');
  
  images.forEach((img, index) => {
    setTimeout(() => {
      img.classList.add('loaded');
    }, index * 300); // 300ms between each image
  });
});