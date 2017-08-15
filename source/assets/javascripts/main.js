$(function(){
  $(document).foundation({
  });
});

// Jquery adds inline width to make slide function works
// this will remove ir if browser scale up
function fix_mobile_menu() {
    $('.main-menu').removeAttr('style');
}

$(window).load(function(){
  if ( $('body').hasClass('index') || $('body').hasClass('our-customers') ){
    sections_equalizer();
  }
});

$(window).resize(function () {
  var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  if (browserWidth > 640) {
    fix_mobile_menu();
  }
  resize_video();
  if ( $('body').hasClass('index') || $('body').hasClass('our-customers') ){
    sections_equalizer();
  }
});

// Check if element is visible on displayPort
function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(document).ready(function(){

  //Scroll to the next section
  $('a#btn-next').on('click', function(event) {

    var margin = 0;
    if($(this).hasClass('btn-next')) {
      margin = Math.abs(parseInt($(this).css('bottom')));
    }

    event.preventDefault();
    var target = $(this).parent().next();

    if( target.length ) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: target.offset().top + margin
        }, 1000);
    }

  });

  // Menu mobile slider
  $('.menu-mobile').click(function(event) {
    $('.main-menu').slideToggle();
  });

});

// determine if screen is 'small'
function isSmall() {
  return matchMedia(Foundation.media_queries.small).matches &&
    !matchMedia(Foundation.media_queries.medium).matches;
}