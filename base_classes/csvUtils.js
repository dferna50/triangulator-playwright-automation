// csvUtils.js

class UploadUtils {
    // Function to generate a random alphanumeric value with a specified limit
    static generateUniqueAlphaNumeric(limit) {
        const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < limit; i++) {
            const randomIndex = Math.floor(Math.random() * alphanumericCharacters.length);
            result += alphanumericCharacters.charAt(randomIndex);
        }

        return result;
    }

    // Function to update the CSV file content for the described steps
    static updateCSVContent(fileContent) {
        const rows = fileContent.split('\n');

        // Process each row starting from the second row
        for (let i = 1; i < Math.min(rows.length, 22); i += 2) {
            const ruleIdentifier = `AUTO${UploadUtils.generateUniqueAlphaNumeric(9)}`;
            const targetRuleIdentifier = `${ruleIdentifier}`;

            // Check if the row has enough columns
            if (rows[i] && rows[i + 1]) {
                // Update values in column A (RulesIdentifier) for source and target rows
                rows[i] = `${ruleIdentifier},${rows[i].split(',').slice(1).join(',')}`;
                rows[i + 1] = `${targetRuleIdentifier},${rows[i + 1].split(',').slice(1).join(',')}`;

                // // Update values in column J (Number) with unique alphanumeric value
                // const uniqueAlphaNumericValue = UploadUtils.generateUniqueAlphaNumeric(8);
                // rows[i] = `${rows[i].split(',').slice(0, 9).join(',')},${uniqueAlphaNumericValue},${rows[i].split(',').slice(10).join(',')}`;
                // rows[i + 1] = `${rows[i + 1].split(',').slice(0, 9).join(',')},${uniqueAlphaNumericValue},${rows[i + 1].split(',').slice(10).join(',')}`;
            }
        }

        // Update the modified content back to the file (if needed)
        return rows.join('\n');
    }

    static updateCSVContentCatalog(fileContent) {
        const rows = fileContent.split('\n');

        // Process each row starting from the second row
        for (let i = 1; i < Math.min(rows.length, 22); i++) {
            const CourseIdentifier = `AUTO${UploadUtils.generateUniqueAlphaNumeric(9)}`;

            // Check if the row exists and is not empty
            if (rows[i] && rows[i].trim() !== '') {
                // Update values in column A (RulesIdentifier) for source and target rows
                rows[i] = `${rows[i].split(',').slice(0, 1).join(',')},${CourseIdentifier},${rows[i].split(',').slice(2).join(',')}`;

                // Update values in column J (Number) with unique alphanumeric value
                const uniqueAlphaNumericValue = UploadUtils.generateUniqueAlphaNumeric(8);
                rows[i] = `${rows[i].split(',').slice(0, 3).join(',')},${uniqueAlphaNumericValue},${rows[i].split(',').slice(4).join(',')}`;

                // Ensure the next row exists before processing it
                if (rows[i + 1] && rows[i + 1].trim() !== '') {
                    rows[i + 1] = `${rows[i + 1].split(',').slice(0, 3).join(',')},${uniqueAlphaNumericValue},${rows[i + 1].split(',').slice(4).join(',')}`;
                }
            }
        }

        // Update the modified content back to the file (if needed)
        return rows.join('\n');
    }
}


// Export the class
module.exports = UploadUtils;
