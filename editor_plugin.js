/**
 * $Id$
 *
 * @author Florian Wittmann
 * @copyright Copyright © 2011, WissKI, All rights reserved.
 */


(function() {
			
	tinymce.create('tinymce.plugins.wisskiSearch', {

		init : function(ed, url) {
			var t = this;
			t.editor = ed;
			t.core = ed.plugins.wisskicore;
			t.editor = ed;
			t.url = url;
					
			ed.addButton('wisskiSearchShowDialog', {
				image : url + '/img/search.png',
				cmd: 'wisskiSearchShowDialog'
			});
			
			var headID = document.getElementsByTagName("head")[0];  		    
			
			Drupal.settings.wisski.wisskiSearch = {
				foundAnnotation : function (vocab, uri) {
			
					if (!uri) return;
					
					var t = this, range, ed = tinymce.activeEditor;
					t.core = ed.plugins.wisskicore;
					if (t.core.current_anno == null) {
						range = t.core.convertW3CRange(ed, ed.selection.getRng(true));
					} else {
						range = t.core.getElementRange(ed, t.core.current_anno);
					}					
					
					var annotation = {
							range : range,
							uri : uri,
							voc : vocab,
							class : Drupal.settings.wisski.editor.vocabularies[vocab].class,
							approved : true
						};
			

					t.core.setAnnotation(ed, annotation, false);
				
				}
			}
					
			var diviframe = document.createElement("iframe");
			var html = url + "/wisski_search.html";
			diviframe.setAttribute("id", "dialog_iframe");
			diviframe.setAttribute("src", html);
			headID.appendChild(diviframe);     
			
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			var jspath = url + '/wisski_search.js';
			newScript.src = jspath;
			headID.appendChild(newScript);
			
			ed.addCommand('wisskiSearchShowDialog', function() {
				var ed = tinymce.activeEditor, t = ed.plugins.wisskiSearch;

				search_term ="";
				if (t.core.current_sel_range) search_term = t.core.getTextOfRange(ed, t.core.current_sel_range[0], t.core.current_sel_range[1]);
				else if (t.core.current_anno) search_term = t.core.current_anno.textContent;
				
				Drupal.settings.wisski.vocab_dialog.showDialog(search_term, Drupal.settings.wisski.wisskiSearch.foundAnnotation);	
			});
			
			
			
			t.core.onSelectionAnnoChange.add(function(ed, cm, n) {
				search_term ="";
				if (t.core.current_sel_range) search_term = t.core.getTextOfRange(ed, t.core.current_sel_range[0], t.core.current_sel_range[1]);
				else if (t.core.current_anno) search_term = t.core.current_anno.textContent;
				cm.setDisabled('wisskiSearchShowDialog', (search_term == "") ? true : false);
			});
			


		},
        
		getInfo : function() {
			return {
				longname : 'WissKI Search Entities',
				author : 'Florian Wittmann',
				authorurl : '',
				infourl : '',
				version : "1.0"
			};
		},
		

     
	});
	
	// Register plugin
	tinymce.PluginManager.add('wisskiSearch', tinymce.plugins.wisskiSearch);	
})();
