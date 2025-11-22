// Cookie Banner
document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptButton = document.querySelector('.accept-button');
  
  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner?.classList.remove('hidden');
  }
  
  acceptButton?.addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'true');
    cookieBanner?.classList.add('hidden');
  });
});
