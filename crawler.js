var Crawler = {
	request : null,
	cheerio : null,
	fs      : null,
	init : function(){
		Crawler.request = require('request');
		Crawler.cheerio = require('cheerio');
		Crawler.fs      = require('fs');
		Crawler.getMovies();
	},
	getMovies: function(){
		
		Crawler.request('http://sistemasenem.inep.gov.br/EnemSolicitacao/', function(err, res, body){
			debugger;
			if(err)
				console.log('Error: ' + err);
			var $ = Crawler.cheerio.load(body);
			$('.dialog').each(function(){
				debugger;
				var title  = $(this).find('input[type=image]').text().trim();
				//var rating = $(this).find('.imdbRating strong').text().trim();
				console.log(title);
				//Crawler.fs.appendFile('imdb.txt', title + ' - ' + rating + '\n');
			});
		});
	}
};
Crawler.init();
    