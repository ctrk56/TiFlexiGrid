/*
 * TiFlexiGrid v.1.2
 * The commonJS module version of TiFlexiGrid, an Alloy Widget for creating flexible grid layouts in iOS and Android. 
 * It works on phones and tablets in any orientation. Now you can create your 
 * own custom grid items and assign them to TiFlexiGrid . You can set different 
 * grid parameters depending the orientations, each item could have it's own layout, 
 * add a custom function when an item is clicked, add a single item or group of items, 
 * clear the grid, etc. Please refer to the sample project to see it in action.
 * 
 * Thanks to everyone for the feedback and contributions. It's awesome to see so many 
 * people using my widget. If anyone have some ideas, requests, contributions or want 
 * to show how you are using the widget , contact me at @pablorr18. 
 * 
 * Copyright (c) 2014 Pablo Rodriguez Ruiz, @pablorr18
 */

var params,space,data,portraitColumns,landscapeColumns,screenWidth,newWidth,columnWidth,frameBGcolor,itemsOptions,onItemClick;
var OS = Ti.Platform.osname;

var fgMain = Ti.UI.createView({
	backgroundColor: '#fff',
	height: Ti.UI.FILL,
	width: Ti.UI.FILL
});

var fgWrapper = Ti.UI.createView({
	width:Ti.UI.FILL,
	height:Ti.UI.FILL,
	backgroundColor:'transparent'
});

var fgScrollView = Ti.UI.createScrollView({
	width: Ti.UI.FILL,
	height:Ti.UI.FILL,
	contentHeight: Ti.UI.SIZE,
	contentWidth: Ti.UI.FILL,
	layout:'horizontal',
	backgroundColor:'transparent',
	scrollType:'vertical'
});

fgWrapper.add(fgScrollView);
fgMain.add(fgWrapper);

var init = function(opts){
	params = opts || {};	
	space = params.space || 5;
	data = params.data || {};
	
	portraitColumns = params.portraitColumns || 2;
	landscapeColumns = params.landscapeColumns || 3;
	
	screenWidth = params.width || Ti.Platform.displayCaps.getPlatformWidth();
	if (OS == 'android') {
        	screenWidth /= Ti.Platform.displayCaps.logicalDensityFactor;
    	}
	newWidth = screenWidth - space;
		
   	orientationCheck();
    
	//ADJUST THE SCROLLVIEW
	fgScrollView.left = 4;
	fgScrollView.top = space;
	fgScrollView.right = 0;
	
	//MAIN BG COLOR
	frameBGcolor = params.gridBackgroundColor || '#fff';
	fgMain.backgroundColor = frameBGcolor;
	
	//ITEMS OPTIONS
	itemsOptions = {
		heightDelta: params.itemHeightDelta || 0,
		backgroundColor: params.itemBackgroundColor || 'transparent',
		borderWidth: params.itemBorderWidth || 0,
		borderColor: params.itemBorderColor || 'transparent',
		borderRadius: params.itemBorderRadius || 0
	};
	
	//ITEM CLICK FUNCTION
	onItemClick = params.onItemClick || function(){Ti.API.info('TiFlexiGrid -> onItemClick is not defined.');};
	
	Ti.API.info('TiFlexiGrid -> Widget initialized.');
	Ti.API.info('TiFlexiGrid -> Items dimension: ' + columnWidth + ' x '+ (columnWidth + itemsOptions.heightDelta));
	addGridItems(data);

	return fgMain;
};

var orientationCheck = function(){
	if(Titanium.Gesture.isLandscape()){
		columnWidth = (newWidth / landscapeColumns) - space;
    }else if(Titanium.Gesture.isPortrait()){
		columnWidth = (newWidth / portraitColumns) - space;
    }
};

var addGridItems = function(args, append){
	if(!append){
		clearGrid();
	};
	orientationCheck();
	data = args || {};
	for (var x=0;x < data.length; x++){
		addGridItem(data[x]);
	}
};

