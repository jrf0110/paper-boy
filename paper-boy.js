var constructor = module.exports = function(routes){
  this.enter = {};
  this.exit = {};
  this.scopes = {};
  this.routeTokens = {};
  this.paramIndices = {};
  for (var route in routes){
    if (typeof routes[route] === "object"){
      if (routes[route].hasOwnProperty('enter')) this.addRoute(route, 'enter', routes[route].enter)
      if (routes[route].hasOwnProperty('exit')) this.addRoute(route, 'exit', routes[route].exit);
    } else this.addRoute(route, 'enter', routes[route]);
  }
  this.silent = false;
};

var _utils = constructor._utils = {
  extractRouteTokens: function(url){
    return url.split('/').map(function(val, index){
      var token = {
        type: val[0] == ':' ? 'variable' : 'text'
      , index: index
      };

      if (token.type == 'variable') token.value = val.substring(1);
      else token.value = val;

      return token;
    });
  }
};

constructor.prototype = {
  addRoute: function(route, type, fn){
    if (typeof type === "function"){
      fn = type;
      type = "enter";
    }
    this[type][route] = fn;
    this._addScope(route);
    this.routeTokens[route] = _utils.extractRouteTokens(route);
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
  // This is a hacked together mess. And I don't give a damn
, _onHashChange: function(event){
    var hash = window.location.hash.replace(/\/*#\/*/, "");
    if (!this.silent){
      if (this.exit.hasOwnProperty(this.current)) this.exit[this.current].call(this.scopes[hash]);
      if (this.enter.hasOwnProperty(hash)){
        this.enter[hash].call(this.scopes[hash]);
      } else {
        var exitTokens = _utils.extractRouteTokens(this.current || "");
        var enterTokens = _utils.extractRouteTokens(hash);

        // Check each route tokens for a match
        var filteredTokens = [], url, args;

        // Exit route
        for ( url in this.routeTokens ){
          args = [];
          if (
            url in this.exit &&
            this.routeTokens[ url ].filter( function( token, index ){
              // Filter out variables
              if ( token.type == 'variable' ) filteredTokens.push( index );
              return token.type != 'variable';
            }).map(function(t){ return t.value; }).join('/') == exitTokens.filter( function( token, index ){
              // Filter tokens that would match the positions of variables
              if ( filteredTokens.indexOf( index ) > -1 ) args.push( token.value );
              return filteredTokens.indexOf( index ) == -1;
            }).map(function(t){ return t.value; }).join('/')
          ){ this.exit[url].apply(this.scopes[url], args); break; }
        }

        // Enter route
        for ( url in this.routeTokens ){
          args = [];
          if (
            url in this.enter &&
            this.routeTokens[ url ].filter( function( token, index ){
              // Filter out variables
              if ( token.type == 'variable' ) filteredTokens.push( index );
              return token.type != 'variable';
            }).map(function(t){ return t.value; }).join('/') == enterTokens.filter( function( token, index ){
              // Filter tokens that would match the positions of variables
              if ( filteredTokens.indexOf( index ) > -1 ) args.push( token.value );
              return filteredTokens.indexOf( index ) == -1;
            }).map(function(t){ return t.value; }).join('/')
          ){ this.enter[url].apply(this.scopes[url], args); break; }
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