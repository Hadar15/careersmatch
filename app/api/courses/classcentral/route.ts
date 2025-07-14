import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

export type Course = {
  id: string
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  category?: string
  provider?: string
}

// Simple in-memory cache (valid for 1 hour)
let cachedCourses: Course[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
  // If cache is valid, return cached data
  if (cachedCourses.length > 0 && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('✅ Returning courses from cache');
    return NextResponse.json({
      courses: cachedCourses,
      dataSource: 'cache',
      timestamp: new Date().toISOString()
    })
  }

  try {
    console.log("🌐 Server-side fetching from Class Central RSS feeds...")
    
    const parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    // Try multiple RSS endpoints from Class Central
    const rssEndpoints = [
      "https://www.classcentral.com/subjects/computer-science/rss",
      "https://www.classcentral.com/subjects/programming/rss", 
      "https://www.classcentral.com/subjects/web-development/rss",
      "https://www.classcentral.com/subjects/data-science/rss",
      "https://www.classcentral.com/subjects/artificial-intelligence/rss"
    ]

    let courses: Course[] = []
    let successfulEndpoint = ""

    // Try each endpoint until one works
    for (const endpoint of rssEndpoints) {
      try {
        console.log(`🔍 Trying RSS endpoint: ${endpoint}`)
        const feed = await parser.parseURL(endpoint)
        
        if (feed.items && feed.items.length > 0) {
          courses = feed.items.map((item, index) => ({
            id: `course-${index}-${Date.now()}`,
            title: item.title || "Course Title Not Available",
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            contentSnippet: item.contentSnippet || "Course description not available",
            category: item.categories?.[0] || "Computer Science",
            provider: item.creator || "Class Central"
          }))
          
          successfulEndpoint = endpoint
          console.log(`✅ Successfully fetched ${courses.length} courses from: ${endpoint}`)
          break
        }
      } catch (endpointError) {
        console.error(`❌ Failed to fetch from ${endpoint}:`, endpointError)
        if (endpointError instanceof Error) {
          console.error('Endpoint error stack:', endpointError.stack)
        }
        continue
      }
    }

    // If all RSS endpoints failed, try alternative approach
    if (courses.length === 0) {
      console.log("🔄 All RSS endpoints failed, trying alternative data source...")
      
      // Try to fetch from Class Central API or alternative source
      try {
        const response = await fetch('https://www.classcentral.com/api/courses?limit=20', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          courses = data.courses?.map((course: any, index: number) => ({
            id: `course-${index}-${Date.now()}`,
            title: course.name || course.title || "Course Title Not Available",
            link: course.url || course.link || "#",
            pubDate: course.startDate || course.pubDate || new Date().toISOString(),
            contentSnippet: course.description || course.contentSnippet || "Course description not available",
            category: course.subject || course.category || "Computer Science",
            provider: course.provider || course.creator || "Class Central"
          })) || []
          
          console.log(`✅ Successfully fetched ${courses.length} courses from Class Central API`)
        }
      } catch (apiError) {
        console.error("❌ Class Central API also failed:", apiError)
        if (apiError instanceof Error) {
          console.error('API error stack:', apiError.stack)
        }
      }
    }

    // If still no courses, use enhanced mock data that looks more realistic
    if (courses.length === 0) {
      console.log("⚠️ Using enhanced mock data as all real sources failed")
      
      courses = [
        {
          id: "course-1-real",
          title: "CS50's Introduction to Computer Science",
          link: "https://www.classcentral.com/course/edx-cs50s-introduction-to-computer-science-9656",
          pubDate: new Date().toISOString(),
          contentSnippet: "An introduction to the intellectual enterprises of computer science and the art of programming.",
          category: "Computer Science",
          provider: "Harvard University"
        },
        {
          id: "course-2-real",
          title: "Machine Learning by Stanford University",
          link: "https://www.classcentral.com/course/coursera-machine-learning-835",
          pubDate: new Date(Date.now() - 86400000).toISOString(),
          contentSnippet: "Learn about machine learning algorithms and their applications in real-world scenarios.",
          category: "Artificial Intelligence",
          provider: "Stanford University"
        },
        {
          id: "course-3-real",
          title: "The Complete Web Developer Bootcamp",
          link: "https://www.classcentral.com/course/udemy-the-complete-web-developer-bootcamp-12345",
          pubDate: new Date(Date.now() - 172800000).toISOString(),
          contentSnippet: "Learn web development from scratch with HTML, CSS, JavaScript, and modern frameworks.",
          category: "Web Development",
          provider: "Udemy"
        },
        {
          id: "course-4-real",
          title: "Data Science: Machine Learning",
          link: "https://www.classcentral.com/course/edx-data-science-machine-learning-6789",
          pubDate: new Date(Date.now() - 259200000).toISOString(),
          contentSnippet: "Build a movie recommendation system and learn the science behind one of the most popular and successful data science techniques.",
          category: "Data Science",
          provider: "MIT"
        },
        {
          id: "course-5-real",
          title: "Python for Everybody",
          link: "https://www.classcentral.com/course/coursera-python-for-everybody-2345",
          pubDate: new Date(Date.now() - 345600000).toISOString(),
          contentSnippet: "Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.",
          category: "Programming",
          provider: "University of Michigan"
        },
        {
          id: "course-6-real",
          title: "Introduction to Cybersecurity",
          link: "https://www.classcentral.com/course/edx-introduction-to-cybersecurity-3456",
          pubDate: new Date(Date.now() - 432000000).toISOString(),
          contentSnippet: "Learn the basics of cybersecurity, network security, and ethical hacking principles.",
          category: "Cybersecurity",
          provider: "Coursera"
        }
      ]
    }

    // Update cache
    cachedCourses = courses;
    cacheTimestamp = Date.now();

    console.log("📊 Server-side API response:", {
      courseCount: courses.length,
      firstCourse: courses[0]?.title,
      dataSource: successfulEndpoint || "mock"
    })

    return NextResponse.json({ 
      courses,
      dataSource: successfulEndpoint || "mock",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("❌ Error fetching courses:", error)
    if (error instanceof Error) {
      console.error('General error stack:', error.stack)
    }
    
    // Enhanced fallback mock data
    const mockCourses: Course[] = [
      {
        id: "course-1-fallback",
        title: "CS50's Introduction to Computer Science",
        link: "https://www.classcentral.com/course/edx-cs50s-introduction-to-computer-science-9656",
        pubDate: new Date().toISOString(),
        contentSnippet: "An introduction to the intellectual enterprises of computer science and the art of programming.",
        category: "Computer Science",
        provider: "Harvard University"
      },
      {
        id: "course-2-fallback",
        title: "Machine Learning by Stanford University",
        link: "https://www.classcentral.com/course/coursera-machine-learning-835",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        contentSnippet: "Learn about machine learning algorithms and their applications in real-world scenarios.",
        category: "Artificial Intelligence",
        provider: "Stanford University"
      },
      {
        id: "course-3-fallback",
        title: "The Complete Web Developer Bootcamp",
        link: "https://www.classcentral.com/course/udemy-the-complete-web-developer-bootcamp-12345",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        contentSnippet: "Learn web development from scratch with HTML, CSS, JavaScript, and modern frameworks.",
        category: "Web Development",
        provider: "Udemy"
      },
      {
        id: "course-4-fallback",
        title: "Data Science: Machine Learning",
        link: "https://www.classcentral.com/course/edx-data-science-machine-learning-6789",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        contentSnippet: "Build a movie recommendation system and learn the science behind one of the most popular and successful data science techniques.",
        category: "Data Science",
        provider: "MIT"
      },
      {
        id: "course-5-fallback",
        title: "Python for Everybody",
        link: "https://www.classcentral.com/course/coursera-python-for-everybody-2345",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        contentSnippet: "Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.",
        category: "Programming",
        provider: "University of Michigan"
      },
      {
        id: "course-6-fallback",
        title: "Introduction to Cybersecurity",
        link: "https://www.classcentral.com/course/edx-introduction-to-cybersecurity-3456",
        pubDate: new Date(Date.now() - 432000000).toISOString(),
        contentSnippet: "Learn the basics of cybersecurity, network security, and ethical hacking principles.",
        category: "Cybersecurity",
        provider: "Coursera"
      }
    ]

    return NextResponse.json({ 
      courses: mockCourses,
      dataSource: "fallback",
      error: "Unable to fetch courses from Class Central. Showing enhanced demo data.",
      timestamp: new Date().toISOString()
    })
  }
} 