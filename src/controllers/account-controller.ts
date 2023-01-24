class AccountController {
    async validateAccountNumber(req: any, res: any, next: any) {
        try {
            console.log("object");
        } catch (e: any) {
            return next(e);
        }
    }
}

export default new AccountController();
