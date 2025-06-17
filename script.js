document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        const isActive = navList.classList.contains('active');
        mobileMenu.querySelector('i').className = isActive ? 'fas fa-times' : 'fas fa-bars';
    });

    // Update Footer Year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Function to render notices
    function renderNotices(notices, container) {
        container.innerHTML = ''; // Clear existing content
        notices.forEach(notice => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            let attachmentsHtml = '';
            if (notice.attachments && notice.attachments.length > 0) {
                attachmentsHtml = `
                    <div class="attachments">
                        <strong>Attachments:</strong>
                        <ul class="attachment-list">
                            ${notice.attachments.map(attachment => `
                                <li>
                                    <a href="${attachment.url}" class="attachment-link" target="_blank" download>
                                        <i class="fas fa-file-download"></i> ${attachment.name}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
            newsItem.innerHTML = `
                <h4>${notice.title}</h4>
                <div class="news-date"><i class="fas fa-calendar-alt"></i> ${notice.date}</div>
                <p>${notice.content}</p>
                ${attachmentsHtml}
                <a href="${notice.link}" class="read-more">${notice.linkText} <i class="fas fa-arrow-right"></i></a>
            `;
            container.appendChild(newsItem);
        });
    }

    // Function to render fixtures
    function renderFixtures(fixtures, container) {
        container.innerHTML = ''; // Clear existing content
        const today = new Date();
        fixtures.forEach(fixture => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            const fixtureDate = new Date(fixture.date);
            const isPastMatch = fixtureDate < today;
            let matchTitle = `Thongjao FC vs. ${fixture.opponent}`;
            if (isPastMatch && fixture.goals && typeof fixture.goals.thongjao === 'number' && typeof fixture.goals.opponent === 'number') {
                matchTitle = `Thongjao FC <span class="match-score">${fixture.goals.thongjao} - ${fixture.goals.opponent}</span> ${fixture.opponent}`;
            }
            matchCard.innerHTML = `
                <div class="match-date"><i class="fas fa-calendar-alt"></i> ${fixture.date}</div>
                <h4>${matchTitle}</h4>
                <p><strong>Tournament:</strong> ${fixture.tournament}</p>
                <p><strong>Venue:</strong> ${fixture.venue}</p>
                <p><strong>Time:</strong> ${fixture.time}</p>
                <a href="football.html" class="read-more">View Team Details <i class="fas fa-arrow-right"></i></a>
            `;
            container.appendChild(matchCard);
        });
    }

    // Fetch and render notices (for index.html and activities.html)
    const newsFeed = document.getElementById('news-feed');
    if (newsFeed) {
        fetch('data/notices.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch notices');
                }
                return response.json();
            })
            .then(data => {
                renderNotices(data.notices, newsFeed);
            })
            .catch(error => {
                console.error('Error fetching notices:', error);
                newsFeed.innerHTML = '<p>Sorry, unable to load news updates at this time.</p>';
            });
    }

    // Fetch and render fixtures (for index.html and football.html)
    const matchesGrid = document.getElementById('matches-grid');
    if (matchesGrid) {
        fetch('data/fixtures.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch fixtures');
                }
                return response.json();
            })
            .then(data => {
                renderFixtures(data.fixtures, matchesGrid);
            })
            .catch(error => {
                console.error('Error fetching fixtures:', error);
                matchesGrid.innerHTML = '<p>Sorry, unable to load upcoming matches at this time.</p>';
            });
    }
});