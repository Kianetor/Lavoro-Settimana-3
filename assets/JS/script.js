/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Cerca su MDN solo i concetti dichiarati come "cerca tu":
  localStorage, Blob/URL.createObjectURL, FileReader.
  Tutto il resto e' stato visto in settimana.
- Niente AI per generare codice. Niente template scaricati.
*/

/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/

/* Array Oggetti Iniziale */

let albums = [
   { id: 1, titolo: "The Wall", artista: "Pink Floyd", anno: 1979, stato: "da-ascoltare" },
   { id: 2, titolo: "Parachutes", artista: "Coldplay", anno: 2000, stato: "ascoltato" },
   { id: 3, titolo: "Meteora", artista: "Linkin Park", anno: 2003, stato: "ascoltato" },
   { id: 4, titolo: "Ride the Lightning", artista: "Metallica", anno: 1984, stato: "da-ascoltare" },
   { id: 5, titolo: "Non al denaro non all'amore né al cielo", artista: "Fabrizio De André", anno: 1971, stato: "ascoltato" }
];

let filtroCorrente = "tutti";
let ordinamentoCorrente = "anno-asc";
let ricercaCorrente = "";


/* Selezione Elementi dal DOM */


const formAlbum = document.getElementById("form-album");
const inputTitolo = document.getElementById("titolo");
const inputArtista = document.getElementById("artista");
const inputAnno = document.getElementById("anno");
const selectStato = document.getElementById("stato");

const inputRicerca = document.getElementById("ricerca");
const selectFiltro = document.getElementById("filtro");
const selectOrdinamento = document.getElementById("ordinamento");

const listaAlbum = document.getElementById("lista-album");
const btnTema = document.getElementById("btn-tema");
const divNotifica = document.getElementById("notifica");

const statTotale = document.getElementById("stat-totale");
const statAscoltati = document.getElementById("stat-ascoltati");
const statDaAscoltare = document.getElementById("stat-da-ascoltare");
const barraProgresso = document.getElementById("barra-ascoltati");


/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/


function render() {
   const listaAlbum = document.getElementById("lista-album");
   listaAlbum.innerHTML = "";

   /* 1-2 Filtro basato su stato e su stringa di ricerca live */

   let albumElaborati = albums.filter(album => {
      const corrispondeFiltro = filtroCorrente === "tutti" || album.stato === filtroCorrente;
      const corrispondeRicerca = album.titolo.toLowerCase().includes(ricercaCorrente.toLowerCase()) || album.artista.toLowerCase().includes(ricercaCorrente.toLowerCase());
      return corrispondeFiltro && corrispondeRicerca;
   });

   /* 3) Ordinamento */
   albumElaborati.sort((a, b) => {
      if (ordinamentoCorrente === "anno-asc") return a.anno - b.anno;
      if (ordinamentoCorrente === "anno-desc") return b.anno - a.anno;
      if (ordinamentoCorrente === "titolo-asc") return a.titolo.localeCompare(b.titolo);
      if (ordinamentoCorrente === "titolo-desc") return b.titolo.localeCompare(a.titolo);
      return 0;
   });

   /* 4-5 Generazione elementi DOM nel container */
   albumElaborati.forEach(album => {
      const card = document.createElement("div");
      card.className = `album-card ${album.stato}`;
      card.dataset.id = album.id;

      const badgeTesto = album.stato === "ascoltato" ? "ascoltato" : "Da ascoltare";
      const badgeClasse = album.stato === "ascoltato" ? "badge-ascoltato" : "badge-da-ascoltare";
      const toggleTesto = album.stato === "ascoltato" ? "Segna da ascoltare" : "Segna ascoltato";

      card.innerHTML = `<div class="album-info">
        <h3 class="testo-titolo">${album.titolo}</h3>
        <p class="testo-artista">${album.artista} — ${album.anno || 'N/D'}</p>
      </div>
      <div class="album-azioni">
        <span class="badge ${badgeClasse}">${badgeTesto}</span>
        <button class="btn-toggle">${toggleTesto}</button>
        <button class="btn-modifica">Modifica</button>
        <button class="btn-elimina">Elimina</button>
      </div>`;

      listaAlbum.appendChild(card);
   });

   const totale = albums.length;
   const ascoltati = albums.filter(album => album.stato === "ascoltato").length;
   const daAscoltare = totale - ascoltati;

   const percentuale = totale > 0 ? (ascoltati / totale) * 100 : 0;
   barraProgresso.style.width = percentuale + "%";

   statTotale.textContent = totale;
   statAscoltati.textContent = ascoltati;
   statDaAscoltare.textContent = daAscoltare;

}

/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

formAlbum.addEventListener("submit", function (event) {
   event.preventDefault();

   const titoloValore = inputTitolo.value.trim();
   const artistaValore = inputArtista.value.trim();
   const annoValore = inputAnno.value ? parseInt(inputAnno.value) : null;
   const statoValore = selectStato.value;


   if (!titoloValore || !artistaValore) {
      notifica("Errore: Compila tutti i campi obbligatori!");
      return;
   }

   const nuovoAlbum = {
      id: Date.now(), // Genera ID numerico unico basato sul millisecondo corrente
      titolo: titoloValore,
      artista: artistaValore,
      anno: annoValore,
      stato: statoValore
   };

   albums.push(nuovoAlbum);
   formAlbum.reset();
   render();
});

render();

/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

document.getElementById("ricerca").addEventListener("input", function (event) {
   ricercaCorrente = event.target.value;
   render();
});

document.getElementById("filtro").addEventListener("change", function (event) {
   filtroCorrente = event.target.value;
   render();
});

document.getElementById("ordinamento").addEventListener("change", function (event) {
   ordinamentoCorrente = event.target.value;
   render();
});



/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

/* SCRIVI QUI LA TUA RISPOSTA */



/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/

/* SCRIVI QUI LA TUA RISPOSTA */

btnTema.addEventListener("click", function () {
   document.body.classList.toggle("dark");

   if (document.body.classList.contains("dark")) {
      btnTema.textContent = "Tema chiaro";
   } else {
      btnTema.textContent = "Tema scuro";
   }
});

/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* ESPORTAZIONE / IMPORTAZIONE JSON (cerca tu su MDN)
   - Esporta: crea un Blob con JSON.stringify(stato), genera un URL con
     URL.createObjectURL e simula il click su un <a download>.
   - Importa: <input type="file"> + FileReader per leggere il contenuto come
     testo, JSON.parse, sostituisci lo stato, render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */