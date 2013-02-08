var siteSP = location.protocol + "//" + location.hostname;
var maxchar = 100;
var context;
var user;
var userid;

// Este código se ejecuta cuando el DOM está preparado y crea un objeto de contexto necesario para poder usar el modelo de objetos de SharePoint
$(document).on("ready", function () {
    var spHostUrl = decodeURIComponent(siteSP);
    var layoutsRoot = spHostUrl + '/_layouts/15/';
    $.getScript(layoutsRoot + "SP.Runtime.js", function () {
        $.getScript(layoutsRoot + "SP.js", sharepointReady);
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

function sharepointReady(){
    context = new SP.ClientContext("/");

    getUserId();
    
    var $_GET = getQueryParams(document.location.search);
    if($_GET['eventoID'] != undefined)
        getComunicados($_GET['eventoID']);
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


function getComunicados(id){
    var requestHeaders = {"ACCEPT": "application/json;odata=verbose",};
    
    var requestUrl =  siteSP + "/_api/web/lists/getByTitle('CalendarioUTV')/items?$select=ID,EventDate,EndDate,Title,Description,LikesCount,LikedById&$filter=ID eq ";

    $.ajax({
        url: requestUrl + id,
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
            var likes = "<div class='indicadores'><div class='likes'>";

            if(data.d.results[0].LikesCount != null && data.d.results[0].LikesCount != 0) {
                NoLikes = data.d.results[0].LikesCount;

                for(var s in data.d.results[0].LikedById.results){
                    if(data.d.results[0].LikedById.results[s] == userid)
                        isLiked = true;
                }
            }

            if(isLiked) {
                likes += "<div class='image' style='display:none'>"+
                "<a id='"+data.d.results[0].ID+"'></a></div>" +
                "<div class='unlike' style='display:inline-block'>"+
                "<a id='"+data.d.results[0].ID+"'>Unlike</a></div>" +
                "<div class='numero'>"+NoLikes+"</div></div>";
            } else {
                likes += "<div class='image' style='display:inline-block'>"+
                "<a id='"+data.d.results[0].ID+"'></a></div>" +
                "<div class='unlike' style='display:none'>"+
                "<a id='"+data.d.results[0].ID+"'>Unlike</a></div>" +
                "<div class='numero'>"+NoLikes+"</div></div></div>";
            }

            $('.inicio-pagina .header-page .titulo h1').html(data.d.results[0].Title);
            $('.inicio-pagina .header-page .titulo .fecha_inicio span').html(date_ini);
            $('.inicio-pagina .header-page .titulo .fecha_fin span').html(date_fin);
            $('.inicio-pagina .header-page .titulo').append(likes);
            $('.inicio-pagina .cuerpo-pagina').html(data.d.results[0].Description);

            $(".cuerpo-pagina").find("div").unwrap();

            $('.inicio-pagina .header-page .titulo .indicadores .likes .image a').on("click", function(){
                setLikes($(this).attr("id"));
                $(this).parent().hide();
                $(this).parent().parent().find('.unlike').show();
                $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)+1 });
            });

            $('.inicio-pagina .header-page .titulo .indicadores .likes .unlike a').on("click", function(){
                setUnlikes($(this).attr("id"));
                $(this).parent().hide();
                $(this).parent().parent().find('.image').show();
                $(this).parent().parent().find('.numero').html(function(i, val) { return parseInt(val)-1 });
            });
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

    requestHeaders = { "ACCEPT": "application/json;odata=verbose", };

    requestUrl = siteSP + "/_api/web/lists/getByTitle('PicturesEvents')/items?$select=Principal,EncodedAbsUrl&$orderby=Created desc&$select=Evento/Id&$expand=Evento/Id&$filter=(Evento/Id eq "+id+") and (Principal ne true)";

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: requestHeaders,
        success: function(data){
            if (data.d.results[0] != undefined)
                $('.header-page .imagen').css("background", "url(" + data.d.results[0].EncodedAbsUrl + ") no-repeat center center");
            else
                $('.header-page .imagen').css("background", "url(/_catalogs/theme/Themed/626BDBFA/siteIcon-2129F729.themedpng?ctag=4) no-repeat center center");
            $('.header-page .imagen').css("background-size", "100% 100%");
        },
        error: function(err){
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

function errorgetUserId() {
    alert('Request failed. ' + args.get_message());
}