document.addEventListener('DOMContentLoaded', function () {
  // Base URL
  const baseUrl = 'http://localhost:3000/';

  const paramSearch = document.getElementById('paramSearch');
  const seasonSelection = document.getElementById('seasonSelection');
  const positionSelection = document.getElementById('positionSelection');
  const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');
  const inputSearch = document.querySelector('#searchForm input');
  const sortSelection = document.getElementById('sortSelection');
  const sortOrderToggle = document.getElementById('sortOrderToggle');
  const sortIcon = document.querySelector('.sort-order-toggle i');

  /* Handle sort functionality */
  function sortTable() {
    const rows = Array.from(playerValuationsTableBody.rows);
    const criteria = sortSelection.value;

    rows.sort((a, b) => {
      let valueA, valueB;

      switch (criteria) {
        case 'position':
          valueA = a.cells[0].textContent;
          valueB = b.cells[0].textContent;
          break;
        case 'player':
          valueA = a.cells[2].textContent;
          valueB = b.cells[2].textContent;
          break;
        case 'club':
          valueA = a.cells[3].textContent;
          valueB = b.cells[3].textContent;
          break;
        case 'marketValue':
          valueA = parseFloat(a.cells[4].textContent.replace(/,/g, ''));
          valueB = parseFloat(b.cells[4].textContent.replace(/,/g, ''));
          break;
        case 'redCards':
          valueA = parseInt(a.cells[5].textContent);
          valueB = parseInt(b.cells[5].textContent);
          break;
        case 'yellowCards':
          valueA = parseInt(a.cells[6].textContent);
          valueB = parseInt(b.cells[6].textContent);
          break;
        case 'assist':
          valueA = parseInt(a.cells[7].textContent);
          valueB = parseInt(b.cells[7].textContent);
          break;
        case 'goals':
          valueA = parseInt(a.cells[8].textContent);
          valueB = parseInt(b.cells[8].textContent);
          break;
        case 'minutesPlayed':
          valueA = parseInt(a.cells[9].textContent);
          valueB = parseInt(b.cells[9].textContent);
          break;
        case 'appearances':
          valueA = parseInt(a.cells[10].textContent);
          valueB = parseInt(b.cells[10].textContent);
          break;
        default:
          return 0;
      }
      let retValue = 0;
      if (valueA < valueB) {
        retValue = -1;
      }
      if (valueA > valueB) {
        retValue = 1;
      }
      if (currentSortOrder === 'DESC') {
        // invert 1 and -1
        retValue = retValue * -1;
      }
      return retValue;
    });

    playerValuationsTableBody.innerHTML = '';
    rows.forEach(row => playerValuationsTableBody.appendChild(row));
  }

  sortSelection.addEventListener('change', sortTable);

  // Define default sort state
  let currentSortOrder = 'ASC';

  sortOrderToggle.addEventListener('click', function(e) {
    e.preventDefault();
    currentSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    sortTable();
    updateSortIcon();
  });

  // Update sort icon based on current sort order
  function updateSortIcon() {
    sortIcon.className = currentSortOrder === 'ASC' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  /* Handle table row creation */
  function createPlayerValuationRow(playerValuation) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${playerValuation.position}</td>
        <td>
        <img src="${playerValuation.image_url}" alt="Player Image" class="rounded-circle user-img">
        </td>
        <td>
        <a href="#" class="btn-player" data-id="${playerValuation.player_id}">${playerValuation.player_name}</a>
        </td>
        <td>
          <!--<button type="button" class="btn btn-link btn-club" data-id="${playerValuation.club_id}">${playerValuation.club_name}</button>   -->       
          <a href="#" class="btn-club" data-id="${playerValuation.club_id}">${playerValuation.club_name}</a>
        </td>
        <td>${playerValuation.market_value} €</td>
        <td>${playerValuation.red_cards}</td>
        <td>${playerValuation.yellow_cards}</td>
        <td>${playerValuation.assists}</td>
        <td>${playerValuation.goals}</td>
        <td>${playerValuation.minutes_played}</td>
        <td>${playerValuation.appearances}</td>
        
      `;
    return row;
  }

  /* Handle API calls */
  function loadPlayerValuationsPlayerName() {
    const queryName = inputSearch.value;
    const queryPosition = positionSelection.options[positionSelection.selectedIndex].value;
    const dateStart = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-start");
    const dateEnd = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-end");
    axios.get(`${baseUrl}players/search/info?name=${queryName}&position=${queryPosition}&start=${dateStart}&end=${dateEnd}`)
      .then(resultPlayer => {
        renderPlayerValuations(resultPlayer.data);
      }).catch(error => console.error('Error fetching game-appearance from playersearch:', error));
  }

  function loadPlayerValuationsClubName() {
    const queryName = inputSearch.value;
    const queryPosition = positionSelection.options[positionSelection.selectedIndex].value;
    const dateStart = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-start");
    const dateEnd = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-end");
    if (queryName) {
      axios.get(`${baseUrl}clubs/search/info?name=${queryName}&position=${queryPosition}&start=${dateStart}&end=${dateEnd}`)
      .then(resultPlayer => {
        renderPlayerValuations(resultPlayer.data);
      }).catch(error => console.error('Error fetching game-appearance from playersearch:', error));
    }
  }

  function renderPlayerValuations(valuations) {
    playerValuationsTableBody.innerHTML = '';

    if (Array.isArray(valuations)) {
      // If playerValuations is an array
      valuations.forEach(valuation => {
        const row = createPlayerValuationRow(valuation);
        playerValuationsTableBody.appendChild(row);
      });
    } else {
      // If playerValuations is a single object
      const row = createPlayerValuationRow(playerValuations);
      playerValuationsTableBody.appendChild(row);
    }

    // Add event listeners for info button
    document.querySelectorAll('.btn-player').forEach(button => {
      button.addEventListener('click', function () {
        const playerId = this.getAttribute('data-id');
        infoPlayerId(playerId);
      });
    });

    document.querySelectorAll('.btn-club').forEach(button => {
      button.addEventListener('click', function () {
        const clubId = this.getAttribute('data-id');
        infoClubId(clubId);
      });
    });
  }

  function loadPlayerValuations() {
    const paramSearchValue = paramSearch.value;
    if (paramSearchValue == 1) {
      loadPlayerValuationsPlayerName();
    } else {
      loadPlayerValuationsClubName();
    }
  }

  // Add eventhandler for search input
  inputSearch.addEventListener('input', function () {
    loadPlayerValuations();
  });

  // Add eventhandler for select input (type of search)
  paramSearch.addEventListener('change', function () {
    inputSearch.value = '';
    loadPlayerValuations();
  });

  // Add eventhandler for select input (position)
  positionSelection.addEventListener('change', function () {
    loadPlayerValuations();
  });

  // Add eventhandler for select input (season)
  seasonSelection.addEventListener('change', function () {
    loadPlayerValuations();
  });


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

        $('#editPlayerModal').modal('show');
      })
      .catch(error => {
        console.error('Error info player');
        alert('C\'è stato un errore nel caricamento delle info del player');
      })
    console.log(playerId);
  }

  function infoClubId(clubId) {
    axios.get(`${baseUrl}clubs/${clubId}`)
      .then(response => {
        const clubData = response.data;
        console.log(clubData);
        document.getElementById("editName").value = clubData.name;
        document.getElementById("editClubCode").value = clubData.clubCode;
        document.getElementById("editDomesticCompetitionId").value = clubData.domesticCompetitionId;
        document.getElementById("editTotalMarketValue").value = clubData.totalMarketValue;
        document.getElementById("editSquadSize").value = clubData.squadSize;
        document.getElementById("editAverageAge").value = clubData.averageAge;
        document.getElementById("editForeignersNumber").value = clubData.foreignersNumber;
        document.getElementById("editForeignersPercentage").value = clubData.foreignersPercentage;
        document.getElementById("editNationalTeamPlayers").value = clubData.nationalTeamPlayers;
        document.getElementById("editStadiumName").value = clubData.stadiumName;
        document.getElementById("editStadiumSeats").value = clubData.stadiumSeats;
        document.getElementById("editNetTransferRecord").value = clubData.netTransferRecord;
        document.getElementById("editCoachName").value = clubData.coachName;
        document.getElementById("editLastSeasonClub").value = clubData.lastSeason;
        document.getElementById("editUrlClub").value = clubData.url;

        $('#editClubModal').modal('show');
      })
      .catch(error => {
        console.error('Error info club');
        alert('C\'è stato un errore nel caricamento delle info del club');
      })
    console.log(clubId);
  }



  // Initial load of player valuations
  loadPlayerValuationsPlayerName();

});