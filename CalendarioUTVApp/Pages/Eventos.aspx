<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.debug.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.debug.js"></script>

    <link href="../Content/comunicado.css" rel="stylesheet" />

    <script src="../Scripts/date-es-MX.js"></script>    
    <script src="../Scripts/jquery-1.7.1.js"></script>
    <script src="../Scripts/jquery.pajinate.js"></script>
    <script src="../Scripts/AllEventos.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class='wrapper'>
        <div class='header'>
            <div><h2>Eventos</h2></div>
            <hr />
                <div class="filtro">
                    <select>
                        <option>Todos</option>
                        <option>Escolar</option>
                        <option>Capacitacion</option>
                        <option>Eventos</option>
                    </select>
                </div>
            <div>
                <div class="results">
                </div>
                <div class="limpiador"></div>
                <div class='col-centered'>
                    <ul class='paginador-id'></ul>
                </div>
                <div class="limpiador"></div>
            </div>
        </div>
        <div class='list-comunicados'>
        </div>
        <hr />
        <div class='foot'>
            <div class='col-centered'>
                <ul class='paginador-id'></ul>
            </div>
        </div>
    </div>
</asp:Content>
