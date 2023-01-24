import { readFile, readFileSync } from "fs";
import fetch from "node-fetch";
import path from "path";
class AccountService {
    async validateAccountNumber(number: string) {
        try {
            // 1. remove spaces
            var accountNumber = number.replace(/\s/g, "");
            var countryCode = accountNumber.substring(0, 2);
            var controllNum = accountNumber.substring(2, 4);

            var algorithm = await this.getCountrySettings(countryCode);
            // 1. valid country code (first 2 letters)
            if (!algorithm) return false;

            // 2. valild length - depends from country code
            if (algorithm["chars"] != accountNumber.length) return false;

            // 3. valild letters: 0-9 and latin alpabetic characters A to Z
            if (this.correctChars(accountNumber)) return false;

            // 4. main controllment:
            // 4.1. Save controll number (3 and 4 letter) - Rearrange
            // 4.2. First 4 letters to the end. - Rearrange
            // 4.3. Convert letters to integer - result is integer
            // 4.4. Compute remainder: mod 97 - digit 1
            // 4.5. Compute remainder: mod 98 - digit 2
            // 4.6. digit 1 subtracted with digit 2 must be controll number


            
        } catch (e) {
            console.log("error");
            return false;
        }
    }
    async getCountrySettings(countryCode: string) {
        var algorithmsJson: any = await readFileSync(path.resolve("src", "db", "country-algorithms.json"));
        // var countries = await readFileSync(path.resolve("..", "db", "country-algorithms.json"));
        var algorithms = JSON.parse(algorithmsJson);
        var countryAlgorithm = algorithms[countryCode];

        return countryAlgorithm;
    }

    correctChars(str: string) {
        return /^[0-9A-Z]+$/.test(str);
    }
}

export default new AccountService();
