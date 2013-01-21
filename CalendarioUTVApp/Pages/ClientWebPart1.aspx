<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.debug.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.debug.js"></script>

    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js"></script>

    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link href="../Content/foundation.css" rel="stylesheet" />
    <link href="../Content/navigation.css" rel="stylesheet" />

    <script type="text/javascript" src="../Scripts/date-es-MX.js"></script>
    <script lang="javascript" type="text/javascript" src="../Scripts/App.js"></script>
</head>
<body>
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
                    <div class="eventos sixteen columns"></div>
                    </div>
                    <input type="button" class="button" value="Ver calendario completo" onclick="window.top.location = 'https://robertotr.sharepoint.com/Lists/CalendarioUTV/calendar.aspx'">
                </div>
            </div>
        </div>
</body>
</html>
