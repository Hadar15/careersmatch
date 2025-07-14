import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
  try {
    const filePath = path.join(process.cwd(), 'public', 'classcentral-courses.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    return NextResponse.json({ ...json, dataSource: 'cache' });
  } catch (error) {
    // fallback ke mock jika file tidak ditemukan
    return NextResponse.json({
      courses: [],
      dataSource: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
} 