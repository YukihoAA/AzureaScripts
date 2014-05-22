//@SinaMafuyu (Orig.@RyuaNerin)
//Mute Retweets Only on HomeTimeLine

TwitterService.addEventListener("preFilterProcessTimelineStatus",function(status) {
if(status.retweeted && System.views.currentView==0){
var v=System.views.getView(0, null).getItem(status.id);
if(v)
return true;
}
return false;}
);
