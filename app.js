document.addEventListener('DOMContentLoaded', function () {
    // Base URL
    const baseUrl = 'http://localhost:3000/';
  
    // Player Valuations Table Body
    const playerValuationsTableBody = document.querySelector('#playerValuationsTable tbody');
  
    // Player name input and datalist for autocomplete
    const playerNameInput = document.getElementById('playerName');
    const playerNameList = document.getElementById('playerNameList');
    
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
    }
      
    function createPlayerValuationRow(valuation) {
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
      return row;
    }
    
    // Edit Player Valuation
    function editPlayerValuation(playerId, date) {
        // Fetch player valuation data from API
        axios.get(`http://localhost:3000/player-valuations/${playerId}/${date}`)
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

      // Find the playerId from the datalist options
      const playerName = playerNameInput.value;
      const selectedOption = Array.from(playerNameList.options).find(option => option.value === playerName);
      const playerId = selectedOption ? selectedOption.dataset.playerId : null; //document.querySelector('#playerId').value
      const date = document.querySelector('#date').value;
      if (clubId) {
        axios.get(`${baseUrl}player-valuations/club/${clubId}`)
          .then(response => {
            renderPlayerValuations(response.data);
          })
          .catch(error => {
            console.error('Error fetching player valuations:', error);
          });
      } else if (playerId || date){
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

    // Handle form submission for editing player valuation
    document.getElementById('editPlayerValuationForm').addEventListener('submit', function(event) {
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

  // Fetch player names for autocomplete
  playerNameInput.addEventListener('input', function () {
    const query = playerNameInput.value;
    if (query.length >= 2) { // Fetch suggestions if input length is greater than or equal to 2
      axios.get(`${baseUrl}players/search/name?name=${query}`)
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

  // Initial load of player valuations
  refreshPlayerValuations();

  // Connect to the server using socket.io
  const socket = io("http://localhost:3000", {
    path: "/socket-io/",
    transports: ['websocket', 'polling'], // Use polling as a fallback
    cors: {  // https://stackoverflow.com/a/64805972
      origin: "http://localhost:3000",
      credentials: true
    }
  });
  

    /* Chat related code */
    const chatComponent = document.getElementById('chatComponent');
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const messageArea = document.getElementById('messageArea');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    let username = '';
    let room = '';

    openChatBtn.addEventListener('click', function() {
      if (!username) {
        username = prompt('Please enter your username:');
        if (!username) return;
      }
      if (!room) {
        room = prompt('Please enter the room name:');
        if (!room) return;
        socket.emit('join-room', { username, room });
      }
      chatComponent.style.display = 'block';
      // Hide openChatBtn after opening the chat
      openChatBtn.style.display = 'none';
    });

    closeChatBtn.addEventListener('click', function() {
      chatComponent.style.display = 'none';
      // Show openChatBtn after closing the chat
      openChatBtn.style.display = 'block';
    });

    // Send message
    function sendMessage() {
      const message = messageInput.value.trim();
      if (message !== '') {
        socket.emit('chat-message', { username, room, message });
        messageInput.value = '';
      }
    }

    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);

    // Send message on Enter key press
    messageInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    });

    // Listen for chat-message event
    socket.on('chat-message', function(message) {
      outputMessage(message);
      playNotificationSound();
    });

    // Output message to the chat component 
    function outputMessage(message) {
      if (room !== message.room) return;
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p><strong>${message.username}: </strong>${message.message}</p>`;
      messageArea.appendChild(div);
      messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Play notification sound (https://www.w3schools.com/jsref/met_audio_play.asp)
    function playNotificationSound() {
      var audio = document.getElementById('notificationSound');
      audio.play();
    }

});
  