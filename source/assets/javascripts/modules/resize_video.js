// Resize video
// Making sure users with small screen will always be able to see the whole video and the arrow (next button)
function resize_video() {
  var browserSize = window.innerHeight;
  var topSize = $('.navigation').height() + $('.deals').height();
  var paddings = $('.intro-video .row').innerHeight() - $('.intro-video .row').height();
  var btnNextMask = $('.btn-next-mask').height();
  var btnNext = $('.btn-next svg').height()*2;
  var rowSize = $('.intro-video .row').innerHeight() + btnNextMask;

  // 16:9 Is the video ratio
  var goal = (browserSize - topSize - paddings - btnNextMask)*16;
  goal = goal/9;

  // 768 is the smaller height in the top 10 screen sizes on desktop
  // Browser size should be a bit less than
  if (browserSize >= 720) {
    if (rowSize >= (browserSize - topSize) ) {
      $('.intro-video .row').css('width', goal);      
    }
  }
}