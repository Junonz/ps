
$(document).ready(function() { 

  $('#testimonials ul li').click(function(event) {

    event.preventDefault();
    var number = $(this).attr('id').substring(2,1);

    var pinkCircle = $('#t'+number);
    var testimonialWord = $('#testimonial-'+number);

    var words = [];
    words = $( '.words div' ).toArray();

    var images = []
    images = $( '#testimonials ul li' ).toArray();

    $(images).each(function(){
      if ( $(this).find('a div img').hasClass('show') ) {
        if ( $(this).attr('id') == pinkCircle.attr('id') ) { 
        } else {
          $(this).find('a div img').fadeTo(200, 0).removeClass('show');  
        }
      }
    });

    $(words).each(function(){
      if ( $(this).hasClass('open') ) {
        if ( $(this).attr('id') == testimonialWord.attr('id') ) { 
        } else {
          $(this).hide().removeClass('open');
        }
      }
    });

    pinkCircle.find('a div img').fadeTo(200, 1).addClass('show');
    testimonialWord.fadeIn(200).addClass('open');
      
  });


});
