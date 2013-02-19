var siteSPallevt = location.protocol + "//" + location.hostname;
var maxchar = 250;
var contextallevt;
var calendarIdallevt;
var useridallevt;
var userallevt;

// Este cÃ³digo se ejecuta cuando el DOM estÃ¡ preparado y crea un objeto de contexto necesario para poder usar el modelo de objetos de SharePoint
$(document).on("ready", function () {
    var spHostUrl = decodeURIComponent(siteSPallevt);
    var layoutsRoot = spHostUrl + '/_layouts/15/';
    $.getScript(layoutsRoot + "SP.Runtime.js", function () {
        $.getScript(layoutsRoot + "SP.js", todosEventosCal);
    });
});

/*function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] == urlParameterKey)
            return decodeURIComponent(singleParam[1]);
    }
}*/

function todosEventosCal() {
    var contextApp = new SP.ClientContext.get_current();
    var relUrl = contextApp.get_url();
    contextallevt = new SP.ClientContext(relUrl);
    
    if(relUrl != "/")
        siteSPallevt += relUrl;

    
    calListIdAllEvt();
    getUserIdAllEvt();
}

function calListIdAllEvt(){
    var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    var requestUrl = siteSPallevt + "/_api/web/lists/getByTitle('CalendarioUTV')/ID";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
           calendarIdallevt = "{" + data.d.Id + "}";
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

}

function createQueryAllEvt(option){
    var query = "/_api/web/lists/getByTitle('CalendarioUTV')/items?$select=EventDate,ID,Title,LikesCount,Location,Description,TaxKeyword,LikedById&$orderby=EventDate%20desc";
    if(option != 'Todos')
        query += "&$filter=Category eq '" + option + "'";
    getAllEventos(query);
}

function getAllEventos(query) {
    var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    var requestUrl = siteSPallevt + query;

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            showalleventos(data.d.results);
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

function showalleventos(eventos) {
    var listEventos = "";
    var EventoPage = siteSPallevt + "/SitePages/Evento.aspx?eventoID=";
    var count = eventos.length;
    
    if(eventos != ""){
    for (var i in eventos) {

        var Nolikes = 0;
        var isLiked = false;
        var classDisplay = "style='display:inline-block'";
        var classNonDisplay = "style='display:none'";
        var lugar = "Ninguno";
        var urlkey = siteSPallevt + "/_layouts/15/osssearchresults.aspx?k=%23";
        var fecha = new Date(eventos[i].EventDate);
        var hora = fecha.getTimezoneOffset();
        var date = fecha.addMinutes(hora);
        var evtPic = allEvtPicture(eventos[i].ID);
        var descevt = "Sin Descripci&oacute;n";;
        
        if(eventos[i].Description != null)
            descevt = eventos[i].Description;
            
        if(eventos[i].Location != null)
            lugar = eventos[i].Location;

        var comunicado = "<div class='obj-comunicado'><hr>" +
                            "<div class='imagen "+eventos[i].ID+"'>"+
                                "<a href='"+ EventoPage + eventos[i].ID +"'></a></div>"+
                            "<div class='evento'>"+
                                "<div class='cabeza'>"+
                                    "<div class='calendario'>"+
                                        "<div class='mes'>"+date.toString("MMM")+"</div>"+
                                        "<div class='dia'>"+date.toString("dd")+"</div></div>"+
                                    "<div class='comunicado titulo'>" +
                                        "<h5><a href='" + EventoPage + eventos[i].ID + "'>" + eventos[i].Title + "</a></h5>" +
                                        "<span>" + date.toString('dd') + " de " + date.toString("MMMM") + " de " + date.toString('yyyy') + "</span></div></div>"+
                                "<div class='lugar'><b>Lugar: </b>"+eventos[i].Location+"</div>" +
                                "<div class='comunicado sinopsis'>" + descevt;
                                
        if(eventos[i].Description != null)
            comunicado += "</div><a href='" + EventoPage + eventos[i].ID + "'>Leer m&aacute;s</a><div class='tags'><div class='img_tag'></div>";
        else
            comunicado += "</div><div class='tags'><div class='img_tag'></div>";

        for (var j in eventos[i].TaxKeyword.results){
            comunicado += "<a target='_parent' href='"+ urlkey + eventos[i].TaxKeyword.results[j].Label.replace("#","")+"'>"+eventos[i].TaxKeyword.results[j].Label.replace("#","")+"</a>"
        }

        if(eventos[i].LikesCount != null && eventos[i].LikesCount != 0) {
            Nolikes = parseInt(eventos[i].LikesCount);

            for(var s in eventos[i].LikedById.results){
            if(eventos[i].LikedById.results[s] == useridallevt)
                isLiked = true;
            }
        }

        comunicado += "</div><div class='indicadores'><div class='likes'>";

        if(isLiked) {
            comunicado += "<div class='image' "+classNonDisplay+" ><a id='" + eventos[i].ID +"'></a>"+
                        "</div><div class='unlike' "+classDisplay+" ><a id='" + eventos[i].ID +"'>Unlike</a></div>";
        }
        else {
            comunicado += "<div class='image' "+ classDisplay +" ><a id='" + eventos[i].ID +"'></a>"+
                        "</div><div class='unlike' "+classNonDisplay+"><a id='" + eventos[i].ID +"'>Unlike</a></div>";
        }

        comunicado += "<div class='numero'>"+ Nolikes + "</div></div></div></div></div>";
        listEventos += comunicado;
    }

    $(".list-comunicados").html(listEventos);

    $(".sinopsis").children().find('div').unwrap();

    $('.sinopsis').find('div').hide();

    $('.sinopsis').each(function () {
         $('div:first', this).show();
    });

    $('.sinopsis div').each(function () {
        var content = $(this).html();
        if (content.length > maxchar) {
            var resumen = content.substr(0, maxchar) + "...";
            $(this).html(resumen);
        }
    });

    for(var i in eventos)
    {
        allEvtPicture(eventos[i].ID);
        //alert(eventos[i].LikesCount);
    }
    }
    else{
        $(".list-comunicados").html("<div class='obj-comunicado'>No hay registros de eventos</div>");
    }
    
    $('.wrapper').show();
    
    $('.wrapper').pajinate({
        items_per_page: 5,
        items_id: '.obj-comunicado',
        nav_panel_id: '.paginador-id',
        nav_label_first: '&laquo;',
        nav_label_last: '&raquo;',
        nav_label_next: '&rsaquo;',
        nav_label_prev: '&lsaquo;'
    });

    $('.obj-comunicado .evento .indicadores .likes .image a').on("click", function(){
        setLikes($(this).attr("id"), calendarIdallevt);
        $(this).parent().hide();
        $(this).parent().parent().find('.unlike').show();
        $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)+1 });
    });

    $('.obj-comunicado .evento .indicadores .likes .unlike a').on("click", function(){
        setUnlikes($(this).attr("id"), calendarIdallevt);
        $(this).parent().hide();
        $(this).parent().parent().find('.image').show();
        $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)-1 });
    });
    $('.wrapper .results').html("<b>Resultados " + count + " eventos</b>");
}

