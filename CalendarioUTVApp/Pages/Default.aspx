﻿<%-- Las 4 líneas siguientes son directivas ASP.NET necesarias cuando se usan componentes de SharePoint --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- El marcado y el script del elemento Content siguiente se pondrán en el elemento <head> de la página --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">

    <!-- Agregue sus estilos CSS al siguiente archivo -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link href="../Content/foundation.css" rel="stylesheet" />
    <link href="../Content/navigation.css" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>
    <script type="text/javascript" src="../Scripts/date-es-MX.js"></script>

    <!-- Agregue el código JavaScript al siguiente archivo -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- El marcado y el script del elemento Content siguiente se pondrán en el elemento <body> de la página --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="row">
        <div class="twelve columns no-padding">
            <div class="eight columns no-padding-right mB20">
                <div class="bloque sombra no-padding">
                    <div class="tituloBloque tk-myriad-pro-condensed">Calendario UTV</div>
                    <div class="filtro sixteen">
                        <div class="eight columns">
                            <select>
                                <option>Todos</option>
                                <option>Escolar</option>
                                <option>Capacitacion</option>
                                <option>Eventos</option>
                            </select>
                        </div>
                    </div>
                    <div class="eventos sixteen columns">
                        <%--<div class="evento">
                            <div class="fecha three">
                                <div class="mes sixteen">Oct</div>
                                <div class="dia sixteen">13</div>
                            </div>
                            <div class="texto thirteen">
                                <div class="titulo"><a href="#" class="linkStyle1">Escolar</a></div>
                                <div class="desc">Congreso de Tecnologia</div>
                            </div>
                        </div>
                        <div class="evento">
                            <div class="fecha three">
                                <div class="mes sixteen">Oct</div>
                                <div class="dia sixteen">10</div>
                            </div>
                            <div class="texto thirteen">
                                <div class="titulo"><a href="#" class="linkStyle1">Capacitacion</a></div>
                                <div class="desc">Lanzamiento de intranet</div>
                            </div>
                        </div>
                        <div class="evento">
                            <div class="fecha three">
                                <div class="mes sixteen">Sep</div>
                                <div class="dia sixteen">18</div>
                            </div>
                            <div class="texto thirteen">
                                <div class="titulo"><a href="#" class="linkStyle1">Eventos</a></div>
                                <div class="desc">Seminario de nuevas tecnologias</div>
                            </div>
                        </div>
                        <div class="evento">
                            <div class="fecha three">
                                <div class="mes sixteen">Sep</div>
                                <div class="dia sixteen">22</div>
                            </div>
                            <div class="texto thirteen">
                                <div class="titulo"><a href="#" class="linkStyle1">Escolar</a></div>
                                <div class="desc">Seminario Educacion en linea</div>
                            </div>--%>
                        </div>
                    </div>
                    <input type="button" class="button" value="Ver calendario completo" onclick="window.location='https://robertotr.sharepoint.com/Lists/CalendarioUTV/calendar.aspx'">
                </div>
            </div>
        </div>
</asp:Content>
