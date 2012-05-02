(function() {
  Drupal.settings.wisski.vocab_dialog = {
  showDialog : function(suche, callbackfunction) {
      
    if ( !Drupal.settings.wisski.vocab_dialog.myform) {
      
      Drupal.settings.wisski.vocab_dialog.myform = document.getElementById('dialog_iframe').contentWindow.document.getElementById('dialog-form');
      $(Drupal.settings.wisski.vocab_dialog.myform).dialog({autoOpen: false, modal: true, height: 500, resizable: false});
      $("#vocab_dialog_progress").attr("src",Drupal.settings.basePath + "sites/all/modules/wisski_search/img/progress.gif");



      $('#vocab_dialog_name').keypress(function(e){
      if(e.which == 13){
        e.preventDefault();
        Drupal.settings.wisski.vocab_dialog.doRequest($("#vocab_dialog_name").val(), $('input:radio[name=searchtype]:checked').val(), 0);
        return false;
       }
      });
      
      Drupal.settings.wisski.vocab_dialog.results = new Array();

      $("#vocab_dialog_results").selectable({
        stop: function() {
          $( ".ui-selected", this ).each(function() {
            var index = $("#vocab_dialog_results li").index( this );
            callbackfunction(Drupal.settings.wisski.vocab_dialog.results[index].voc, Drupal.settings.wisski.vocab_dialog.results[index].uri);
            $(Drupal.settings.wisski.vocab_dialog.myform).dialog( "close" );   
          });
        }
      });
    }
    
    $(Drupal.settings.wisski.vocab_dialog.myform).dialog( "open" );    
    $("#vocab_dialog_name").val(suche);
    if (suche.length >= Drupal.settings.wisski.search.use_auto_contains ) {
      $('input:radio[name=searchtype]').val(["contains"]);
    } else { 
      $('input:radio[name=searchtype]').val(["exact"]);
  }    
  Drupal.settings.wisski.vocab_dialog.doRequest(suche, $('input:radio[name=searchtype]:checked').val(), 0);      
  
    
    
    
    
  },

  doRequest : function(term, mode, offset) {
    $("#vocab_dialog_progress").css("visibility", "visible");
    
 //  $('div#vocab_dialog_infoentry').remove();
   $("li#vocab_dialog_resultentry").remove();
    
    var limit = Drupal.settings.wisski.search.results_per_page;
    var data = {term : term, match_mode : mode, offset : offset, limit : limit};
    
    
    
    $.ajax({
      url : Drupal.settings.wisski.editor.suggest_url,
      content_type : "application/json",
      type : "POST",
      data : 'wisski_editor_query=' + '{"term":"'+term+ '","fields":"label","match_mode":"' + mode +'","offset":'+offset+',"limit":'+limit+'}',
      //data : 'wisski_editor_query=' + '{"term":"'+term+ '","match_mode":"' + mode +'","offset":'+offset+',"limit":'+limit+'}',
      timeout : 10000,
      success : function (response){
        $("#vocab_dialog_progress").css("visibility", "hidden");
        //$('div#vocab_dialog_infoentry').remove();
        $("li#vocab_dialog_resultentry").remove();
        Drupal.settings.wisski.vocab_dialog.results = new Array();
        var json;
        if (response.indexOf("{") != -1) {
             json = JSON.parse(response.substr(response.indexOf("{")));
         } else {
             json = JSON.parse(response);
         }
        if(!json){
          return;
        }
        for (var group in json) {
          var current_class = Drupal.settings.wisski.editor.vocabularies[group].class;
          for (var ele in json[group]) {
            var element = json[group][ele];
            if (element.label)
            $('ul#vocab_dialog_results').append('<li id="vocab_dialog_resultentry"><span id="vocab_dialog_resultentry_text" class="wisski_anno wisski_anno_approved wisski_anno_uri_'+ encodeURIComponent(ele)+' wisski_anno_vocab_'+ encodeURIComponent(group)+' wisski_anno_class_'+ encodeURIComponent(current_class) +'">' + element.label["0"].value + '</span></li>');
                        
            var annotation = {
              voc : group,
              uri : ele,
            };
            Drupal.settings.wisski.vocab_dialog.results.push(annotation);
            
          } 
        }
        var tds = $('span#vocab_dialog_resultentry_text');
        if(tds == undefined || tds == null) return;

        for(var i=0; i<tds.length; i++){
          $(tds[i]).ttip_set();
        }    
      },
      error : function (jqXHR, textStatus, errorThrown) {
		  $("#vocab_dialog_progress").css("visibility", "hidden");
	  }
    });
  }
  };

  //Head suchen:
  var headID = document.getElementsByTagName("head")[0];    




  //jQuery Theme laden:
  var newLink = document.createElement('link');
  newLink.type = 'text/css';
  newLink.rel = 'stylesheet';
  newLink.href = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css';
  headID.appendChild(newLink);

  //jQuery laden
  //var newScript1 = document.createElement('script');
  //newScript1.type = 'text/javascript';
  //newScript1.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js';
  //headID.appendChild(newScript1);

  //jQuery UI laden
  var newScript2 = document.createElement('script');
  newScript2.type = 'text/javascript';
  newScript2.src = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js';
  headID.appendChild(newScript2);

  /*var diviframe = document.createElement("iframe");
  var html = url + "/../../../wisski_search/wisski_search.html"
  diviframe.setAttribute("id", "dialog_iframe");
  diviframe.setAttribute("src", html);
  headID.appendChild(diviframe); */
})();
