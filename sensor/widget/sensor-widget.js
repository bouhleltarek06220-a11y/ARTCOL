/* ==========================================================================
 * SENSOR — Widget de chat embarquable (vanilla JS, sans dépendance)
 *
 * Intégration :
 *   <script src="https://votre-api/sensor-widget.js"
 *           data-client="id_client"
 *           data-api="https://votre-api"
 *           data-titre="Assistant"            (optionnel)
 *           data-primaire="#c8f53a"           (optionnel, surcharge la config API)
 *           data-fond="#080b10"               (optionnel)
 *           data-texte="#e8edf2"></script>    (optionnel)
 *
 * Le widget appelle TON API (POST /chat), jamais directement Anthropic.
 * Transparence AI Act : la mention « Assistant IA » est affichée en permanence.
 * ========================================================================== */
(function () {
  "use strict";

  // -- Récupération de la balise <script> et de ses attributs data-* --------
  var script =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  var CONFIG = {
    idClient: script.getAttribute("data-client") || "",
    api: (script.getAttribute("data-api") || "").replace(/\/$/, ""),
    titre: script.getAttribute("data-titre") || "Assistant",
    couleurs: {
      primaire: script.getAttribute("data-primaire") || "#c8f53a",
      fond: script.getAttribute("data-fond") || "#080b10",
      texte: script.getAttribute("data-texte") || "#e8edf2",
      secondaire: script.getAttribute("data-secondaire") || "#7b61ff",
    },
    messageAccueil: null, // chargé depuis l'API
  };

  if (!CONFIG.idClient || !CONFIG.api) {
    console.error("[SENSOR] Attributs data-client et data-api requis sur la balise <script>.");
    return;
  }

  var SESSION_KEY = "sensor_session_" + CONFIG.idClient;

  // -- Utilitaires -----------------------------------------------------------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "style") node.setAttribute("style", attrs[k]);
      else if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function echapper(t) {
    var d = document.createElement("div");
    d.textContent = t == null ? "" : String(t);
    return d.innerHTML;
  }

  function getSession() {
    try {
      return sessionStorage.getItem(SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  }
  function setSession(id) {
    try {
      if (id) sessionStorage.setItem(SESSION_KEY, id);
    } catch (e) {}
  }

  // -- Styles (scopés via un préfixe de classe) ------------------------------
  function injecterStyles(c) {
    if (document.getElementById("sensor-styles")) return;
    var css =
      "" +
      ".sensor-bulle{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;" +
      "background:" + c.primaire + ";color:" + c.fond + ";border:none;cursor:pointer;z-index:2147483000;" +
      "box-shadow:0 6px 24px rgba(0,0,0,.35);font-size:26px;display:flex;align-items:center;justify-content:center;transition:transform .15s;}" +
      ".sensor-bulle:hover{transform:scale(1.06);}" +
      ".sensor-panneau{position:fixed;bottom:92px;right:20px;width:370px;max-width:calc(100vw - 32px);height:560px;" +
      "max-height:calc(100vh - 120px);background:" + c.fond + ";color:" + c.texte + ";border-radius:16px;" +
      "box-shadow:0 12px 48px rgba(0,0,0,.5);z-index:2147483000;display:none;flex-direction:column;overflow:hidden;" +
      "font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;border:1px solid rgba(255,255,255,.08);}" +
      ".sensor-panneau.ouvert{display:flex;}" +
      ".sensor-entete{padding:14px 16px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);}" +
      ".sensor-titre{font-weight:700;font-size:15px;}" +
      ".sensor-sous{font-size:11px;opacity:.65;margin-top:2px;display:flex;align-items:center;gap:5px;}" +
      ".sensor-pastille{display:inline-block;width:7px;height:7px;border-radius:50%;background:" + c.primaire + ";}" +
      ".sensor-corps{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}" +
      ".sensor-msg{max-width:85%;padding:10px 12px;border-radius:12px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}" +
      ".sensor-msg.user{align-self:flex-end;background:" + c.primaire + ";color:" + c.fond + ";border-bottom-right-radius:4px;}" +
      ".sensor-msg.bot{align-self:flex-start;background:rgba(255,255,255,.07);border-bottom-left-radius:4px;}" +
      ".sensor-msg.horscope{border-left:3px solid " + c.secondaire + ";}" +
      ".sensor-sources{margin-top:8px;font-size:11px;opacity:.8;border-top:1px dashed rgba(255,255,255,.15);padding-top:6px;}" +
      ".sensor-source{margin-top:3px;}" +
      ".sensor-source b{color:" + c.primaire + ";}" +
      ".sensor-frappe{align-self:flex-start;font-size:13px;opacity:.6;font-style:italic;}" +
      ".sensor-pied{padding:10px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:8px;}" +
      ".sensor-input{flex:1;background:rgba(255,255,255,.06);color:" + c.texte + ";border:1px solid rgba(255,255,255,.12);" +
      "border-radius:10px;padding:10px 12px;font-size:14px;outline:none;resize:none;max-height:90px;}" +
      ".sensor-input:focus{border-color:" + c.primaire + ";}" +
      ".sensor-envoyer{background:" + c.primaire + ";color:" + c.fond + ";border:none;border-radius:10px;padding:0 16px;" +
      "cursor:pointer;font-weight:700;}" +
      ".sensor-envoyer:disabled{opacity:.5;cursor:not-allowed;}" +
      ".sensor-disclaimer{font-size:10px;opacity:.5;text-align:center;padding:0 10px 8px;}" +
      "@media(max-width:480px){.sensor-panneau{right:8px;left:8px;width:auto;bottom:84px;}}";
    var style = el("style", { id: "sensor-styles", html: css });
    document.head.appendChild(style);
  }

  // -- Construction de l'interface ------------------------------------------
  var refs = {};
  function construireUI() {
    var bulle = el("button", { class: "sensor-bulle", "aria-label": "Ouvrir le chat", html: "&#128172;" });
    var entete = el("div", { class: "sensor-entete" }, [
      el("div", { class: "sensor-titre" }, [CONFIG.titre]),
      el("div", { class: "sensor-sous" }, [
        el("span", { class: "sensor-pastille" }),
        document.createTextNode("Assistant IA · " + CONFIG.idClient),
      ]),
    ]);
    var corps = el("div", { class: "sensor-corps" });
    var input = el("textarea", {
      class: "sensor-input",
      rows: "1",
      placeholder: "Écrivez votre question…",
      "aria-label": "Votre message",
    });
    var envoyer = el("button", { class: "sensor-envoyer" }, ["Envoyer"]);
    var pied = el("div", { class: "sensor-pied" }, [input, envoyer]);
    var disclaimer = el("div", { class: "sensor-disclaimer" }, [
      "Réponses générées par une IA à partir de la documentation officielle.",
    ]);
    var panneau = el("div", { class: "sensor-panneau" }, [entete, corps, pied, disclaimer]);

    document.body.appendChild(bulle);
    document.body.appendChild(panneau);

    refs = { bulle: bulle, panneau: panneau, corps: corps, input: input, envoyer: envoyer };

    bulle.addEventListener("click", basculer);
    envoyer.addEventListener("click", soumettre);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        soumettre();
      }
    });
  }

  function basculer() {
    var ouvert = refs.panneau.classList.toggle("ouvert");
    if (ouvert) {
      refs.input.focus();
      if (!refs.corps.dataset.amorce) {
        refs.corps.dataset.amorce = "1";
        ajouterBot(CONFIG.messageAccueil || "Bonjour ! Comment puis-je vous aider ?", [], false);
      }
    }
  }

  // -- Affichage des messages ------------------------------------------------
  function ajouterUser(texte) {
    var msg = el("div", { class: "sensor-msg user" }, [texte]);
    refs.corps.appendChild(msg);
    defiler();
  }

  function ajouterBot(texte, sources, horsScope) {
    var classe = "sensor-msg bot" + (horsScope ? " horscope" : "");
    var msg = el("div", { class: classe });
    msg.innerHTML = echapper(texte);
    if (sources && sources.length) {
      var bloc = el("div", { class: "sensor-sources" });
      bloc.appendChild(el("div", {}, ["Sources :"]));
      sources.forEach(function (s) {
        var ligne = el("div", { class: "sensor-source" });
        ligne.innerHTML =
          "• <b>" + echapper(s.titre_document) + "</b>" +
          (s.section ? " — " + echapper(s.section) : "");
        bloc.appendChild(ligne);
      });
      msg.appendChild(bloc);
    }
    refs.corps.appendChild(msg);
    defiler();
  }

  function indicateurFrappe(actif) {
    var existant = refs.corps.querySelector(".sensor-frappe");
    if (actif && !existant) {
      refs.corps.appendChild(el("div", { class: "sensor-frappe" }, ["L'assistant rédige…"]));
      defiler();
    } else if (!actif && existant) {
      existant.remove();
    }
  }

  function defiler() {
    refs.corps.scrollTop = refs.corps.scrollHeight;
  }

  // -- Envoi vers l'API ------------------------------------------------------
  function soumettre() {
    var texte = refs.input.value.trim();
    if (!texte) return;
    refs.input.value = "";
    refs.envoyer.disabled = true;
    ajouterUser(texte);
    indicateurFrappe(true);

    fetch(CONFIG.api + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_client: CONFIG.idClient,
        message: texte,
        id_session: getSession(),
      }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        indicateurFrappe(false);
        setSession(data.id_session);
        ajouterBot(data.reponse, data.sources || [], data.hors_scope);
      })
      .catch(function (err) {
        indicateurFrappe(false);
        ajouterBot(
          "Désolé, une erreur de connexion est survenue. Merci de réessayer dans un instant.",
          [],
          true
        );
        console.error("[SENSOR]", err);
      })
      .finally(function () {
        refs.envoyer.disabled = false;
        refs.input.focus();
      });
  }

  // -- Chargement de la config publique puis init ----------------------------
  function init() {
    fetch(CONFIG.api + "/client/" + encodeURIComponent(CONFIG.idClient) + "/config")
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (cfg) {
        if (cfg) {
          CONFIG.messageAccueil = cfg.message_accueil;
          if (cfg.nom_entreprise && CONFIG.titre === "Assistant")
            CONFIG.titre = "Assistant " + cfg.nom_entreprise;
          // Les couleurs de la config API ne s'appliquent que si non surchargées en data-*.
          if (cfg.couleurs) {
            if (!script.getAttribute("data-primaire")) CONFIG.couleurs.primaire = cfg.couleurs.primaire;
            if (!script.getAttribute("data-fond")) CONFIG.couleurs.fond = cfg.couleurs.fond;
            if (!script.getAttribute("data-texte")) CONFIG.couleurs.texte = cfg.couleurs.texte;
            if (!script.getAttribute("data-secondaire")) CONFIG.couleurs.secondaire = cfg.couleurs.secondaire;
          }
        }
      })
      .catch(function () {})
      .finally(function () {
        injecterStyles(CONFIG.couleurs);
        construireUI();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
