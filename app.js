document.addEventListener('DOMContentLoaded', function () {
    // Base URL
    const baseUrl = 'http://localhost:3000/';
  
    // Player Valuations Table Body
    const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');
  
    // Function to fetch Player Valuations by Club ID
    document.querySelector('#searchByClubForm').addEventListener('submit', function (event) {
      event.preventDefault();
      /*const clubId = document.querySelector('#clubId').value;
      axios.get(`${baseUrl}player-valuations/club/${clubId}`)
        .then(response => {
          renderPlayerValuations(response.data);
        })
        .catch(error => {
          console.error('Error fetching player valuations:', error);
        });*/
        refreshPlayerValuations();
    });
  
    // Function to fetch Player Valuations by Player ID and Date
    document.querySelector('#searchByPlayerForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const playerId = document.querySelector('#playerId').value;
      const date = document.querySelector('#date').value;
      axios.get(`${baseUrl}player-valuations/${playerId}/${date}`)
        .then(response => {
          renderPlayerValuations(response.data);
        })
        .catch(error => {
          console.error('Error fetching player valuations:', error);
        });
    });
  
    // Function to render Player Valuations in the table
    function renderPlayerValuations(playerValuations) {
      playerValuationsTableBody.innerHTML = '';
      playerValuations.forEach(valuation => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${valuation.id.playerId}</td>
          <td>${valuation.id.date}</td>
          <td>${valuation.lastSeason}</td>
          <td>${valuation.marketValueInEur}</td>
          <td>
            <button class="btn btn-primary btn-sm edit-valuation" data-id="${valuation.id.playerId}" data-date="${valuation.id.date}">Edit</button>
            <button class="btn btn-danger btn-sm delete-valuation" data-id="${valuation.id.playerId}" data-date="${valuation.id.date}">Delete</button>
          </td>
        `;
        playerValuationsTableBody.appendChild(row);
      });
  
      // Add event listeners for edit and delete buttons
      document.querySelectorAll('.edit-valuation').forEach(button => {
        button.addEventListener('click', function () {
          const playerId = this.getAttribute('data-id');
          const date = this.getAttribute('data-date');
          editPlayerValuation(playerId, date);
        });
      });
  
      document.querySelectorAll('.delete-valuation').forEach(button => {
        button.addEventListener('click', function () {
          const playerId = this.getAttribute('data-id');
          const date = this.getAttribute('data-date');
          deletePlayerValuation(playerId, date);
        });
      });
    }
  
    
    
    function loadPlayerValuations() {
      axios.get(`${baseUrl}player-valuations/page`)
          .then(response => {
            renderPlayerValuations(response.data);
          })
          .catch(error => console.error('Error fetching player valuations:', error));
    }

    // Function to refresh Player Valuations table
    function refreshPlayerValuations() {
      const clubId = document.querySelector('#clubId').value;
      if (clubId) {
        axios.get(`${baseUrl}player-valuations/club/${clubId}`)
          .then(response => {
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
      } else if (document.querySelector('#playerId').value && document.querySelector('#date').value){
        const playerId = document.querySelector('#playerId').value;
        const date = document.querySelector('#date').value;
        axios.get(`${baseUrl}player-valuations/${playerId}/${date}`)
          .then(response => {
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
      }
      else {
        loadPlayerValuations();
      }
    }

    

  // Initial load of player valuations
  refreshPlayerValuations();
  
  });
  