$(function(){var t=function(){var t=!1;$("[id$=-error-text] p").text(""),$("[id$=-error-text]").hide(),$("#name").val()||($("#name-error-text p").text("Please enter your first name"),$("#name-error-text").show(),t=!0),$("#last-name").val()||($("#last-name-error-text p").text("Please enter your last name"),$("#last-name-error-text").show(),t=!0);var e=/^[a-z0-9!#$%&*+\/=?^_{|}~'-]+(\.[a-z0-9!#$%&*+\/=?^_{|}~'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;$("#email").val()&&$("#email").val().match(e)||($("#email-error-text p").text("Please enter a valid email address"),$("#email-error-text").show(),t=!0);var a=/^(0|(\+64(\s|-)?)){1}(21|22|27){1}(\s|-)?\d{3}(\s|-)?\d{4}$/,r=/^(0|(\+64(\s|-)?)){1}\d{1}(\s|-)?\d{3}(\s|-)?\d{4}$/;return $("#phone-number").val()&&($("#phone-number").val().match(a)||$("#phone-number").val().match(r))||($("#phone-error-text p").text("Please enter a valid telephone number"),$("#phone-error-text").show(),t=!0),!t},e=function(){var t=a("transaction_id"),e=$("form#contact input#name").val()+" "+$("form#contact input#last-name").val(),r=$("form#contact input#phone-number").val(),n=$("form#contact input#address").val(),o=$("form#contact #time-to-call").find("option:selected").text(),i="Residential outbound sales lead: Full Name: "+e+"; Transaction ID: "+t+"; Phone Number: "+r+"; Address: "+n+"; Best time to call: "+o;$("form#contact input#comment").val(i)},a=function(t){for(var e=window.location.search.substring(1),a=e.split("&"),r=0;r<a.length;r++){var n=a[r].split("=");if(n[0]===t)return n[1]}},r=function(){var t=a("transaction_id");$.get("http://tracking.jackmedia.com.au/SP1qp?transaction_id="+t)};$("#contact").on("submit",function(){return!!t()&&(e(),r(),!0)})});