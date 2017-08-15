$(document).ready(function() {

  // accept T&Cs
  $('#sign_up_now').click(function(event) {
    event.preventDefault();
    if (!$('#accept_ts_and_cs').is(':checked'))  { 
      $('#must_accept_ts_and_cs').slideDown();
      return false;
    };
    $('#promo-form').submit();
    return false;
  });





  // show/hide phone number/leave details
  var d = new Date().toTimeString();
  if ((d>"09:00:01") && (d<"16:59:59")) {
    $("#mobile-call-us").show();
    $("#mobile-leave-details").hide();
  } else {
    $("#mobile-call-us").hide();
    $("#mobile-leave-details").show();
  }

  $('#mobile-signup-online').click(function(event) {
    event.preventDefault();
    $('#promo-form').slideToggle("fast");
    return false;
  });

  function hide_promo_form_if_small() {
    if (isSmall()){
      $('#promo-form').hide();
    } else {
      $('#promo-form').show();
    };
  }

  hide_promo_form_if_small();

});
