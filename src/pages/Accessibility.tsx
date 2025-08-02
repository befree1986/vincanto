import React from "react";

const Accessibilita: React.FC = () => {
  return (
    <main role="main" aria-labelledby="accessibility-title" lang="it">
      <section>
        <h1 id="accessibility-title">Accessibilità del Sito</h1>
        <p>
          <strong>Ultimo aggiornamento:</strong> 2 agosto 2025
        </p>
        <p>
          Vincanto Maiori si impegna a garantire che il proprio sito web sia
          accessibile a tutti gli utenti, inclusi coloro con disabilità.
        </p>
        <p>
          Abbiamo adottato misure tecniche e redazionali per conformarci alle
          linee guida WCAG 2.1, offrendo un’esperienza fluida e inclusiva.
        </p>

        <h2>Compatibilità</h2>
        <p>
          Il sito è stato testato con lettori di schermo, navigazione da
          tastiera e dispositivi mobili. Il layout, i colori e i contenuti
          seguono criteri di accessibilità visiva e semantica.
        </p>

        <h2>Limitazioni</h2>
        <p>
          Alcune sezioni potrebbero non essere completamente conformi. Se riscontri
          difficoltà, ti invitiamo a segnalarcelo.
        </p>

        <h2>Contatti</h2>
        <p>
          Per richieste o segnalazioni scrivici a{" "}
          <a href="mailto:accessibilita@vincantomaiori.it">
            accessibilita@vincantomaiori.it
          </a>
        </p>

        <p>
          Grazie per contribuire a migliorare l'accessibilità del sito.
        </p>

        <footer>
          <small>
            Questa dichiarazione è soggetta ad aggiornamenti. Ultima revisione: 2 agosto 2025.
          </small>
        </footer>
        <button
          onClick={() => window.close()}
          className="colose-page-btn"
          aria-label="Chiudi pagina"
        >
          ❌ Chiudi la pagina
        </button>
      </section>
    </main>
  );
};

export default Accessibilita;