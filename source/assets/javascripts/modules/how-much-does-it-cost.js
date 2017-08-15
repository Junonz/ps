$(document).ready(function() {
  $('#available-network-areas-form').on('submit', function(){
    window.location = $('#available-network-areas').val()

    return false
  })

  $('#show-refine-selection').on('click', function(e) {
    e.preventDefault()

    $("#tell-us-more").hide()
    $("#refine-details").fadeIn()
  })

  $('#refine-details-form').on('submit', function(e){
    e.preventDefault()

    $('.consumption-band').hide()
    $('.' + $('input[name=user-type]:checked').val()).show()

    scrollToPriceCharge()
  })

  $('#show-price-breakdown, .over-year-info').on('click', function(e) {
    e.preventDefault()

    showPriceBreakdown()
    scrollToPriceBreakdown()
  })
})

function showPriceBreakdown() {
  $('#see-your-prices').hide();
  $('#price-breakdown').fadeIn();
}

function scrollToPriceCharge() {
  $("html, body").animate({ scrollTop: $("#price-result").offset().top }, 1000);
}

function scrollToPriceBreakdown() {
  $("html, body").animate({ scrollTop: $("#price-breakdown").offset().top }, 1000);
}
