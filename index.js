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
});