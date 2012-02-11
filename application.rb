# coding: utf-8
  require 'sinatra'
  require 'data_mapper'
  require 'json'
  require "awesome_print"

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
    {:models => Book.all}.to_json
  end

  post '/books' do
    content_type :json
    
  end

  post '/book' do
      #content_type :json

      raw = request.env["rack.input"].read
      a = JSON.parse raw

      #{:a => a }.to_json
      ap a
  end
