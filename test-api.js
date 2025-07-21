// Test script to verify Remotive API
async function testRemotiveAPI() {
  try {
    console.log('🌐 Testing Remotive API directly...');
    
    const response = await fetch('https://remotive.com/api/remote-jobs', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ API Response received:');
    console.log('- Status:', response.status);
    console.log('- Jobs count:', data.jobs?.length || 0);
    console.log('- First job:', data.jobs?.[0]?.title || 'No jobs');
    console.log('- First company:', data.jobs?.[0]?.company_name || 'No company');
    console.log('- First URL:', data.jobs?.[0]?.url || 'No URL');
    
    if (data.jobs && data.jobs.length > 0) {
      console.log('✅ API is working correctly with real data');
    } else {
      console.log('⚠️ API returned empty or invalid data');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testRemotiveAPI(); 