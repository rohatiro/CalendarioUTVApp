var siteSPevt = location.protocol + "//" + location.hostname;
var maxchar = 100;
var contextevt;
var userevt;
var useridevt;
var urlidevt;
var calendarIdevt;

// Este cÃ³digo se ejecuta cuando el DOM estÃ¡ preparado y crea un objeto de contexto necesario para poder usar el modelo de objetos de SharePoint
$(document).on("ready", function () {
    var spHostUrl = decodeURIComponent(siteSPevt);
    var layoutsRoot = spHostUrl + '/_layouts/15/';
    $.getScript(layoutsRoot + "SP.Runtime.js", function () {
        $.getScript(layoutsRoot + "SP.js", eventoCal);
    });
    //sharepointReady();
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

function eventoCal(){
    var contextApp = new SP.ClientContext.get_current();;
    var relUrl = contextApp.get_url();
    contextevt = new SP.ClientContext(relUrl);
    
    if(relUrl != "/")
    	siteSPevt += relUrl;

    
    calListIdEvt();
    getUserIdEvt();   
}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

function calListIdEvt(){
	var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    var requestUrl = siteSPevt + "/_api/web/lists/getByTitle('CalendarioUTV')/ID";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
			calendarIdevt = "{" + data.d.Id + "}";
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

}

function getEventos(){
    var requestHeaders = {"ACCEPT": "application/json;odata=verbose",};
    
    var requestUrl =  siteSPevt + "/_api/web/lists/getByTitle('CalendarioUTV')/items?$select=ID,EventDate,EndDate,Title,Description,LikesCount,LikedById&$filter=ID eq " + urlidevt["eventoID"];

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            var fecha_ini = new Date(data.d.results[0].EventDate);
            //var hora_ini = fecha_ini.getTimezoneOffset();
            //var date_ini = fecha_ini.addMinutes(hora_ini).toString("dd/MM/yyyy h:mm tt");
            var date_ini = fecha_ini.toString("dd/MM/yyyy h:mm tt");

            var fecha_fin = new Date(data.d.results[0].EndDate);
            //var hora_fin = fecha_fin.getTimezoneOffset();
            //var date_fin = fecha_fin.addMinutes(hora_fin).toString("dd/MM/yyyy h:mm tt");
            var date_fin = fecha_fin.toString("dd/MM/yyyy h:mm tt");

            var NoLikes = 0;
            var isLiked = false;
            var descripcion = "Sin Descripci&oacute;n";
            var likes = "<div class='indicadores'><div class='likes'>";

            if(data.d.results[0].LikesCount != null && data.d.results[0].LikesCount != 0) {
                NoLikes = data.d.results[0].LikesCount;

                for(var s in data.d.results[0].LikedById.results){
                    if(data.d.results[0].LikedById.results[s] == useridevt)
                        isLiked = true;
                }
            }
            
            if(data.d.results[0].Description != "<div></div>" && data.d.results[0].Description != null)
            	descripcion = data.d.results[0].Description;

            if(isLiked) {
                likes += "<div class='image' style='display:none'>"+
                "<a id='"+data.d.results[0].ID+"'></a></div>" +
                "<div class='unlike' style='display:inline-block'>"+
                "<a id='"+data.d.results[0].ID+"'>Unlike</a></div>";
            } else {
                likes += "<div class='image' style='display:inline-block'>"+
                "<a id='"+data.d.results[0].ID+"'></a></div>" +
                "<div class='unlike' style='display:none'>"+
                "<a id='"+data.d.results[0].ID+"'>Unlike</a></div>";
            }
            
            likes += "<div class='numero'>"+NoLikes+"</div></div>";

            $('.inicio-pagina .header-page .titulo h1').html(data.d.results[0].Title);
            $('.inicio-pagina .header-page .titulo .fecha_inicio').html("<b>Fecha de Evento: </b><span>"+date_ini+"</span>");
            $('.inicio-pagina .header-page .titulo .fecha_fin').html("<b>Fecha de Finalizaci&oacute;n: </b><span>"+date_fin+"</span>");
            $('.inicio-pagina .header-page .titulo').append(likes);
            $('.inicio-pagina .cuerpo-pagina').html(descripcion);

            $(".cuerpo-pagina").find("div").unwrap();

            $('.inicio-pagina .header-page .titulo .indicadores .likes .image a').on("click", function(){
                setLikes($(this).attr("id"), calendarIdevt);
                $(this).parent().hide();
                $(this).parent().parent().find('.unlike').show();
                $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)+1 });
            });

            $('.inicio-pagina .header-page .titulo .indicadores .likes .unlike a').on("click", function(){
                setUnlikes($(this).attr("id"), calendarIdevt);
                $(this).parent().hide();
                $(this).parent().parent().find('.image').show();
                $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)-1 });
            });
            
            $('.comunicado-id').show();
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

    requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    requestUrl = siteSPevt + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=Principal,EncodedAbsUrl&$orderby=Created desc&$select=Evento/Id&$expand=Evento/Id&$filter=(Evento/Id eq "+ urlidevt["eventoID"] +") and (Principal ne true)";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function(data){
            if (data.d.results[0] != undefined)
                $('.header-page .imagen').css("background", "url(" + data.d.results[0].EncodedAbsUrl + ") no-repeat center center");
            else
                $('.header-page .imagen').css("background", "url('/_layouts/15/images/ltal.png?rev=23') no-repeat center center");
            	$('.header-page .imagen').css("background-size", "100% 100%").css("background-color", "#198ACB");
        },
        error: function(err){
        	$('.header-page .imagen').css("background", "url('/_layouts/15/images/ltal.png?rev=23') no-repeat center center");
			$('.header-page .imagen').css("background-size", "100% 100%").css("background-color", "#198ACB");   
        }

    });
}

function getUserIdEvt(){
	userevt = contextevt.get_web().get_currentUser();
	contextevt.load(userevt);
	contextevt.executeQueryAsync(successgetUserIdEvt, errorgetUserIdEvt);
}

function successgetUserIdEvt(){
	useridevt = userevt.get_id();
	urlidevt = getQueryParams(document.location.search);
    if(urlidevt['eventoID'] != undefined)
		getEventos();
}

function errorgetUserIdEvt(args){
	alert("Error: " + args.get_message());
}