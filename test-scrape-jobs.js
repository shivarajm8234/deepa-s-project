// Test script for the Supabase function
async function testScrapeJobs() {
  const response = await fetch('https://otffbtvzoelrphatllng.functions.supabase.co/scrape-jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'software engineer',
      location: 'remote',
      limit: 3
    })
  });

  if (!response.ok) {
    console.error('Error:', response.status, response.statusText);
    const error = await response.text();
    console.error('Error details:', error);
    return;
  }

  const data = await response.json();
  console.log('Success! Jobs received:');
  console.log(JSON.stringify(data, null, 2));
}

testScrapeJobs().catch(console.error);
