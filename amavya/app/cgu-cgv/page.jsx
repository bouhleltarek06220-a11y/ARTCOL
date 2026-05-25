import LegalShell from "@/components/LegalShell";

export const metadata = {
  title: "CGU / CGV",
  description: "Conditions générales d'utilisation et de vente d'AMAVYA.",
  robots: { index: true, follow: true },
};

export default function CguCgv() {
  return (
    <LegalShell title="Conditions générales (CGU / CGV)" updated="25 mai 2026">
      <p>
        Les présentes conditions régissent l'utilisation du site <strong>amavya.cloud</strong>{" "}
        (CGU) ainsi que les prestations proposées par <strong>AMAVYA</strong> (CGV).
      </p>

      <h2>Partie A — Conditions générales d'utilisation (CGU)</h2>

      <h3>1. Objet</h3>
      <p>
        Le site amavya.cloud a pour objet de présenter l'activité d'AMAVYA (solutions
        d'intelligence artificielle, automatisation, SaaS, CRM et agents IA) et de
        permettre la prise de contact.
      </p>

      <h3>2. Accès au site</h3>
      <p>
        Le site est accessible gratuitement. AMAVYA s'efforce d'assurer sa disponibilité
        mais ne saurait être tenue responsable d'une interruption, notamment pour
        maintenance ou cas de force majeure.
      </p>

      <h3>3. Propriété intellectuelle</h3>
      <p>
        Tous les éléments du site sont protégés par le droit de la propriété
        intellectuelle et demeurent la propriété d'AMAVYA. Voir nos{" "}
        <a href="/mentions-legales">mentions légales</a>.
      </p>

      <h3>4. Responsabilité</h3>
      <p>
        Les informations fournies sur le site le sont à titre indicatif et peuvent
        évoluer. AMAVYA ne saurait être tenue responsable de l'usage qui en est fait ni
        des contenus de sites tiers accessibles via des liens.
      </p>

      <h2>Partie B — Conditions générales de vente (CGV)</h2>

      <h3>5. Prestations</h3>
      <p>
        Les prestations d'AMAVYA (développement, intégration IA, automatisation, CRM,
        SaaS sur mesure…) font l'objet de <strong>devis personnalisés</strong> et de{" "}
        <strong>contrats spécifiques</strong>. Les présentes CGV s'appliquent à défaut de
        conditions particulières convenues entre les parties.
      </p>

      <h3>6. Devis et commande</h3>
      <p>
        Toute prestation débute après acceptation écrite d'un devis. Le devis précise le
        périmètre, les livrables, les délais et le prix.
      </p>

      <h3>7. Prix et paiement</h3>
      <p>
        Les prix sont indiqués en euros. Les modalités de paiement (acompte, échéances,
        délais) sont précisées sur chaque devis.{" "}
        <span className="todo">[conditions de paiement détaillées à compléter]</span>
      </p>

      <h3>8. Droit de rétractation</h3>
      <p>
        Les prestations s'adressant à des professionnels (B2B), le droit de rétractation
        prévu pour les consommateurs ne s'applique pas, sauf disposition contractuelle
        contraire.
      </p>

      <h3>9. Réclamations et litiges</h3>
      <p>
        Toute réclamation peut être adressée à{" "}
        <a href="mailto:contact@amavya.cloud">contact@amavya.cloud</a>. À défaut d'accord
        amiable, tout litige relève du <strong>droit français</strong> et de la
        compétence des tribunaux français.
      </p>
    </LegalShell>
  );
}
