// =================================================================
// MON MONDE · Edge Function · proxy Anthropic Claude API
// =================================================================
// Cette fonction tourne sur l'edge Vercel (Cloudflare Workers compat).
// Elle reçoit les appels du frontend (via le service worker qui
// intercepte api.anthropic.com) et les forwarde à l'API Anthropic
// en injectant la clé ANTHROPIC_API_KEY depuis les variables
// d'environnement Vercel.
//
// → La clé ne touche JAMAIS le navigateur. C'est ça la sécurité absolue.
// =================================================================

export const config = { runtime: 'edge' };

const UPSTREAM = 'https://api.anthropic.com/v1/messages';
const ALLOWED_METHODS = ['POST', 'OPTIONS'];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
    'Access-Control-Allow-Headers': 'Content-Type, anthropic-version, anthropic-beta, x-api-key',
    'Access-Control-Max-Age': '86400',
  };
}

function errorResponse(message, status, request) {
  return new Response(JSON.stringify({ error: { type: 'proxy_error', message } }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

export default async function handler(request) {
  // ─── CORS preflight ───
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (!ALLOWED_METHODS.includes(request.method)) {
    return errorResponse(`Method ${request.method} not allowed`, 405, request);
  }

  // ─── API key (server-side only) ───
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return errorResponse(
      'ANTHROPIC_API_KEY non configurée sur Vercel. Va dans Project Settings → Environment Variables et ajoute la clé.',
      500,
      request,
    );
  }
  if (!apiKey.startsWith('sk-ant-')) {
    return errorResponse('ANTHROPIC_API_KEY semble invalide (doit commencer par sk-ant-).', 500, request);
  }

  // ─── Read & validate body ───
  let body;
  try {
    body = await request.text();
    if (!body) throw new Error('Empty body');
    JSON.parse(body); // syntax check
  } catch (err) {
    return errorResponse('Invalid JSON body: ' + err.message, 400, request);
  }

  // ─── Forward to Anthropic ───
  let upstream;
  try {
    upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
        ...(request.headers.get('anthropic-beta') ? { 'anthropic-beta': request.headers.get('anthropic-beta') } : {}),
      },
      body,
    });
  } catch (err) {
    return errorResponse('Upstream fetch failed: ' + err.message, 502, request);
  }

  // ─── Stream the response back ───
  // Anthropic peut renvoyer du SSE (stream) ou du JSON. On laisse passer tel quel.
  const responseHeaders = {
    'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
    'Cache-Control': 'no-store',
    ...corsHeaders(request),
  };

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
