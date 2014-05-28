
<x-localforage id="local" namespace="task-app"></x-localforage>
<x-rest endpoint="user/settings"></x-rest>

<x-rest endpoint="user/settings/colorschema"></x-rest>


<x-sync>

</x-sync>

<x-app-settings namespace="column" storage-provider="local">
  <x-app-setting label="Title" key="name" validator="validatorTitle"></x-app-setting>
  <x-app-setting label="Filter" key="filter" validator="validateTags"></x-app-setting>
</x-app-settings>


<x-app-settings namespace="app-color-schema" storage-provider="local">
  <x-app-setting label="Title" key="name" validator="validatorTitle"></x-app-setting>
  <x-app-setting label="Filter" key="filter" validator="validateTags"></x-app-setting>
</x-app-settings>

{
  'task-app':{
    'column-1232':{
      'name':'All Items',
      'filter': '*'
    }
  }
}


Validation

<x-regexvalidator id="validateTitle" regex="(/w+)+?" modifiers="g" errorMsg="Invalid Title"></x-validator>
<x-regexvalidator id="validateTags" regex="(#\w+)+?" modifiers="g" errorMsg="Invalid Tags"></x-validator>


function recentTags(filter, callback){

}

<x-autocompleter target="input[name='tag-filter']">
  <x-autocompleter-match pattern="#" do="">
</x-autocompleter>


htmlimports-polyfill git://github.com/pennyfx/htmlimports-polyfill.git
shadowdom-polyfill git://github.com/pennyfx/shadowdom-polyfill.git
