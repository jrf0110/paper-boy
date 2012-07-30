(function(){
  var PaperBoy = (function(){
    var _utils = {
      extractRouteArray: function(route){
        var parts = route.split('/');
        if (parts[0] == "") parts.shift();
        if (parts[parts.length - 1] == "") parts.pop();
        return parts;
      }
    };

    var constructor = function(routes){
      this.enter = {};
      this.exit = {};
      this.scopes = {};
      this.paramIndices = {};
      for (var route in routes){
        if (typeof routes[route] === "object"){
          if (routes[route].hasOwnProperty('enter')) this.enter[route] = routes[route].enter;
          if (routes[route].hasOwnProperty('exit')) this.exit[route] = routes[route].exit;
        }else this.enter[route] = routes[route];
        this._addScope(route);
      }
      this.silent = false;
    };
    constructor.prototype = {
    , addRoute: function(route, type, fn){
        if (typeof type === "function"){
          fn = type;
          type = "enter";
        }
        this[type][route] = fn;
        this._addScope(route);
        var routeArray = _utils.extractRouteArray(route);
        this.paramIndices[route] = {};
        for (var i = 0; i < routeArray.length; i++){
          if (routeArray[i][0] !== ":") continue;
          this.paramIndices[route][routeArray[i].substring(1)] = i;
        }
        return this;
      }
    , navigate: function(route, silent){
        this.silent = !!silent;
        window.location.hash = route;
        return this;
      }
    , listen: function(route, silent){
        window.addEventListener('hashchange', this._onHashChange.bind(this));
        this._onHashChange();
        // For now lets not add the ability to enter a route here
        // this.navigate((typeof route === "string") ? route : window.location.hash, silent);
        return this;
      }
    , stop: function(){
        window.removeEventListener('hashchange', this._onHashChange);
        return this;
      }
    , _onHashChange: function(event){
        var hash = window.location.hash;
        if (!this.silent){
          if (this.exit.hasOwnProperty(this.current)) this.exit[this.current].call(this.scopes[hash]);
          if (this.enter.hasOwnProperty(hash)){
            var enter =
            this.enter[hash].call(this.scopes[hash]);
          }
          if (hash.indexOf(':') > -1){
            var routeArray = _utils.extractRouteArray(), params = this.paramIndices[hash];
            for (var key in params){
              this.scopes[hash].params[key] = params[key];
            }
          }
        }
        this.current = hash;
        this.silent = false;
      }
    , _addScope: function(route){
        this.scopes[route] = { _router: this, params: {} };
      }
    };
    return constructor;
  })();
  if (define) define(function(){ return PaperBoy; });
  else window.PaperBoy = PaperBoy;
})();

/*

/consumer/:consumerId/somethings/:somethingId
/consumer/1234/somethings/a23badaf



 */

var parts = route.split('/');
if (parts[0] == "") parts.shift();
if (parts[parts.length - 1] == "") parts.pop();
var paramIndices = {};
for (var i = 0; i < parts.length; i++){
  if (parts[i][0] !== ":") continue;
  paramIndices[parts[i].substring(1)] = i;
}