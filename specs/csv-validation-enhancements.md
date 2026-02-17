# CSV Downloaded File Validation Enhancements

## Overview
Enhanced the equivalency download tests with comprehensive CSV file validation to ensure downloaded data meets all filter criteria and quality standards.

---

## Enhanced Validations Implemented

### 1. Filtered State Data Validation ✅

**Requirement**: Verify only filtered state data is downloaded (e.g., Nevada)

**Implementation**:
- **Test**: TC3.1 - Download with single source state (Nevada)
- **Test**: TC3.2 - Download with multiple source states (Arizona and Nevada)

**Key Features**:
- ✅ Validates state filter applies ONLY to source rows, not target rows
- ✅ Handles CSV files with paired source/target rows
- ✅ Identifies incorrect state values and reports row numbers
- ✅ Distinguishes between source and target rows automatically

**Validation Logic**:
```javascript
const validator = new CSVValidator(downloadPath);
validator.load();

// Validate single state
const stateValidation = validator.validateSourceStateFilter('Nevada');
expect(stateValidation.pass).toBeTruthy();

// Validate multiple states
const multiStateValidation = validator.validateMultipleStatesFilter(['Arizona', 'Nevada']);
expect(multiStateValidation.pass).toBeTruthy();
```

**Output**:
```
✓ CSV has 150 rows
✓ 75 source rows have correct state: Nevada
✓ 75 target rows (filters not applied)
```

---

### 2. Date Range Validation (Decision Date Mapping) ✅

**Requirement**: Start date and end date filters map to the "decision date" column

**Implementation**:
- **Test**: TC2.3 - Download with complete date range

**Key Features**:
- ✅ Automatically finds decision date column (supports multiple naming conventions)
- ✅ Validates all dates fall within specified range
- ✅ Reports rows with dates outside range
- ✅ Handles empty date values gracefully
- ✅ Provides detailed date range information

**Validation Logic**:
```javascript
const startDate = new Date('2024-11-01');
const endDate = new Date('2024-12-31');

const dateValidation = validator.validateDateRangeFilter(startDate, endDate);
expect(dateValidation.pass).toBeTruthy();
```

**Output**:
```
✓ CSV has 120 rows
✓ All 118 rows have dates within range: 2024-11-01 to 2024-12-31
✓ Date column used: decision_date
⚠ 2 rows have empty dates
```

**Supported Date Column Names**:
- `decision_date`
- `decision date`
- `date_suggested`
- `date suggested`
- `created_date`
- `date`

---

### 3. Data Presence Validation ✅

**Requirement**: Verify CSV file contains actual data

**Implementation**:
- **All tests** now validate data presence before applying specific validations

**Key Features**:
- ✅ Confirms CSV has rows (not empty file)
- ✅ Confirms CSV has columns
- ✅ Provides row and column count
- ✅ Displays all column headers

**Validation Logic**:
```javascript
const dataPresence = validator.validateDataPresence();
expect(dataPresence.pass).toBeTruthy();
```

**Output**:
```
✓ CSV contains 150 rows and 12 columns
```

---

### 4. CSV Structure Validation ✅

**Requirement**: Verify CSV has expected columns and proper structure

**Implementation**:
- **Test**: TC7.1 - Verify file format and structure

**Key Features**:
- ✅ Validates presence of expected columns
- ✅ Reports missing columns
- ✅ Flexible column name matching (case-insensitive, partial match)
- ✅ Lists all available headers

**Validation Logic**:
```javascript
const expectedColumns = ['state', 'institution', 'subject', 'course', 'number', 'decision'];
const structureValidation = validator.validateStructure(expectedColumns);
expect(structureValidation.foundColumns.length).toBeGreaterThan(0);
```

**Output**:
```
✓ CSV contains 150 rows and 12 columns
✓ Found columns: Source State, Source Institution, Target Subject, Course Number, Decision Date
⚠ Missing some expected columns: decision
✓ CSV Summary - Headers: Source State, Source Institution, Source Subject, Source Course Number, Target State, Target Institution, Target Subject, Target Course Number, Score, Decision Date, Request Name, Suggestion Type
```

---

## CSV Validator Helper Class

### Location
`a:\Triangulator_Automation\Triangulator_Priya\helpers\csv-validator.js`

### Key Methods

#### `load()`
Loads and parses the CSV file
```javascript
const validator = new CSVValidator(csvPath);
validator.load();
```

#### `validateSourceStateFilter(expectedState)`
Validates state filter on source rows only
```javascript
const result = validator.validateSourceStateFilter('Nevada');
// Returns: { pass, message, validSourceRows, targetRows, invalidRows, stateColumn }
```

#### `validateMultipleStatesFilter(expectedStates)`
Validates multiple states filter
```javascript
const result = validator.validateMultipleStatesFilter(['Arizona', 'Nevada']);
// Returns: { pass, message, invalidRows }
```

#### `validateDateRangeFilter(startDate, endDate)`
Validates date range mapped to decision date column
```javascript
const result = validator.validateDateRangeFilter('2024-11-01', '2024-12-31');
// Returns: { pass, message, validRows, invalidRows, emptyDateRows, dateColumn, dateRange }
```

