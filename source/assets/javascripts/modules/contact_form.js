function checkHoneypot(){
  if ($("#catch-text").val() != "") {
    _gaq.push(['_trackEvent', 'Contact form', 'Honeypot textinput', $("#check-text").val(), 0]);
  }
}

function checkContactForm(){
  var error_occurred = false;
  // clear error text

  $("#name-error-text p").text("");
  $("#email-error-text p").text("");
  $("#comment-error-text p").text("");
  // and hide error divs for good measure
  $("#name-error-text").hide();
  $("#email-error-text").hide();
  $("#comment-error-text").hide();

  // show error: name
  if ($("#name").val() == "") {
    $("#name-error-text p").text("Please enter your name");
    $("#name-error-text").show();
    error_occurred = true;
  }

  // show error: email
  // Email regexp obtained from RFC822::EmailAddress in the app
  var email_regexp = /^[a-z0-9!#$%&*+\/=?^_{|}~'-]+(\.[a-z0-9!#$%&*+\/=?^_{|}~'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
  if (!$("#email").val().match(email_regexp)) {
    $("#email-error-text p").text("Please enter a valid email address");
    $("#email-error-text").show();
    error_occurred = true;
  }
  // show error: comment
  if ($("#comment").val() == "") {
    $("#comment-error-text p").text("Please enter your comments");
    $("#comment-error-text").show();
    error_occurred = true;
  }

  checkHoneypot();

  return !error_occurred;
}

function checkLeaveDetailsForm() {
  var error_occurred = false;
  // clear error text

  $('[id$=-error-text] p').text("");

  // and hide error divs for good measure

  $('[id$=-error-text]').hide();

  // show error: name
  if ($("#name").val() == "") {
    $("#name-error-text p").text("Please enter your name");
    $("#name-error-text").show();
    error_occurred = true;
  }
  // show error: email
  // Email regexp obtained from RFC822::EmailAddress in the app
  var email_regexp = /^[a-z0-9!#$%&*+\/=?^_{|}~'-]+(\.[a-z0-9!#$%&*+\/=?^_{|}~'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
  if (!$("#email").val().match(email_regexp)) {
    $("#email-error-text p").text("Please enter a valid email address");
    $("#email-error-text").show();
    error_occurred = true;
  }

  // only required if contact via phone has been selected
  // show error: phone
  if ($("#via-phone").is(':checked')) {
    if ($("#phone").val() == "") {
      $("#phone-error-text p").text("Please enter your phone number");
      $("#phone-error-text").show();
      error_occurred = true;
    }
    // show error: time
    if ($("#time").val() == "") {
      $("#time-error-text p").text("Please enter a good time for us to call");
      $("#time-error-text").show();
      error_occurred = true;
    }
  }

  // show error: name
  if ($("#via-phone").prop('checked') == false && $("#via-email").prop('checked') == false) {
    $("#contact-method-error-text p").text("Please select at least one");
    $("#contact-method-error-text").show();
    error_occurred = true;
  }

  return !error_occurred;
}

// Reusing the existing contact form for the promo 'leave your details' form which creates a ticket via a post to the secure app.
// We have a few new fields so will concatenate them into the one comment field so that there is no need for any backend changes.

function squashCommentFields() {
  var phone_val = $('form#contact input#phone').val();
  var time_val = $('form#contact input#time').val();
  var contact_method_val = ($("form#contact input#via-phone").is(':checked') ? "via-phone" : "") + ($("form#contact input#via-email").is(':checked') ? " via-email" : "");
  var promo_name = $('form#contact').attr("name");
  var new_comment_val = "Promo: " + promo_name + " Phone: " + phone_val + " Good time to call: " + time_val + " Preferred contact method: " + contact_method_val
  $('form#contact input#comment').val(new_comment_val);
}

// show/hide the phone fields in contact_leave_details
$( document ).ready(function() {
  if (!$('form#contact #via-phone').is(':checked'))  {
    $('form#contact #via-phone').click(function() {
      $('.phone-fields').slideToggle();
    });
  }
});
