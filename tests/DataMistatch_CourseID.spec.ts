import { test, expect } from '@playwright/test';
import fs from 'fs';

interface CourseValues {
    courseSubject: string;
    courseNumber: string;
    courseDescription: string;
    courseCreditMaxValue: number;
    masterCourseId: string;
}

interface SuggestionBody {
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

interface CourseDetailBody {
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

let courseParams: (string | number)[][] = [];

function getValues(body: SuggestionBody, num: number): (string | number)[] {
    const meta = body.data.suggestions.courseMetadata[num];
    console.log('courseSubject: ', meta.courseSubject);
    console.log('courseNumber: ', meta.courseNumber);
    console.log('courseDescription: ', meta.courseDescription);
    console.log('courseCreditMaxValue: ', meta.courseCreditMaxValue);
    console.log('masterCourseId: ', meta.masterCourseId);
    console.log('-----------------------------------------');
    return [meta.courseSubject, meta.courseNumber, meta.courseDescription, meta.courseCreditMaxValue, meta.masterCourseId];
}

function compareCourse(body: CourseDetailBody, param: (string | number)[]): void {
    console.log('courseSubject: ', body.data.courseDetails.courses[0].courseSubject);
    console.log('courseNumber: ', body.data.courseDetails.courses[0].courseNumber);
    console.log('courseDescription: ', body.data.courseDetails.metadata.courseDescription);
    console.log('courseCreditMaxValue: ', body.data.courseDetails.metadata.courseCreditMaxValue);
    console.log('CourseId: ', body.data.courseDetails.courses[0].courseId);

    expect(body.data.courseDetails.courses[0].courseSubject).toEqual(param[0]);
    expect(body.data.courseDetails.courses[0].courseNumber).toEqual(param[1]);
    expect(body.data.courseDetails.metadata.courseDescription).toEqual(param[2]);
    expect(body.data.courseDetails.metadata.courseCreditMaxValue).toEqual(param[3]);
    expect(body.data.courseDetails.courses[0].courseId).toEqual(param[4]);
}

const API_URL = process.env.API_URL ?? 'https://api-qa-internal.creditmobility.net/graphql';

test('TC_SUG_001: Verify find suggestion post call GraphQL API', async ({ request }) => {
    const query = fs.readFileSync('./playwright_migration/test_data/api_data/suggestion.graphql', 'utf8');
    const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/sugg.var.json', 'utf8'));

    const response = await request.post(API_URL, {
        data: { query, variables },
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json() as SuggestionBody;
    courseParams = [
        getValues(body, 1),
        getValues(body, 11),
        getValues(body, 65),
        getValues(body, 77),
        getValues(body, 90),
    ];
});

for (let i = 0; i < 5; i++) {
    test(`TC_SEARCH_00${i + 1}: Validate fields on search Find course for data mismatch`, async ({ request }) => {
        const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');
        const variables = JSON.parse(
            fs.readFileSync(`./playwright_migration/test_data/api_data/findcourse${i + 1}.var.json`, 'utf8')
        );

        const response = await request.post(API_URL, {
            data: { query, variables },
            headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json() as CourseDetailBody;
        compareCourse(body, courseParams[i]);
    });
}
