// Profile card flip functionality
document.addEventListener('DOMContentLoaded', function() {
    const flipContainer = document.querySelector('.card-flip-container');
    
    if (flipContainer) {
        flipContainer.addEventListener('click', function(event) {
            // Prevent flipping if a link was clicked
            if (event.target.tagName === 'A') {
                return;
            }
            this.classList.toggle('flipped');
        });
    }
});
