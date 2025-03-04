document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('.city-list a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset considering the sticky header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20; // 20px extra space
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all
            document.querySelectorAll('.city-section').forEach(section => {
                section.classList.remove('hidden');
            });
            document.querySelectorAll('.branch-item').forEach(item => {
                item.classList.remove('hidden');
            });
            return;
        }
        
        // First, hide all city sections
        document.querySelectorAll('.city-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Keep track of sections with matching items
        const sectionsWithMatches = new Set();
        
        // Search in branch items
        document.querySelectorAll('.branch-item').forEach(item => {
            const branchName = item.querySelector('h3').textContent.toLowerCase();
            const address = item.querySelector('p:nth-child(2)').textContent.toLowerCase();
            const phone = item.querySelector('p:nth-child(3)').textContent.toLowerCase();
            
            const citySection = item.closest('.city-section');
            const cityName = citySection.querySelector('h2').textContent.split(' ')[0].toLowerCase();
            
            if (
                branchName.includes(searchTerm) || 
                address.includes(searchTerm) || 
                phone.includes(searchTerm) ||
                cityName.includes(searchTerm)
            ) {
                item.classList.remove('hidden');
                sectionsWithMatches.add(citySection.id);
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Show sections with matches
        sectionsWithMatches.forEach(sectionId => {
            document.getElementById(sectionId).classList.remove('hidden');
        });
        
        // If no results found, show a message
        if (sectionsWithMatches.size === 0) {
            // Check if the no-results message already exists
            let noResults = document.querySelector('.no-results');
            
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.style.textAlign = 'center';
                noResults.style.padding = '2rem';
                noResults.style.backgroundColor = '#fff';
                noResults.style.borderRadius = '8px';
                noResults.style.marginBottom = '2rem';
                noResults.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                
                const branchesListing = document.querySelector('.branches-listing');
                if (branchesListing) {
                    branchesListing.prepend(noResults);
                }
            }
            
            noResults.innerHTML = `
                <h3>No results found for "${searchTerm}"</h3>
                <p>Please try a different search term or browse the list of cities.</p>
            `;
        } else {
            // Remove the no-results message if it exists
            const noResults = document.querySelector('.no-results');
            if (noResults) {
                noResults.remove();
            }
        }
    }
    
    // Search button click event
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Search on Enter key press
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Count branches and update the numbers
    document.querySelectorAll('.city-section').forEach(section => {
        const branchCount = section.querySelectorAll('.branch-item').length;
        const countSpan = section.querySelector('.branch-count');
        
        if (countSpan) {
            countSpan.textContent = `(${branchCount})`;
        }
    });

    // Highlight the active city in the sidebar when scrolling
    const citySections = document.querySelectorAll('.city-section');
    const cityLinks = document.querySelectorAll('.city-list a');
    
    function highlightActiveCity() {
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        citySections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 30;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                
                cityLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Active city highlighting on scroll
    window.addEventListener('scroll', highlightActiveCity);
    
    // Initial call to highlight the active city
    highlightActiveCity();
});
