var evtid;

function setLikes(contexto, id, listid) {

    var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

    //reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, true);
    reputation.setLike(contexto, listid, id, true);

    contexto.executeQueryAsync(successSetLikes, errorSetLikes);
}

function successSetLikes() {
}

function errorSetLikes(sender, args) {
    alert('Request failed. ' + args.get_message());
}

function setUnlikes(contexto, id, listid) {
    var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

    //reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, false);
    reputation.setLike(contexto, listid, id, false);

    contexto.executeQueryAsync(successSetUnlikes, errorSetUnlikes);
}

function successSetUnlikes() {

}

function errorSetUnlikes(sender, args) {
    alert('Request failed. ' + args.get_message());
}