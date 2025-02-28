// Add event listener to document to check if click events are being intercepted
document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug script loaded');
  
  // Add a test click handler to the document
  document.addEventListener('click', function(e) {
    console.log('Document click detected at:', e.clientX, e.clientY);
  });
  
  // Specifically check the click button
  const clickButton = document.getElementById('click-btn');
  if (clickButton) {
    console.log('Click button found');
    
    // Add a separate event listener to the button
    clickButton.addEventListener('click', function(e) {
      console.log('Button click detected directly');
      // Display a visual indicator that the click was detected
      const indicator = document.createElement('div');
      indicator.textContent = 'Click detected!';
      indicator.style.position = 'fixed';
      indicator.style.top = '10px';
      indicator.style.right = '10px';
      indicator.style.background = 'green';
      indicator.style.color = 'white';
      indicator.style.padding = '5px';
      indicator.style.borderRadius = '5px';
      indicator.style.zIndex = '9999';
      document.body.appendChild(indicator);
      
      setTimeout(() => {
        document.body.removeChild(indicator);
      }, 2000);
    });
  } else {
    console.error('Click button not found');
  }
  
  // Check if game.js is loaded
  console.log('Game scripts:', document.scripts);
  
  // Check localStorage access
  try {
    localStorage.setItem('debug-test', 'test');
    console.log('LocalStorage test:', localStorage.getItem('debug-test'));
    localStorage.removeItem('debug-test');
  } catch (e) {
    console.error('LocalStorage access error:', e);
  }
}); 