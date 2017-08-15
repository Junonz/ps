$(function() {

    var validateTrumpForm = function() {
        var errorOccurred = false;

        $('[id$=-error-text] p').text("");

        $('[id$=-error-text]').hide();

        if (!$("#name").val()) {
            $("#name-error-text p").text("Please enter your first name");
            $("#name-error-text").show();
            errorOccurred = true;
        }

        if (!$("#last-name").val()) {
            $("#last-name-error-text p").text("Please enter your last name");
            $("#last-name-error-text").show();
            errorOccurred = true;
        }

        var emailRegexp = /^[a-z0-9!#$%&*+\/=?^_{|}~'-]+(\.[a-z0-9!#$%&*+\/=?^_{|}~'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
        if (! ($("#email").val() && $("#email").val().match(emailRegexp)) ) {
            $("#email-error-text p").text("Please enter a valid email address");
            $("#email-error-text").show();
            errorOccurred = true;
        }

        var phoneRegexp = /^(0|(\+64(\s|-)?)){1}(21|22|27){1}(\s|-)?\d{3}(\s|-)?\d{4}$/;
        var landPhoneRegexp = /^(0|(\+64(\s|-)?)){1}\d{1}(\s|-)?\d{3}(\s|-)?\d{4}$/;
        if ( !$("#phone-number").val() || ( !$("#phone-number").val().match(phoneRegexp) && !$("#phone-number").val().match(landPhoneRegexp) ) ) {
            $("#phone-error-text p").text("Please enter a valid telephone number");
            $("#phone-error-text").show();
            errorOccurred = true;
        };

        return !errorOccurred;
    }

    var serializeFieldsIntoContactForm = function() {
        var fullName = $('form#contact input#name').val() + " " + $('form#contact input#last-name').val();
        var phoneNumber = $('form#contact input#phone-number').val();
        var bestTimeToCall = $('form#contact #time-to-call').find("option:selected" ).text()
        var serializedContent = "Trump follow-up leads: " + "Full Name: " + fullName + "; "  + "Phone Number: " + phoneNumber + "; " + "Best time to call: " + bestTimeToCall;
        $('form#contact input#comment').val(serializedContent);
    }


    $("#contact").on("submit", function(e) {
        if (validateTrumpForm()) {
            serializeFieldsIntoContactForm();
            return true;
        } else {
            return false;
        };
    });

});