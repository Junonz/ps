var flag = 0;

$(window).scroll(function () {

  if ( isScrolledIntoView($("#usage")) && flag==0) {
    $("#specials_star16").hide();
    AdobeEdge.getComposition("EDGE-357241589").getStage().play("start");
    setTimeout( function(){
      AdobeEdge.getComposition("EDGE-357241590").getStage().play("start");
      setTimeout( function(){
        AdobeEdge.getComposition("EDGE-357241591").getStage().play("start");
        setTimeout( function(){
          $("#specials_star16").show();
          AdobeEdge.getComposition("EDGE-357241589").getStage().getSymbol("another-view").play(0);
          AdobeEdge.getComposition("EDGE-357241590").getStage().getSymbol("payment3").play(0);
          AdobeEdge.getComposition("EDGE-357241591").getStage().getSymbol("star16").play(0);
        }, 1500);
      }, 550);
    }, 550);
    
    flag = 1;
  }

});