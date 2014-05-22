//@SinaMafuyu (Orig.@RyuaNerin)
//Filtering Retweets

var modify = eval(System.settings.getValue('user.Fillter', 'modify'));

if (modify == 0 | !modify)
	System.showNotice('모든 리트윗을 필터링하지 않습니다');
else if (modify == 1)
	System.showNotice('수동 리트윗을 필터링합니다. (QT, RT로 시작하는 트윗)');
else if (modify == 2)
	System.showNotice('모든 수동 리트윗을 필터링합니다.');
else if (modify == 3)
	System.showNotice('공식 리트윗을 필터링합니다.');
else
	System.showNotice('모든 리트윗을 필터링합니다');

TwitterService.addEventListener('preFilterProcessTimelineStatus', 
	function(status)
	{
		if (!status.retweeted || modify == 3 || modify == 4)
		{
			if (modify == 1)
			{
				if (status.text.match('^RT \@.*|^QT \@.*'))
					return true;
				else
					return false;
			}
			else if (modify == 2)
			{
				if (status.text.match('RT \@.*|QT \@.*'))
					return true;
				else
					return false;
			}
			else if (modify == 3)
			{
				if(status.retweeted){
					var v=System.views.getView(0, null).getItem(status.id);
					if(v)
						return true;
				}
				return false;
			}
			else if (modify == 4)
			{
				if (status.text.match('RT \@.*|QT \@.*'))
					return true;
				if(status.retweeted){
					var v=System.views.getView(0, null).getItem(status.id);
					if(v)
						return true;
				}
				return false;
			}
		}
	}
);

System.addKeyBindingHandler('Q'.charCodeAt(0), 1, 
	function()
	{
		if (modify == 0 | !modify)
		{
			System.settings.setValue('user.Fillter', 'modify', 1);
			System.settings.reconfigure();
			System.showNotice('수동 리트윗을 필터링합니다 (QT, RT로 시작하는 트윗)');
			modify = 1;
		}
		else if (modify == 1)
		{
			System.settings.setValue('user.Fillter', 'modify', 2);
			System.settings.reconfigure();
			System.showNotice('모든 수동 리트윗을 필터링합니다');
			modify = 2;
		}
		else if (modify == 2)
		{
			System.settings.setValue('user.Fillter', 'modify', 3);
			System.settings.reconfigure();
			System.showNotice('공식 리트윗을 필터링합니다');
			modify = 3;
		}
		else if (modify == 3)
		{
			System.settings.setValue('user.Fillter', 'modify', 4);
			System.settings.reconfigure();
			System.showNotice('모든 리트윗을 필터링합니다');
			modify = 4;
		}
		else
		{
			System.settings.setValue('user.Fillter', 'modify', 0);
			System.settings.reconfigure();
			System.showNotice('모든 리트윗을 필터링하지 않습니다');
			modify = 0;
		}
	}
);
