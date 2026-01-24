import {utilUniqString} from "./util-uniq-string";

describe("utilUniqString", () => {
    it("should work", () => {
        expect(utilUniqString()).toEqual("util-uniq-string");
    });
});
