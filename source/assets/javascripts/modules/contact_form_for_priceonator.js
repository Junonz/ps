$(function() {

    $("#sendRate").on("click", function(event){
        event.preventDefault();
        $("#contact").fadeIn();
        $(this).hide();
    });

    var validatePriceonatorForm = function() {
        var errorOccurred = false;

        $('[id$=-error-text] p').text("");

        $('[id$=-error-text]').hide();

        if (!$("#name").val()) {
            $("#name-error-text p").text("Please enter your name");
            $("#name-error-text").show();
            errorOccurred = true;
        }

        var emailRegexp = /^[a-z0-9!#$%&*+\/=?^_{|}~'-]+(\.[a-z0-9!#$%&*+\/=?^_{|}~'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
        if (! ($("#email").val() && $("#email").val().match(emailRegexp)) ) {
            $("#email-error-text p").text("Please enter a valid email address");
            $("#email-error-text").show();
            errorOccurred = true;
        }

        if (!$("#comment").val()) {
            $("#comment-error-text p").text("Please enter your message");
            $("#comment-error-text").show();
            errorOccurred = true;
        }

        return !errorOccurred;
    }

    var priceonatorIdentifier = function() {
        var message = $('form#contact textarea#comment').val();
        var priceonatorMessage = "Price-o-nator Query: " + message;
        $('form#contact textarea#comment').val(priceonatorMessage);
    }

    $("#contact").on("submit", function(e) {
        if (validatePriceonatorForm()) {
            priceonatorIdentifier();
            return true;
        } else {
            return false;
        };
    });

});