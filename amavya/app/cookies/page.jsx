import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "Politique de cookies",
  description: "Utilisation des cookies sur le site AMAVYA.",
  robots: { index: true, follow: true },
};

export default function Cookies() {
  return (
    <LegalShell title="Politique de cookies" updated="25 mai 2026">
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier déposé sur votre appareil lors de la visite d'un
        site. Il peut servir à faire fonctionner le site, à mémoriser des préférences ou
        à mesurer l'audience.
      </p>

      <h2>2. Les cookies utilisés sur ce site</h2>
      <p>
        Le site <strong>amavya.cloud</strong> est conçu dans une logique de respect de la
        vie privée. À ce jour, il <strong>n'utilise aucun cookie de suivi, de
        publicité ou de mesure d'audience tiers</strong> : pas de Google Analytics, pas de
        pixel publicitaire, pas de traceur marketing.
      </p>
      <ul>
        <li>
          <strong>Cookies strictement nécessaires</strong> : éventuellement déposés par
          notre hébergeur pour la sécurité et le bon fonctionnement technique du site. Ils
          ne nécessitent pas de consentement.
        </li>
        <li>
          <strong>Polices d'écriture</strong> : chargées de manière auto-hébergée, sans
          dépôt de cookie tiers.
        </li>
      </ul>

      <h2>3. Votre consentement</h2>
      <p>
        Aucun cookie soumis à consentement (mesure d'audience, publicité) n'étant
        actuellement déposé, aucune bannière de consentement n'est nécessaire. Si cela
        venait à changer (ajout d'un outil de statistiques par exemple), un bandeau de
        gestion du consentement serait mis en place et cette page mise à jour.
      </p>

      <h2>4. Gérer les cookies</h2>
      <p>
        Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer
        les cookies (menu « Paramètres » → « Confidentialité » de votre navigateur).
      </p>

      <h2>5. Contact</h2>
      <p>
        Pour toute question relative aux cookies ou à vos données, écrivez-nous à{" "}
        <a href="mailto:contact@amavya.cloud">contact@amavya.cloud</a>. Voir aussi notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </LegalShell>
  );
}
