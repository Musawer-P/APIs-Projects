export async function handler(event, context) {
  const url = event.queryStringParameters.url;

  try {
    const res = await fetch(url, { headers: { Accept: "application/sparql-results+json" } });
    const data = await res.text();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: data
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

