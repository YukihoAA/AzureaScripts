//by @SinaMafuyu

var MessageBox = true;			//뮤트 확인 대화상자 사용 여부.
var MuteUser = [ ];

var mode = eval(System.settings.getValue('user.Fillter', 'Mmode'));

var preFilerFunc = function(status) {
	var mysn = TwitterService.currentUser.screen_name;
	if(mode == 0)
		return false;
	else if(status.user.screen_name == mysn)
		return false;
	else if((mode == 3) && status.text.indexOf(mysn) >= 0)
		return false;
	else if(MuteUser.indexOf(status.user.screen_name) != -1)
	{
		return true;
	}
	else if(MuteUser.indexOf(status.retweeted_by) != -1)
	{
		return true;
	}
	else if(mode >	1)
		return MuteUser.indexOfs(status.text);
	return false;
};

TwitterService.addEventListener("preFilterProcessTimelineStatus",preFilerFunc);

System.addKeyBindingHandler('M'.charCodeAt(0), 4, function(id){
	if (mode == 0 | !mode)
	{
		System.settings.setValue('user.Fillter', 'Mmode', 1);
		System.settings.reconfigure();
		System.showNotice('뮤트 대상의 모든 트윗을 뮤트합니다.');
		mode = 1;
	}
	else if (mode == 1)
	{
		System.settings.setValue('user.Fillter', 'Mmode', 2);
		System.settings.reconfigure();
		System.showNotice('뮤트 대상의 모든 트윗과 대상에게 하는 멘션을 뮤트합니다.');
		mode = 2;
	}
	else if (mode == 2)
	{
		System.settings.setValue('user.Fillter', 'Mmode', 3);
		System.settings.reconfigure();
		System.showNotice('나에게 한 멘션을 제외한 트윗을 뮤트합니다.');
		mode = 3;
	}
	else
	{
		System.settings.setValue('user.Fillter', 'Mmode', 0);
		System.settings.reconfigure();
		System.showNotice('모든 트윗을 뮤트하지 않습니다');
		mode = 0;
	}
});

Array.prototype.indexOf = function(s)
{
	for (var i = 0; i < this.length; ++i )
		if(this[i] == s) return i;

	return -1;
};

Array.prototype.indexOfs = function(s)
{
	for (var i = 0; i < this.length; ++i )
		if(s.indexOf(this[i]) >=0 ) return true;

	return false;
};

if(FileSystem.privateStore.exists('list.txt')){
	var value = FileSystem.privateStore.read('list.txt');
	if(value != ''){
		MuteUser.sort();
		MuteUser = value.split('\n');
	}
}
else
{
	FileSystem.privateStore.write('list.txt', "", 3);
}

System.addEventListener('quit', function(){
	var value = MuteUser.join('\n');
	if(value[0] == '\n') value = value.slice(1);
	FileSystem.privateStore.write('list.txt', value, 3);
});

System.addKeyBindingHandler('M'.charCodeAt(0), 0, function(id){
	var status = TwitterService.status.get(id);
	if (!status) return;
	var s = status.user.screen_name;
	var tmp = [ ];
	var yn = 0x06;
	if(MuteUser.indexOf(s)<0){
		if(MessageBox)
			yn=System.showMessage(s + "를 뮤트하시겠습니까?", "Mute Script - @SinaMafuyu", 0x04 );
		if(yn==0x06){
			MuteUser.push(s);
			System.showNotice(s + '를 뮤트합니다.');
		}
	}
	else {
		if(MessageBox)
			yn=System.showMessage(s + "를 뮤트하지 않겠습니까?", "Mute Script - @SinaMafuyu", 0x04 );
		if(yn==0x06)
		{
			for (var i = 0,j = 0; i < MuteUser.length; i++ )
			{
				if(MuteUser[i] == s) 
				{
					continue;
				}
				tmp[j++]=MuteUser[i];
			}
			MuteUser=tmp;
			System.showNotice(s + '를 뮤트하지 않습니다.');
		}
	}
TwitterService.addEventListener("preFilterProcessTimelineStatus",preFilerFunc);
});

System.addKeyBindingHandler('M'.charCodeAt(0), 2, function(id){
	var s = System.inputBox("뮤트 할 아이디", "", false);
	
	if(s == undefined)
		return;
	if(MuteUser.indexOf(s)<0){
		MuteUser.push(s);
		System.showNotice(s + '를 뮤트합니다.');
	}
TwitterService.addEventListener("preFilterProcessTimelineStatus",preFilerFunc);
});
System.addKeyBindingHandler('M'.charCodeAt(0), 1, function(id){
	var s = System.inputBox("뮤트 해제할 아이디", "", false);
	var tmp = [ ];

	if(s == undefined)
		return;
	for (var i = 0,j = 0; i < MuteUser.length; ++i )
	{
		if(MuteUser[i] == s) 
		{
			continue;
		}
		tmp[j++]=MuteUser[i];
	}
	MuteUser=tmp;
	System.showNotice(s + '를 뮤트하지 않습니다.');
TwitterService.addEventListener("preFilterProcessTimelineStatus",preFilerFunc);
});
