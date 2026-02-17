const fs = require('fs');
const Papa = require('papaparse');

/**
 * CSV Validation Helper for Equivalency Download Tests
 * Handles validation of filtered data, date ranges, and data presence
 */

class CSVValidator {
    constructor(csvPath) {
        this.csvPath = csvPath;
        this.csvContent = null;
        this.parsedData = null;
        this.headers = [];
    }

    /**
     * Load and parse the CSV file
     */
    load() {
        if (!fs.existsSync(this.csvPath)) {
            throw new Error(`CSV file not found at: ${this.csvPath}`);
        }

        this.csvContent = fs.readFileSync(this.csvPath, 'utf8');
        this.parsedData = Papa.parse(this.csvContent, { 
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim()
        });

        if (this.parsedData.errors.length > 0) {
            console.warn('CSV parsing warnings:', this.parsedData.errors);
        }

        this.headers = this.parsedData.meta.fields || [];
        return this;
    }

    /**
     * Get all rows from the CSV
     */
    getAllRows() {
        return this.parsedData.data;
    }

    /**
     * Get only source rows (filters apply to source, not target)
     * Assumes there's a column that identifies row type or uses pattern matching
     */
    getSourceRows() {
        const rows = this.getAllRows();
        
        // Try to identify source rows by checking for a row type column
        const rowTypeColumn = this.findColumn(['row_type', 'type', 'suggestion_type']);
        
        if (rowTypeColumn) {
            return rows.filter(row => 
                row[rowTypeColumn]?.toLowerCase().includes('source')
            );
        }

        // Alternative: If rows come in pairs (source then target), take odd-indexed rows
        // Or use other logic based on actual data structure
        // For now, return all rows and let specific validators handle it
        return rows;
    }

    /**
     * Get only target rows
     */
    getTargetRows() {
        const rows = this.getAllRows();
        
        const rowTypeColumn = this.findColumn(['row_type', 'type', 'suggestion_type']);
        
        if (rowTypeColumn) {
            return rows.filter(row => 
                row[rowTypeColumn]?.toLowerCase().includes('target')
            );
        }

        return [];
    }

    /**
     * Find a column by possible names (case-insensitive)
     */
    findColumn(possibleNames) {
        const lowerHeaders = this.headers.map(h => h.toLowerCase());
        
        for (const name of possibleNames) {
            const index = lowerHeaders.findIndex(h => h.includes(name.toLowerCase()));
            if (index !== -1) {
                return this.headers[index];
            }
        }
        
        return null;
    }

    /**
     * Validate that filtered state only appears in source rows
     * @param {string} expectedState - The state that was filtered (e.g., 'Nevada')
     * @returns {object} Validation result with pass/fail and details
     */
    validateSourceStateFilter(expectedState) {
        const stateColumn = this.findColumn([
            'source_state', 
            'source state',
            'state',
            'source_institution_state'
        ]);

        if (!stateColumn) {
            return {
                pass: false,
                message: 'Could not find state column in CSV',
                availableColumns: this.headers
            };
        }

        const allRows = this.getAllRows();
        const invalidRows = [];
        const validSourceRows = [];
        const targetRows = [];

        // Check each row
        allRows.forEach((row, index) => {
            const stateValue = row[stateColumn]?.trim();
            const rowNumber = index + 2; // +2 because CSV is 1-indexed and header is row 1

            // Determine if this is a source or target row
            // This logic may need adjustment based on actual CSV structure
            const isSourceRow = this.isSourceRow(row, index);

            if (isSourceRow) {
                if (stateValue) {
                    if (stateValue.toLowerCase() === expectedState.toLowerCase()) {
                        validSourceRows.push({ row: rowNumber, state: stateValue });
                    } else {
                        invalidRows.push({ 
                            row: rowNumber, 
                            expected: expectedState, 
                            actual: stateValue,
                            type: 'source'
                        });
                    }
                }
            } else {
                // Target row - should be allowed to have any state
                targetRows.push({ row: rowNumber, state: stateValue });
            }
        });

        return {
            pass: invalidRows.length === 0,
            message: invalidRows.length === 0 
                ? `All ${validSourceRows.length} source rows have correct state: ${expectedState}`
                : `Found ${invalidRows.length} source rows with incorrect state`,
            validSourceRows,
            targetRows,
            invalidRows,
            stateColumn
        };
    }

