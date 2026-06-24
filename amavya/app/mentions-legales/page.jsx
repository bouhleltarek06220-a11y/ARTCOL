import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site AMAVYA.",
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <LegalShell title="Mentions légales" updated="25 mai 2026">
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>amavya.cloud</strong> est édité par <strong>AMAVYA</strong>,
        société par actions simplifiée unipersonnelle (SASU) de droit français.
      </p>
      <ul>
        <li>Dénomination sociale : <strong>AMAVYA</strong></li>
        <li>Forme juridique : SASU</li>
        <li>Capital social : 1,00 €</li>
        <li>SIREN / SIRET : 105 546 634 / 105 546 634 00012</li>
        <li>RCS : Antibes 105 546 634</li>
        <li>Code APE/NAF : 62.01Z (programmation informatique)</li>
        <li>N° TVA intracommunautaire : FR01105546634</li>
        <li>Siège social : 195 chemin des Plateaux Fleuris, 06600 Antibes</li>
        <li>Email : <a href="mailto:contact@amavya.cloud">contact@amavya.cloud</a></li>
        <li>Président : <strong>Tarek Bouhlel</strong></li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est <strong>Tarek Bouhlel</strong>, en qualité
        de Président d'AMAVYA.
      </p>

      <h2>3. Hébergeur</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
      </p>
      <p>
        Les données du formulaire de contact sont stockées sur{" "}
        <strong>Supabase</strong> (infrastructure située dans l'Union européenne).
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu de ce site (textes, identité visuelle, logo, images,
        code source, mise en page) est la propriété exclusive d'AMAVYA, sauf mention
        contraire. Toute reproduction, représentation, modification ou exploitation,
        totale ou partielle, sans autorisation écrite préalable, est interdite et
        constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants
        du Code de la propriété intellectuelle.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Le traitement des données personnelles collectées via ce site est détaillé dans
        notre <a href="/confidentialite">politique de confidentialité</a>. Vous y
        trouverez vos droits (accès, rectification, effacement…) et les modalités pour
        les exercer.
      </p>

      <h2>6. Cookies</h2>
      <p>
        La gestion des cookies est décrite dans notre{" "}
        <a href="/cookies">politique de cookies</a>.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont soumises au <strong>droit français</strong>.
        Tout litige relatif à l'utilisation du site relève de la compétence exclusive des
        tribunaux français.
      </p>
    </LegalShell>
  );
}
