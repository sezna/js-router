"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.test = void 0;

var _pageNotFound = _interopRequireDefault(require("./page-not-found"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
var Router = function Router(routes) {
  var notFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _pageNotFound["default"];
  var URL = window.location.pathname;
  var paramRoutes = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var route = _step.value;
      // If a route contains brackets, then it has parameters. If it has parameters, then they should be removed and added to paramRoutes which contains the real route.
      // paramRoutes contains { routeWithoutVarNames : routeWithVarNames }
      paramRoutes[removeParNames(route)] = route;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return routes[URL] || matchParamPath(URL, paramRoutes, routes) || notFound; // TODO reduce parameter url
};

var removeParNames = function removeParNames(route) {
  // While an opening bracket still exists, keep slicing out anything between a { and a }
  while (route.indexOf("{") >= 0) {
    route = route.slice(0, route.indexOf("{")) + route.slice(route.indexOf("{") + 1);
  }
};
/** Takes in a route's URL and returns the variable names.
 * @param {string} routeUrl a string representing a route
 * @returns {array<string>} parNames an array of the parameter names contained in the routeUrl.
 * getParameterNamesFromRoute("/{variableOne}/{variableTwo}") returns ["variableOne", "variableTwo"]
 */


var getParameterNamesFromRoute = function getParameterNamesFromRoute(routeUrl) {
  var routeLetters = routeUrl.split("");
  var numOpeningBrackets = routeLetters.filter(function (x) {
    return x === "{";
  }).length;
  var numClosingBrackets = routeLetters.filter(function (x) {
    return x === "}";
  }).length;

  if (numClosingBrackets !== numOpeningBrackets) {
    throw "Malformed route ".concat(routeUrl, ", mismatched brackets.");
    return {
      status: false,
      error: "Malformed route, mismatched brackets"
    };
  } // Get names of variables from object


  var parNames = [];
  var letterStack = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = routeLetters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var letter = _step2.value;
      letterStack.push(letter);

      if (letterStack[letterStack.length - 1] === "}") {
        var tmpVarName = "";
        letterStack.pop(); // get rid of closing bracket

        while (letterStack[letterStack.length - 1] !== "{") {
          tmpVarName = letterStack.pop() + tmpVarName;
        }

        if (!validateVarName(tmpVarName)) {
          throw "Invalid var name ".concat(tmpVarName, " in route ").concat(routeUrl);
        }

        parNames.push(tmpVarName);
        letterStack.pop(); // get rid of the opening bracket
        // Before a variable name, we need a slash to differentiate the names

        var shouldBeSlash = letterStack.pop();

        if (shouldBeSlash !== "/") {
          throw "Malformed route ".concat(routeUrl, ": variable names must be preceeded by a slash");
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return parNames;
}; /// Makes sure a variable name is valid, i.e. it has no disallowed characters


var validateVarName = function validateVarName(name) {
  return name.indexOf("{") < 0 && name.indexOf("}") < 0 && name.indexOf(";") < 0 && name.indexOf("-") < 0;
}; // TODO more things here
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
  var pathSections = path.split("/");
  var reductions = [];

  for (var rank = 0; rank < pathSections.length; rank++) {
    for (var i = 0; i < pathSections.length; i++) {
      var pathSectionsCopy = _toConsumableArray(pathSections);

      for (var j = 0; j < rank; j++) {
        pathSectionsCopy[i + j % pathSections.length] = "";
      }

      pathSectionsCopy = pathSectionsCopy.slice(0, pathSections.length);
      reductions = [].concat(_toConsumableArray(reductions), [pathSectionsCopy.join("/")]);
    }
  }

  return _toConsumableArray(new Set(reductions));
}
/** Matches a path to one of the routes in the object, if it exists, and passes the args into it
 * @param {string} currentPath the current path in the browser
 * @param {Object<string, function>} paramRoutes the reduced variable routes object
 * @returns {function} result a function that, when executed, gives the desired output
 * TODO needs major refactor - path matching is different with and without trailing slash
 */


var matchParamPath = function matchParamPath(currentPath, paramRoutes, routes) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = getPathReductions(currentPath)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var reduction = _step3.value;

      if (paramRoutes[reduction] !== undefined) {
        console.log("match!", reduction, paramRoutes[reduction]);
        var parameters = {};
        var routeSections = paramRoutes[reduction].split("/").filter(function (x) {
          return x !== "";
        });
        var pathSections = currentPath.split("/").filter(function (x) {
          return x !== "";
        });
        console.log("route and path sections", routeSections, pathSections);

        if (routeSections.length !== pathSections.length) {
          console.error("incorrect matching: route and path have different number of sections: ".concat(currentPath, " ").concat(paramRoutes[reduction]));
        }

        for (var sectionIndex in routeSections) {
          if (routeSections[sectionIndex].indexOf("{") >= 0) {
            parameters[routeSections[sectionIndex].replace("{", "").replace("}", "")] = pathSections[sectionIndex];
          }
        }

        console.log("parameters are", parameters);
        console.log("returning func: ", routes[paramRoutes[reduction]]);
        return routes[paramRoutes[reduction]](parameters);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

var test = {
  getParameterNamesFromRoute: getParameterNamesFromRoute,
  getPathReductions: getPathReductions,
  matchParamPath: matchParamPath
};
exports.test = test;
var _default = Router;
exports["default"] = _default;