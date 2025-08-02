import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next"; // Da abilitare quando traduci
// import { Helmet } from "react-helmet"; // Per SEO

const PrivacyPolicy = () => {
  // const { t } = useTranslation(); // Abilita per traduzioni

  return (
    <main className="privacy-container" style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      {/* SEO title per la traduzione futura */}
      {/* 
      <Helmet>
        <title>{t("Privacy Policy")} | Vincanto Maiori</title>
        <meta name="description" content={t("Informativa privacy secondo GDPR")} />
      </Helmet> 
      */}

      <h1>Informativa sulla Privacy</h1>
      <p>Ultimo aggiornamento: 31 luglio 2025</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        Vincanto Maiori – Via Torre di Milo, 7 – 84010 Maiori (SA) <br />
        Email: info@vincantomaiori.it – PEC: [inserire PEC]
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
        <li>Marketing (previo consenso)</li>
      </ul>

      <h2>4. Base giuridica</h2>
      <p>Contratto, Consenso, Legittimo Interesse</p>

      <h2>5. Modalità del trattamento</h2>
      <p>
        Trattamento lecito, trasparente e sicuro, con misure tecniche e organizzative adeguate.
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
        Utilizziamo cookie tecnici, analitici e di marketing. Consulta la{" "}
        <Link to="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>9. Destinatari e trasferimenti</h2>
      <p>
        Provider IT, servizi di analisi/pubblicità (Google, Meta), soggetti autorizzati. Nessun trasferimento extra-UE senza garanzie adeguate.
      </p>

      <h2>10. Aggiornamenti</h2>
      <p>Questa informativa può essere soggetta a modifiche. Ultimo aggiornamento: 31 luglio 2025</p>
    <div style={{ textAlign: "center" , marginTop: "3rem" }}>
      <button
      onClick={() => window.print()}
      className="colose-page-btn">
      ❌ Chiudi la pagina
      </button>
    </div>
    </main>
  );
};

export default PrivacyPolicy;