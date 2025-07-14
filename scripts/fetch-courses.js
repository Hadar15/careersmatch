const Parser = require('rss-parser');
const fs = require('fs');

const rssEndpoints = [
  "https://www.classcentral.com/subjects/computer-science/rss",
  "https://www.classcentral.com/subjects/programming/rss", 
  "https://www.classcentral.com/subjects/web-development/rss",
  "https://www.classcentral.com/subjects/data-science/rss",
  "https://www.classcentral.com/subjects/artificial-intelligence/rss"
];

(async () => {
  const parser = new Parser();
  let courses = [];
  for (const endpoint of rssEndpoints) {
    try {
      const feed = await parser.parseURL(endpoint);
      if (feed.items && feed.items.length > 0) {
        courses = feed.items.map((item, index) => ({
          id: `course-${index}-${Date.now()}`,
          title: item.title || "Course Title Not Available",
          link: item.link || "#",
          pubDate: item.pubDate || new Date().toISOString(),
          contentSnippet: item.contentSnippet || "Course description not available",
          category: item.categories?.[0] || "Computer Science",
          provider: item.creator || "Class Central"
        }));
        break;
      }
    } catch (err) {
      console.error(`Failed to fetch from ${endpoint}:`, err.message);
    }
  }
  fs.writeFileSync('./public/classcentral-courses.json', JSON.stringify({ courses, timestamp: new Date().toISOString() }, null, 2));
  console.log('Courses saved to public/classcentral-courses.json');
})(); 