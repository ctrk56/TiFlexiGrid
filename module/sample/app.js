//CREATES THE MAIN WINDOW, HEADER AND A TITLE
var win = Titanium.UI.createWindow({  
    backgroundColor:'#FFF',
    layout:'vertical',
    orientationModes:[Titanium.UI.PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]
});

win.addEventListener('open', function(){
	var activity = this.getActivity();
	if(activity){
		
		activity.onCreateOptionsMenu = function(e){
                var menu = e.menu; 
                
                //Aparente
                var menuCompartilhar = menu.add({
                	icon: Titanium.App.Android.R.drawable.ic_action_content_add,
                    title : 'Criar',
                    showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
                });  
                
                menuCompartilhar.addEventListener("click", function(e){
                	TFG.addGridItems(items);
                });
                
                var menuFavoritar = menu.add({
                    icon: Titanium.App.Android.R.drawable.ic_action_navigation_close,
                    title : 'Limpar',
                    showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
                });
                
                menuFavoritar.addEventListener("click", function(e){
                	TFG.clearGrid();
                }); 
            }; 
            
            activity.invalidateOptionsMenu();
		
	    var actionBar = activity.getActionBar(); 
	    
        if (actionBar) { 
            actionBar.setDisplayHomeAsUp(false);
            actionBar.setTitle('GridLayout');
            actionBar.show();
            actionBar.setOnHomeIconItemSelected(function(){
                win.close();
           	});
        }
    }
});

//HERE WE CREATE OUR GRID ITEMS.
var items = [];

for(var x=0;x<25;x++){
	//THIS IS THE ITEM VIEW LAYOUT (RIGHT NOW JUST A VIEW WITH A LABEL)
	var view = Ti.UI.createView({
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		backgroundColor:'#eee'
	});
	var label = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		text:x
	});
	view.add(label);
	
	//THE DATA WE WANT AVAILABLE FOR THIS ITEM
	var values = {
			title: x
		};
	
	//WE ADD THE ITEM VIEW AND DATA
	items.push({
		view: view,
		data: values
	});
}


//CUSTOM FUNCTION TO DEFINE WHAT HAPPENS WHEN AN ITEM IN THE GRID IS CLICKED
var showGridItemInfo = function(e){
	TFG.openModal('http://www.fodecast.com.br/wp-content/uploads/2012/01/criatividade-60261.jpg');
	//alert('Title is: ' + e.source.data.title + '.');
};


//INCLUDE THE TIFLEXIGRID MODULE
var TFG = require('/services/tiflexigrid');

//INITIALIZE & CREATE TIFLEXIGRID
var grid_view = TFG.init({
	portraitColumns: 4,
	landscapeColumns: 7,
	space: 5,
	gridBackgroundColor:'#fff',
	itemHeightDelta: 0,
	itemBackgroundColor:'#eee',
	itemBorderColor:'transparent',
	itemBorderWidth:0,
	itemBorderRadius:0,
	onItemClick: showGridItemInfo,
	data:items
});
win.add(grid_view);

//OPEN MAIN WIN
win.open();