#### `validateDataPresence()`
Checks if CSV has data
```javascript
const result = validator.validateDataPresence();
// Returns: { pass, message, rowCount, columnCount, headers }
```

#### `validateStructure(expectedColumns)`
Validates CSV structure and columns
```javascript
const result = validator.validateStructure(['state', 'institution', 'subject']);
// Returns: { pass, message, foundColumns, missingColumns, allHeaders }
```

#### `getSummary()`
Returns CSV summary statistics
```javascript
const summary = validator.getSummary();
// Returns: { totalRows, columns, headers, sampleRow }
```

---

## Important Implementation Details

### Source vs Target Row Distinction

The validator handles CSV files where each suggestion has TWO rows:
1. **Source row** - Filters apply here
2. **Target row** - Filters do NOT apply here

**Detection Methods** (in order of preference):
1. **Explicit row type column**: Checks for columns like `row_type`, `type`, `suggestion_type`
2. **Source-specific columns**: Checks for `source_institution` column with values
3. **Alternating pattern**: Assumes rows alternate (source, target, source, target...)
4. **Default**: Treats all rows as source if can't determine

### Flexible Column Matching

The validator uses intelligent column name matching:
- **Case-insensitive**: `Source State` matches `source_state`
- **Partial match**: Looking for `state` finds `source_institution_state`
- **Multiple aliases**: Supports various naming conventions

### Error Reporting

When validation fails, detailed error information is provided:
```javascript
{
  pass: false,
  message: "Found 5 source rows with incorrect state",
  invalidRows: [
    { row: 12, expected: "Nevada", actual: "Arizona", type: "source" },
    { row: 24, expected: "Nevada", actual: "California", type: "source" }
  ]
}
```

---

## Tests Enhanced with Validation

### State Filter Tests
- ✅ **TC3.1**: Single state (Nevada) - Full validation
- ✅ **TC3.2**: Multiple states (Arizona + Nevada) - Full validation

### Date Range Tests
- ✅ **TC2.3**: Complete date range - Full validation with decision date mapping

### File Validation Tests
- ✅ **TC7.1**: File structure - Data presence and structure validation

---

## Running Enhanced Tests

### Run specific validation test
```bash
npx playwright test equivalency_download.spec.js --grep "TC3.1"
```

### Run all enhanced validation tests
```bash
npx playwright test equivalency_download.spec.js --grep "TC3.1|TC3.2|TC2.3|TC7.1"
```

### View detailed console output
```bash
npx playwright test equivalency_download.spec.js --grep "TC3.1" --reporter=list
```

---

## Test Results

All enhanced validation tests passing:
```
✓ TC3.1: Download with single source state (Nevada)
✓ TC3.2: Download with multiple source states (Arizona and Nevada)
✓ TC2.3: Download with complete date range
✓ TC7.1: Verify file format and structure
```

---

## Future Enhancements

### Potential Additions
1. **Subject filter validation**: Validate target subject filters
2. **Institution filter validation**: Validate source institution filters
3. **Combined filter validation**: Validate when multiple filters are applied together
4. **Data integrity checks**: Validate referential integrity between source and target rows
5. **Performance validation**: Ensure large CSV files are validated efficiently

---

## Benefits

### For QA Team
- ✅ Automated validation reduces manual CSV inspection
- ✅ Detailed error reporting pinpoints exact issues
- ✅ Reusable validator for future tests
- ✅ Console output provides immediate feedback

### For Development Team
- ✅ Catches filter logic bugs early
- ✅ Validates API response data correctness
- ✅ Ensures backend filters work as expected
- ✅ Provides confidence in data export feature

### For Stakeholders
- ✅ Guarantees data quality in downloads
- ✅ Ensures users get correctly filtered data
- ✅ Validates critical business logic
- ✅ Comprehensive test coverage documented

---

## Usage Example

```javascript
const { CSVValidator } = require('../helpers/csv-validator.js');

// In your test
test('Validate Nevada state filter', async ({ page }) => {
    // ... download file ...
    const downloadPath = await download.path();
    
    // Create validator and load CSV
    const validator = new CSVValidator(downloadPath);
    validator.load();
    
    // Validate data exists
    const dataCheck = validator.validateDataPresence();
    expect(dataCheck.pass).toBeTruthy();
    console.log(`✓ CSV has ${dataCheck.rowCount} rows`);
    
    // Validate state filter
    const stateCheck = validator.validateSourceStateFilter('Nevada');
    expect(stateCheck.pass).toBeTruthy();
    console.log(`✓ ${stateCheck.validSourceRows.length} source rows have Nevada`);
    
    // Get summary
    const summary = validator.getSummary();
    console.log(`Headers: ${summary.headers.join(', ')}`);
});
```

---

## Validation Coverage Summary

| Validation Type | Status | Tests Coverage |
|----------------|---------|----------------|
| State Filter (Single) | ✅ | TC3.1 |
| State Filter (Multiple) | ✅ | TC3.2 |
| Date Range Filter | ✅ | TC2.3 |
| Data Presence | ✅ | All enhanced tests |
| CSV Structure | ✅ | TC7.1 |
| Source vs Target Row Handling | ✅ | TC3.1, TC3.2 |

---

**Last Updated**: January 30, 2026  
**Version**: 1.0  
**Author**: QA Automation Team