    /**
     * Validate multiple states filter
     */
    validateMultipleStatesFilter(expectedStates) {
        const stateColumn = this.findColumn([
            'source_state', 
            'source state',
            'state',
            'source_institution_state'
        ]);

        if (!stateColumn) {
            return {
                pass: false,
                message: 'Could not find state column in CSV'
            };
        }

        const expectedStatesLower = expectedStates.map(s => s.toLowerCase());
        const allRows = this.getAllRows();
        const invalidRows = [];

        allRows.forEach((row, index) => {
            if (this.isSourceRow(row, index)) {
                const stateValue = row[stateColumn]?.trim().toLowerCase();
                if (stateValue && !expectedStatesLower.includes(stateValue)) {
                    invalidRows.push({
                        row: index + 2,
                        expected: expectedStates.join(', '),
                        actual: row[stateColumn]
                    });
                }
            }
        });

        return {
            pass: invalidRows.length === 0,
            message: invalidRows.length === 0
                ? `All source rows have states from: ${expectedStates.join(', ')}`
                : `Found ${invalidRows.length} source rows with states not in filter`,
            invalidRows
        };
    }

    /**
     * Validate date range filter (mapped to decision date column)
     * @param {Date|string} startDate 
     * @param {Date|string} endDate 
     */
    validateDateRangeFilter(startDate, endDate) {
        const dateColumn = this.findColumn([
            'decision_date',
            'decision date',
            'date_suggested',
            'date suggested',
            'created_date',
            'date'
        ]);

        if (!dateColumn) {
            return {
                pass: false,
                message: 'Could not find decision date column in CSV',
                availableColumns: this.headers
            };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const allRows = this.getAllRows();
        const invalidRows = [];
        const validRows = [];
        const emptyDateRows = [];

        allRows.forEach((row, index) => {
            const dateValue = row[dateColumn]?.trim();
            const rowNumber = index + 2;

            if (!dateValue) {
                emptyDateRows.push(rowNumber);
                return;
            }

            const rowDate = new Date(dateValue);
            
            if (isNaN(rowDate.getTime())) {
                invalidRows.push({
                    row: rowNumber,
                    reason: 'Invalid date format',
                    value: dateValue
                });
                return;
            }

            if (rowDate < start || rowDate > end) {
                invalidRows.push({
                    row: rowNumber,
                    reason: 'Date outside range',
                    value: dateValue,
                    expectedRange: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`
                });
            } else {
                validRows.push({
                    row: rowNumber,
                    date: dateValue
                });
            }
        });

        return {
            pass: invalidRows.length === 0,
            message: invalidRows.length === 0
                ? `All ${validRows.length} rows have dates within range`
                : `Found ${invalidRows.length} rows with dates outside range`,
            validRows,
            invalidRows,
            emptyDateRows,
            dateColumn,
            dateRange: {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0]
            }
        };
    }

    /**
     * Validate that CSV has data (not empty)
     */
    validateDataPresence() {
        const rowCount = this.getAllRows().length;
        const columnCount = this.headers.length;

        return {
            pass: rowCount > 0 && columnCount > 0,
            message: rowCount > 0 
                ? `CSV contains ${rowCount} rows and ${columnCount} columns`
                : 'CSV is empty',
            rowCount,
            columnCount,
            headers: this.headers
        };
    }

    /**
     * Validate CSV structure (has expected columns)
     */
    validateStructure(expectedColumns = []) {
        const missingColumns = [];
        const foundColumns = [];

        expectedColumns.forEach(expected => {
            const found = this.findColumn([expected]);
            if (found) {
                foundColumns.push(found);
            } else {
                missingColumns.push(expected);
            }
        });

        return {
            pass: missingColumns.length === 0,
            message: missingColumns.length === 0
                ? `All expected columns found`
                : `Missing columns: ${missingColumns.join(', ')}`,
            foundColumns,
            missingColumns,
            allHeaders: this.headers
        };
    }

    /**
     * Helper: Determine if a row is a source row
     * This logic should be adjusted based on actual CSV structure
     */
    isSourceRow(row, index) {
        // Method 1: Check for explicit row type column
        const rowTypeColumn = this.findColumn(['row_type', 'type', 'suggestion_type']);
        if (rowTypeColumn && row[rowTypeColumn]) {
            return row[rowTypeColumn].toLowerCase().includes('source');
        }

        // Method 2: Check for source-specific columns having values
        const sourceInstitutionCol = this.findColumn(['source_institution', 'source institution']);
        if (sourceInstitutionCol && row[sourceInstitutionCol]) {
            return true;
        }

        // Method 3: Assume rows alternate (source, target, source, target...)
        // Uncomment if this pattern applies:
        // return index % 2 === 0;

        // Default: Consider all rows as source rows if can't determine
        // This ensures filters are checked on all rows
        return true;
    }

    /**
     * Get summary statistics
     */
    getSummary() {
        const rows = this.getAllRows();
        return {
            totalRows: rows.length,
            columns: this.headers.length,
            headers: this.headers,
            sampleRow: rows[0] || {}
        };
    }
}

module.exports = { CSVValidator };
