// Get the navigation links
const projectsLink = document.getElementById('projects-link');
const gamesLink = document.getElementById('games-link');

// Get the content area where the sections will be injected
const contentArea = document.getElementById('content-area');

// Define the content for the Projects and Games sections
const projectsContent = `
    <section id="projects-section">
        <h2>Projects</h2>
        <p>Here are some cool projects!</p>
        <!-- Add more project details or list items here -->
    </section>
`;

const gamesContent = `
    <section id="games-section">
        <h2>Games</h2>
        <p>Here are some fun games!</p>
        <!-- Add more game details or list items here -->
    </section>
`;

// Function to clear the current content and inject the selected section
function loadContent(content) {
    contentArea.innerHTML = content;  // Inject the new content
}

// Event listener for the "Projects" link
projectsLink.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default link behavior
    loadContent(projectsContent);  // Load Projects content
});

// Event listener for the "Games" link
gamesLink.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default link behavior
    loadContent(gamesContent);  // Load Games content
});