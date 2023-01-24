import { readFile, readFileSync } from "fs";
import fetch from "node-fetch";
import path from "path";
import IAlgorithm from "../models/algorithm";
import IFormat from "../models/format";
class AccountService {
    async validateAccountNumber(number: string) {
        try {
            // 1. remove spaces
            var accountNumber = number.replace(/\s/g, "");
            var countryCode = accountNumber.substring(0, 2);

            var format = await this.getCountryFormat(countryCode);

            // 1. valid country code (first 2 letters)
            if (!format) return false;

            // 2. valild length - depends from country code
            if (format["chars"] != accountNumber.length) return false;

            // 3. valild letters: 0-9 and latin alpabetic characters A to Z
            if (!this.correctChars(accountNumber)) return false;

            var algorithm = await this.getCountryAlgorithm(countryCode);
            var generalValid = this.generalValidation(accountNumber);

            if (generalValid && algorithm) {
                // var countryValid = this.validateByAlgorithm(accountNumber, algorithm);
                // return countryValid;
            }

            return generalValid;
        } catch (e) {
            console.log("error");
            return false;
        }
    }

    private async getCountryAlgorithm(countryCode: string): Promise<IAlgorithm | undefined> {
        var algorithmsJson: any = await readFileSync(path.resolve("src", "db", "country-algorithms.json"));
        // var countries = await readFileSync(path.resolve("..", "db", "country-algorithms.json"));
        var algorithms: any = JSON.parse(algorithmsJson);
        var countryAlgorithm: IAlgorithm | undefined = algorithms[countryCode];

        return countryAlgorithm;
    }

    private async getCountryFormat(countryCode: string): Promise<IFormat | undefined> {
        var formsJson: any = await readFileSync(path.resolve("src", "db", "country-formats.json"));
        var forms = JSON.parse(formsJson);
        var countryForm = forms[countryCode];

        return countryForm;
    }

    private generalValidation(accountNumber: string) {
        // PART 1: General Control
        var remainder = this.getRemainder(accountNumber, 97n);
        var generalControl = remainder === 1n;

        // PART 2: Control by twho check digits
        // 4.1. Save controll number (3 and 4 letter) - Rearrange
        var controllNumber = accountNumber.substring(2, 4);

        var testAccountNumber = this.replaceChar(accountNumber, "0", 2);
        testAccountNumber = this.replaceChar(testAccountNumber, "0", 3);
        var remainder = this.getRemainder(testAccountNumber, 97n);
        var checkDigitsControl = 98n - remainder === BigInt(controllNumber);

        console.log(checkDigitsControl + "&&" + generalControl);

        return checkDigitsControl && generalControl;
    }

    private getRemainder(accountNumber: string, mod: bigint) {
        var part1 = accountNumber.substring(0, 4);
        // 4.2. First 4 letters to the end. - Rearrange
        var rearrange = accountNumber.substring(4) + part1;
        // 4.3. Convert letters to integer - result is integer
        var converted = this.convertToInteger(rearrange);

        // 4.4. Compute remainder: mod 97 - digit 1
        var digit1 = converted % mod;

        return digit1;
    }

    private validateByAlgorithm(accountNumber: string, algorithm: IAlgorithm) {
        // console.log(accountNumber, algorithm);
        var part1 = accountNumber.substring(0, 4);
        // 4.1. Save controll number (3 and 4 letter) - Rearrange
        var controllNumber = accountNumber.substring(2, 4);
        // 4.2. First 4 letters to the end. - Rearrange
        var rearrange = accountNumber.substring(4) + part1;
        // 4.3. Convert letters to integer - result is integer
        var converted = this.convertToInteger(rearrange);
        // console.log(converted);
        // // 4.4. Compute remainder: mod 97 - digit 1
        // var digit1 = converted % 97n;
        // // 4.5. Compute remainder: mod 98 - digit 2
        // // 4.6. digit 1 subtracted with digit 2 must be controll number
        // return digit1 === 1n;
    }

    private convertToInteger(accountNumber: string): bigint {
        var result = "";
        for (let c of accountNumber) {
            if (+c || +c == 0) result += c;
            else {
                var num = this.fromHexToDecimal(c);
                result += num;
            }
        }
        return BigInt(result);
    }

    private fromHexToDecimal(char: string) {
        var n = char.charCodeAt(0) - 65;
        var result = 10 + n;
        return result;
    }

    private replaceChar(origString: string, replaceChar: string, index: number) {
        let firstPart = origString.substring(0, index);
        let lastPart = origString.substring(index + 1);

        let newString = firstPart + replaceChar + lastPart;
        return newString;
    }
    private correctChars(str: string) {
        return /^[0-9A-Z]+$/.test(str);
    }
}

export default new AccountService();
