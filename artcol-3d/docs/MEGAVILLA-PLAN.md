# Méga-villa — Programme architectural & plan de coordonnées

> Repère three.js : mètres, **Y vers le haut**, façade sud **z=+2.5**, fond nord **z=−8.5**,
> X croissant vers l'est. Calé sur le code existant (`VillaArchitecture`, `VillaInterior`, `VillaGrounds`).
> Document de référence pour l'expansion multi-niveaux. Voir aussi la mémoire `artcol-3d-megavilla`.

## Niveaux cibles

| Niveau | Plage Y | H.s.p. |
|---|---|---|
| Sous-sol (S1) | y ∈ [−4.0, −0.3] | 3.4 m |
| Rez-de-chaussée (R0) | y ∈ [0, 4.0] (dalle étage) ; hall double-hauteur jusqu'à 7.4 | 3.6 m / 7.0 m hall |
| Étage (R1) | y ∈ [4.0, 7.6] | 3.2 m |
| Nouvelle toiture | y = 7.8 | — |

Décision structurante : **surélever le toit** ; la mezzanine (y≈3.8) devient le palier d'un **étage complet** (dalle y=4.0). Le hall reste ouvert en double hauteur (vide sur dalle de z=+2.5 à z≈−3.5).

## Emprises par niveau (coordonnées)

### Sous-sol S1 (y ∈ [−4.0, −0.3], h 3.4 m)
- Hall/circulation : x[−2,4] z[−3,2]
- Spa bassin de nage : x[−10.5,−2] z[−8,−1] (bassin 6×3, prof 1.4)
- Jacuzzi : x[−10.5,−7] z[0,2] (ø2.2)
- Hammam : x[−10.5,−6] z[−8,−5] (h 2.6, vapeur)
- Salle de sport : x[4.5,10.5] z[−8.3,−2]
- Salle de cinéma : x[4.5,10.5] z[−1,2] (gradins 3 rangs, h 3.0)
- Local technique : x[−10.5,−7] z[−4,−1]
- Cage ascenseur : x[7.8,9.2] z[−1.7,−0.3] (traverse 3 niveaux)
- Escalier S1↔R0 : x[−2,0.6] z[−2.5,2]
- Puits de lumière à percer dans dalle R0 au-dessus du spa (x≈−6,z≈−4) et gym (x≈7,z≈−5)

### Rez-de-chaussée R0 (existant — ajouts = trémies/escaliers/ascenseur)
- Hall-galerie double hauteur : x[−11,11] z[−3.5,2.5]
- Cuisine : x[−18,−11.4] z[−6,1] · Bibliothèque : x[11.4,18] z[−6,1.5] · Bureau : x[−9.5,3.5] z[−17,−8.5]
- Escalier monumental R0↔R1 : x[4.9,8.1] z[−7.1,−2.6] (existant)
- Ascenseur gaine : x[7.8,9.2] z[−1.7,−0.3]
- Vide sur hall (pas de dalle étage) : x[−11,11] z[−3.5,2.5]

### Étage R1 (y ∈ [4.0, 7.6], h 3.2 m, toiture y=7.8)
- Palier/couloir (ex-mezzanine, élargir à 1.5 m) : x[−10.7,10.7] z[−4.5,−3.5] + garde-corps verre z=−3.5 (existe)
- Suite parentale chambre : x[−10.7,0] z[−13,−5]
- Suite SdB : x[−10.7,−5] z[−17,−13] · Dressing : x[−5,0] z[−17,−13]
- Chambre d'amis 1 : x[3,10.7] z[−13,−7.5] · SdB1 : x[3,7] z[−17,−13]
- Chambre d'amis 2 : x[7,10.7] z[−17,−13] · SdB2 : x[3,7] z[−13,−10.5]

### Extérieur / jardin (y=0, terrain = plane 400×400, périmètre utile x∈[±40] z∈[−56,+34])
- Terrasse bois : x[−9,11] z[2.5,6.5] (existe)
- **Grande piscine** (déplacée) : x[−4,16] z[7.5,16.5] — 25×9, prof 1.5, débordement sud · margelle x[−5,17] z[6.5,17.5]
- Pool house : x[−24,−14] z[6,13] (10×7, h 3.2)
- Lounge jardin + brasero : x[−12,−2] z[16,22]
- Allée d'entrée prolongée : x[−6.5,0.5] z[5,34] (portail z=+34)
- **Court de tennis** : emprise x[−36,−18] z[−32,−50] (36×18, aire 23.77×10.97, clôture 4 m)
- **Terrain de basket** (demi-terrain 15×14 recommandé) : x[10,25] z[−32,−46]
- Jardin paysager : x[−40,40] z[−26,−56] · végétation périmètre (instancing)

## Modules d'implémentation (ordre conseillé)

Préalable : extraire les constantes (`LEFT_X`, `FRONT_Z`, `BASE_Y=-4`, `SLAB_Y=4`, `ROOF2_Y=7.8`…) dans `villa/dimensions.ts` + matériaux partagés `villa/materials.ts`.

1. `SiteTerrain` — agrandir/zoner le sol (remplace le plane de `VillaGrounds`)
2. `BasementShell` — coque sous-sol (dalle, murs soutènement, plafond, puits de lumière)
3. `BasementSpa` · 4. `BasementHammam` · 5. `BasementGym` · 6. `BasementCinema`
7. `VerticalCirculation` — escalier S1↔R0↔R1 + ascenseur traversant
8. `GroundFloorSlabUpdate` — dalle étage y=4.0 + trémies
9. `UpperFloorShell` — murs étage + toiture y=7.8 + plancher
10. `UpperMasterSuite` · 11. `UpperGuestRooms` · 12. `UpperCorridorRail`
13. `GardenPool` · 14. `PoolHouse` · 15. `GardenLounge`
16. `GardenTennis` · 17. `GardenBasket` · 18. `LandscapePlanting` · 19. `EntranceGateDrive`

## Notes de réalisme

- Œil debout 1.65 m. Portes 0.9×2.1 m. Couloir confort 1.5 m. Marche h 0.17 m / giron 0.28–0.30 m.
- ⚠️ Escalier existant trop raide (0.237 m/marche) ; pour atteindre y=4.0 prévoir ~24 marches + palier ou 2 volées.
- H.s.p. 3.0–3.6 m ; hammam 2.4–2.6 m ; cinéma 3.0 m faux-plafond acoustique.
- Matériaux : réutiliser `concrete`(+bump), `marble`, `wood`, `darkMetal`, `glass`. Spa = travertin + eau `MeshReflectorMaterial` + mosaïque `#06222b`. Hammam = marbre + « ciel étoilé » (points emissive). Gym = caoutchouc mat + miroir mural. Cinéma = moquette `#1a1a1d` + écran emissive. Tennis = acrylique `#2f6d4a`/`#3a4a6a`. Basket = résine `#b5762a`. Piscine = `MeshReflectorMaterial`.
- Éclairage : garder golden-hour ; élargir `shadow-camera` ±44 → ±60 pour couvrir courts/jardin ; puits de lumière zénithaux au sous-sol ; pointLights immergées bleutées la nuit.
- Perf (CLAUDE.md) : matériaux mutualisés (`useMemo`), végétation en `<Instances>`, sous-sol éventuellement lazy.
- Ne pas reboucher les portes existantes (cuisine z≈−1.5, biblio z≈−1, bureau x≈−3, entrée x≈−6.5). Réutiliser escalier monumental (x=6.5) + garde-corps verre (z=−3.5).
