---
name: ai-visual-workflow
description: "Production de visuels par IA générative pour le web/3D : concept art, style frames, images héro, textures + maps PBR. Outils : Higgsfield (image/vidéo + reference elements pour l'identité), FLUX.2, Midjourney, ComfyUI (ControlNet depth/pose, IP-Adapter, LoRA), fal.ai/Replicate, Ubisoft CHORD (text→PBR). Cohérence (IP-Adapter), composition verrouillée (ControlNet), itération, handoff vers three.js (MeshStandardMaterial). Utiliser pour : générer du concept art / style frames / moodboard, des textures PBR pour la 3D, des visuels cohérents en style ou identité, intégrer la gen-AI dans un pipeline site/3D. Mots-clés : ia générative, concept art, style frame, texture, pbr, midjourney, flux, comfyui, controlnet, ip-adapter, higgsfield, fal, stable diffusion, génération image, look dev."
---

# Visuels génératifs IA → web / 3D

Pour concevoir vite et beau : **concept art, style frames, images héro, textures PBR**, puis les brancher dans le site/la 3D.

## Quand l'activer
Générer du concept art / des style frames / un moodboard visuel, des textures PBR pour la 3D, des visuels cohérents (style ou identité), intégrer la gen-AI dans un pipeline.

## Outils (du plus accessible au plus contrôlable)
- **Higgsfield** (déjà branché via MCP) : image **et** vidéo, + **reference elements** pour verrouiller une **identité** (c'est ce qu'on a utilisé pour mettre les vrais visages Tarek/Myriam/Julie dans le tableau final).
- **FLUX.2** (pro / klein) : fidélité de prompt + lumière de haut niveau ; klein = itération quasi temps réel.
- **Midjourney** : récolte de **style refs** (lumière/texture/ambiance) — ignorer la géométrie.
- **ComfyUI** : pipeline node ultra-contrôlable — **ControlNet** (depth/pose pour verrouiller la compo), **IP-Adapter** (cohérence de style/perso), LoRA.
- **fal.ai / Replicate** : APIs pour intégrer la génération **dans une appli web**.

## Cohérence (le vrai défi)
- **IP-Adapter** = un token de **style/personnage** depuis une image de référence (sans fine-tuning).
- **ControlNet** = **verrouiller la composition** sur ton blockout 3D / un croquis / une depth map.
- **Identité réelle** (vrais visages) → **reference elements** (Higgsfield), comme pour le tableau.

## Stratégie d'itération
**20–50 variantes en basse résolution d'abord** (explorer le style), puis **up-rez les 2–3 gardées**. Largeur d'abord, précision ensuite.

## IA → textures PBR (pour la 3D)
- **ComfyUI + CHORD** (Ubisoft, open-source) ou text-to-texture : `texte/image → texture seamless → set PBR (albedo, roughness, metallic, normal)` → brancher dans **three.js `MeshStandardMaterial`**.
- **Midjourney → ComfyUI** : récupérer lumière/texture de MJ, verrouiller la compo avec ControlNet depth sur ta vraie 3D.
- Optimiser ensuite les textures en **KTX2** (voir `gltf-optimization-pipeline`).

## Anatomie d'un bon prompt cinématique
Sujet + **lumière** + objectif/caméra + ambiance + couleur + style refs (+ anti/négatif). La lumière est le levier #1 du « premium ».

## ⚠️ Droits
Respecter les licences des références et des assets générés (usage commercial, marques, visages de personnes → consentement, comme pour vos 3 photos).

> Skills sœurs : `web3d-threejs`, `gltf-optimization-pipeline`, `art-direction-brief`, `cinematic-scroll`.
