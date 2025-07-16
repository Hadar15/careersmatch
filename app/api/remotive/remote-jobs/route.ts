import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Access the OpenAI API key from environment variables
  const openaiApiKey = process.env.OPENAI_API_KEY;
  // You can now use openaiApiKey in your server-side logic
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let url = 'https://remotive.com/api/remote-jobs';
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    console.log('🌐 Server-side fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('📊 Server-side API response:', {
      jobCount: data.jobs?.length || 0,
      firstJob: data.jobs?.[0]?.title || 'No jobs',
      hasJobs: !!data.jobs,
      isArray: Array.isArray(data.jobs)
    });

    // Check if we have valid job data
    if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
      console.log('✅ Valid job data received from Remotive API');
      return NextResponse.json(data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      console.log('⚠️ No valid job data in response, falling back to mock data');
      throw new Error('No valid job data in API response');
    }

  } catch (error) {
    console.error('❌ Server-side API error:', error);
    
    // Return mock data as fallback
    const mockData = {
      jobs: [
        {
          id: 1,
          title: "Frontend Developer",
          company_name: "TechCorp Indonesia",
          candidate_required_location: "Jakarta, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-15",
          url: "https://example.com/job1"
        },
        {
          id: 2,
          title: "Backend Engineer",
          company_name: "Digital Solutions",
          candidate_required_location: "Remote",
          job_type: "Full-time",
          publication_date: "2024-01-14",
          url: "https://example.com/job2"
        },
        {
          id: 3,
          title: "UI/UX Designer",
          company_name: "Creative Studio",
          candidate_required_location: "Bandung, Indonesia",
          job_type: "Contract",
          publication_date: "2024-01-13",
          url: "https://example.com/job3"
        }
      ]
    };

    return NextResponse.json(mockData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 