// Menu Toggle Script
document.getElementById('menuIcon').addEventListener('click', function () {
  const navMenu = document.getElementById('navMenu');
  if (navMenu.classList.contains('hidden')) {
    navMenu.classList.remove('hidden');
    navMenu.classList.add('visible');
  } else {
    navMenu.classList.remove('visible');
    navMenu.classList.add('hidden');
  }
});
