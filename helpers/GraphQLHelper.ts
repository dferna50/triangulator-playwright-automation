import fs from 'fs';
import path from 'path';

/**
 * GraphQL API Helper for making GraphQL requests
 * Follows Service pattern for API testing within POM architecture
 */
export class GraphQLHelper {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.API_URL || 'https://api-qa-internal.creditmobility.net/graphql';
  }

  /**
   * Execute a GraphQL query
   * @param request - Playwright APIRequestContext
   * @param query - GraphQL query string
   * @param variables - Query variables
   * @returns Response JSON
   */
  async executeQuery<T = unknown>(
    request: { post: (url: string, options: { data: { query: string; variables: unknown }; headers: Record<string, string> }) => Promise<{ ok: () => boolean; json: () => Promise<T> }> },
    query: string,
    variables: unknown
  ): Promise<T> {
    const response = await request.post(this.baseUrl, {
      data: { query, variables },
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    });

    if (!response.ok()) {
      throw new Error(`GraphQL request failed: ${response}`);
    }

    return await response.json();
  }

  /**
   * Load GraphQL query from file
   * @param filePath - Path to .graphql file
   * @returns Query string
   */
  loadQueryFromFile(filePath: string): string {
    // Try multiple base paths for flexibility
    const possiblePaths = [
      filePath,
      path.join('test_data/api_data', filePath),
      path.join('playwright_migration/test_data/api_data', filePath),
    ];

    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        return fs.readFileSync(tryPath, 'utf8');
      }
    }

    throw new Error(`GraphQL query file not found: ${filePath}. Tried: ${possiblePaths.join(', ')}`);
  }

  /**
   * Load JSON variables from file
   * @param filePath - Path to .json file
   * @returns Parsed JSON
   */
  loadVariablesFromFile<T = unknown>(filePath: string): T {
    // Try multiple base paths for flexibility
    const possiblePaths = [
      filePath,
      path.join('test_data/api_data', filePath),
      path.join('playwright_migration/test_data/api_data', filePath),
    ];

    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        return JSON.parse(fs.readFileSync(tryPath, 'utf8')) as T;
      }
    }

    throw new Error(`Variables file not found: ${filePath}. Tried: ${possiblePaths.join(', ')}`);
  }
}

/**
 * Course data interfaces for type safety
 */
export interface CourseValues {
  courseSubject: string;
  courseNumber: string;
  courseDescription: string;
  courseCreditMaxValue: number;
  masterCourseId: string;
}

export interface SuggestionBody {
  data: {
    suggestions: {
      courseMetadata: Array<{
        courseSubject: string;
        courseNumber: string;
        courseDescription: string;
        courseCreditMaxValue: number;
        masterCourseId: string;
      }>;
    };
  };
}

export interface CourseDetailBody {
  data: {
    courseDetails: {
      courses: Array<{
        courseSubject: string;
        courseNumber: string;
        courseId: string;
      }>;
      metadata: {
        courseDescription: string;
        courseCreditMaxValue: number;
      };
    };
  };
}

/**
 * Helper functions for extracting and comparing course data
 */
export function getCourseValuesFromSuggestion(body: SuggestionBody, index: number): CourseValues {
  const metadataArray = body?.data?.suggestions?.courseMetadata;
  const meta = (metadataArray && metadataArray.length > 0)
    ? metadataArray[index % metadataArray.length]
    : {
        courseSubject: 'Unknown',
        courseNumber: 'Unknown',
        courseDescription: 'Unknown',
        courseCreditMaxValue: 0,
        masterCourseId: 'Unknown'
      };
  return {
    courseSubject: meta.courseSubject,
    courseNumber: meta.courseNumber,
    courseDescription: meta.courseDescription,
    courseCreditMaxValue: meta.courseCreditMaxValue,
    masterCourseId: meta.masterCourseId,
  };
}

export function compareCourseData(
  courseDetail: CourseDetailBody,
  expected: CourseValues
): { match: boolean; differences: string[] } {
  const differences: string[] = [];

  if (courseDetail.data.courseDetails.courses[0].courseSubject !== expected.courseSubject) {
    differences.push(`courseSubject: expected "${expected.courseSubject}", got "${courseDetail.data.courseDetails.courses[0].courseSubject}"`);
  }
  if (courseDetail.data.courseDetails.courses[0].courseNumber !== expected.courseNumber) {
    differences.push(`courseNumber: expected "${expected.courseNumber}", got "${courseDetail.data.courseDetails.courses[0].courseNumber}"`);
  }
  if (courseDetail.data.courseDetails.metadata.courseDescription !== expected.courseDescription) {
    differences.push(`courseDescription mismatch`);
  }
  if (courseDetail.data.courseDetails.metadata.courseCreditMaxValue !== expected.courseCreditMaxValue) {
    differences.push(`courseCreditMaxValue: expected ${expected.courseCreditMaxValue}, got ${courseDetail.data.courseDetails.metadata.courseCreditMaxValue}`);
  }
  if (courseDetail.data.courseDetails.courses[0].courseId !== expected.masterCourseId) {
    differences.push(`courseId: expected "${expected.masterCourseId}", got "${courseDetail.data.courseDetails.courses[0].courseId}"`);
  }

  return {
    match: differences.length === 0,
    differences,
  };
}
