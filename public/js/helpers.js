handlebars.loadPartial = function (name) {
  var partial = handlebars.partials[name];
  if (typeof partial === "string") {
    partial = handlebars.compile(partial);
    handlebars.partials[name] = partial;
  }
  return partial;
};

handlebars.registerHelper("partial",
  function (name, options) {
    /* Look for partial by name. */
    var partial
      = handlebars.loadPartial(name) || options.fn;
    return partial(this, { data : options.hash });
  });