$(function() {

    var validateJackMediaForm = function() {
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
        var transactionId = getURLParameter("transaction_id");
        var fullName = $('form#contact input#name').val() + " " + $('form#contact input#last-name').val();
        var phoneNumber = $('form#contact input#phone-number').val();
        var address = $('form#contact input#address').val();
        var bestTimeToCall = $('form#contact #time-to-call').find("option:selected" ).text()
        var serializedContent = "Residential outbound sales lead: " + "Full Name: " + fullName + "; " + "Transaction ID: " + transactionId + "; "  + "Phone Number: " + phoneNumber + "; " + "Address: " + address + "; " + "Best time to call: " + bestTimeToCall;
        $('form#contact input#comment').val(serializedContent);
    }

    var getURLParameter = function(parameter) {
        var pageUrl = window.location.search.substring(1);
        var urlVariables = pageUrl.split('&');
        for (var i = 0; i < urlVariables.length; i++) {
            var parameterName = urlVariables[i].split('=');
            if (parameterName[0] === parameter) {
                return parameterName[1];
            }
        }
    }

    var notifyJackMediaAboutFormSubmission = function() {
        var transactionId = getURLParameter("transaction_id");
        $.get("http://tracking.jackmedia.com.au/SP1qp?transaction_id=" + transactionId);
    }

    $("#contact").on("submit", function(e) {
        if (validateJackMediaForm()) {
            serializeFieldsIntoContactForm();
            notifyJackMediaAboutFormSubmission();
            return true;
        } else {
            return false;
        };
    });

});