function allEvtPicture(evtID){
    var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    //var requestUrl = siteSP + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=Principal,EncodedAbsUrl&$orderby=Created desc&$select=Evento/Id&$expand=Evento/Id&$filter=(Evento/Id eq "+evtID+") and (Principal ne true)";
    var requestUrl = siteSPallevt + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=EventoId,EncodedAbsUrl&$orderby=Created desc&$filter=(Evento/Id eq "+evtID+") and (Principal ne true)&$top=1";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            // alert(data.d.results);
            var returnValue;
            if (typeof(data.d.results[0]) != "undefined") {
                $('.imagen.' + data.d.results[0].EventoId).css("background", "url(" + data.d.results[0].EncodedAbsUrl + ") no-repeat center center");
                $('.imagen.' + data.d.results[0].EventoId).css("background-size", "100% 100%");
            }
            else {
                $('.imagen.' + evtID).css("background", "url(/_layouts/15/images/ltal.png?rev=23) no-repeat center center");
                $('.imagen.' + evtID).css("background-size", "100% 100%").css("background-color","#198ACB");
            }
        },
        error: function (err) {
            $('.imagen.' + evtID).css("background", "url(/_layouts/15/images/ltal.png?rev=23) no-repeat center center");
            $('.imagen.' + evtID).css("background-size", "100% 100%").css("background-color","#198ACB");
        }
    });
}

function getUserIdAllEvt(){
    userallevt = contextallevt.get_web().get_currentUser();
    contextallevt.load(userallevt);
    contextallevt.executeQueryAsync(successgetUserIdAllEvt, errorgetUserIdAllEvt);
}

function successgetUserIdAllEvt() {
    useridallevt = userallevt.get_id();
    
    createQueryAllEvt($('.filtro select option:selected').text());
    
    $('.filtro select').change(function(){
        createQueryAllEvt($('option:selected', this).text());
    });

}

function errorgetUserIdAllEvt(sender, args) {
    alert('Request failed. ' + args.get_message());
}