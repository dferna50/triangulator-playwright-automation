import { test, expect } from '@playwright/test';
import fs from 'fs';
let cSub1, cNum1, cDes1, cCredit1, cCourseid1;
let cSub2, cNum2, cDes2, cCredit2, cCourseid2;
let cSub3, cNum3, cDes3, cCredit3, cCourseid3;
let cSub4, cNum4, cDes4, cCredit4, cCourseid4;
let cSub5, cNum5, cDes5, cCredit5, cCourseid5;
let cSub, cNum, cDes, cCredit, cCourseid;

function getValues(body, num) {
  cSub = body.data.suggestions.courseMetadata[num].courseSubject
  cNum = body.data.suggestions.courseMetadata[num].courseNumber
  cDes = body.data.suggestions.courseMetadata[num].courseDescription
  cCredit = body.data.suggestions.courseMetadata[num].courseCreditMaxValue
  cCourseid = body.data.suggestions.courseMetadata[num].masterCourseId
  console.log("courseSubject: ", cSub)
  console.log("courseNumber: ", cNum)
  console.log("courseDescription: ", cDes)
  console.log("courseCreditMaxValue: ", cCredit)
  console.log("masterCourseId: ", cCourseid)
  console.log("-----------------------------------------")
  return [cSub, cNum, cDes, cCredit, cCourseid];
}

function compareCourse(body, param) {
  console.log("courseSubject: ", body.data.courseDetails.courses[0].courseSubject)
  console.log("courseNumber: ", body.data.courseDetails.courses[0].courseNumber)
  console.log("courseDescription: ", body.data.courseDetails.metadata.courseDescription)
  console.log("courseCreditMaxValue: ", body.data.courseDetails.metadata.courseCreditMaxValue)
  console.log("CourseId: ", body.data.courseDetails.courses[0].courseId)

  expect(body.data.courseDetails.courses[0].courseSubject).toEqual(param[0])
  expect(body.data.courseDetails.courses[0].courseNumber).toEqual(param[1])
  expect(body.data.courseDetails.metadata.courseDescription).toEqual(param[2])
  expect(body.data.courseDetails.metadata.courseCreditMaxValue).toEqual(param[3])
  expect(body.data.courseDetails.courses[0].courseId).toEqual(param[4])
}

test('TC_SUG_001:To verify find suggestion post call GraphQL API with external query file', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/suggestion.graphql', 'utf8');
  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/sugg.var.json', 'utf8'));



  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  [cSub1, cNum1, cDes1, cCredit1, cCourseid1] = getValues(body, 1);
  [cSub2, cNum2, cDes2, cCredit2, cCourseid2] = getValues(body, 11);
  [cSub3, cNum3, cDes3, cCredit3, cCourseid3] = getValues(body, 65);
  [cSub4, cNum4, cDes4, cCredit4, cCourseid4] = getValues(body, 77);
  [cSub5, cNum5, cDes5, cCredit5, cCourseid5] = getValues(body, 90);

});

test('TC_SEARCH_001:To validate feilds on serach Find course for data mismatch for ', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');

  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/findcourse1.var.json', 'utf8'));
  console.log(variables)

  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  compareCourse(body, [cSub1, cNum1, cDes1, cCredit1, cCourseid1])
});
test('TC_SEARCH_002:To validate feilds on serach Find course for data mismatch', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');

  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/findcourse2.var.json', 'utf8'));
  console.log(variables)

  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  compareCourse(body, [cSub2, cNum2, cDes2, cCredit2, cCourseid2])
});
test('TC_SEARCH_003:To validate feilds on serach Find course for data mismatch', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');

  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/findcourse3.var.json', 'utf8'));
  console.log(variables)

  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  compareCourse(body, [cSub3, cNum3, cDes3, cCredit3, cCourseid3])
});
test('TC_SEARCH_004:To validate feilds on serach Find course for data mismatch', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');

  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/findcourse4.var.json', 'utf8'));
  console.log(variables)

  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  compareCourse(body, [cSub4, cNum4, cDes4, cCredit4, cCourseid4])
});
test('TC_SEARCH_005:To validate feilds on serach Find course for data mismatch', async ({ request }) => {
  const query = fs.readFileSync('./playwright_migration/test_data/api_data/findcourse.graphql', 'utf8');

  const variables = JSON.parse(fs.readFileSync('./playwright_migration/test_data/api_data/findcourse5.var.json', 'utf8'));
  console.log(variables)

  const response = await request.post('https://api-qa-internal.creditmobility.net/graphql', {
    data: { query, variables },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    }
  });

  // console.log('API response: ',response)
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  compareCourse(body, [cSub5, cNum5, cDes5, cCredit5, cCourseid5])
});
