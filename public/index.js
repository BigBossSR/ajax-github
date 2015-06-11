$(document).on("ready", function() {


	var getRepos = function(callback) {
		var templateStr = $("#repoTemplate").html()
		var TemplateFunction = Handlebars.compile(templateStr)		

		var ajaxSuccess = function(repoArray) {

			repoArray = _.sortBy(repoArray, function(repo){

				return moment(repo.updated_at).valueOf() * -1
			})
			
			console.log(repoArray)
			_.each(repoArray, function(aRepo){
			//var aRepo = repoArray[5]
				//each repoArray, function repo - instead of above definition

				$.ajax({
				url: aRepo.url,
				method: "GET",
				data: {
					access_token: "54af0aafe21d91b090e4e1cf0af39d056591a3f3"
				},
				success: function(data) {
					console.log(data)
					
					//var forked_from = function(data) {
					//	for (var parent in data) {
					//		return data[parent].html_url
					//	}
					//}
					var repoInfo = { // put it in a var
						name: aRepo.name,
						stars: aRepo.stargazers_count,
						forks: data.network_count,
						language: aRepo.language,
						description: aRepo.description,
						updated: moment(aRepo.updated_at).fromNow(),
					}

					if (data.parent) {
						repoInfo.forked_from = data.parent["html_url"]
						repoInfo.parent = data.parent["full_name"]
						repoInfo.forked = true
					}

					var htmlString = TemplateFunction(repoInfo)
					$("#templateLocation").append(htmlString)
					//append to repolocation
				}//corrct place? need to close that _.each within the success function
				})
			})
			//console.log(userdataArray)
			//console.log(repoArray)
			//callback(repoArray)
		}
		$.ajax({
			url: "https://api.github.com/users/BigBossSR/repos",
			method: "GET",
			data: {
				access_token: "54af0aafe21d91b090e4e1cf0af39d056591a3f3"
			},
			success: ajaxSuccess
		})
	}




	var getData = function(callback) {
		var ajaxSuccess = function(userdataArray) {
			//console.log(userdataArray)
			callback(userdataArray)
			var title = userdataArray.login+" ("+userdataArray.name+")"
			$(".title").text(title)

			var templateStr = $("#orgList").html()
			var TemplateFunction = Handlebars.compile(templateStr)

			$.ajax({
				url: userdataArray.organizations_url,
				method: "GET",
				data: {
					access_token: "54af0aafe21d91b090e4e1cf0af39d056591a3f3"
				},
				success: function(orgArray) {
					_.each(orgArray, function(org){
						var htmlString = TemplateFunction({
							url: org.url,
							avatar_url: org.avatar_url
						})
						$("#orgLocation").append(htmlString)
					})
				}
			})

	
			/*$.ajax({
				url: "https://api.github.com/users/BigBossSR/starred",
				method: "GET",
				data: {
					access_token: "54af0aafe21d91b090e4e1cf0af39d056591a3f3"
				},
				success: function(starredArray) {
					
					callback(starredArray)					

				}
			})*/
	

		}
		$.ajax({
			url: "https://api.github.com/users/BigBossSR",
			method: "GET",
			data: {
				access_token: "54af0aafe21d91b090e4e1cf0af39d056591a3f3"
			},
			success: ajaxSuccess
		})
	}


	getRepos(function(repoArray){})


	var templateFn = Handlebars.compile( $("#sidebarTemplate").html())

	myData = getData(function(userdataArray){
		if (!userdataArray.starred) {
			userdataArray.starred_url = "https://github.com/stars"
			userdataArray.starred = "0"			
		} else {
			userdataArray.starred_url = "https://github.com/stars/BigBossSR"
		}	

		userdataArray.created_at = moment(userdataArray.created_at).format('MMM Do, YYYY');
		console.log(userdataArray)
		var templateString = templateFn( userdataArray )
		$("#copyLocation").append(templateString)				

	})


//to get the forks number for each repo, request that repos url and get from
//network count or the owner I suppose
	



})