//Styling for the geojson data
//Functions

function SortCounties(a,b){
	var _a = a.feature.properties.name;
	var _b = b.feature.properties.name;

	if( _a < _b ){

		return -1;
	}

	if( _a > _b ){

		return 1;
	}

	return 0;
}



L.Control.Search = L.Control.extend({
	options: {
		position: 'topleft',
		placeholder: 'search .....',
		hideMarkerOnCollapse: false,
		marker: {						//custom L.Marker or false for hide
			icon: false,				//custom L.Icon for maker location or false for hide
			animate: true,				//animate a circle over location found
			circle: {					//draw a circle in location found
				radius: 10,
				weight: 3,
				color: '#e03',
				stroke: true,
				fill: false
			}
		},
	},

	initialize: function(options/*{data:{...} }*/){
		L.Util.setOptions(this,options);
	},

	onAdd: function(map){
		var container = L.DomUtil.create('div','search-container');
		this.form = L.DomUtil.create('form','form',container);
		var group = L.DomUtil.create('div','form-group',this.form);
		this.input = L.DomUtil.create('input','form-control input-sm',group)
		this.input.type = 'text';
		this.input.placeholder = this.options.placeholder;
		this.results = L.DomUtil.create('div','list-group',group);
		L.DomEvent.addListener(this.input,'keyup', _.debounce(this.keyup, 300),this);
		L.DomEvent.addListener(this.form,'submit',this);
		L.DomEvent.disableClickPropagation(container);
		return container;

	},

	onRemove: function(map){
		L.DomEvent.removeListener(this._input,'keyup',this.keyup,this);
		L.DomEvent.removeListener(form,'submit',this.submit,this);
	},
	keyup: function(e){
		if(e.KeyCode== 38 || e.KeyCode==40){
			console.log(e.KeyCode);
			//do something
		}else{
			this.results.innerHTML = '';

			if(this.input.value.length >0){
				var value = this.input.value;
				var results = _.take(_.filter(this.options.data,function(x){

					SearchResults = x.feature.properties.name.toUpperCase().indexOf(value.toUpperCase()) > -1;

					return SearchResults

				}).sort(SortCounties),10);

				_.map(results,function(x){
					var a = L.DomUtil.create('a','list-group-item');
					a.href = '';
					a.setAttribute('data-result-name',x.feature.properties.name);
					a.innerHTML = x.feature.properties.name;
					this.results.appendChild(a);
					L.DomEvent.addListener(a,'click',this.itemSelected,this);
					return a;
				}, this);
			}
		}
	},
	itemSelected: function(e){
		L.DomEvent.preventDefault(e);
		var	elem = e.target;
		var value = elem.innerHTML;
		this.input.value = elem.getAttribute('data-result-name');
		var feature = _.find(this.options.data, function(x){
			return x.feature.properties.name == this.input.value;
		}, this);
		if (feature){
			// zooming a specific point (coordinate)
  			var latLngs = [ feature.getLatLng() ];
  			var markerBounds = L.latLngBounds(latLngs);
			var circle = L.circle([latLngs], {
			    color: 'red',
			    fillColor: '#f03',
			    fillOpacity: 0.5,
			    radius: 500
			});
			
			
  			// console.log(markerBounds);

			// feature.setStyle({fillColor:'black',fillOpacity: 0.8,dashArray: 3,weight: 2,opacity: 1,color: 'white',});
			// alert(feature);
			this._map.fitBounds(markerBounds);
		}

		this.results.innerHTML = '';
	},
	submit: function(e){
		L.DomEvent.preventDefault(e);
	},
});

L.Control.search = function(id,options){
	return new L.Control.Search(id,options);
}