-- ═══════════════════════════════════════════════════════════════════════════
-- AJOUT DE JULIE ET MYRIAM AU CRM PLAY AZUR
-- ═══════════════════════════════════════════════════════════════════════════
--
-- À EXÉCUTER DANS SUPABASE (SQL Editor) APRÈS avoir créé leurs comptes
-- côté Authentication.
--
-- ÉTAPES PRÉALABLES (à faire UNE FOIS dans Supabase Dashboard) :
--
-- 1. Va sur https://supabase.com/dashboard/project/dmztalsmreugfwojsaar
-- 2. Menu gauche : Authentication → Users → bouton "Add user" → "Create new user"
-- 3. Crée Julie :
--      - Email          : <son email pro>
--      - Password       : <mot de passe temporaire, ex : Jp2026#a1b2c3d4e5f6>
--                          (le pattern Jp2026#XXXXXXXXXXXX est reconnu par le code
--                           qui forcera Julie à le changer au premier login)
--      - Auto Confirm User : ✅ COCHE LA CASE (sinon elle ne pourra pas se connecter)
-- 4. Idem pour Myriam.
-- 5. Note les UUID générés (visibles dans la colonne "UID" de la liste des users).
-- 6. Remplace ci-dessous JULIE_USER_ID et MYRIAM_USER_ID par leurs UUID réels.
-- 7. Exécute ce script dans SQL Editor.
--
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── JULIE ─────────────────────────────────────────────────────────────────
INSERT INTO public.user_roles (
  user_id,
  short_id,
  full_name,
  initials,
  role,
  avatar_color,
  departments,
  dept_names
) VALUES (
  'JULIE_USER_ID'::uuid,                  -- ⚠️ REMPLACE par l'UUID de Julie
  'julie',                                 -- identifiant court (utilisé dans le code)
  'Julie Martin',                          -- ⚠️ ADAPTE le nom complet
  'JM',                                    -- initiales (auto-générées dans l'UI sinon)
  'editor',                                -- rôle : 'owner' / 'editor' / 'viewer'
  '#FF3D9A',                               -- couleur d'avatar (rose Play Azur)
  ARRAY['06', '83', '13'],                 -- départements assignés (Alpes-Mar., Var, B.-du-Rhône)
  '06 Alpes-Mar. · 83 Var · 13 Bouches-du-Rhône'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name    = EXCLUDED.full_name,
  initials     = EXCLUDED.initials,
  role         = EXCLUDED.role,
  avatar_color = EXCLUDED.avatar_color,
  departments  = EXCLUDED.departments,
  dept_names   = EXCLUDED.dept_names;

-- ─── MYRIAM ────────────────────────────────────────────────────────────────
INSERT INTO public.user_roles (
  user_id,
  short_id,
  full_name,
  initials,
  role,
  avatar_color,
  departments,
  dept_names
) VALUES (
  'MYRIAM_USER_ID'::uuid,                 -- ⚠️ REMPLACE par l'UUID de Myriam
  'myriam',
  'Myriam Durand',                         -- ⚠️ ADAPTE le nom complet
  'MD',
  'editor',
  '#FF6B5C',                               -- couleur d'avatar (corail Play Azur)
  ARRAY['75', '69', '33', '31'],           -- Paris, Lyon, Bordeaux, Toulouse
  '75 Paris · 69 Rhône · 33 Gironde · 31 Hte-Garonne'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name    = EXCLUDED.full_name,
  initials     = EXCLUDED.initials,
  role         = EXCLUDED.role,
  avatar_color = EXCLUDED.avatar_color,
  departments  = EXCLUDED.departments,
  dept_names   = EXCLUDED.dept_names;

-- ─── VÉRIFICATION ──────────────────────────────────────────────────────────
SELECT
  ur.short_id,
  ur.full_name,
  ur.role,
  ur.dept_names,
  au.email,
  au.created_at,
  au.last_sign_in_at
FROM public.user_roles ur
LEFT JOIN auth.users au ON au.id = ur.user_id
ORDER BY ur.role DESC, ur.full_name;
