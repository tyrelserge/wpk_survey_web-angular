function init() {
  this.windowResize();
  window.addEventListener('resize', windowResize);
}

windowResize = function() {
    contentSideResize();
}

contentSideResize = function() {

  var contentElement = document.querySelector('#content')
  var contentPrimaryElem = document.querySelector('#content-primary')
  var sideElement = document.querySelector("#content-side");

  if (sideElement==null) {
    return;
  }

  var navbarElement = document.querySelector('.navbar');
  var navbarSecondaryElem = document.querySelector('.navbar-secondary');
  var footerElement = document.querySelector('footer');

  var bindingElements = navbarElement.offsetHeight + navbarSecondaryElem.offsetHeight + footerElement.offsetHeight;

  var spacing = 80;
  var sideHeight = window.innerHeight - bindingElements - spacing;

  if (sideHeight < contentPrimaryElem.offsetHeight) {
    sideHeight = contentPrimaryElem.offsetHeight;
  }

  sideElement.style.height = sideHeight + 'px';

  setTimeout(function () {
    contentSideResize()
  }, 5000)

}

window.onload = init;
