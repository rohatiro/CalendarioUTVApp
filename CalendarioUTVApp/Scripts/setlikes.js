var evtid;

function setLikes(id) {

	var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

	reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, true);

	context.executeQueryAsync(successSetLikes, errorSetLikes);
}

function successSetLikes(){
}

function errorSetLikes(sender, args) {
	alert('Request failed. ' + args.get_message());
}

function setUnlikes(id) {
	var reputation = Microsoft.Office.Server.ReputationModel.Reputation;

	reputation.setLike(context, '{57e87912-1b19-4a4d-8af3-2531014dca23}', id, false);

	context.executeQueryAsync(successSetUnlikes, errorSetUnlikes);
}

function successSetUnlikes() {

}

function errorSetUnlikes() {
	alert('Request failed. ' + args.get_message());
}