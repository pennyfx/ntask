xtag.register('x-task-edit', {
    lifecycle: {
      created: function(){
        this.appendChild(xtag.createFragment([
          '<x-modal>',
          '<label>Note<textarea class="text" rows="15" cols="33"></textarea></label>',
          '<label>Tags<input class="tags" type="text" name="tag-filter"></label>',
          '<button class="save">ok</button>',
          '</x-modal>'].join('')).cloneNode(true));
        this.xtag.text = xtag.query(this, '.text')[0];
        this.xtag.tags = xtag.query(this, '.tags')[0];
        this.xtag.modal = this.firstElementChild;
      }
    },
    events: {
      'tap:delegate(.save)': function(e){
        xtag.fireEvent(e.currentTarget, 'save');
      }
    },
    accessors: {
      text: {
        set: function(value){
          this.xtag.text.value = value;
        },
        get: function(){
          return this.xtag.text.value;
        }
      },
      tags: {
        set: function(value){
          this.xtag.tags.value = value;
        },
        get: function(){
          return this.xtag.tags.value;
        }
      }
    }
  });

  xtag.register('x-task-item', {
    lifecycle:{
      created: function(){
        this.appendChild(xtag.createFragment([
          '<p class="text"></p>',
          '<div class="status-bar">',
            '<span class="edit"></span>',
            '<small class="tags text"></small>',
            '<small class="date">5m ago</small>',
          '</div>'].join('')).cloneNode(true));
        this.xtag.text = xtag.query(this, '.text')[0];
        this.xtag.tags = xtag.query(this, 'small.tags')[0];
        this.xtag.date = xtag.query(this, '.date')[0];
      }
    },
    events:{
      'tap:delegate(.edit)': function(e){
        var item = e.currentTarget;
        var edit = document.createElement('x-task-edit');
        edit.text = item.text;
        edit.tags = item.tags;
        edit.addEventListener('save', function(){
          item.text = edit.text;
          item.tags = edit.tags;
          edit.parentElement.removeChild(edit);
          delete edit;
        });
        item.parentElement.appendChild(edit);
      }
    },
    accessors:{
      id: {
        attribute:{}
      },
      text:{
        get: function(){
          return this.xtag.text.textContent;
        },
        set: function(value){
          this.xtag.text.textContent = value;
        }
      },
      tags: {
        attribute: {},
        get: function(){
          return this.xtag.tags.textContent;
        },
        set: function(value){
          this.xtag.tags.textContent = value;
        }
      },
      date: {
        set: function(value){
          this.xtag.date.textContent = value;
        }
      }
    }
  });

  xtag.register('x-validator-regex', {
    lifecycle:{
      created: function(){
        this.xtag.regex = null;
      }
    },
    accessors:{
      regex:{
        attribute:{},
        set: function(pattern){
          this.xtag.regex = this.modifers ? new RegExp(pattern, this.modifers) : new RegExp(pattern);
        }
      },
      modifers:{
        attribute:{},
        set: function(value){
          if (value && value.length && this.regex) {
            this.xtag.regex = new RegExp(this.regex, value);
          } else if (!value && this.regex){
            this.xtag.regex = new RegExp(this.regex);
          }
        }
      },
      errorMsg: {
        attribute:{}
      }
    },
    methods:{
      validate: function(value){
        return this.xtag.regex && this.xtag.regex.test(value);
      }
    }
  });

  xtag.register('x-app-setting', {
    lifecycle:{
      created: function(){
        var frag = xtag.createFragment([
          '<label><span></span>',
          '<input type="text">',
          '<div class="error" hidden></div>',
          '</label>'].join(''));
        this.appendChild(frag.cloneNode(true));
        this.xtag.label = xtag.query(this, 'span')[0];
        this.xtag.input = xtag.query(this, 'input')[0];
        this.xtag.error = xtag.query(this, '.error')[0];
      }
    },
    accessors: {
      label: {
        attribute:{},
        set: function(value){
          this.xtag.label.textContent = value;
        }
      },
      value: {
        set: function(value){
          this.xtag.input.value = value;
        },
        get: function(){
          return this.xtag.input.value;
        }
      },
      validators: {
        attribute: {}
      },
      inputName: {
        attribute: { name: 'input-name'},
        set: function(value){
          this.xtag.input.setAttribute('name', value);
        }
      }
    },
    methods:{
      isValid: function(){
        var setting = this;
        var errors = xtag.query(document, this.validators).map(function(validator){
          if (!validator.validate(setting.value)){
            return validator.errorMsg.replace('{label}', setting.label);
          } else {
            null;
          }
        }).filter(function(item){
          return item != null;
        });
        if (errors.length>0){
          this.xtag.error.textContent = errors.join(', ');
          this.xtag.error.removeAttribute('hidden');
        } else if(!this.xtag.error.hasAttribute('hidden')) {
          this.xtag.error.setAttribute('hidden','');
          this.xtag.error.textContent = '';
        }
        return errors.length == 0;
      }
    }
  });

  xtag.register('x-app-settings', {
    events: {
      'tap:delegate(.save)': function(e){
        var settings = e.currentTarget;
        if (settings.validate()){
          settings.hide();
          xtag.fireEvent(settings, 'saved');
        }
      }
    },
    methods: {
      'show:transition(before)': function(){
        this.removeAttribute('hidden');
      },
      'hide:transition(after)': function(){
        this.setAttribute('hidden','');
      },
      toggle: function() {
        this[this.hasAttribute('hidden') ? 'show' : 'hide']();
      },
      validate: function(){
        var errors = xtag.query(this, 'x-app-setting').filter(function(setting){
          return !setting.isValid();
        });
        return errors.length == 0;
      },
      getSettings: function(){
        var settings = {};
        xtag.query(this, 'x-app-setting').forEach(function(setting){
          settings[setting.inputName] = setting.value;
        });
        return settings;
      }
    }
  });

  xtag.register('x-app-column', {
    lifecycle: {
      created: function(){
        var frag = xtag.createFragment([
          '<x-layout class="filter-column">',
          '<header class="status-bar">',
            '<span class="add"></span><span class="text"></span><span class="settings"></span>',
          '</header>',
          '<x-app-settings hidden transition="hide">',
            '<x-app-setting label="Title" validators="#validateTitle" input-name="column-title"></x-app-setting>',
            '<x-app-setting label="Filter" validators="#validateTags" input-name="tag-filter"></x-app-setting>',
            '<button class="save">Save</button>',
          '</x-app-settings>',
          '<section></section>',
          '<footer><span class="text"></span></footer>',
          '</x-layout'].join(''))
        this.appendChild(frag.cloneNode(true));
        this.xtag.header = xtag.query(this, 'header > span.text')[0];
        this.xtag.footer = xtag.query(this, 'footer > span.text')[0];
        this.xtag.section = xtag.query(this, 'section')[0];
        this.xtag.settings = xtag.query(this, 'x-app-settings')[0];
      }
    },
    events: {
      'tap:delegate(header .add)':function(e){
        var col = e.currentTarget;
        var edit = document.createElement('x-task-edit');
        xtag.addEvent(edit, 'save', function(){
          var item = document.createElement('x-task-item');
          item.text = edit.text;
          item.tags = edit.tags;
          col.xtag.section.appendChild(item);
          edit.parentElement.removeChild(edit);
          delete edit;
        });
        col.xtag.section.appendChild(edit);
      },
      'tap:delegate(header .settings)':function(e){
        var col = e.currentTarget;
        if (col.xtag.settings.hasAttribute('hidden')){
          col.xtag.settings.show();
        } else {
          col.xtag.settings.hide();
        }
      },
      'saved:delegate(x-app-settings)': function(e){
        var col = e.currentTarget;
        var settings = this.getSettings();
        col.headerLabel = settings['column-title'];
        col.filter = settings['tag-filter'];
      }
    },
    accessors: {
      headerLabel: {
        attribute: { name: 'header-label'},
        set: function(value){
          this.xtag.header.textContent = value;
        }
      },
      footerLabel: {
        attribute: { name: 'footer-label'},
        set: function(value){
          this.xtag.footer.textContent = value;
        }
      },
      filter: {
        attribute: {},
        set: function(value){
          this.xtag.header.setAttribute('title',value);
        }
      }
    }
  });
