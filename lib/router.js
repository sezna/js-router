"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.test = void 0;

var _pageNotFound = _interopRequireDefault(require("./page-not-found"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/// Routes should be in the form of { path : component }
/// TODO support URL params w/ lambda components, get rid of exports and test in a smarter way
var Router = function Router(routes) {
  var notFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _pageNotFound["default"];
  var URL = window.location.pathname;

  for (route in routes) {// If a route contains brackets, then it has parameters. If it has parameters, then they should be removed and added to varRoutes which contains the real route.
    // varRoutes contains { reducedURLWithoutVarNames : routeWithVarNames }
  }

  return routes[URL] || routes[reduceParameterUrl(URL)] || notFound; // TODO reduce parameter url
}; /// Takes in a route's URL and returns the variable names.
/// Example:
/// getParameterNamesFromRoute("/{variableOne}/{variableTwo}") returns ["variableOne", "variableTwo"]


var getParameterNamesFromRoute = function getParameterNamesFromRoute(routeUrl) {
  var routeLetters = routeUrl.split('');
  var numOpeningBrackets = routeLetters.filter(function (x) {
    return x === '{';
  }).length;
  var numClosingBrackets = routeLetters.filter(function (x) {
    return x === '}';
  }).length;

  if (numClosingBrackets !== numOpeningBrackets) {
    throw "Malformed route ".concat(routeUrl, ", mismatched brackets.");
    return {
      status: false,
      error: "Malformed route, mismatched brackets"
    };
  } // Get names of variables from object


  var varNames = [];
  var letterStack = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = routeLetters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var letter = _step.value;
      letterStack.push(letter);

      if (letterStack[letterStack.length - 1] === '}') {
        var tmpVarName = "";
        letterStack.pop(); // get rid of closing bracket

        while (letterStack[letterStack.length - 1] !== '{') {
          tmpVarName = letterStack.pop() + tmpVarName;
        }

        if (!validateVarName(tmpVarName)) {
          throw "Invalid var name ".concat(tmpVarName, " in route ").concat(routeUrl);
        }

        varNames.push(tmpVarName);
        letterStack.pop(); // get rid of the opening bracket
        // Before a variable name, we need a slash to differentiate the names

        var shouldBeSlash = letterStack.pop();

        if (shouldBeSlash !== '/') {
          throw "Malformed route ".concat(routeUrl, ": variable names must be preceeded by a slash");
        }
      }
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

  return varNames;
}; /// Makes sure a variable name is valid, i.e. it has no disallowed characters


var validateVarName = function validateVarName(name) {
  return name.indexOf('{') < 0 && name.indexOf('}') < 0 && name.indexOf(';') < 0 && name.indexOf('-') < 0;
}; // TODO more things here
/// Reduces a path to its potential variable-less forms


var getPathReductions = function getPathReductions(path) {
  var reductions = []; // "While there are still non-slash characters in the path"

  while (path.split('').filter(function (x) {
    return x !== '/';
  }).length > 0) {
    // Add the path to the potential reductions and remove the bit after the last slash
    reductions.push(path);
    path = path.slice(0, path.lastIndexOf('/'));
  }

  return reductions;
}; //const getPath


var test = {
  getParameterNamesFromRoute: getParameterNamesFromRoute,
  getPathReductions: getPathReductions
};
exports.test = test;
var _default = Router;
exports["default"] = _default;