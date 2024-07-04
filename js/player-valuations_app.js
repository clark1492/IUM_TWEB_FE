document.addEventListener('DOMContentLoaded', function () {
  // Base URL
  const baseUrl = 'http://localhost:3000/';

  // Player Valuations Table Body
  const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');

  // Player name input and datalist for autocomplete
  const playerNameInput = document.getElementById('playerName');
  const playerNameList = document.getElementById('playerNameList');
  const clubNameInput = document.getElementById('clubName');
  const clubNameList = document.getElementById('clubNameList');

  // Function to fetch Player Valuations by Club ID
  document.querySelector('#searchByClubForm').addEventListener('submit', function (event) {
    event.preventDefault();
    refreshPlayerValuations();
  });

  // Function to fetch Player Valuations by Player ID and Date
  document.querySelector('#searchByPlayerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    refreshPlayerValuations();
  });

  function renderPlayerValuations(playerValuations) {
    playerValuationsTableBody.innerHTML = '';

    if (Array.isArray(playerValuations)) {
      // If playerValuations is an array
      playerValuations.forEach(valuation => {
        const row = createPlayerValuationRow(valuation);
        playerValuationsTableBody.appendChild(row);
      });
    } else {
      // If playerValuations is a single object
      const row = createPlayerValuationRow(playerValuations);
      playerValuationsTableBody.appendChild(row);
    }

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

    // Add event listeners for info button
    document.querySelectorAll('.btn-link').forEach(button => {
      button.addEventListener('click', function () {
        const playerId = this.getAttribute('data-id');
        infoPlayerId(playerId);
      });
    });
  }

  function createPlayerValuationRow(valuation) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
          <button type="button" class="btn btn-link" data-id="${valuation.playerValuation.id.playerId}">${valuation.player.name}</button>
        </td>
        <td>${valuation.club.name}</td>
        <td>${valuation.player.position}</td>
        <td>${valuation.player.foot}</td>
        <td>${valuation.player.heightInCm}</td>

        <td>${valuation.playerValuation.id.date}</td>
        <td>${valuation.playerValuation.lastSeason}</td>
        <td>${valuation.playerValuation.marketValueInEur}</td>
        <td>${valuation.player.highestMarketValueInEur}</td>

        <!--<td>
          <button class="btn btn-primary btn-sm edit-valuation" data-id="${valuation.playerValuation.id.playerId}" data-date="${valuation.playerValuation.id.date}">Edit</button>
          <button class="btn btn-danger btn-sm delete-valuation" data-id="${valuation.playerValuation.id.playerId}" data-date="${valuation.playerValuation.id.date}">Delete</button>
        </td>-->
        <td>
          <div class="action-icons">
            <i class="fas fa-edit action-icon edit-icon edit-valuation" data-id="${valuation.playerValuation.id.playerId}" data-date="${valuation.playerValuation.id.date}"></i>
            <i class="fas fa-trash-alt action-icon delete-icon delete-valuation" title="Delete" data-id="${valuation.playerValuation.id.playerId}" data-date="${valuation.playerValuation.id.date}"></i>
          </div>
        </td>
      `;
    return row;
  }

  // Edit Player Valuation
  function editPlayerValuation(playerId, date) {
    // Fetch player valuation data from API
    axios.get(`${baseUrl}player-valuations/${playerId}/${date}`)
        .then(response => {
          const playerValuation = response.data;
          // Populate the edit modal with the fetched data
          document.getElementById('editLastSeason').value = playerValuation.lastSeason;
          document.getElementById('editMarketValue').value = playerValuation.marketValueInEur;
          document.getElementById('editDatetime').value = playerValuation.datetime;
          document.getElementById('editDateWeek').value = playerValuation.dateWeek;
          document.getElementById('editN').value = playerValuation.n;
          document.getElementById('editCurrentClubId').value = playerValuation.currentClubId;
          document.getElementById('editPlayerClubDomesticCompetitionId').value = playerValuation.playerClubDomesticCompetitionId;
          document.getElementById('editPlayerId').value = playerId;
          document.getElementById('editDate').value = date;

          // Show the edit modal
          $('#editPlayerValuationModal').modal('show');
        })
        .catch(error => {
          console.error('Error fetching player valuation:', error);
          //alert('Error fetching player valuation. Do you have connection issues?')
        });
  }


  // Function to delete Player Valuation
  function deletePlayerValuation(playerId, date) {
    if (confirm('Are you sure you want to delete this player valuation?')) {
      axios.delete(`${baseUrl}player-valuations/${playerId}/${date}`)
          .then(response => {
            console.log('Player valuation deleted successfully');
            // Refresh player valuations table
            refreshPlayerValuations();
          })
          .catch(error => {
            console.error('Error deleting player valuation:', error);
          });
    }
  }

  // Edit Player
  function infoPlayerId(playerId) {
    // Fetch player data from API
    axios.get(`${baseUrl}players/${playerId}`)
        .then(response => {
          const playerData = response.data;
          console.log(playerData);
          document.getElementById("imgUrl").src = playerData.imageUrl;
          document.getElementById("editFirstName").value = playerData.firstName;
          document.getElementById("editLastName").value = playerData.lastName;
          document.getElementById("editLastSeasonPlayer").value = playerData.lastSeason;
          document.getElementById("editCurrentClubIdPlayer").value = playerData.currentClubId;
          document.getElementById("editPlayerCode").value = playerData.playerCode;
          document.getElementById("editCountryOfBirth").value = playerData.countryOfBirth;
          document.getElementById("editCityOfBirth").value = playerData.cityOfBirth;
          document.getElementById("editCountryOfCitizenship").value = playerData.countryOfCitizenship;
          document.getElementById("editDateOfBirth").value = playerData.dateOfBirth;
          document.getElementById("editSubPosition").value = playerData.subPosition;
          document.getElementById("editPosition").value = playerData.position;
          document.getElementById("editFoot").value = playerData.foot;
          document.getElementById("editHeightInCm").value = playerData.heightInCm;
          document.getElementById("editMarketValueInEur").value = playerData.marketValueInEur;
          document.getElementById("editHighestMarketValueInEur").value = playerData.highestMarketValueInEur;
          document.getElementById("editContractExpirationDate").value = playerData.contractExpirationDate;
          document.getElementById("editAgentName").value = playerData.agentName;
          document.getElementById("editImageUrl").value = playerData.imageUrl;
          document.getElementById("editUrl").value = playerData.url;
          document.getElementById("editCurrentClubDomesticCompetitionId").value = playerData.currentClubDomesticCompetitionId;
          document.getElementById("editCurrentClubName").value = playerData.currentClubName;
          document.getElementById("editPPlayerId").value = playerId;
          document.getElementById("editName").value = playerData.name;

          $('#editPlayerModal').modal('show');
        })
        .catch(error => {
          console.error('Error info player');
          alert('C\'è stato un errore nel caricamento delle info del player');
        })
    console.log(playerId);
  }

  function loadPlayerValuations() {
    /*axios.get(`${baseUrl}player-valuations/page`)
        .then(response => {
          renderPlayerValuations(response.data);
        })
        .catch(error => console.error('Error fetching player valuations:', error));*/
        axios.get(`${baseUrl}player-valuations/info/club/370?pageSize=20`)
          .then(response => {
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
  }

  // Function to refresh Player Valuations table
  function refreshPlayerValuations() {

    const clubName = clubNameInput.value;
    const selectedOptionClub = Array.from(clubNameList.options).find(option => option.value === clubName);
    const clubId = selectedOptionClub ? selectedOptionClub.dataset.clubId : null; //document.querySelector('#clubId').value
    // Find the playerId from the datalist options
    const playerName = playerNameInput.value;
    const selectedOption = Array.from(playerNameList.options).find(option => option.value === playerName);
    const playerId = selectedOption ? selectedOption.dataset.playerId : null; //document.querySelector('#playerId').value
    const startDate = document.querySelector('#startDate').value;
    const endDate = document.querySelector('#endDate').value;

    if (clubId) {
      axios.get(`${baseUrl}player-valuations/info/club/${clubId}?pageSize=100`)
          .then(response => {
            clubNameInput.value = '';
            playerNameInput.value = '';
            startDate.value = '';
            endDate.value = '';
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
    } else if (playerId) {
      //http://localhost:3000/player-valuations/info/player/16631?startDate=2003-12-12&endDate=2005-12-12
      axios.get(`${baseUrl}player-valuations/info/player/${playerId}?pageSize=100&startDate=${startDate}&endDate=${endDate}`)
          .then(response => {
            playerNameInput.value = '';
            clubNameInput.value = '';
            startDate.value = '';
            endDate.value = '';
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
    } else {
      loadPlayerValuations();
    }
  }

  // Handle form submission for editing player valuation
  document.getElementById('editPlayerValuationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get input values
    const lastSeason = document.getElementById('editLastSeason').value;
    const datetime = document.getElementById('editDatetime').value;
    const marketValue = document.getElementById('editMarketValue').value;
    const n = document.getElementById('editN').value;
    const currentClubId = document.getElementById('editCurrentClubId').value;
    const playerClubDomesticCompetitionId = document.getElementById('editPlayerClubDomesticCompetitionId').value;
    const dateWeek = document.getElementById('editDateWeek').value;

    // Get player ID and date from hidden inputs
    const playerId = document.getElementById('editPlayerId').value;
    const date = document.getElementById('editDate').value;

    // Prepare data for update
    const updatedPlayerValuation = {
      lastSeason: lastSeason,
      datetime: datetime,
      dateWeek: dateWeek,
      marketValueInEur: marketValue,
      n: n,
      currentClubId: currentClubId,
      playerClubDomesticCompetitionId: playerClubDomesticCompetitionId
    };

    // Send update request
    axios.put(`http://localhost:3000/player-valuations/${playerId}/${date}`, updatedPlayerValuation)
        .then(response => {
          console.log('Player valuation updated successfully:', response.data);
          // Hide the modal after successful update
          $('#editPlayerValuationModal').modal('hide');
          // Refresh the player valuation table
          refreshPlayerValuations();
        })
        .catch(error => {
          console.error('Error updating player valuation:', error);
          // Handle error
        });
  });

  document.getElementById('editPlayerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get input values
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const lastSeason = document.getElementById('editLastSeasonPlayer').value;
    const currentClubId = document.getElementById('editCurrentClubIdPlayer').value;
    const playerCode = document.getElementById('editPlayerCode').value;
    const countryOfBirth = document.getElementById('editCountryOfBirth').value;
    const cityOfBirth = document.getElementById('editCityOfBirth').value;
    const countryOfCitizenship = document.getElementById('editCountryOfCitizenship').value;
    const dateOfBirth = document.getElementById('editDateOfBirth').value;
    const subPosition = document.getElementById('editSubPosition').value;
    const position = document.getElementById('editPosition').value;
    const foot = document.getElementById('editFoot').value;
    const heightInCm = document.getElementById('editHeightInCm').value;
    const marketValueInEur = document.getElementById('editMarketValueInEur').value;
    const highestMarketValueInEur = document.getElementById('editHighestMarketValueInEur').value;
    const contractExpirationDate = document.getElementById('editContractExpirationDate').value;
    const agentName = document.getElementById('editAgentName').value;
    const imageUrl = document.getElementById('editImageUrl').value;
    const url = document.getElementById('editUrl').value;
    const currentClubDomesticCompetitionId = document.getElementById('editCurrentClubDomesticCompetitionId').value;
    const currentClubName = document.getElementById('editCurrentClubName').value;
    const playerValuationId = document.getElementById('editPlayerId').value;
    const playerName = document.getElementById('editName').value;
    // Get player ID from hidden input
    const playerId = document.getElementById('editPPlayerId').value;

    // Prepare data for update
    const updatedPlayer = {
      playerId: playerId,
      firstName: firstName,
      lastName: lastName,
      name: playerName,
      lastSeason: lastSeason,
      currentClubId: currentClubId,
      playerCode: playerCode,
      countryOfBirth: countryOfBirth,
      cityOfBirth: cityOfBirth,
      countryOfCitizenship: countryOfCitizenship,
      dateOfBirth: dateOfBirth,
      subPosition: subPosition,
      position: position,
      foot: foot,
      heightInCm: heightInCm,
      marketValueInEur: marketValueInEur,
      highestMarketValueInEur: highestMarketValueInEur,
      contractExpirationDate: contractExpirationDate,
      agentName: agentName,
      imageUrl: imageUrl,
      url: url,
      currentClubDomesticCompetitionId: currentClubDomesticCompetitionId,
      currentClubName: currentClubName,
      playerValuationId: playerValuationId
    };
   
    axios.put(`http://localhost:3000/players/${playerId}/`, updatedPlayer)
        .then(response => {
          console.log('Player info updated successfully:', response.data);
          // Hide the modal after successful update
          $('#editPlayerId').modal('hide');
          // Refresh the player valuation table
          refreshPlayerValuations();
        })
        .catch(error => {
          console.error('Error updating player valuation:', error);
          // Handle error
        });
  });

  // Fetch player names for autocomplete
  playerNameInput.addEventListener('input', function () {
    const query = playerNameInput.value;
    if (query.length >= 2) { // Fetch suggestions if input length is greater than or equal to 2
      axios.get(`${baseUrl}players/search/name?name=${query}&sort=name&order=asc`)
          .then(result => {
            playerNameList.innerHTML = '';
            result.data.forEach(player => {
              const option = document.createElement('option');
              option.value = player.name;
              option.dataset.playerId = player.playerId;
              playerNameList.appendChild(option);
            });
          })
          .catch(error => {
            console.error('Error fetching player names for autocomplete:', error);
          });
    }
  });

  // Fetch club names for autocomplete
  clubNameInput.addEventListener('input', function () {
    const query = clubNameInput.value;
    if (query.length >= 2) { // Fetch suggestions if input length is greater than or equal to 2
      axios.get(`${baseUrl}clubs/search/name?name=${query}`)
          .then(result => {
            clubNameList.innerHTML = '';
            result.data.forEach(club => {
              const option = document.createElement('option');
              option.value = club.name;
              option.dataset.clubId = club.clubId;
              clubNameList.appendChild(option);
            });
          })
          .catch(error => {
            console.error('Error fetching club names for autocomplete:', error);
          });
    }
  });

  // Initial load of player valuations
  refreshPlayerValuations();


});
