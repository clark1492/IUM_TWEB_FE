document.addEventListener('DOMContentLoaded', function () {
      // Base URL
      const baseUrl = 'http://localhost:3000/';

      const paramSearch = document.getElementById('paramSearch');
      const seasonSelection = document.getElementById('seasonSelection');
      const positionSelection = document.getElementById('positionSelection');
      const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');
      const inputSearch = document.querySelector('#searchForm input');


      function createPlayerValuationRow(playerValuation) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${playerValuation.position}</td>
        <td>
          <button type="button" class="btn btn-link btn-player" data-id="${playerValuation.player_id}">${playerValuation.player_name}</button>
        </td>
        <td>
          <button type="button" class="btn btn-link btn-club" data-id="${playerValuation.club_id}">${playerValuation.club_name}</button>          
        </td>
        <td>${playerValuation.market_value}</td>
        <td>${playerValuation.goals}</td>
        <td>${playerValuation.assists}</td>
        <td>${playerValuation.yellow_cards}</td>
        <td>${playerValuation.red_cards}</td>
        <td>${playerValuation.minutes_played}</td>
        <td>${playerValuation.appearances}</td>
        
      `;
        return row;
      }

      function loadPlayerValuationsPlayerName() {
        const queryName = inputSearch.value;
        const queryPosition = positionSelection.options[positionSelection.selectedIndex].value;
        const dateStart = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-start");
        const dateEnd = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-end");
        let valuations = [];
        if(queryName){
          axios.get(`${baseUrl}players/search/name/position?name=${queryName}&positon=${queryPosition}&startdate=${dateStart}&enddate=${dateEnd}`)
              .then(resultPlayer => {
                renderPlayerValuations(valuations);
                if(resultPlayer){
                  resultPlayer.data.forEach(player => {
                    axios.get(`${baseUrl}game-appearances/playerid/startdate/enddate?playerid=${player.playerId}&startdate=${dateStart}&enddate=${dateEnd}`)
                        .then(resultApp => {
                          if(resultApp) {
                            resultApp.data.forEach(gameAppearance => {
                              axios.get(`${baseUrl}clubs/${gameAppearance.player_club_id}`)
                                  .then(resultClub => {
                                    let playerValuation = {
                                      "player_id": player.playerId,
                                      "player_name": player.name,
                                      "position": player.position,
                                      "market_value": player.marketValueInEur,
                                      "club_name": resultClub.data.name,
                                      "club_id": gameAppearance.player_club_id,
                                      "yellow_cards": gameAppearance.yellow_cards,
                                      "red_cards": gameAppearance.red_cards,
                                      "goals": gameAppearance.goals,
                                      "assists": gameAppearance.assists,
                                      "minutes_played": gameAppearance.minutes_played,
                                      "appearances": gameAppearance.appearances
                                    }
                                    valuations.push(playerValuation);
                                    renderPlayerValuations(valuations);
                                  }).catch(error => console.error("Error fetching clubs:", error));
                            })
                          }
                        }).catch(error => console.error('Error fetching players:', error));
                  })
                }
              }).catch(error => console.error('Error fetching game-appearance:', error));
        }
        else {
          axios.get(`${baseUrl}game-appearances/playerid/startdate/enddate?startdate=${dateStart}&enddate=${dateEnd}`)
              .then(resultApp => {
                resultApp.data.forEach(gameAppearance => {
                  axios.get(`${baseUrl}players/search/name/position?name=${gameAppearance.player_name}&positon=${queryPosition}`)
                      .then(resultPlayer => {
                        if(resultPlayer) {
                          resultPlayer.data.forEach(player => {
                            axios.get(`${baseUrl}clubs/${gameAppearance.player_club_id}`)
                                .then(resultClub => {
                                  let playerValuation = {
                                    "player_id": player.playerId,
                                    "player_name": player.name,
                                    "position": player.position,
                                    "market_value": player.marketValueInEur,
                                    "club_name": resultClub.data.name,
                                    "club_id": gameAppearance.player_club_id,
                                    "yellow_cards": gameAppearance.yellow_cards,
                                    "red_cards": gameAppearance.red_cards,
                                    "goals": gameAppearance.goals,
                                    "assists": gameAppearance.assists,
                                    "minutes_played": gameAppearance.minutes_played,
                                    "appearances": gameAppearance.appearances
                                  }
                                  valuations.push(playerValuation);
                                  renderPlayerValuations(valuations);
                                }).catch(error => console.error("Error fetching clubs:", error));
                          })
                        }
                      }).catch(error => console.error('Error fetching players:', error));
                })
              }).catch(error => console.error('Error fetching game-appearance:', error));
        }
      }

      function loadPlayerValuationsClubName() {
        const queryName = inputSearch.value;
        const queryPosition = positionSelection.options[positionSelection.selectedIndex].value;
        const queryStart = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-start");
        const queryEnd = seasonSelection.options[seasonSelection.selectedIndex].getAttribute("data-end");
        let valuations = [];
        if(queryName){
          axios.get(`${baseUrl}clubs/search/name?name=${queryName}`)
            .then(resultClubs => {
              if(resultClubs) {
                resultClubs.data.forEach(club => {
                  axios.get(`${baseUrl}game-appearances/clubid/startdate/enddate?clubid=${club.club_id}&startdate=${queryStart}&enddate=${queryEnd}`)
                      .then(resultApp => {
                        if (resultApp) {
                          resultApp.data.forEach(gameAppearance => {
                            axios.get(`${baseUrl}players/search/name/position?name=${gameAppearance.player_name}&sort=name&order=asc&position=${queryPosition}`)
                                .then(resultPlayer => {
                                  if (resultPlayer) {
                                    resultPlayer.data.forEach(player => {
                                      let playerValuation = {
                                        "player_id": player.player_id,
                                        "player_name": player.name,
                                        "postion": player.postion,
                                        "market_value": player.market_value,
                                        "club_name": resultClub.data.club_name,
                                        "club_id": gameAppearance.player_club_id,
                                        "yellow_cards": gameAppearance.yellow_cards,
                                        "red_cards": gameAppearance.red_cards,
                                        "goals": gameAppearance.goals,
                                        "assists": gameAppearance.assists,
                                        "minutes_played": gameAppearance.minutes_played,
                                        "appearances": gameAppearance.appearances
                                      }
                                      valuations.push(playerValuation);
                                    })
                                  }
                                }).catch(error => console.error("Error fetching clubs:", error));
                          })
                        }
                      }).catch(error => console.error('Error fetching game-appearances:', error));
                })
              }
            }).catch(error => console.error('Error fetching players paged:', error));

        }
          renderPlayerValuations(valuations);
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

// Fetch player names for autocomplete
      inputSearch.addEventListener('input', function () {

        const paramSearchValue = paramSearch.value;
        if (paramSearchValue == 1) {
          loadPlayerValuationsPlayerName();
        } else {
          loadPlayerValuationsClubName();
        }
      });

  function infoPlayerId(playerId) {
    // Fetch player data from API
    axios.get(`${baseUrl}players/${playerId}`)
        .then(response => {
          const playerData = response.data;
          console.log(playerData);
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
        .then(response =>{
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