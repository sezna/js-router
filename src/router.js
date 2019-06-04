import PageNotFound from "./page-not-found";
/// Routes should be in the form of { path : component }
/// TODO support URL params w/ lambda components, get rid of exports and test in a smarter way
/** Constructs a router which returns a function based on the current path in the browser.
 * @param {Object<string>} routes an object of the form { routeUrl : function }
 * @returns {function} result a function which, when executed, provides the desired content.
 *
 * Paths must be preceeded with a forward slash `/`. If a parameter is in the url, it must have its
 * own "section" between slashes, i.e. `/path/{parameter}/`, _not_ `/path{parameter}/` (although the
 * trailing slash at the end is optional).
 */
const Router = (routes, notFound = PageNotFound) => {
  let URL = window.location.pathname;
  let paramRoutes = {};
  for (const route of routes) {
    // If a route contains brackets, then it has parameters. If it has parameters, then they should be removed and added to paramRoutes which contains the real route.
    // paramRoutes contains { routeWithoutVarNames : routeWithVarNames }
    paramRoutes[removeParNames(route)] = route;
  }
  return routes[URL] || matchParamPath(URL, paramRoutes, routes) || notFound; // TODO reduce parameter url
};

const removeParNames = route => {
  // While an opening bracket still exists, keep slicing out anything between a { and a }
  while (route.indexOf("{") >= 0) {
    route =
      route.slice(0, route.indexOf("{")) + route.slice(route.indexOf("{") + 1);
  }
};

/** Takes in a route's URL and returns the variable names.
 * @param {string} routeUrl a string representing a route
 * @returns {array<string>} parNames an array of the parameter names contained in the routeUrl.
 * getParameterNamesFromRoute("/{variableOne}/{variableTwo}") returns ["variableOne", "variableTwo"]
 */
const getParameterNamesFromRoute = routeUrl => {
  let routeLetters = routeUrl.split("");
  let numOpeningBrackets = routeLetters.filter(x => x === "{").length;
  let numClosingBrackets = routeLetters.filter(x => x === "}").length;
  if (numClosingBrackets !== numOpeningBrackets) {
    throw `Malformed route ${routeUrl}, mismatched brackets.`;
    return { status: false, error: "Malformed route, mismatched brackets" };
  }
  // Get names of variables from object
  let parNames = [];
  let letterStack = [];
  for (const letter of routeLetters) {
    letterStack.push(letter);
    if (letterStack[letterStack.length - 1] === "}") {
      let tmpVarName = "";
      letterStack.pop(); // get rid of closing bracket
      while (letterStack[letterStack.length - 1] !== "{") {
        tmpVarName = letterStack.pop() + tmpVarName;
      }
      if (!validateVarName(tmpVarName)) {
        throw `Invalid var name ${tmpVarName} in route ${routeUrl}`;
      }
      parNames.push(tmpVarName);
      letterStack.pop(); // get rid of the opening bracket
      // Before a variable name, we need a slash to differentiate the names
      let shouldBeSlash = letterStack.pop();
      if (shouldBeSlash !== "/") {
        throw `Malformed route ${routeUrl}: variable names must be preceeded by a slash`;
      }
    }
  }
  return parNames;
};

/// Makes sure a variable name is valid, i.e. it has no disallowed characters
const validateVarName = name =>
  name.indexOf("{") < 0 &&
  name.indexOf("}") < 0 &&
  name.indexOf(";") < 0 &&
  name.indexOf("-") < 0; // TODO more things here

/// Reduces a path to its potential variable-less forms
/// TODO make this a generator?
/// TODO this needs to match paths where the variables are in the beginning of the route
/* putting this on hold as I don't want to add babel-polyfill to my dependencies...:(
function* getPathReductions(path) {
   let pathSections = path.split('/');
   for (let rank = 0; rank < pathSections.length; rank++) {
       for (let i = 0; i < pathSections.length; i++) {
           let pathSectionsCopy = [...pathSections];
           for (let j = 0; j < rank; j++) {
                pathSectionsCopy[j] = "";
           }
           yield pathSectionsCopy.join('/');
       }
   }
}*/

// TODO this needs to be redone
function getPathReductions(path) {
  let pathSections = path.split("/");
  let reductions = [];
  for (let rank = 0; rank < pathSections.length; rank++) {
    for (let i = 0; i < pathSections.length; i++) {
      let pathSectionsCopy = [...pathSections];
      for (let j = 0; j < rank; j++) {
        pathSectionsCopy[i + (j % pathSections.length)] = "";
      }
      pathSectionsCopy = pathSectionsCopy.slice(0, pathSections.length);
      reductions = [...reductions, pathSectionsCopy.join("/")];
    }
  }
  return [...new Set(reductions)];
}

/** Matches a path to one of the routes in the object, if it exists, and passes the args into it
 * @param {string} currentPath the current path in the browser
 * @param {Object<string, function>} paramRoutes the reduced variable routes object
 * @returns {function} result a function that, when executed, gives the desired output
 * TODO needs major refactor - path matching is different with and without trailing slash
 */
const matchParamPath = (currentPath, paramRoutes, routes) => {
  for (const reduction of getPathReductions(currentPath)) {
    if (paramRoutes[reduction] !== undefined) {
      let parameters = {};
      let routeSections = paramRoutes[reduction]
        .split("/")
        .filter(x => x !== "");
      let pathSections = currentPath.split("/").filter(x => x !== "");
      if (routeSections.length !== pathSections.length) {
        console.error(
          `incorrect matching: route and path have different number of sections: ${currentPath} ${
            paramRoutes[reduction]
          }`
        );
      }
      for (const sectionIndex in routeSections) {
        if (routeSections[sectionIndex].indexOf("{") >= 0) {
          parameters[
            routeSections[sectionIndex].replace("{", "").replace("}", "")
          ] = pathSections[sectionIndex];
        }
      }
      return routes[paramRoutes[reduction]](parameters);
    }
  }
};

export const test = {
  getParameterNamesFromRoute: getParameterNamesFromRoute,
  getPathReductions: getPathReductions,
  matchParamPath: matchParamPath
};

export default Router;
