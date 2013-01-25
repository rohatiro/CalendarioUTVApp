var siteSP = location.protocol + "//" + location.hostname;
var maxchar = 100;

// Este código se ejecuta cuando el DOM está preparado y crea un objeto de contexto necesario para poder usar el modelo de objetos de SharePoint
$(document).on("ready", function () {
    // var spHostUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    // var layoutsRoot = spHostUrl + '/_layouts/15/';
    // $.getScript(layoutsRoot + "SP.Runtime.js", function () {
    //     $.getScript(layoutsRoot + "SP.js", sharepointReady);
    // });
    sharepointReady();
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
    
    var requestUrl =  siteSP + "/_api/web/lists/getByTitle('CalendarioUTV')/items?$filter=ID eq ";

    $.ajax({
        url: requestUrl + id,
        type: "GET",
        headers: requestHeaders,
        success: function (data) {
            var fecha_ini = new Date(data.d.results[0].EventDate);
            var hora_ini = fecha_ini.getTimezoneOffset();
            var date_ini = fecha_ini.addMinutes(hora_ini).toString("dd/MM/yyyy h:mm tt");

            var fecha_fin = new Date(data.d.results[0].EndDate);
            var hora_fin = fecha_fin.getTimezoneOffset();
            var date_fin = fecha_fin.addMinutes(hora_fin).toString("dd/MM/yyyy h:mm tt");

            $('.inicio-pagina .header-page .titulo h1').html(data.d.results[0].Title);
            $('.inicio-pagina .header-page .titulo .fecha_inicio span').html(date_ini);
            $('.inicio-pagina .header-page .titulo .fecha_fin span').html(date_fin);
            $('.inicio-pagina .cuerpo-pagina').html(data.d.results[0].Description);

            $(".cuerpo-pagina").find("p").unwrap();
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
            $('.header-page .imagen img').attr('src', data.d.results[0].EncodedAbsUrl);
        },
        error: function(err){
            alert(JSON.stringify(err));   
        }

    });
}