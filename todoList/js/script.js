$('document').ready(function(){


    var ENTER_KEY = 13;
    var ESC_KEY = 27;
    var model, view, control;
    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });


    var Router = {
        routes: [],
        mode: null,
        root: '/',
        config: function(options) {

            this.mode = options && options.mode && options.mode == 'history'
                        && !!(history.pushState) ? 'history' : 'hash';
            this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
            return this;
        },
        getFragment: function() {
            var fragment = '';
            if(this.mode === 'history') {
                fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
                fragment = fragment.replace(/\?(.*)$/, '');
                fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
            } else {
                var match = window.location.href.match(/#(.*)$/);
                fragment = match ? match[1] : '';
            }
            return this.clearSlashes(fragment);
        },
        clearSlashes: function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        add: function(re, handler) {
            if(typeof re == 'function') {
                handler = re;
                re = '';
            }
            this.routes.push({ re: re, handler: handler});
            return this;
        },
        remove: function(param) {
            for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
                if(r.handler === param || r.re.toString() === param.toString()) {
                    this.routes.splice(i, 1);
                    return this;
                }
            }
            return this;
        },
        flush: function() {
            this.routes = [];
            this.mode = null;
            this.root = '/';
            return this;
        },
        check: function(f) {
            var fragment = f || this.getFragment();
            for(var i=0; i<this.routes.length; i++) {
                var match = fragment.match(this.routes[i].re);
                if(match) {
                    match.shift();
                    this.routes[i].handler.apply({}, match);
                    return this;
                }
            }
            return this;
        },
        listen: function() {
            var self = this;
            var current = self.getFragment();
            var fn = function() {
                if(current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            }
            clearInterval(this.interval);
            this.interval = setInterval(fn, 50);
            return this;
        },
        navigate: function(path) {
            path = path ? path : '';
            if(this.mode === 'history') {
                history.pushState(null, null, this.root + this.clearSlashes(path));
            } else {
                window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
            }
            return this;
        }
    }


    var util = {
        uuid: function () {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function (namespace, data) {
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        }
    };

    function autosize(el){
      setTimeout(function(){
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';

        el.style.cssText = 'height:' + el.scrollHeight + 'px';

      },0);
    }



    model=  (function Model(){
            var list;
            /*{
                id,completed,descript
            }
            */
            return {
                init: function(){
                    list = util.store('jhong-todo');
                },
                save: function(todos){
                    util.store('jhong-todo', todos);
                },
                newTodo: function(todo){
                    list.push(todo);
                },
                indexOf: function(id){
                    let  index = 0,
                         n = list.length;
                    while(index < n){
                        if(list[index].id === id){
                            return index;
                        }
                        index++;
                    }
                    return -1;
                },
                toggleCompleted: function(id){
                    var index = this.indexOf(id)
                    list[index].completed = !list[index].completed;

                },
                destroy: function(id){
                    var index = this.indexOf(id);
                    list.splice(index,1);
                },
                update: function(id, val){
                    var index = this.indexOf(id);
                    list[index].descript = val;
                },
                destroyCompleted: function(){
                    var activeList = this.getActiveTodos();
                    console.log(activeList);
                    list = activeList;
                },
                getActiveTodos:function(){
                    return list.filter(function(todo){
                        return !todo.completed;
                    })
                },
                getCompletedTodos:function(){
                    return list.filter(function(todo){
                        return todo.completed;
                    })
                },
                getList: function(){
                    return list;
                }
            }

    })()

    view = {
        init:function(){
            this.todoList = $('#todo-list');
            this.footerBar = $('#footer-bar');
            this.todoListTemplate = Handlebars.compile($('#todo-list-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
        },

        addTodo: function(todo){
            this.todoList.append(this.todoListTemplate(todo));
        },

        render: function(){
            this.todoList.html('');
            var todos = control.filterTodos();
            this.todoList.html(this.todoListTemplate({todos:todos}));

            this.renderFooter();


            //save data to localstorage
            model.save(todos)
        },
        renderFooter:function(){
            this.footerBar.html('');

           // this.todoCount.append(`<strong>${count}</strong> <span>${atricle}</span> left`);

            var content ={
                count: model.getActiveTodos().length,
                disableClearCompleted : model.getCompletedTodos().length === 0,
                article : util.pluralize(this.count,'item'),
                filter: control.todosFilter
            }


            this.footerBar.append(this.footerTemplate(content));
        }



    }

    control={
        init:function(){


            //filte

            model.init();
            view.init();
            this.bindEvents();

                        // configuration
            Router.config();

            // returning the user to the initial state
            Router.navigate();

            // adding routes
            var self = this;
            Router
            .add(/^all$/, function(){

                self.todosFilter = 'all';
                view.render();

            })
            .add(/^active$/, function() {
                self.todosFilter = 'active';
                view.render();

            })
            .add(/^completed$/, function() {
               self.todosFilter = 'completed';
               view.render();

            })
            //default
            .add(function() {
                self.todosFilter = 'all';
                view.render();
            })
            .listen()
            .navigate('/all');



        },
        bindEvents: function(){
            $('#new-todo').on('keyup', this.create);
            $('#footer-bar').on('click','#clear-completed', this.destroyCompleted)

            $('#todo-list').on('change', '.toggle-completed', this.toggleCompleted)
                           .on('click', '.destroy', this.destroy)
                           .on('dblclick', '.todo-content', this.editing)
                           .on('focusout', '.todo-edit',  this.editFocusout)
                           .on('keyup','.todo-edit', this.editKeyup)


        },
        create:function(e){
            var $input = $(e.target);
            if(e.which == ENTER_KEY) {
                e.preventDefault();

                if($input.val() == ''){
                    return ;
                }

                model.newTodo({
                    id:util.uuid(),
                    completed:false,
                    descript:$input.val()
                });

                $input.val('');

                view.render();

            }
        },
        toggleCompleted: function(e){
            e.preventDefault();
            //get id from view;
            var id = $(e.target).closest( "li" ).data('id');

            //toggle completed by id
            model.toggleCompleted(id);
            //render with new model
            view.render();
        },
        destroy: function(e){
            var id = $(e.target).closest( "li" ).data('id');
            model.destroy(id);
            view.render();
        },
        destroyCompleted: function(){
            console.log('destroy completed')
            model.destroyCompleted();
            view.render();
        },
        editing: function(e){
            e.preventDefault();
            var edit = $(e.target).closest( "li" ).addClass('editing').find('.todo-edit')[0];

            //!! using dom method
            edit.focus();
            edit.setSelectionRange(edit.value.length, edit.value.length);
        },
        editKeyup: function(e){
            var keyFunction = {
                [ESC_KEY]: function(){
                    $(e.target).val($(e.target).siblings('.todo-content').text().trim())
                    $(e.target).closest( "li" ).removeClass('editing');
                    e.target.blur();
                },
                [ENTER_KEY]: function(){
                    e.target.blur();
                }
            }

            var foo = keyFunction[e.which];

            if (typeof foo === 'function'){
                e.preventDefault();
                foo();
            }else{
                autosize(e.target)
            }
        },
        editFocusout: function(e){
            e.preventDefault();
            var id = $(e.target).closest( "li" ).removeClass('editing').data('id');
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (val ==''){
                model.destroy(id);
            }else{
                model.update(id, val);
            }
            view.render();
        },
        filterTodos: function(){
            var fn = {
                all:  model.getList,
                active: model.getActiveTodos,
                completed: model.getCompletedTodos
            }
            return fn[this.todosFilter].call(model);
        }

    }

control.init();


})