Titanium.Gesture.addEventListener('orientationchange', function(e){
	screenWidth = params.width || Ti.Platform.displayCaps.getPlatformWidth();
	if (OS == 'android') {
        screenWidth /= Ti.Platform.displayCaps.logicalDensityFactor;
    }
	newWidth = screenWidth - space;
		
	if(e.source.landscape){
		for(item in localData){
			localData[item].animate({
				width: (newWidth / landscapeColumns) - space, 
				height: (newWidth / landscapeColumns) - space
			});
		}
	}
	else{
		for(item in localData){
			localData[item].animate({
				width: (newWidth / portraitColumns) - space,
				height: (newWidth / portraitColumns) - space
			});
		}
	}
	
	Titanium.API.info('#######################################################');
	Titanium.API.info('screenWidth: ' + screenWidth);
	Titanium.API.info('screenWidth / landscapeColumns: ' + screenWidth / landscapeColumns);
	Titanium.API.info('screenWidth / portraitColumns: ' + screenWidth / portraitColumns);
	Titanium.API.info('#######################################################');
	Titanium.API.info('newWidth: ' + newWidth);
	Titanium.API.info('newWidth / landscapeColumns: ' + newWidth / landscapeColumns);
	Titanium.API.info('newWidth / portraitColumns: ' + newWidth / portraitColumns);
	Titanium.API.info('#######################################################');
});

var localData = [];
var addGridItem = function(item){
	var frame = Ti.UI.createView({
		width:columnWidth,
		height:columnWidth + itemsOptions.heightDelta,
		backgroundColor:itemsOptions.backgroundColor,
		top:0,
		left:0,
		right:space,
		bottom:space,
		borderColor:itemsOptions.borderColor,
		borderRadius:itemsOptions.borderRadius,
		borderWidth:itemsOptions.borderWidth
	});
	localData.push(frame);
	
	var overlay = Ti.UI.createView({
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		backgroundColor:'transparent',
		zIndex:1,
		data:item.data
	});
	
	var gridElement = item.view;
	
		
	//ADD CUSTOM FUNCTION ONCE AN ITEM IS CLICKED
	overlay.addEventListener('click',function(e){
		onItemClick(e);
	});
			 
	frame.add(gridElement);
	frame.add(overlay);
	
	fgScrollView.add(frame);
};

var openModal = function(url){
	var overlay = Ti.UI.createView({
		width:Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor:'#000',
		opacity:0,
		zIndex:100
	});
	
	var topView = Ti.UI.createView({
		width:Ti.UI.FILL,
		height: Ti.UI.FILL,
		zIndex:1200,
		visible:false
	});
	
	var imgView = Ti.UI.createImageView({
		image: url,
		width:Ti.UI.SIZE,
		height: Ti.UI.SIZE
	});
	
	topView.add(imgView);
	fgMain.add(overlay);
		
	if (OS != 'android') {
		//ANIMATION OF OVERLAY
		overlay.animate({opacity:0.7,duration:200});
		
		//ANIMATION FOR POP EFFECT
		var t = Titanium.UI.create2DMatrix();
		t = t.scale(0);
		var a = Titanium.UI.createAnimation();
		a.transform = t;
		a.duration = 200;
		
		fgMain.add(topView);
		topView.animate(a);
		
		a.addEventListener('complete', function(){
			topView.visible = true;
			var t2 = Titanium.UI.create2DMatrix();
			t2 = t2.scale(1.2);
			topView.animate({transform:t2, duration:200},function(e){
				var t4 = Titanium.UI.create2DMatrix();
				t4 = t4.scale(1.0);
				topView.animate({transform:t4, duration:200});
			});
		});
	}
	else{
		//ANIMATION OF OVERLAY
		overlay.animate({opacity:0.7,duration:200},function(e){
			topView.visible = true;
			fgMain.add(topView);
		});	
	}
	
	topView.addEventListener('click',function(e){
		if (OS != 'android'){
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(1.2);
			var a2 = Titanium.UI.createAnimation();
			a2.transform = t3;
			a2.duration = 200;
			topView.animate(a2);
			
			a2.addEventListener('complete', function(){
				var t5 = Titanium.UI.create2DMatrix();
				t5 = t5.scale(0);
				topView.animate({transform:t5, duration:200},function(e){
					fgMain.remove(topView);
					overlay.animate({opacity:0,duration:200},function(e){
						fgMain.remove(overlay);
					});
				});
			});
		}
		else{
			fgMain.remove(topView);
			overlay.animate({opacity:0,duration:200},function(e){
				fgMain.remove(overlay);
			});
		}
		
	});
	
};

var clearGrid = function(){
	fgScrollView.removeAllChildren();
};

var getItemWidth = function(){
	return columnWidth;
};

var getItemHeight = function(){
	return columnWidth + itemsOptions.heightDelta;
};

var setOnItemClick = function(fnt){
	onItemClick = fnt || function(){Ti.API.info('TiFlexiGrid -> onItemClick is not defined.');};
};

exports.init=init;
exports.addGridItems = addGridItems;
exports.clearGrid = clearGrid;
exports.openModal = openModal;
exports.addGridItem = addGridItem;
exports.getItemWidth = getItemWidth;
exports.getItemHeight = getItemHeight;
exports.setOnItemClick = setOnItemClick;
