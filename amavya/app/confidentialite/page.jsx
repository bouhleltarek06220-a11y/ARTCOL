import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment AMAVYA collecte et protège vos données personnelles (RGPD).",
  robots: { index: true, follow: true },
};

export default function Confidentialite() {
  return (
    <LegalShell title="Politique de confidentialité" updated="25 mai 2026">
      <p>
        AMAVYA accorde une grande importance à la protection de vos données
        personnelles. La présente politique explique quelles données sont collectées,
        pourquoi, et quels sont vos droits, conformément au Règlement général sur la
        protection des données (RGPD) et à la loi « Informatique et Libertés » du
        6 janvier 1978 modifiée.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement est <strong>AMAVYA</strong> (SASU), représentée par
        Tarek Bouhlel. Contact :{" "}
        <a href="mailto:contact@amavya.cloud">contact@amavya.cloud</a>.
      </p>

      <h2>2. Données collectées</h2>
      <p>Lorsque vous remplissez le formulaire de contact, nous collectons :</p>
      <ul>
        <li>votre <strong>nom complet</strong> ;</li>
        <li>votre <strong>entreprise</strong> (le cas échéant) ;</li>
        <li>votre <strong>adresse email</strong> ;</li>
        <li>votre <strong>numéro de téléphone</strong> (facultatif) ;</li>
        <li>le <strong>message</strong> décrivant votre besoin ;</li>
        <li>
          des <strong>données techniques</strong> minimales (navigateur, page d'origine)
          à des fins de sécurité anti-spam.
        </li>
      </ul>

      <h2>3. Finalité du traitement</h2>
      <p>Ces données sont utilisées uniquement pour :</p>
      <ul>
        <li>répondre à votre demande de contact ;</li>
        <li>échanger avec vous au sujet d'une éventuelle prestation ;</li>
        <li>assurer le suivi de la relation commerciale.</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Le traitement repose sur votre <strong>consentement</strong> (envoi volontaire du
        formulaire) et sur l'exécution de <strong>mesures précontractuelles</strong>
        prises à votre demande (article 6.1.a et 6.1.b du RGPD).
      </p>

      <h2>5. Destinataires</h2>
      <p>
        Vos données sont strictement <strong>internes à AMAVYA</strong>. Elles ne sont{" "}
        <strong>jamais cédées, vendues ou louées</strong> à des tiers à des fins
        commerciales. Elles sont hébergées chez notre sous-traitant technique{" "}
        <strong>Supabase</strong> (infrastructure dans l'Union européenne).
      </p>

      <h2>6. Durée de conservation</h2>
      <p>
        Les données sont conservées le temps nécessaire au traitement de votre demande,
        et au maximum <strong>3 ans à compter du dernier contact</strong>. Au-delà, elles
        sont supprimées.
      </p>

      <h2>7. Vos droits</h2>
      <p>Vous disposez à tout moment d'un droit :</p>
      <ul>
        <li>d'<strong>accès</strong> à vos données ;</li>
        <li>de <strong>rectification</strong> ;</li>
        <li>d'<strong>effacement</strong> (droit à l'oubli) ;</li>
        <li>de <strong>limitation</strong> du traitement ;</li>
        <li>d'<strong>opposition</strong> ;</li>
        <li>de <strong>portabilité</strong> ;</li>
        <li>de <strong>retrait de votre consentement</strong> à tout moment.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez-nous à{" "}
        <a href="mailto:contact@amavya.cloud">contact@amavya.cloud</a> en précisant
        l'objet « RGPD ».
      </p>

      <h2>8. Réclamation</h2>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas
        respectés, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong>{" "}
        —{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          cnil.fr/fr/plaintes
        </a>
        .
      </p>

      <h2>9. Sécurité</h2>
      <p>
        AMAVYA met en œuvre des mesures techniques et organisationnelles appropriées
        (connexions chiffrées, accès restreint) pour protéger vos données contre tout
        accès non autorisé, perte ou altération.
      </p>
    </LegalShell>
  );
}
