import PptxGenJS from 'pptxgenjs';
import path from 'path';

const NOTES = [
 "OGHJI — le tableau électrique intelligent, le cerveau énergétique de votre installation. Accroche : contrôle en temps réel, 100 % numérique, connecté et intelligent. Produit breveté.",
 "Le constat : un tableau électrique classique est passif et « aveugle ». Quatre douleurs — aucune visibilité sur la conso, factures qui grimpent, risque électrique vu trop tard, zéro pilotage à distance. Transition : il faut lui donner un cerveau.",
 "La solution : OGHJI remplace le tableau et se branche entre le disjoncteur général et les circuits. 100 % numérique, il mesure, protège, pilote et anticipe en temps réel. Pas des modules vissés — un système nativement intelligent, d'un seul bloc.",
 "Le produit : écran 10″ tactile et déportable, capteurs de présence et de luminosité, boîtiers de puissance 8 circuits extensibles, format compact 35 × 25 × 10 cm.",
 "Sous le capot : tout est intégré nativement — mesure par circuit, protection avancée, communication (écran, app, web). Produit breveté FR3055478B1. Borniers d'arrivée, Linky et circuits sur rail DIN 6 modules.",
 "Les bénéfices, six leviers concrets : mesure en temps réel, pilotage total à distance, sécurité avancée (type B + arc), maintenance prédictive, économies d'énergie et gestion multi-tableaux / véhicule électrique.",
 "Le verrou sécurité : différentiel type B + détection d'arc, le niveau le plus exigeant. OGHJI détecte l'anomalie et alerte AVANT l'accident — alertes couleur, écran, sonore et SMS, bouton d'arrêt d'urgence, journal en temps réel.",
 "Trois interfaces : l'écran de contrôle sur place, l'application mobile à distance, et l'interface web pour l'analyse et le multi-sites. Toutes les données sont synchronisées.",
 "La différence vs un tableau « connecté » classique : OGHJI est nativement numérique, tout intégré dès la conception, mesure circuit par circuit, écran + app + web unifiés, sécurité type B + détection d'arc.",
 "Pour qui : maison, appartement, bureaux, commerces, garages, entrepôts, collectivités — partout où il y a un tableau électrique. Positionnement Smart Home, Smart Building, Smart Service et Smart City.",
 "Installation simple et rapide en 4 étapes : je remplace mon tableau, je configure via l'assistant guidé, je surveille, je connecte l'app. Un remplacement, pas un chantier.",
 "Appel à l'action : demander une démo. Précommandes à venir — invitez le prospect à rejoindre les premiers utilisateurs d'OGHJI.",
];

const pptx = new PptxGenJS();
pptx.defineLayout({ name:'OGHJI', width:13.333, height:7.5 });
pptx.layout = 'OGHJI';
pptx.author = 'OGHJI Smart Energy';
pptx.company = 'OGHJI Smart Energy';
pptx.title = 'OGHJI — Le cerveau énergétique et électrique';
pptx.subject = 'Présentation commerciale OGHJI';

for (let i=1;i<=12;i++){
  const n = String(i).padStart(2,'0');
  const s = pptx.addSlide();
  s.background = { color:'05110D' };
  s.addImage({ path: path.resolve(`out/slide-${n}.png`), x:0, y:0, w:13.333, h:7.5 });
  s.addNotes(NOTES[i-1]);
}

await pptx.writeFile({ fileName:'OGHJI_Presentation_Commerciale.pptx' });
console.log('PPTX written: OGHJI_Presentation_Commerciale.pptx');
