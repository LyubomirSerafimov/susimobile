function createEvent(name,time,date){
	//alert(name+" "+time+" "+date);
	var str = '<li data-theme="c" event-time="'+time+'" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-btn-up-c"> <div class="ui-btn-inner ui-li"> <div class="ui-btn-text"> <a href="#eventDialog" data-transition="slide" class="ui-link-inherit">'+name+'<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+time+'</span> </a> </div> <span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span> </div> </li>';
	if(!$("ul[date='"+date+"']").html()){
		var str2 = '<ul data-role="listview" data-divider-theme="b" data-inset="true" date="'+date+'" class="ui-listview ui-listview-inset ui-corner-all ui-shadow"> <li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child"> '+date+' </li></ul>';
		
		var created = false;
		$("ul[date]").each(function(){
			if($(this).attr("date") > date){$(this).before(str2);created=true;return false;}
		});
		if(!created){$("ul[date]:last").after(str2);}
		
	}
	var created = false;
	$("ul[date='"+date+"'] li").each(function( key , el ){
		if($(this).attr("event-time")>time){$(this).before(str);created = true;return false;}
	});
	if(!created){$("ul[date='"+date+"']").append(str);}
	$( "#createEvent" ).panel( "close" );
	//$("ul[date='"+date+"'] li[event-time='"+time+"'] a").html(name);
	//$("ul[date='"+date+"'] li[event-time='"+time+"'] a span").html(time);
}

$(document).ready(function(){
	$("#addEventOk").click(function(){
		try{
		if($.trim($("#eventName").val())==""){throw "Event Name Required"; return;}
		if($.trim($("#eventTime").val())==""){throw "Event Time required"; return;}
		if($.trim($("#eventDate").val())==""){throw "Event Date Required"; return;}
		createEvent($.trim($("#eventName").val()),$.trim($("#eventTime").val()),$.trim($("#eventDate").val()));
		}catch(e){alert(e);}
	});
	var eventToEdit = {id:""};
	$("ul li[role!='heading']").on('click', function(){
		s = $.trim($(this).children().find("a").text().replace($(this).children().find("span").html(),''));
		$("#editEventName").val(s);
		s = $.trim($(this).children().find("span").text());
		$("#editEventTime").val(s);
		s = $.trim($(this).parent().attr("date"));
		$("#editEventDate").val(s);
		eventToEdit = $(this);
		
	});
	$("#editEventSave").click(function(){
		eventToEdit.attr("event-time",$("#editEventTime").val());
		eventToEdit.html('<div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#eventDialog" data-transition="slide" class="ui-link-inherit">'+$("#editEventName").val()+'<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+$("#editEventTime").val()+'</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div>');
		eventToEdit.parent().attr("date",$("#editEventDate").val());
		$( "#eventDialog" ).panel( "close" );
	});
});
