-- ═══════════════════════════════════════════════════════════════════════════
-- ÉQUIPE PLAY AZUR — état actuel (auto-vérifié le 2026-05-18)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- ✅ Les 3 comptes sont DÉJÀ créés dans Supabase Auth + user_roles.
-- Aucune action requise pour l'instant. Ce fichier sert de référence et de
-- modèle pour ajouter un futur 4e membre (ex : Bastien, Bruno…).
--
-- ─── Composition actuelle ───────────────────────────────────────────────────
--
--   tarek   | Tarek Bouhlel    | owner  | tarek.bouhlel@rocket-school.eu
--   julie   | Julie MORSIANI   | editor | julie.morsiani@rocket-school.eu
--   myriam  | Myriam DOU       | editor | mdou9441@gmail.com
--
-- Tarek a déjà loggué plusieurs fois.
-- Julie et Myriam ont leur compte confirmé mais ne se sont pas encore
-- connectées. Tarek leur transmettra l'URL Vercel + leur mot de passe
-- temporaire après le 1er déploiement.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- COMMENT VÉRIFIER L'ÉTAT (à coller dans Supabase SQL Editor)
-- ═══════════════════════════════════════════════════════════════════════════

SELECT
  ur.short_id,
  ur.full_name,
  ur.role,
  ur.dept_names,
  au.email,
  au.email_confirmed_at IS NOT NULL AS email_confirmed,
  au.last_sign_in_at,
  ur.created_at
FROM public.user_roles ur
LEFT JOIN auth.users au ON au.id = ur.user_id
ORDER BY ur.role DESC, ur.full_name;

-- ═══════════════════════════════════════════════════════════════════════════
-- AJOUTER UN NOUVEAU MEMBRE (modèle, à adapter)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- 1. Supabase Dashboard → Authentication → Users → "Add user" → "Create new user"
--      - Email     : <email pro du membre>
--      - Password  : Jp2026#XXXXXXXXXXXX  (12 chars hex aléatoires après #)
--                    → ce pattern force le changement de mot de passe au 1er login
--      - Auto Confirm User : ✅ COCHER
-- 2. Récupère son UUID dans la liste des users (colonne UID).
-- 3. Décommente et adapte le INSERT ci-dessous, puis exécute :

/*
INSERT INTO public.user_roles (
  user_id, short_id, full_name, initials, role, avatar_color, departments, dept_names
) VALUES (
  'PASTE_UUID_ICI'::uuid,
  'prenom_short',
  'Prénom NOM',
  'PN',
  'editor',                 -- ou 'owner' / 'viewer'
  '#f59e0b',                -- couleur d'avatar (palette : 1B6FFF, FF3D9A, 10b981, a855f7, f59e0b, FF6B5C)
  ARRAY['06', '83'],        -- départements assignés
  '06 Alpes-Mar. · 83 Var'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name    = EXCLUDED.full_name,
  initials     = EXCLUDED.initials,
  role         = EXCLUDED.role,
  avatar_color = EXCLUDED.avatar_color,
  departments  = EXCLUDED.departments,
  dept_names   = EXCLUDED.dept_names;
*/

-- ═══════════════════════════════════════════════════════════════════════════
-- DÉBLOQUER UN COMPTE VERROUILLÉ APRÈS TROP DE TENTATIVES
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Si Julie ou Myriam tape son mot de passe 5 fois faux, son compte est
-- verrouillé 30 min. Pour la débloquer manuellement :

/*
SELECT public.release_lockout(id) FROM public.account_lockouts
WHERE email = 'julie.morsiani@rocket-school.eu'
  AND released_at IS NULL
  AND locked_until > now();
*/
