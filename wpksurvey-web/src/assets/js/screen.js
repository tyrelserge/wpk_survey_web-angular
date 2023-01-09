function acreenInit() {
  this.contentSideResize();
  window.addEventListener('resize', contentSideResize);
}

contentSideResize = function() {

  var contentElement = document.querySelector('#content')
  var contentPrimaryElem = document.querySelector('#content-primary')
  var sideElement = document.querySelector("#content-side");

  if (sideElement==null)
    return;

  var navbarElement = document.querySelector('.navbar');
  var navbarSecondaryElem = document.querySelector('.navbar-secondary');
  var footerElement = document.querySelector('footer');

  var bindingElements = navbarElement.offsetHeight + navbarSecondaryElem.offsetHeight + footerElement.offsetHeight;

  var spacing = 0;
  var sideHeight = window.innerHeight - bindingElements - spacing;

  if (sideHeight < contentPrimaryElem.offsetHeight) {
    sideHeight = contentPrimaryElem.offsetHeight;
  }

  contentElement.style.minHeight = sideHeight + 40 + 'px';

}
