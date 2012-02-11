$(function() {
	//Backbone.emulateJSON = true;
		
	var Book = Backbone.Model.extend({
		url: '/book',
		defaults: {
			title: "Book's title",
			year: 2009,
			author: "Murakami",
			genre: ["horror", "comedy"],
			isbn: "0128127622",
			status: "not read",
			image: "images/placeholder.png",
			date: ''
		},
		initialize: function() {
			//console.log("model's initialize");
		}
	});

	//var book = new Book({});

	var Library = Backbone.Collection.extend({
		url: '/books',
		model: Book,
		initialize: function() {
			//console.log("fsdf");
			//this.fetch();
		}
	});

	var library = new Library({});
	
	var BookView = Backbone.View.extend({
		tagName: 'div',
		className: 'book',

		template: _.template($('#book-template').html()),

		events: {
			"click .book": "clickBook",
			"click a.book-edit": "edit",
			"keypress input": "update",
			"click .book-delete": "remove",
			"click .book-save": "close",
			//$( ".selector" ).bind( "sortchange", function(event, ui) {
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
			this.model.save(this.model.toJSON(), {
				success: function() {
					console.log('success');
				} 
			});
      		$(this.el).removeClass("editing");	
		},

		clickBook: function() {
			console.log("clickBook");
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

		remove: function() {
			if (confirm("Вы уверены?")) {
				$(this.el).remove();
				//this.model.destroy();
			}
		},

		clear: function() {
			this.model.destroy();
		}
				
	});

	var AppView = Backbone.View.extend({
		el: $('#books'),
		
		events: {
			"click button": "create",
			"keypress #book-title": "createOnEnter"
		},

		initialize: function() {
			this.input = this.$('#book-title');
			library.bind('add', this.addOne, this);
			library.bind('reset', this.addAll, this);
			library.bind('all', this.render, this);
			library.fetch();

//			library.bind('add', function(book) {
				//library.fetch({success: function() {
				//	console.log('action!');
					//.this.render();	
				//}});
//			});
			
		},

		render: function() {
			console.log(this.model);
						console.log('app render');
		},

		addOne: function(book) {
			console.log("add one");
			var view = new BookView({model: book});
			//library.create(book.toJSON());
			$(this.el).find('.book-container').append(view.render().el);
		},

		addAll: function() {
			console.log('add all');
			//library.fetch();
			library.each(this.addOne);
		},

		createOnEnter: function(e) {
			if (e.keyCode == 13) this.create();	
		},

		create: function(e) {
			var text = this.input.val();
			library.add({title: text});
			this.input.val('');
		}
	});

	var appView = new AppView();

	library.add([{}, {}, {}]);


	$('.book .book-date').datepicker({});
});