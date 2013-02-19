var evtid;

function setLikes(id, listid) {

	var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

	//reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, true);
	reputation.setLike(context, listid, id, true);
	
	context.executeQueryAsync(successSetLikes, errorSetLikes);
}

function successSetLikes(){
}

function errorSetLikes(sender, args) {
	alert('Request failed. ' + args.get_message());
}

function setUnlikes(id, listid) {
	var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

	//reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, false);
	reputation.setLike(context, listid, id, false);

	context.executeQueryAsync(successSetUnlikes, errorSetUnlikes);
}

function successSetUnlikes() {

}

function errorSetUnlikes(sender, args) {
	alert('Request failed. ' + args.get_message());
}