const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Configurar CORS para permitir requisições do GitHub Pages
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { method, url, data, apiKey, binId } = JSON.parse(event.body || '{}');
    
    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'API Key é obrigatória' })
      };
    }

    // Construir URL do JsonBin
    let jsonbinUrl = 'https://api.jsonbin.io/v3/b';
    if (binId && method !== 'POST') {
      jsonbinUrl += `/${binId}`;
    }

    // Configurar headers para JsonBin
    const jsonbinHeaders = {
      'X-Master-Key': apiKey,
      'Content-Type': 'application/json'
    };

    // Fazer requisição para JsonBin
    const response = await fetch(jsonbinUrl, {
      method: method || 'GET',
      headers: jsonbinHeaders,
      body: data ? JSON.stringify(data) : undefined
    });

    const responseData = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};
