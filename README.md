#Paper Boy Routes!

This is a simple routing system for non-shitty browsers. That is browsers that support addEventListener and window.location.hash. It doesn't use fancy push-state yet, but it does use hash tags.

It's ideal for projects where you don't need a huge library or cross-browser support. Paper Boy is 44 lines of code. 

##Install

```
jam install paperboy
```

```javascript
// Assuming RequireJS
define(function(require){
	var
		PaperBoy = require('paperboy')
	, router 	 = new PaperBoy({
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
			// Paper Boy enter and exit routes share their 'this' objects
		, "weeeee": {
				enter: function(){
					this.hello = "Hello World!!!";
				}
			, exit: function(){
					console.log(this.hell); // "Hello World!!!"
				}
			}
		});
	;
	router.listen();
});
```

##Hey, this doesn't work in Internet Explorer!

I don't give a damn.

