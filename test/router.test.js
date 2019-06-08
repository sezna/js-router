import { test } from "../lib/router";
// TODO test actual contents of returns
describe("getParameterNamesFromRoute tests", () => {
  it("should return no variable names", () => {
    expect(
      test.getParameterNamesFromRoute("/testPath/notAVarName/test/").length
    ).toBe(0);
  });
  it("should return a single variable name", () => {
    expect(
      test.getParameterNamesFromRoute("/testPath/{varName}/test/").length
    ).toBe(1);
  });
  it("should return two variable names", () => {
    expect(
      test.getParameterNamesFromRoute(
        "/testPath/{varName}/{varName2}/others//extra///"
      ).length
    ).toBe(2);
  });
  it("should return three variable names", () => {
    expect(
      test.getParameterNamesFromRoute("/{var1}/{var2}/{var3}").length
    ).toBe(3);
  });
  it("should return an error due to missing preceeding slashes", () => {
    expect(() =>
      test.getParameterNamesFromRoute("{var1}{var2}{var3}")
    ).toThrow();
  });
  it("should return an error due to mismatched brackets", () => {
    expect(() => test.getParameterNamesFromRoute("/{var{var1}")).toThrow();
  });
  it("should throw an error due to improper var names", () => {
    expect(() => test.getParameterNamesFromRoute("/{var-1}/")).toThrow();
  });
  it("should throw an error due to improper var names", () => {
    expect(() => test.getParameterNamesFromRoute("/{var{1}}/")).toThrow();
  });
});
describe("getPathReductions tests", () => {
  it("should return four reductions", () => {
    let reductions = test.getPathReductions("/four/reductions/");
    expect(test.getPathReductions("/four/reductions/").length).toBe(3);
  });
  it("should return a reduction", () => {
    expect(test.getPathReductions("").length).toBe(1);
  });
});
describe("matchParamPath tests", () => {
  const paramRoutes = {
    "/param/route//": "/param/route/{var1}",
    "/other/param/route///": "/other/param/route/{var1}/{var2}"
  };
  const routes = {
    "/param/route/{var1}": () => 1,
    "/other/param/route/{var1}/{var2}": ({ var1, var2 }) => var1 + var2
  };
  it("should return the number 1", () => {
    console.log(test.matchParamPath("/param/route/param", paramRoutes, routes));
    expect(
      test.matchParamPath("/param/route/param/", paramRoutes, routes)()
    ).toBe(1);
  });
  it("should concat the string params in the path (ab)", () => {
    expect(
      test.matchParamPath("/other/param/route/a/b/", paramRoutes, routes)()
    ).toBe("ab");
  });
});
