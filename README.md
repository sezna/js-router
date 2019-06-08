# Why JS-Router?
This project is a lighter weight alternative to the feature-rich routers like React Router. It has _no_ dependencies (none at all!) and only provides basic routing capabilities. It supports URL parameters and provides an overrideable 404 page. A Link component is also included (or, will be in the future). 

It is currently a WIP and isn't ready for release yet

# Usage
The router takes two parameters: an object specifying paths to components and an optional 404 page component if it doesn't find anything for the current path. By default, it will just return a "404 page not found" string if it doesn't find anything.
```js
import Router from 'js-router';
import React from 'react';
import { BlogPage, BlogPostPage } from './my-components';

const ComponentRouter = Router({
      '/' : HomePage,
      '/blog/' : BlogPage,
      '/blog/post/{postID}': BlogPostPage
});

const App = () => {
    return <ThemeContext.Provider value={themes.warm}>
                <ComponentRouter />
           </ThemeContext.Provider>
}
```

## Basic Routes
As you can see in the example above, pass in an object specifying your routes and the components you wish for them to be routed to. All routes must start with a `/` (forward slash).

## Parameter Routes
A parameter route is a route that includes variables you will pass into your component, like the `postID` seen in the above example. Parameters in a route must have their own "section" in between two slashes.
* Valid parameter route: `/{var1}/{var2}`
* _Invalid_ parameter route: `/{var1}{var2}`.

This is because the matching algorithm needs to know where one parameter ends and the next begins. Additionally, parameters must come at the _end_ of a route.

* Valid parameter route: `/my/path/{var1}`
* Invalid parameter route: `/{var1}/my/path`
This decision was made to simplify the path matching algorithm, and in the spirit of this being a lightweight router, I think this constraint is not too bad. I welcome PRs that solve this problem, though!
