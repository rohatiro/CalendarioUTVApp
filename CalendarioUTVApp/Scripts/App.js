var context;
var web;
var lists;
var siteSP = location.protocol + "//" + location.hostname;

$(document).ready(function () {
	var spHostUrl = decodeURIComponent(siteSP);
	var layoutsRoot = spHostUrl + '/_layouts/15/';
	$.getScript(layoutsRoot + "SP.Runtime.js", function () {
		$.getScript(layoutsRoot + "SP.js", sharepointReady);
	});
});

function getQueryStringParameter(urlParameterKey) {
	var params = document.URL.split('?')[1].split('&');
	var strParams = '';
	for (var i = 0; i < params.length; i = i + 1) {
		var singleParam = params[i].split('=');
		if (singleParam[0] == urlParameterKey)
			return decodeURIComponent(singleParam[1]);
	}
}

function sharepointReady() {
	context = new SP.ClientContext('/');
	web = context.get_web();
	lists = web.get_lists();

	selectOption($('.filtro .eight.columns select option:selected').text());

	$('.filtro .eight.columns select').change(function () {
		selectOption($('option:selected', this).text());
	});
}

function selectOption(option){
	var query = "<View><Query>";
	if(option != "Todos") {
		query += "<Where><Eq><FieldRef Name='Category' /><Value Type='Text'>"+option+"</Value></Eq></Where>";
	}
	query += "<OrderBy><FieldRef Name='EventDate' Ascending='False' /></OrderBy></Query><RowLimit>4</RowLimit></View>";
	getEventos(query);
}

function getEventos(eventQuery) {
	var calUTV = lists.getByTitle('CalendarioUTV');
	var query = new SP.CamlQuery();
	query.set_viewXml(eventQuery);
	this.colllistitem = calUTV.getItems(query);

	context.load(colllistitem);
	context.executeQueryAsync(Function.createDelegate(this, this.successGetEventos), Function.createDelegate(this, this.errorGetEventos));
}

function successGetEventos(){
	var listEnumerator = colllistitem.getEnumerator();
	var eventos = "";
	var EventoPage = siteSP + "/SitePages/Evento.aspx?eventoID=";

	while(listEnumerator.moveNext()){
		var calUTVItem = listEnumerator.get_current();
		var fecha_evt = new Date(calUTVItem.get_item('EventDate'));

		eventos += "<div class='evento'><div class='fecha three'>";
		eventos += "<div class='mes sixteen'>" + fecha_evt.toString('MMM') + "</div>";
		eventos += "<div class='dia sixteen'>" + fecha_evt.toString('dd') + "</div></div>";
		eventos += "<div class='texto thirteen'><div class='titulo'><a target='_top' href='"+EventoPage+calUTVItem.get_item('ID')+"' class='linkStyle1'>" + calUTVItem.get_item('Category') + "</a></div>";
		eventos += "<div class='desc'>" + calUTVItem.get_item('Title') + "</div></div></div>"
	}
	$('.eventos.sixteen.columns').html(eventos);
}

function errorGetEventos(){
	alert('No');
}