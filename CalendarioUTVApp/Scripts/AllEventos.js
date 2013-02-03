var siteSP = location.protocol + "//" + location.hostname;
var maxchar = 250;
var context;
var userid;
var user;

// Este código se ejecuta cuando el DOM está preparado y crea un objeto de contexto necesario para poder usar el modelo de objetos de SharePoint
$(document).on("ready", function () {
    var spHostUrl = decodeURIComponent(siteSP);
    var layoutsRoot = spHostUrl + '/_layouts/15/';
    $.getScript(layoutsRoot + "SP.Runtime.js", function () {
        $.getScript(layoutsRoot + "SP.js", sharepointReady);
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

function sharepointReady() {
    context = new SP.ClientContext("/");

    getUserId();

    createQuery($('.eight.columns select option:selected').text());
    
    $('.eight.columns select').change(function(){
        createQuery($('option:selected', this).text());
    });
    
}

function createQuery(option){
    var query = "/_api/web/lists/getByTitle('CalendarioUTV')/items?$select=EventDate,ID,Title,LikesCount,Lugar,Description,TaxKeyword,LikedById&$orderby=EventDate desc";
    if(option != 'Todos')
        query += "&$filter=Category eq '" + option + "'";
    geteventos(query);
}

function geteventos(query) {
    var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    var requestUrl = siteSP + query;

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            showeventos(data.d.results);
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

function showeventos(eventos) {
    var listEventos = "";
    var EventoPage = siteSP + "/SitePages/Evento.aspx?eventoID=";
    var count = eventos.length;

    for (var i in eventos) {

        var Nolikes = 0;
        var isLiked = false;
        var classDisplay = "style='display:inline-block'";
        var classNonDisplay = "style='display:none'";
        var urlkey = siteSP + "/_layouts/15/osssearchresults.aspx?k=%23";
        var fecha = new Date(eventos[i].EventDate);
        var hora = fecha.getTimezoneOffset();
        var date = fecha.addMinutes(hora);
        var evtPic = evtPicture(eventos[i].ID);

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
                                        "<span>" + date.toString('dd') + " de " + date.toString("MMMM") + "</span></div></div>"+
                                "<div class='lugar'><b>Lugar: </b>"+eventos[i].Lugar+"</div>" +
                                "<div class='comunicado sinopsis'>" + eventos[i].Description + 
                                    "</div><a href='" + EventoPage + eventos[i].ID + "'>Leer Mas</a><div class='tags'>";


        for (var j in eventos[i].TaxKeyword.results){
            comunicado += "<a target='_parent' href='"+ urlkey + eventos[i].TaxKeyword.results[j].Label.replace("#","")+"'>"+eventos[i].TaxKeyword.results[j].Label.replace("#","")+"</a>"
        }

        if(eventos[i].LikesCount != null && eventos[i].LikesCount != 0) {
            Nolikes = parseInt(eventos[i].LikesCount);

            for(var s in eventos[i].LikedById.results){
            if(eventos[i].LikedById.results[s] == userid)
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
        evtPicture(eventos[i].ID);
        //alert(eventos[i].LikesCount);
    }

    $('.wrapper').pajinate({
        items_per_page: 5,
        items_id: '.obj-comunicado',
        nav_panel_id: '.paginador-id',
        nav_label_first: '«',
        nav_label_last: '»',
        nav_label_next: '›',
        nav_label_prev: '‹'
    });

    $('.results').html("<b>Resultados " + count + " eventos</b>");

    $('.obj-comunicado .evento .indicadores .likes .image a').on("click", function(){
        setLikes($(this).attr("id"));
        $(this).parent().hide();
        $(this).parent().parent().find('.unlike').show();
        $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)+1 });
    });

    $('.obj-comunicado .evento .indicadores .likes .unlike a').on("click", function(){
        setUnlikes($(this).attr("id"));
        $(this).parent().hide();
        $(this).parent().parent().find('.image').show();
        $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)-1 });
    });
}

function evtPicture(evtID){
    var requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    //var requestUrl = siteSP + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=Principal,EncodedAbsUrl&$orderby=Created desc&$select=Evento/Id&$expand=Evento/Id&$filter=(Evento/Id eq "+evtID+") and (Principal ne true)";
    var requestUrl = siteSP + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=EventoId,EncodedAbsUrl&$orderby=Created desc&$filter=(Evento/Id eq "+evtID+") and (Principal ne true)&$top=1";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            // alert(data.d.results);
            var returnValue;
            if(data.d.results[0] != undefined){
                $('.imagen.'+ data.d.results[0].EventoId).css("background", "url(" + data.d.results[0].EncodedAbsUrl+") no-repeat center center");
                $('.imagen.'+ data.d.results[0].EventoId).css("background-size", "100% 100%");
            }
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
}

function getUserId(){
    user = context.get_web().get_currentUser();
    context.load(user);
    context.executeQueryAsync(successgetUserId, errorgetUserId);
}

function successgetUserId() {
    userid = user.get_id();
}

function errorgetUserId(sender, args) {
    alert('Request failed. ' + args.get_message());
}