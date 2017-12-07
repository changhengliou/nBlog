describe('App', () => {
    it('should be able to run tests', () => {
        expect(1 + 2).toEqual(3);
    });
});
// xit: exclude that test
// fit: only test that instance

// global function
// afterAll(fn)
// afterEach(fn)
// beforeAll(fn)
// beforeEach(fn)
// describe(name, fn)
// describe.only(name, fn) # only execute this describe
// describe.skip(name, fn) # skip this particular describe