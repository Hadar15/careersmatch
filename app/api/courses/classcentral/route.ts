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

export async function GET() {
  try {
    console.log("🌐 Server-side fetching from: https://www.classcentral.com/subjects/computer-science/rss")
    
    const parser = new Parser()
    const feed = await parser.parseURL("https://www.classcentral.com/subjects/computer-science/rss")
    
    const courses: Course[] = feed.items.map((item, index) => ({
      id: `course-${index}`,
      title: item.title || "Course Title Not Available",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || "Course description not available",
      category: item.categories?.[0] || "Computer Science",
      provider: item.creator || "Class Central"
    }))

    console.log("📊 Server-side API response:", {
      courseCount: courses.length,
      firstCourse: courses[0]?.title
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("❌ Error fetching courses:", error)
    
    // Fallback mock data
    const mockCourses: Course[] = [
      {
        id: "course-1",
        title: "Introduction to Computer Science",
        link: "https://www.classcentral.com/course/intro-cs",
        pubDate: new Date().toISOString(),
        contentSnippet: "Learn the fundamentals of computer science and programming with this comprehensive course.",
        category: "Computer Science",
        provider: "Harvard University"
      },
      {
        id: "course-2",
        title: "Machine Learning Fundamentals",
        link: "https://www.classcentral.com/course/ml-fundamentals",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        contentSnippet: "Master the basics of machine learning algorithms and their applications in real-world scenarios.",
        category: "Artificial Intelligence",
        provider: "Stanford University"
      },
      {
        id: "course-3",
        title: "Web Development Bootcamp",
        link: "https://www.classcentral.com/course/web-dev",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        contentSnippet: "Complete course on modern web development including HTML, CSS, JavaScript, and React.",
        category: "Web Development",
        provider: "Udemy"
      },
      {
        id: "course-4",
        title: "Data Science Essentials",
        link: "https://www.classcentral.com/course/data-science",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        contentSnippet: "Learn data analysis, visualization, and statistical methods for data science projects.",
        category: "Data Science",
        provider: "MIT"
      },
      {
        id: "course-5",
        title: "Cybersecurity Fundamentals",
        link: "https://www.classcentral.com/course/cybersecurity",
        pubDate: new Date(Date.now() - 345600000).toISOString(),
        contentSnippet: "Understand the basics of cybersecurity, network security, and ethical hacking.",
        category: "Cybersecurity",
        provider: "Coursera"
      },
      {
        id: "course-6",
        title: "Python Programming Masterclass",
        link: "https://www.classcentral.com/course/python-masterclass",
        pubDate: new Date(Date.now() - 432000000).toISOString(),
        contentSnippet: "Comprehensive Python programming course from beginner to advanced level.",
        category: "Programming",
        provider: "edX"
      }
    ]

    return NextResponse.json({ 
      courses: mockCourses,
      error: "Unable to fetch courses from Class Central. Showing demo data."
    })
  }
} 