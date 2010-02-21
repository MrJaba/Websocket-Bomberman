function GameImages(toLoad){
	this.imagesToLoad = toLoad;
};

GameImages.prototype = {
	
	initialize : function(){
		for( var i in this.imagesToLoad ){
			this.loadImage(this.imagesToLoad[i]);
		}
		return this;
	},
	
	loadImage : function(filePath){
		var img = new Image();
		img.src = filePath;
		var gameImages = this;
		img.onload = function(){ gameImages.addImage(gameImages.imageName(filePath), img); }
	},
	
	addImage : function(name, image){
		this.images = this.images || {};
		this.imageArray = this.imageArray || new Array();
		this.images[name] = image;
		this.imageArray.push(image);
		if( this.imageArray.length == this.imagesToLoad.length ){
			$(document).trigger('imagesLoaded');
		}		
	},
	
	imageName : function(filePath){
		return filePath.split('/').pop().split('.')[0];
	},	
	
	getImage : function(imageName){
		return this.images[imageName];			
	},
	
};

$(document).ready( function(){ MrJaba.Bomberman.Images = new GameImages(['images/tiles/StoneBlock.png','images/CharacterBoy.png']).initialize();});