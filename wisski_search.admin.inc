<?php


/**
* @author Florian Wittmann
*/
function wisski_search_admin_list($form_state) { 
          
  $form['use_auto_contains'] = array(
      '#type' => 'textfield',
      '#title' => t('Use contains search when searching for at least x characters'),
      '#description' => t('0 means use contains search only. 3 means search with contains when typing at least 3 characters. '),
      '#default_value' => variable_get('wisski_search_use_auto_contains', 4),
      ); 
  $form['results_per_page'] = array(
      '#type' => 'textfield',
      '#title' => t('Results per page'),
      '#default_value' => variable_get('wisski_search_results_per_page', 15),
      );      
  $form['submit']=array(
      '#type'=>'submit',
      '#value'=>t('Save changes'),
      );

  return $form;

}


/**
* @author Florian Wittmann
*/
function wisski_search_admin_list_submit($form, $form_state) {

  variable_set('wisski_search_use_auto_contains', intval($form_state['values']['use_auto_contains']));
  variable_set('wisski_search_results_per_page', intval($form_state['values']['results_per_page']));

}
