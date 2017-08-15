$(document).ready(function() {
    $('.questions-answered .q a').click(function(event) {
        event.preventDefault();
        $(this).parent().next().slideToggle("fast");
        $(this).parent().children("img").toggleClass( "arrow-down" );
    });


    // used on promo pages only
    $('#got-questions-link').click(function(event) {
      event.preventDefault();
      $('#got-questions').slideToggle(500);
    })
});
