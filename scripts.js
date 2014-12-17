// helpers

var build_data = function(callback){
  
  "use strict";

  var nested_data = function(data, key){
    var nested = {};
    data.forEach(function(x, i){
      //console.log(x.agrupacion)
      x.name = x.nombre
        if (nested[x[key]]){
            nested[x[key]].push(x);
        }else{
            nested[x[key]] = [];
            nested[x[key]].push(x);
        }
    });
    return nested;
  };

  d3.json('votacion.json', function(d){
    
    var votos = {
      name: d.mediatico,
      voto:"none",
      children:[],
      size: d.votos.length
    };

    var tipo_voto = nested_data(d.votos, "voto")
    for(var v in tipo_voto){ // cada tip vot
      var agrupaciones = {
        name: v.toLowerCase(),
        voto: v.toLowerCase(),
        children:[],
        size: tipo_voto[v].length
      }
      var agrup = nested_data(tipo_voto[v], "agrupacion");
      for(var a in agrup){ // cada agr
        agrupaciones.children.push({
                  name: a,
                  voto:v.toLowerCase(),
                  children: agrup[a].map(function(j){ j.size = 1; return j;}),
                  size: agrup[a].length
                });
      }
      votos.children.push(agrupaciones);
    }
    
    callback(votos) // cuando la data esta lista ejecuta drag como callback
  
  });
}





var get_class = function(d){
  
  if(d._children){
    var name = d.name;
  }else{
    var name = d.agrupacion;
  }
  return name.replace(/\s|\.|\+|[áéíóú]/gi, "");
};


var Tooltip = (function(d3){
  
  "use strict";

  var _tooltip = d3.select("#tooltip");

  var _get_position = function(d){
    return {
      "display": "block",
      "top": function(d){ return (d3.event.pageY + 5) +  "px"},
      "left": function(d){ return (d3.event.pageX + 5) + "px"}
    }
  }
  
  return { // public
    
    show_tp : function(d){
      if(d.nombre){
        var _html = tpl_tooltip_persona(d);
        _tooltip.html(_html)
        _tooltip.style(_get_position(d));
      }
    },

    hide_tp : function(d){
      if(d.nombre){
        _tooltip.style({"display": "none"});
      }
    }
  
  };

})(d3);



// Handlebars Helpers ...

Handlebars.registerHelper('get_id_class', function(str) {
  return str.replace(/\s|\.|\+|[áéíóú]/gi, "")
});

Handlebars.registerHelper( "lower", function ( _string ){
  return _string.toLowerCase();
});