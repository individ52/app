class AccountService {
    validateAccountNumber(number: string) { 
        // 1. valid country code (first 2 letters)
        // 2. valild length - depends from country code
        // 3. valild letters: 0-9 and latin alpabetic characters A to Z
        // 4. main controllment:
        // 5.1. Save controll number (3 and 4 letter) - Rearrange
        // 5.2. First 4 letters to the end. - Rearrange
        // 5.3. Convert letters to integer - result is integer
        // 5.4. Compute remainder: mod 97 - digit 1
        // 5.5. Compute remainder: mod 98 - digit 2
        // 5.6. digit 1 subtracted with digit 2 must be controll number
        
        

        

    }
}

export default new AccountService();
