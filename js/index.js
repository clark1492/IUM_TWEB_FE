const baseUrl = 'http://localhost:3000';

/* Handle API calls */

function getPlayerInfoLastWeek() {
    //http://localhost:3000/players/search/info?name=&position=&start=2013-08-20&end=2013-08-27
    const dateStart = "2013-08-20"; // Can't use last week data as we don't have data for them
    const dateEnd = "2013-08-27";
    axios.get(`${baseUrl}/players/search/info?start=${dateStart}&end=${dateEnd}`)
    .then(resultPlayer => {
        updatePlayerInfoTable(resultPlayer.data);
    }).catch(error => console.error('Error fetching data from playersearch:', error));
}

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

async function getTopGoalScorers() {
    try {
        let dateStart = "2000-01-01"; // TODO: Eventually add support to customize it from the page
        let dateEnd = "3000-12-31";
        let queryName = '';
        let queryPosition = '';
        //minutes_played, yellow_cards, red_cards, assists
        //i.e. http://localhost:3000/players/search/info?name=&position=&start=2013-08-20&end=2024-08-19
        const appearancesResponse = await axios.get(`${baseUrl}/players/search/info?name=${queryName}&position=${queryPosition}&start=${dateStart}&end=${dateEnd}`);
        const appearances = appearancesResponse.data;
        
        const goalScorers = appearances.reduce((acc, appearance) => {
            if (appearance.goals && appearance.player_name) {
                acc[appearance.player_name] = (acc[appearance.goals] || 0) + appearance.goals;
            }
            return acc;
        }, {});
        
        const topScorers = Object.entries(goalScorers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

        

        const yellowCards = appearances.reduce((acc, appearance) => {
            if (appearance.yellow_cards && appearance.player_name) {
                acc[appearance.player_name] = (acc[appearance.yellow_cards] || 0) + appearance.yellow_cards;
            }
            return acc;
        }, {});
        
        const topYellowCards = Object.entries(yellowCards)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);


        const redCards = appearances.reduce((acc, appearance) => {
            if (appearance.red_cards && appearance.player_name) {
                acc[appearance.player_name] = (acc[appearance.red_cards] || 0) + appearance.red_cards;
            }
            return acc;
        }, {});
        
        const topRedCards = Object.entries(redCards)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

        const assists = appearances.reduce((acc, appearance) => {
            if (appearance.assists && appearance.player_name) {
                acc[appearance.player_name] = (acc[appearance.assists] || 0) + appearance.assists;
            }
            return acc;
        }, {});
        
        const topAssists = Object.entries(assists)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

        // minutes_played

        const minutesPlayed = appearances.reduce((acc, appearance) => {
            if (appearance.minutes_played && appearance.player_name) {
                acc[appearance.player_name] = (acc[appearance.minutes_played] || 0) + appearance.minutes_played;
            }
            return acc;
        }, {});
        
        const topMinutesPlayed= Object.entries(minutesPlayed)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
        
        updateBarChart(topScorers.map(s => s[0]), topScorers.map(s => s[1]), 'topScorersChart', 'Number of Goals', 'Goals', 'rgba(128, 171, 130, 0.8)', 'rgba(128, 171, 130, 1)')
        //updateTopYellowCardsChart(topYellowCards.map(s => s[0]), topYellowCards.map(s => s[1]));
        updateBarChart(topYellowCards.map(s => s[0]), topYellowCards.map(s => s[1]), 'yellowCardsChart', 'Number of Yellow Cards', 'Yellow Cards', 'rgba(255, 206, 86, 0.8)', 'rgba(255, 206, 86, 1)')
        updateBarChart(topRedCards.map(s => s[0]), topRedCards.map(s => s[1]), 'redCardsChart', 'Number of Red Cards', 'Red Cards', 'rgba(255, 99, 132, 0.8)', 'rgba(255, 99, 132, 1)')
        updateBarChart(topAssists.map(s => s[0]), topAssists.map(s => s[1]), 'assistsChart', 'Number of Assists', 'Assists', 'rgba(195, 162, 158, 0.8)', 'rgba(195, 162, 158, 1)')
        // yellow rgba(255, 206, 86, 0.8)
        //grey rgba(75, 192, 192, 0.8)
        //updateBarChart(topMinutesPlayed.map(s => s[0]), topMinutesPlayed.map(s => s[1]), 'minutesPlayedChart', 'Number of Minutes Played', 'Minutes Played', 'rgba(255, 206, 86, 0.8)')


    } catch (error) {
        console.error('Error fetching top goal scorers:', error);
    }
}

async function getGoalsByPosition() {
    try {
        let dateStart = "2000-01-01"; // TODO: Eventually add support to customize it from the page
        let dateEnd = "3000-12-31";
        let queryName = '';
        let queryPosition = '';
        const appearancesResponse = await axios.get(`${baseUrl}/players/search/info?name=${queryName}&position=${queryPosition}&start=${dateStart}&end=${dateEnd}`);
        
        const appearances = appearancesResponse.data;
        
        // Process data to count goals by position
        const goalsByPosition = appearances.reduce((acc, appearance) => {
            if (appearance.goals) {
                acc[appearance.position] = (acc[appearance.position] || 0) + 1;
            }
            return acc;
        }, {});
        
        // Update chart
        updateGoalsByPositionChart(Object.keys(goalsByPosition), Object.values(goalsByPosition));
    } catch (error) {
        console.error('Error fetching goals by position data:', error);
    }
}

/* Handle UI updates */
function updateTopScorersChart(labels, data) {
    const ctx = document.getElementById('topScorersChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Goals',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
                        text: 'Number of Goals'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateBarChart(labels, data, chartId, chartTitle, chartLabel, chartBackgroundColor, chartBorderColor) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: chartBackgroundColor,
                borderColor: chartBorderColor,
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
                        text: chartTitle
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
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

let playerValueChart;
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

let goalsByPositionChart;

function updateGoalsByPositionChart(labels, data) {
    const ctx = document.getElementById('goalsByPositionChart').getContext('2d');
    
    if (goalsByPositionChart) {
        goalsByPositionChart.destroy();
    }
    
    goalsByPositionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/* Handle table row creation */
function createPlayerInfoRow(playerValuation) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${playerValuation.position}</td>
        <td>
        <img src="${playerValuation.image_url}" alt="Player Image" class="rounded-circle user-img">
        </td>
        <td>${playerValuation.player_name}</td>
        <td>${playerValuation.club_name}</td>
        <td>${playerValuation.red_cards}</td>
        <td>${playerValuation.yellow_cards}</td>
        <td>${playerValuation.assists}</td>
        <td>${playerValuation.goals}</td>
        <td>${playerValuation.minutes_played}</td>
        <td>${playerValuation.appearances}</td>
        
      `;
    return row;
  }

function updatePlayerInfoTable(valuations) {
    const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');
    playerValuationsTableBody.innerHTML = '';
    if (Array.isArray(valuations)) {
      // If playerValuations is an array
      valuations.forEach(valuation => {
        const row = createPlayerInfoRow(valuation);
        playerValuationsTableBody.appendChild(row);
      });
    } else {
      // If playerValuations is a single object
      const row = createPlayerInfoRow(playerValuations);
      playerValuationsTableBody.appendChild(row);
    }
  }

document.addEventListener('DOMContentLoaded', () => {
    getTopPlayersByMarketValue();
    getRecentGames();
    getTopClubsByAverageAge();
    getTopGoalScorers();
    getPlayerInfoLastWeek();
    getGoalsByPosition();
});