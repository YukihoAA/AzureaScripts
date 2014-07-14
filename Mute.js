//by SinaMafuyu - SinaMafuyu@SinaMafuyu.net

var MuteUser = [ ];
var MuteUser_hash = { };

if(FileSystem.privateStore.exists('list.txt')){
	var value = FileSystem.privateStore.read('list.txt');
	if(value != ''){
		MuteUser = value.split('\n');
		MuteUser.sort();
		for(var i = 0; i < MuteUser.length; ++i) MuteUser_hash[MuteUser] = 1;
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
	if(MuteUser_hash[s] == undefined){
		MuteUser_hash[s] = 1;
		MuteUser.push(s);
		MuteUser.sort();
		System.showNotice(s + '를 뮤트합니다.');
	}
	else {
		for (var i = 0,j = 0; i < MuteUser.length; ++i )
		{
			if(MuteUser[i] == s) 
			{
				continue;
			}
			tmp[j++]=MuteUser[i];
		}
		MuteUser=tmp;
		delete MuteUser_hash[s];
		System.showNotice(s + '를 뮤트하지 않습니다.');
	}
});

System.addKeyBindingHandler('M'.charCodeAt(0), 2, function(id){
	var s = System.inputBox("뮤트 할 아이디", "", false);
	
	if(s == undefined)
		return;
	if(MuteUser_hash[s] == undefined){
		MuteUser_hash[s] = 1;
		MuteUser.push(s);
		MuteUser.sort();
		System.showNotice(s + '를 뮤트합니다.');
	}
});
System.addKeyBindingHandler('M'.charCodeAt(0), 1, function(id){
	var s = System.inputBox("뮤트 해제할 아이디", "", false);
	var tmp = [ ];

	if(s == undefined)
		return;
	for (var i = 0,j = 0; i < MuteUser.length; i++ )
	{
		if(MuteUser[i] == s) 
		{
			continue;
		}
		tmp[j++]=MuteUser[i];
	}
	for (var i = 0,j = 0; i < tmp.length; i++ )
	{
		MuteUser[j++]=tmp[i];
	}
	delete MuteUser_hash[s];
	System.showNotice(s + '를 뮤트하지 않습니다.');
});

Array.prototype.indexOf = function(s)
{
	for (var i = 0; i < this.length; ++i )
		if(this[i] == s) return i;

	return -1;
};

TwitterService.addEventListener("preFilterProcessTimelineStatus",function(status) {
	if(MuteUser.indexOf(status.user.screen_name) != -1)
	{
		var v=System.views.getView(0, null).getItem(status.id);
		if(v)
			return true;
	}
	return false;
});
