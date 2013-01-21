var siteSP = location.protocol + "//" + location.hostname;
var maxchar = 250;

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

function sharepointReady() {
    createQuery($('.eight.columns select option:selected').text());
    
    $('.eight.columns select').change(function(){
        createQuery($('option:selected', this).text());
    });
    
}

function createQuery(option){
    var query = "/_api/web/lists/getByTitle('CalendarioUTV')/items?$orderby=EventDate desc";
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
    var listEventos = "<hr>";
    var EventoPage = siteSP + "/SitePages/Evento.aspx?eventoID=";
    var count = 0;

    for (var i in eventos) {
        count++;
        var fecha = new Date(eventos[i].EventDate);
        var hora = fecha.getTimezoneOffset();
        var date = fecha.addMinutes(hora).toString("dd/MM/yyyy h:mm tt");


        var comunicado = "<div class='obj-comunicado'>" +
                            "<div class='comunicado titulo'>" +
                                "<a href='" + EventoPage + eventos[i].ID + "'>" + eventos[i].Title + "</a>" +
                                "<span>" + date + "</span>" +
                            "</div>";

        comunicado += "<div class='comunicado sinopsis'>" + eventos[i].Description + "</div>" +
                        "<a href='" + EventoPage + eventos[i].ID + "'>Leer Mas</a></div>";

        listEventos += comunicado;
    }

    $(".list-comunicados").html(listEventos + "<hr>");
    $(".sinopsis").children().find('div').unwrap();

    $('.sinopsis').find('div').hide();

    $('.sinopsis').each(function () {
         $('div:first', this).show();
    });

    $('.sinopsis p').each(function () {
        var content = $(this).html();
        if (content.length > maxchar) {
            var resumen = content.substr(0, maxchar) + "...";
            $(this).html(resumen);
        }
    });

    $('.wrapper').pajinate({
        items_per_page: 10,
        items_id: '.obj-comunicado',
        nav_panel_id: '.paginador-id',
        nav_label_first: '«',
        nav_label_last: '»',
        nav_label_next: '›',
        nav_label_prev: '‹'
    });

    $('.results').html("<b>Resultados " + count + " eventos</b>");
}