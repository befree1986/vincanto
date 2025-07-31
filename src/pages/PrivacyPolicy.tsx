import React from "react";

const PrivacyPolicy = () => {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Informativa sulla Privacy</h1>
      <p>Ultimo aggiornamento: [inserire data]</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        [Nome Azienda o Tuo Nome] – [Indirizzo completo] <br />
        Email: tuo@email.it – PEC: [PEC se presente]
      </p>

      <h2>2. Tipologie di dati raccolti</h2>
      <ul>
        <li>Dati identificativi (nome, email, ecc.)</li>
        <li>Dati di navigazione (IP, browser, sistema operativo)</li>
        <li>Dati raccolti tramite cookie</li>
      </ul>

      <h2>3. Finalità del trattamento</h2>
      <ul>
        <li>Rispondere alle richieste</li>
        <li>Ottimizzare l’esperienza</li>
        <li>Statistiche e analisi</li>
        <li>Marketing (con consenso)</li>
      </ul>

      <h2>4. Base giuridica</h2>
      <p>Contratto, Consenso, Legittimo interesse</p>

      <h2>5. Modalità del trattamento</h2>
      <p>
        Trattamento lecito, trasparente, con misure tecniche adeguate per
        proteggere i dati.
      </p>

      <h2>6. Conservazione dei dati</h2>
      <ul>
        <li>10 anni per obblighi legali</li>
        <li>2 anni per marketing</li>
        <li>Fino alla revoca del consenso</li>
      </ul>

      <h2>7. Diritti dell’utente</h2>
      <ul>
        <li>Accesso</li>
        <li>Rettifica, cancellazione, limitazione</li>
        <li>Revoca del consenso</li>
        <li>Opposizione</li>
      </ul>

      <h2>8. Cookie</h2>
      <p>
        Utilizziamo cookie tecnici, analitici e di marketing. Vedi{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>9. Destinatari e trasferimento</h2>
      <p>
        Provider IT, servizi analisi/pubblicità (Google, Meta), soggetti
        autorizzati. Nessun trasferimento extra-UE senza garanzie.
      </p>

      <h2>10. Aggiornamenti</h2>
      <p>L’informativa può subire modifiche. Ultimo aggiornamento: [data]</p>
    </main>
  );
};

export default PrivacyPolicy;