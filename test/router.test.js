import { test } from '../lib/router';

describe('Function tests', () => {
    describe('getParameterNamesFromRoute tests', () => {
        it('should return a single variable name', () => {
            expect(test.getParameterNamesFromRoute('/testPath/{varName}/test/').length).toBe(1); 
        }); 
        it('should return two variable names', () => {
            expect(test.getParameterNamesFromRoute('/testPath/{varName}/{varName2}/others//extra///').length).toBe(2);
        });
        it('should return three variable names', () => {
            expect(test.getParameterNamesFromRoute('/{var1}/{var2}/{var3}').length).toBe(3)
        });
        it('should return an error due to missing preceeding slashes', () => {
            expect(() => test.getParameterNamesFromRoute('{var1}{var2}{var3}')).toThrow();
        });
        it('should return an error due to mismatched brackets', () => {
            expect(() => test.getParameterNamesFromRoute('/{var{var1}')).toThrow();
        });
        it('should throw an error due to improper var names', () => {
            expect(() => test.getParameterNamesFromRoute('/{var-1}/')).toThrow();
        });
        it('should throw an error due to improper var names', () => {
            expect(() => test.getParameterNamesFromRoute('/{var{1}}/')).toThrow();
        });
    });
});
