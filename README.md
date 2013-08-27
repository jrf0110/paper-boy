#Paper Boy Routes!

This is a simple routing system for non-shitty browsers. That is browsers that support addEventListener and window.location.hash. It doesn't use fancy push-state yet, but it does use hash tags.

It's not very good, but you can check it out. The defining feature is the ability to have ```enter``` and ```exit``` routes defined. You should probably use [https://github.com/millermedeiros/crossroads.js](https://github.com/millermedeiros/crossroads.js)

##Install

```
jam install paper-boy
```

```javascript
// Assuming RequireJS
// It doesn't have to be used with require
define(function(require){
  var
    PaperBoy = require('paper-boy')
  , router   = new PaperBoy({
      // Paper Boy has enter and exit routes
      "": {
        enter: function(){
          console.log("Welcome to the home page!");
        }
      , exit: function(){
          console.log("Hope to see you back at the home page soon!");
        }
      }
      // Or if you just want an enter route, don't pass in an obj
    , "some/thing/else": function(){
        // Access the instantiated router object via:
        this._router.navigate("weeeee"); // Redirect to weeeee
      }
      // Standard variables
    , "users/:userId/profiles/:profileType": function(userId, profileType){
        console.log("User:", userId, "Profile:", profileType);
      }
      // Paper Boy enter and exit routes share their 'this' objects
    , "weeeee": {
        enter: function(){
          this.hello = "Hello World!!!";
        }
      , exit: function(){
          console.log(this.hello); // "Hello World!!!"
        }
      }
    });
  ;
  router.listen();
});
```

##Hey, this doesn't work in Internet Explorer!

I don't give a damn.

