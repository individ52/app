jest.mock("../services/account-service");
import { readFileSync } from "fs";
import { TopologyDescriptionChangedEvent } from "../../node_modules/mongodb/mongodb";
import accountService from "../services/account-service";
import * as path from "path";

// describe("All IBAN examples is passed", () => {
//     let examples = [];
//     beforeAll(async () => {
//         examples = await getExamples();
//         test.each(examples)("${name} is correct", async ({ name, example }) => {
// var isCorrect = await accountService.validateAccountNumber(example);
// expect(isCorrect).toBeTruthy();
//         });
//     });
// });

test("All IBAN examples is passed", async () => {
    const examples = await getExamples();
    var allIsCorrect = true;
    console.log("WAS TESTED: ", examples.length);
    examples.forEach(async ({ name, example }) => {
        if (allIsCorrect) {
            var isCorrect = await accountService.validateAccountNumber(example);
            if (!isCorrect) allIsCorrect = false;
        }
    });
    expect(allIsCorrect).toBeTruthy();
});

async function getExamples() {
    var formsJson: any = await readFileSync(path.resolve("src", "db", "country-iban-examples.json"));
    var forms = JSON.parse(formsJson);

    return forms;
}
