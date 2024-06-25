const baseUrl = 'http://localhost:3000';

let playerValueChart;

async function getTopPlayersByMarketValue() {
    try {
        let dateStart = "2000-01-01"; // TODO: Eventually add support to customize it from the page
        let dateEnd = "3000-12-31";
        const response = await axios.get(`${baseUrl}/player-valuations/info/top/page?pageSize=50&start=${dateStart}&end=${dateEnd}`);
        const playerValuations = response.data;
        
        // Sort and get top 10 players (filter out duplicated player valutations and keep only the highest in the given range: https://stackoverflow.com/a/9229821/11265715)
        let seen = new Set();
        const topPlayers = playerValuations
        .sort((a, b) => b.playerValuation.marketValueInEur - a.playerValuation.marketValueInEur)
        .filter(item => {
            let k = item.player.name;
            return seen.has(k) ? false : seen.add(k);
        })
        .slice(0, 10);
        
        // Define labels and data points and update the chart
        const labels = topPlayers.map(p => p.player.name);
        const data = topPlayers.map(p => p.playerValuation.marketValueInEur);

        updatePlayerValueChart(labels, data);
    } catch (error) {
        console.error('Error fetching player valuations:', error);
    }
}

async function getRecentGames() {
    try {
        const response = await axios.get(`${baseUrl}/games/page?pageSize=10`);
        const games = response.data;
        
        // Sort games by date (also if they should be already sorted on the BE, but the srting order is creationDate) and get the 5 most recent
        const recentGames = games
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        // Update the card with the recent games
        const recentGamesContainer = document.getElementById('recentGames');
        recentGamesContainer.innerHTML = recentGames.map(game => `
            <div class="list-group-item">
                <strong>${game.home_club_name} ${game.home_club_goals} - ${game.away_club_goals} ${game.away_club_name}</strong>
                <br>
                <small>${new Date(game.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching recent games:', error);
    }
}

async function getTopClubsByAverageAge() {
    try {
        const response = await axios.get(`${baseUrl}/clubs`);
        const clubs = response.data;
        
        // Sort and get top 5 clubs
        const topClubs = clubs
            //.sort((a, b) => b.averageAge - a.averageAge)
            .sort((a, b) => a.averageAge - b.averageAge)
            .filter(c => c.averageAge > 0)
            .slice(0, 5);
        
        // Process data for chart
        const labels = topClubs.map(c => c.name);
        const data = topClubs.map(c => c.averageAge);
        
        // Update chart
        updateClubAgeChart(labels, data);
    } catch (error) {
        console.error('Error fetching club avg age:', error);
    }
}

let clubAgeChart;

function updateClubAgeChart(labels, data) {
    const ctx = document.getElementById('clubAgeChart').getContext('2d');
    
    if (clubAgeChart) {
        clubAgeChart.destroy();
    }
    
    clubAgeChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Age',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  // This makes the bar chart horizontal
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Age'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString()+ ' years old';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Club'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x.toLocaleString() + ' years old';
                        }
                    }
                }
            }
        }
    });
}

function updatePlayerValueChart(labels, data) {
    const ctx = document.getElementById('playerValueChart').getContext('2d');
    
    if (playerValueChart) {
        playerValueChart.destroy();
    }
    
    playerValueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Market Value (EUR)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Market Value (EUR)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Player'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '€' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    getTopPlayersByMarketValue();
    getRecentGames();
    getTopClubsByAverageAge();
});