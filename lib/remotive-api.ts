// Remotive API integration
// https://remotive.com/api/remote-jobs

export interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  job_type: string;
  publication_date: string;
  url: string;
  salary?: string;
  description?: string;
  tags?: string[];
}

export interface RemotiveApiResponse {
  jobs: RemotiveJob[];
}

class RemotiveAPI {
  private baseUrl = "/api/remotive/remote-jobs"; // Using our proxy

  async getJobs(search?: string): Promise<RemotiveApiResponse> {
    try {
      // Try different API endpoints for better compatibility
      let url = this.baseUrl;
      
      if (search) {
        url = `${this.baseUrl}?search=${encodeURIComponent(search)}`;
      }
      
      console.log("🌐 Attempting to fetch from Remotive API via proxy:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        // Add timeout
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📊 Remotive API Response received:", {
        jobCount: data.jobs?.length || 0,
        firstJob: data.jobs?.[0]?.title || 'No jobs',
        sampleUrl: data.jobs?.[0]?.url || 'No URL',
        sampleCompany: data.jobs?.[0]?.company_name || 'No company'
      });
      
      // Check if this looks like real Remotive data
      const isRealData = this.isRealRemotiveData(data);
      if (isRealData) {
        console.log("✅ Confirmed: Real Remotive API data received");
        return data;
      } else {
        console.log("⚠️ API returned data that looks like mock data, using fallback");
        return this.getMockJobs();
      }
      
    } catch (error) {
      console.error("❌ Error fetching from Remotive API via proxy:", error);
      
      // Try direct endpoints as fallback
      const alternativeUrls = [
        "https://remotive.com/api/remote-jobs",
        "https://remotive.io/api/remote-jobs",
        "https://api.remotive.com/remote-jobs"
      ];
      
      for (const altUrl of alternativeUrls) {
        try {
          console.log(`🔄 Trying direct endpoint: ${altUrl}`);
          const altResponse = await fetch(altUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: AbortSignal.timeout(10000)
          });
          
          if (altResponse.ok) {
            const altData = await altResponse.json();
            console.log("📊 Direct API Response:", {
              jobCount: altData.jobs?.length || 0,
              firstJob: altData.jobs?.[0]?.title || 'No jobs',
              url: altUrl
            });
            
            const isRealData = this.isRealRemotiveData(altData);
            if (isRealData) {
              console.log("✅ Direct endpoint: Real Remotive API data received");
              return altData;
            }
          }
        } catch (altError) {
          console.error(`❌ Direct endpoint ${altUrl} failed:`, altError);
        }
      }
      
      console.log("🔄 All API attempts failed, falling back to mock data");
      return this.getMockJobs();
    }
  }

  private isRealRemotiveData(data: any): boolean {
    if (!data.jobs || !Array.isArray(data.jobs) || data.jobs.length === 0) {
      console.log("❌ No jobs array found in response");
      return false;
    }

    const sampleJob = data.jobs[0];
    console.log("🔍 Analyzing sample job:", {
      id: sampleJob.id,
      title: sampleJob.title,
      company: sampleJob.company_name,
      url: sampleJob.url
    });
    
    // Only check for obvious mock data indicators
    const isMockData = 
      sampleJob.url?.includes('example.com') ||
      sampleJob.company_name?.includes('TechCorp Indonesia') ||
      sampleJob.company_name?.includes('Digital Solutions') ||
      sampleJob.company_name?.includes('Creative Studio') ||
      sampleJob.company_name?.includes('AI Research Lab') ||
      sampleJob.company_name?.includes('CloudTech Solutions') ||
      sampleJob.company_name?.includes('Startup Indonesia') ||
      sampleJob.company_name?.includes('App Studio') ||
      sampleJob.company_name?.includes('Quality Assurance Inc') ||
      sampleJob.company_name?.includes('IT Solutions') ||
      !sampleJob.url || 
      !sampleJob.company_name;

    if (isMockData) {
      console.log("❌ Detected mock data indicators");
      return false;
    }

    console.log("✅ Data appears to be real Remotive data");
    return true;
  }

  async getJobById(id: string): Promise<RemotiveJob | null> {
    try {
      const jobs = await this.getJobs();
      return jobs.jobs.find(job => job.id.toString() === id) || null;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      return null;
    }
  }

  private getMockJobs(): RemotiveApiResponse {
    console.log("📋 Returning mock jobs data");
    return {
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
        },
        {
          id: 4,
          title: "Data Scientist",
          company_name: "AI Research Lab",
          candidate_required_location: "Surabaya, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-12",
          url: "https://example.com/job4"
        },
        {
          id: 5,
          title: "DevOps Engineer",
          company_name: "CloudTech Solutions",
          candidate_required_location: "Remote",
          job_type: "Full-time",
          publication_date: "2024-01-11",
          url: "https://example.com/job5"
        },
        {
          id: 6,
          title: "Product Manager",
          company_name: "Startup Indonesia",
          candidate_required_location: "Jakarta, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-10",
          url: "https://example.com/job6"
        },
        {
          id: 7,
          title: "Mobile Developer",
          company_name: "App Studio",
          candidate_required_location: "Yogyakarta, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-09",
          url: "https://example.com/job7"
        },
        {
          id: 8,
          title: "QA Engineer",
          company_name: "Quality Assurance Inc",
          candidate_required_location: "Remote",
          job_type: "Full-time",
          publication_date: "2024-01-08",
          url: "https://example.com/job8"
        },
        {
          id: 9,
          title: "System Administrator",
          company_name: "IT Solutions",
          candidate_required_location: "Medan, Indonesia",
          job_type: "Full-time",
          publication_date: "2024-01-07",
          url: "https://example.com/job9"
        }
      ]
    };
  }
}

export const remotiveAPI = new RemotiveAPI(); 