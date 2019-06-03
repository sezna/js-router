import PageNotFound from './page-not-found';
/// Routes should be in the form of { path : component }
/// TODO support URL params w/ lambda components, get rid of exports and test in a smarter way
const Router = (routes, notFound = PageNotFound) => {
   let URL = window.location.pathname;
   for (route in routes) {
        // If a route contains brackets, then it has parameters. If it has parameters, then they should be removed and added to varRoutes which contains the real route.
       // varRoutes contains { reducedURLWithoutVarNames : routeWithVarNames }


   }
   return routes[URL] || routes[reduceParameterUrl(URL)] || notFound; // TODO reduce parameter url
}


/// Takes in a route's URL and returns the variable names.
/// Example:
/// getParameterNamesFromRoute("/{variableOne}/{variableTwo}") returns ["variableOne", "variableTwo"]
const getParameterNamesFromRoute = (routeUrl) => {
    let routeLetters = routeUrl.split(''); 
    let numOpeningBrackets = routeLetters.filter(x => x === '{').length;
    let numClosingBrackets = routeLetters.filter(x => x === '}').length;
    if (numClosingBrackets !== numOpeningBrackets) {
        throw `Malformed route ${routeUrl}, mismatched brackets.`;
        return { status: false, error: "Malformed route, mismatched brackets" }
    }
    // Get names of variables from object
    let varNames = []
    let letterStack = []
    for (const letter of routeLetters) {
        letterStack.push(letter)
        if (letterStack[letterStack.length - 1] === '}') {
            let tmpVarName = ""
            letterStack.pop(); // get rid of closing bracket
            while (letterStack[letterStack.length - 1] !== '{') {
                tmpVarName = letterStack.pop() + tmpVarName;
            }
            if (!validateVarName(tmpVarName)) {
                throw `Invalid var name ${tmpVarName} in route ${routeUrl}`
            }
            varNames.push(tmpVarName)
           letterStack.pop(); // get rid of the opening bracket
            // Before a variable name, we need a slash to differentiate the names
            let shouldBeSlash = letterStack.pop();
            if (shouldBeSlash !== '/') {
               throw `Malformed route ${routeUrl}: variable names must be preceeded by a slash`;
            }
        }
    }

    return varNames;
}

/// Makes sure a variable name is valid, i.e. it has no disallowed characters
const validateVarName = (name) => 
           name.indexOf('{') < 0 &&
           name.indexOf('}') < 0 &&
           name.indexOf(';') < 0 &&
           name.indexOf('-') < 0; // TODO more things here


/// Reduces a path to its potential variable-less forms
const getPathReductions = (path) => {
    let reductions = [];
    // "While there are still non-slash characters in the path"
    while (path.split('').filter(x => x !== '/').length > 0) {
        // Add the path to the potential reductions and remove the bit after the last slash
        reductions.push(path);
        path = path.slice(0, path.lastIndexOf('/')); 
    }
    return reductions;    
}

//const getPath

export const test = {
    getParameterNamesFromRoute: getParameterNamesFromRoute,
    getPathReductions: getPathReductions
}

export default Router;
