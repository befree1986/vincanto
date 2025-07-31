const CookiePolicy = () => {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Cookie Policy</h1>
      <p>Ultimo aggiornamento: [inserire data]</p>

      <h2>1. Cosa sono i cookie?</h2>
      <p>
        I cookie sono piccoli file di testo inviati da un sito al dispositivo
        dell’utente, dove vengono memorizzati per essere ritrasmessi al sito
        durante le visite successive. Servono a migliorare l’esperienza,
        raccogliere dati statistici e offrire contenuti personalizzati.
      </p>

      <h2>2. Tipologie di cookie utilizzate</h2>
      <ul>
        <li><strong>Cookie tecnici:</strong> indispensabili per il funzionamento del sito</li>
        <li><strong>Cookie analitici:</strong> utilizzati per raccogliere dati anonimi di traffico</li>
        <li><strong>Cookie di marketing:</strong> impiegati per tracciare la navigazione e offrire contenuti pubblicitari rilevanti</li>
      </ul>

      <h2>3. Base giuridica per l’uso dei cookie</h2>
      <p>
        I cookie tecnici sono necessari e non richiedono consenso. Per analitici
        e marketing, viene richiesto il consenso esplicito tramite il banner GDPR.
      </p>

      <h2>4. Gestione del consenso</h2>
      <p>
        Al primo accesso, l’utente può scegliere quali cookie accettare. Le
        preferenze possono essere modificate in ogni momento accedendo alla sezione
        dedicata o cliccando sul link nel footer del sito.
      </p>

      <h2>5. Cookie di terze parti</h2>
      <p>
        Alcuni servizi (es. Google Analytics, Meta Pixel) possono installare cookie
        propri. Si consiglia di consultare le rispettive informative per maggiori dettagli.
      </p>

      <h2>6. Come disabilitare i cookie</h2>
      <p>
        L’utente può gestire i cookie anche dal proprio browser. Di seguito i link
        alle guide dei principali browser:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank">Chrome</a></li>
        <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank">Firefox</a></li>
        <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank">Safari</a></li>
        <li><a href="https://support.microsoft.com/it-it/topic/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank">Edge</a></li>
      </ul>

      <h2>7. Modifiche alla Cookie Policy</h2>
      <p>
        La presente policy può subire variazioni. Si consiglia di consultarla
        periodicamente. Ultimo aggiornamento: [data].
      </p>
    </main>
  );
};

export default CookiePolicy;