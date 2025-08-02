

const TermsConditions = () => {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Termini e Condizioni</h1>
      <p>Ultimo aggiornamento: 31 luglio 2025</p>

      <h2>1. Introduzione</h2>
      <p>
        L'accesso e l'utilizzo di questo sito web sono soggetti ai seguenti
        Termini e Condizioni. Visitando il sito, accetti pienamente questi termini.
      </p>

      <h2>2. Proprietà Intellettuale</h2>
      <p>
        Tutti i contenuti presenti sono di proprietà di Vincanto Maiori o dei
        rispettivi titolari. È vietata la riproduzione non autorizzata.
      </p>

      <h2>3. Prenotazioni e Pagamenti</h2>
      <p>
        Le condizioni di prenotazione, pagamento, cancellazione e rimborso sono
        descritte nel modulo di prenotazione. L'invio comporta accettazione.
      </p>

      <h2>4. Responsabilità</h2>
      <p>
        Non siamo responsabili per interruzioni di servizio, danni indiretti o
        informazioni errate causate da terze parti.
      </p>

      <h2>5. Modifiche ai Termini</h2>
      <p>
        Ci riserviamo il diritto di modificare i presenti termini in qualsiasi momento.
      </p>

      <h2>6. Foro competente</h2>
      <p>
        Per ogni controversia sarà competente il Foro di Salerno, Italia.
      </p>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button 
        onClick={() =>window.close()}
          className="close-page-btn"
          >
          ❌ Chiudi la pasgina
          </button>
      </div>
    </main>
  );
};

export default TermsConditions;