# IUM_TWEB_FE

Frontend del progetto universitario **IUM/TWEB** — una Soccer Analytics Dashboard per visualizzare e gestire dati calcistici. È un'applicazione web statica (HTML + CSS + JS vanilla) che comunica con il [MainServer (Node.js)](../IUM_TWEB_BE_MainServer) tramite chiamate HTTP (Axios) e WebSocket (Socket.IO).

## Descrizione

La dashboard permette di esplorare statistiche calcistiche aggregate: valori di mercato dei giocatori, risultati delle partite, statistiche per stagione, e gestione delle valutazioni. Include anche una chat real-time accessibile da qualsiasi pagina.

## Stack tecnologico

- **HTML5 / CSS3 / JavaScript vanilla** — nessun framework frontend
- **Bootstrap 5** — layout e componenti UI
- **Chart.js** — grafici e visualizzazioni dati
- **Axios** — chiamate HTTP alle API REST
- **Socket.IO (client)** — chat real-time
- **Font Awesome** — icone

## Struttura del progetto

```
IUM_TWEB_FE/
├── index.html                  # Dashboard principale
├── player-stats.html           # Pagina statistiche giocatori
├── player-valuations.html      # Pagina valutazioni di mercato
├── register.html               # Pagina di registrazione
├── css/
│   ├── base_style.css          # Stili condivisi
│   ├── index.css               # Stili specifici della home
│   └── chat.css                # Stili del componente chat
├── js/
│   ├── index.js                # Logica e grafici della home
│   ├── player-stats_app.js     # Logica della pagina Player Stats
│   ├── player-valuations_app.js# Logica della pagina Player Valuations
│   ├── chat.js                 # Componente chat (Socket.IO)
│   └── register.js             # Logica del form di registrazione
└── assets/
    └── audio/
        └── pop-alert.mp3       # Suono notifica chat
```

## Pagine

### Home (`index.html`)
Dashboard con una panoramica generale dei dati calcistici, composta da diversi grafici:
- **Top 10 giocatori per valore di mercato** — grafico a barre
- **Risultati partite recenti** — lista delle ultime 5 partite
- **Top 5 club per età media** — grafico a barre orizzontale
- **Distribuzione goal per ruolo** — grafico a torta
- **Top goal scorer, assist, cartellini rossi e gialli** — grafici a barre
- **Tabella performance ultima settimana** — statistiche aggregate per giocatore

### Player Stats (`player-stats.html`)
Ricerca avanzata delle statistiche dei giocatori con filtri per:
- Ruolo (Attack, Goalkeeper, Midfield, Defender)
- Stagione (dalla 2013/2014 alla 2023/2024)
- Nome giocatore o club
- Ordinamento per qualsiasi colonna (goals, assist, cartellini, minuti, valore di mercato...)

Cliccando su una riga si apre un modal con le informazioni complete del giocatore o del club.

### Player Valuations (`player-valuations.html`)
Ricerca e gestione dello storico dei valori di mercato con due modalità:
- **Ricerca per club** — con autocompletamento
- **Ricerca per giocatore** — con filtro su intervallo di date

Permette di **modificare** le valutazioni di mercato e i dati dei giocatori tramite modal con form editabili.

### Register (`register.html`)
Form di registrazione utente con campi: nome, cognome, data di nascita, username, email, password e accettazione dei ToS.

### Chat (componente trasversale)
Presente in tutte le pagine — chat real-time basata su Socket.IO con:
- Autenticazione tramite username e stanza (room)
- Notifiche sonore e visive sui messaggi non letti
- Badge con contatore messaggi non letti

## Avvio

Il frontend è un'applicazione statica: non richiede build né installazione di dipendenze.

### Prerequisiti

Assicurarsi che i backend siano in esecuzione:
- **MainServer** Node.js → `http://localhost:3000`
- **DataPos** Spring Boot → `http://localhost:8989` (usato internamente dal MainServer)

### Opzione 1 — Live Server (VS Code)

Aprire la cartella `IUM_TWEB_FE` in VS Code, installare l'estensione **Live Server** e cliccare su **Go Live** in basso a destra.

```
http://localhost:5500
```

### Opzione 2 — Python HTTP Server

```bash
cd IUM_TWEB_FE
python3 -m http.server 5500
```

Aprire il browser su `http://localhost:5500`.

## Configurazione

L'URL del backend è hardcoded nei file JS come:

```js
const baseUrl = 'http://localhost:3000';
```

Se il MainServer gira su una porta o host diverso, aggiornare questa variabile nei file `js/index.js`, `js/player-stats_app.js`, `js/player-valuations_app.js` e `js/chat.js`.

## Note

- I dati della dashboard home sono fissi su un intervallo di date (`2013-08-20` / `2024-08-19`) poiché il dataset non copre date recenti.
- La pagina di registrazione è attualmente solo un mockup: il form non invia dati al backend.
- La chat richiede che Socket.IO sia configurato e attivo sul MainServer.