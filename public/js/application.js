$(function() {
	var Book = Backbone.Model.extend({
		defaults: {
			title: "Book's title",
			year: 2009,
			author: "Murakami",
			genre: ["horror", "comedy"],
			isbn: "0128127622",
			status: "not read",
			image: "/images/placeholder.png",
			date: ''
		},
	});

	var Library = Backbone.Collection.extend({
		//localStorage: new Store("BackboneCollection"),
		url: '/books',
		model: Book,
	});

	var library = new Library({});
	
	var BookView = Backbone.View.extend({
		tagName: 'div',
		className: 'book',

		template: _.template($('#book-template').html()),

		events: {
			"click a.book-edit": "edit",
			"keypress input": "update",
			"click .book-delete": "clear",
			"click .book-save": "close",
		},


		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		update: function(e) {
			if (e.keyCode == 13) this.close();	
		},

		close: function() {
			this.model.set(this._get());
			this.model.save(this.model.toJSON());
      		$(this.el).removeClass("editing");	
		},

		render: function() {
			console.log("book view render");
			$(this.el).html(this.template(this.model.toJSON()));
			$(this.el).css({'background': ' no-repeat url(' + this.model.get('image') + ')'});
			this.setText();
			return this;
		},

		setText: function() {
			var text = this.model.get('title');
			this.$('.book span.book-title').text(text);
			this.inputTitle = this.$('input.book-title');
			this.inputYear = this.$('input.book-year');
			this.inputAuthor = this.$('input.book-author');
			this.inputGenre = this.$('input.book-genre');
			this.inputIsbn = this.$('input.book-isbn');
			this.inputStatus = this.$('select.book-status');
			this.inputDate = this.$('input.book-date');
			//this.input.bind('blur', _.bind(this.close, this)).val(text);
		},
		_fillForm: function() {
			var data = this.model.toJSON();
			this.inputTitle.val(data.title);
			this.inputYear.val(data.year);
			this.inputAuthor.val(data.author);
			this.inputGenre.val(data.genre);
			this.inputIsbn.val(data.isbn);
			this.inputStatus.val(data.status);
			this.inputDate.val(data.date);
		},

		_get: function() {
			return {
				title: this.inputTitle.val(),
				year: this.inputYear.val(),
				author: this.inputAuthor.val(),
				genre: this.inputGenre.val(),
				isbn: this.inputIsbn.val(),
				status: this.inputStatus.val(),
				date: this.inputDate.val()
			}
		},

		edit: function() {
			$('div.book').removeClass('editing');
			$(this.el).addClass('editing').find('input, select').fadeIn('slow');
			this._fillForm();
			this.inputTitle.focus();
			return false;
		},

		clear: function() {
			if (confirm("Вы уверены?")) {
				//$(this.el).remove();
				this.model.destroy();
			}
		},

		remove: function() {
			//this.model.destroy();
			$(this.el).fadeOut('slow', function() {$(this).remove()});
			console.log('clear');
		}
				
	});

	var AppView = Backbone.View.extend({
		el: $('#books'),
	//id: 'books',
		
		events: {
			"click button": "create",
			"keypress #book-title": "createOnEnter"
		},

		initialize: function() {
			this.input = this.$('#book-title');
			library.bind('add', this.addOne, this);
			library.bind('reset', this.addAll, this);
			library.bind('all', this.render, this);
			console.log('library fetch');
			//console.log(library.fetch());
			library.fetch();
		},

		render: function() {
			console.log('app render');
		},

		addOne: function(book) {
			var view = new BookView({model: book});
			var content = view.render().el;
			$(content).hide();
			$('#books').find('.book-container').prepend(content);
			$(content).show(1000);
		},

		addAll: function() {
			library.each(this.addOne);
		},

		createOnEnter: function(e) {
			if (e.keyCode == 13) {
				console.log("enter");
				this.create();	
			}
		},

		create: function(e) {
			var text = this.input.val();
			library.create({title: text});
			this.input.val('');
		}
	});

	var appView = new AppView();

	//library.create([{}, {}, {}]);


	$('.book .book-date').datepicker({});

	//console.log(Store.findAll());
});