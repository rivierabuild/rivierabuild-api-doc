(function (global) {

  var $global = $(global);
  var content, searchInfo;
  var highlightOpts = { element: 'span', className: 'search-highlight' };
  var index = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    // this.field('tags', { boost: 100 });
    this.field('body');
  });

  $(populate);
  $(bind);

  function populate () {
    $('h1').each(function () {
      var title = $(this);
      var body = title.nextUntil('h1');
      var wrapper = $('<section id="section-' + title.prop('id') + '"></section>');

      title.after(wrapper.append(body));
      wrapper.prepend(title);

      index.add({
        id: title.prop('id'),
        title: title.text(),
        // tags: tags,
        body: body.text()
      });
    });
  }

  function bind () {
    content = $('.content');
    searchInfo = $('.search-info');
    $('#input-search')
      .on('keyup', search)
      .on('focus', active)
      .on('blur', inactive);
  }

  function search (event) {
    var sections = $('section, #toc .tocify-header');

    searchInfo.hide();
    unhighlight();

    // ESC clears the field
    if (event.keyCode === 27) this.value = '';

    if (this.value) {
      sections.hide();
      var results = index.search(this.value);
      if (results.length) {
        $.each(results, function (index, item) {
          $('#section-' + item.ref).show();
          $('.tocify-item[data-unique=' + item.ref + ']').closest('.tocify-header').show();
        });
        highlight.call(this);
      } else {
        sections.show();
        searchInfo.text('No Results Found for "' + this.value + '"').show();
      }
    } else {
      sections.show();
    }

    // HACK trigger tocify height recalculation
    $global.triggerHandler('scroll.tocify');
    $global.triggerHandler('resize');
  }

  function active () {
    search.call(this, {});
  }

  function inactive () {
    unhighlight();
    searchInfo.hide();
  }

  function highlight () {
    if (this.value) content.highlight(this.value, highlightOpts);
  }

  function unhighlight () {
    content.unhighlight(highlightOpts);
  }

})(window);
