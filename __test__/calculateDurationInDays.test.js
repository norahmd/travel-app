import { calculateDurationInDays } from "../src/client/js/durationCalculator"

describe("Testing if calculateDurationInDays() is defined", () => {
    test("Testing the calculateDurationInDays() function", () => {

           expect(calculateDurationInDays).toBeDefined();

    })
});

describe('Test "calculateDurationInDays()" should be a function' , () => {
    test('It should be a function', async () => {
        expect(typeof calculateDurationInDays).toBe("function");
    });
});

describe('Test "calculateDurationInDays()" functionality' , () => {
    test('test the happy scenario for calculateDurationInDays()', async () => {
        var date = new Date();
        var dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 1)
        expect(calculateDurationInDays(date, dayAfter)).toBe(1);
    });
});