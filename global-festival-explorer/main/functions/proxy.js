export async function handler(event, context) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return { statusCode: 400, body: "Missing URL parameter" };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/sparql-results+json",
        "User-Agent": "GlobalFestivalExplorer/1.0 (MusawerPopalzai; contact@example.com)"
      },
      // Add a timeout for long queries
      timeout: 15000 // 15 seconds
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Wikidata rejected request", status: response.status })
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: data
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
