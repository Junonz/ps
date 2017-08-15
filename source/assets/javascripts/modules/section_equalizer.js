// Set section to have the same height
function sections_equalizer() {

  var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  var sections = [];
  sections = $( 'section' ).toArray();

  // To no work on mobile/smallcreens
  if (browserWidth >= 720) {

    $(sections).each(function(){
      if(!$(this).hasClass('navigation') && !$(this).hasClass('deals') && !$(this).hasClass('you-cant-lose') && !$(this).hasClass('home-links') && !$(this).hasClass('power-you-can-love') ){

        var browserSize = window.innerHeight;
        var sectionSize = $(this).height();

        if (sectionSize > browserSize) {
          // if($(this).hasClass('shop-view')){
          //   var rowWidth = $(this).find('.row').width();
          //   var size = (browserSize * rowWidth)/sectionSize;
          //   $(this).find('.row').first().css('width', size);
          // }
        }
        else if ( $(this).hasClass('campaign-new-ep') ){
          var top =  $('.navigation').height() + $('.deals').first().height();
          var bottom = $('.home-links').height() + $('.home-links').find('.btn-next svg').height();
          var goal = browserSize - top - bottom;
          $(this).css('height', goal);
        }
        else {

          // Need refactor this part
          // Problem with first section on custtomers
          if ( $(this).hasClass('testimonials') ) {
            var top =  $('.navigation').height() + $('.deals').first().height();
            if (sectionSize > (browserSize - top) ) {
              goal = 0;
            }
            else{
              var goal = (browserSize - sectionSize - top)/2;
            }
          }
          else {
            var goal = (browserSize - sectionSize)/2;
          }

          if ($(this).prev().find('.btn-next-mask').length == 1) {
            var maskSize = $(this).prev().find('.btn-next-mask').height();
            goal = goal - (maskSize/3);
          }

          $(this).css('padding-top', goal);

          if($(this).find('.btn-next')) {
            var btnNext = $(this).find('.btn-next svg').height();
            if ($(this).hasClass('last-section')){
              $(this).find('.row').eq(-2).css('padding-top', (goal - btnNext*2)/2);
              $(this).find('.row').last().css('padding-bottom', (goal - btnNext*2)/2);
            }
            else {
              if(!($(this).is('#campaign'))) {
                $(this).find('.row').first().css('padding-bottom', goal - btnNext*2);
              }
            }
          }

        }
      }
    });
  }
  else {
    $(sections).each(function(){
      if ( $(this).hasClass('campaign-new-ep') ){
        $(this).css('height', 'auto');
      }
    });
  }
}