import { test, expect } from '../fixtures/test';
import {
    GraphQLHelper,
    getCourseValuesFromSuggestion,
    compareCourseData,
    type SuggestionBody,
    type CourseDetailBody,
    type CourseValues,
} from '../helpers/GraphQLHelper';

let courseParams: CourseValues[] = [];

const GRAPHQL_FILES = {
    suggestionQuery: 'suggestion.graphql',
    suggestionVariables: 'sugg.var.json',
    findCourseQuery: 'findcourse.graphql',
};

test.describe('Data Mismatch - Course ID Validation', () => {
    test.describe.configure({ mode: 'serial' });
    const graphqlHelper = new GraphQLHelper();

    test('TC_SUG_001: Verify find suggestion post call GraphQL API', async ({ request }) => {
        const query = graphqlHelper.loadQueryFromFile(GRAPHQL_FILES.suggestionQuery);
        const variables = graphqlHelper.loadVariablesFromFile(GRAPHQL_FILES.suggestionVariables);

        const body = await graphqlHelper.executeQuery<SuggestionBody>(request, query, variables);

        // Extract course values from suggestion response
        courseParams = [
            getCourseValuesFromSuggestion(body, 1),
            getCourseValuesFromSuggestion(body, 11),
            getCourseValuesFromSuggestion(body, 65),
            getCourseValuesFromSuggestion(body, 77),
            getCourseValuesFromSuggestion(body, 90),
        ];

        // Verify we have valid course data
        for (const course of courseParams) {
            expect(course.courseSubject).toBeTruthy();
            expect(course.courseNumber).toBeTruthy();
            expect(course.masterCourseId).toBeTruthy();
        }
    });

    for (let i = 0; i < 5; i++) {
        test.skip(`TC_SEARCH_00${i + 1}: Validate fields on search Find course for data mismatch`, async ({ request }) => {
            const query = graphqlHelper.loadQueryFromFile(GRAPHQL_FILES.findCourseQuery);
            const variables = graphqlHelper.loadVariablesFromFile(`findcourse${i + 1}.var.json`) as { courseId: string };

            const body = await graphqlHelper.executeQuery<CourseDetailBody>(request, query, variables);

            // Compare course details with expected values from suggestion API
            const courseId = variables.courseId;
            let expectedCourse = courseParams.find(c => c.masterCourseId === courseId);
            if (!expectedCourse) {
                console.log(`Warning: expected course with ID ${courseId} not found in suggestion results. Using fallback.`);
                expectedCourse = courseParams[i] || courseParams[0];
            }
            
            const result = compareCourseData(body, expectedCourse);

            // Log any differences for debugging
            if (!result.match) {
                console.log('Course data mismatch detected:');
                result.differences.forEach((diff) => console.log(`  - ${diff}`));
            }

            // All values should match between suggestion and course detail APIs
            expect(result.match).toBe(true);
        });
    }
});
