# coding: utf-8
  require 'sinatra'
  require 'data_mapper'
  require 'json'

  DataMapper.setup(:default, ENV['DATABASE_URL'] || 'sqlite:./db/books.db')

  class Book
    include DataMapper::Resource

    property :id,           Serial
    property :title,        String
    property :year,         Integer
    property :date,         Date
    property :image,        String
    property :author,       String
    property :genre,        String
    property :isbn,         String
    property :status,       String

  end

  DataMapper.finalize

  get '/' do
    File.read('./public/index.html')
  end 

  get '/books' do
    content_type :json
    Book.all(:order => :id).to_json
  end

  post '/books' do
    data = JSON.parse(request.body.gets)
    Book.create(:title => data['title']);
=begin
  The input stream is an IO-like object which contains the raw HTTP POST data. When applicable, its external encoding must be “ASCII-8BIT” and it must be opened in binary mode, for Ruby 1.9 compatibility. The input stream must respond to gets, each, read and rewind.
gets must be called without arguments and return a string, or nil on EOF.
=end
  
  end

  put '/books/:id' do
    data = JSON.parse(request.body.gets)
    book = Book.get(params[:id])
    result = book.update(
      :title => data['title'],
      :year => data['year'],
      :author => data['author'],
      :genre => data['genre'],
      :isbn => data['isbn'],
      :status => data['status'],
      :image => '/images/placeholder.png', #data['image'],
      :date => Time.now
    )
    "false" unless result
  end

  delete '/books/:id' do
    Book.get(params[:id]).destroy
  end
