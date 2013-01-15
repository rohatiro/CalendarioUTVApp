var context;
var web;
var lists;

$(document).ready(function () {
	var spHostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
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
	getEventos();
}

function getEventos() {
	var calUTV = lists.getByTitle('CalendarioUTV');
	var query = new SP.CamlQuery();
	query.set_viewXml("<View>"+
						"<Query>"+
							"<OrderBy>"+
								"<FieldRef Name='EventDate' Ascending='False' />"+
							"</OrderBy>"+
						"</Query>"+
						"<RowLimit>4</RowLimit>" +
					"</View>");
	this.colllistitem = calUTV.getItems(query);

	context.load(colllistitem);
	context.executeQueryAsync(Function.createDelegate(this, this.successGetEventos), Function.createDelegate(this, this.errorGetEventos));
}

function successGetEventos(){
	var listEnumerator = colllistitem.getEnumerator();

	while(listEnumerator.moveNext()){
		var calUTVItem = listEnumerator.get_current();
		var evento = "";
		var fecha_ini = new Date(calUTVItem.get_item('EventDate'));
		fecha_ini = fecha_ini.toString('dddd dd') + " de " + fecha_ini.toString('MMMM') + " del " + fecha_ini.toString('yyyy') + " a las " + fecha_ini.toString('HH:mm');
		var fecha_fin = new Date(calUTVItem.get_item('EndDate'));
		fecha_fin = fecha_fin.toString('dddd dd') + " de " + fecha_fin.toString('MMMM') + " del " + fecha_fin.toString('yyyy') + " a las " + fecha_fin.toString('HH:mm');
		evento += "Titulo: " + calUTVItem.get_item('Title') + "\n";
		evento += "Fecha de Inicio: " + fecha_ini + "\n";
		evento += "Fecha de Finalización: " + fecha_fin + "\n";
		alert(evento);
	}
}

function errorGetEventos(){
	alert('No');
}