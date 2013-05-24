# encoding: UTF-8
require File.dirname(__FILE__)+'/spec_helper'
require File.join(File.dirname(__FILE__), '..', 'app.rb')
require 'test/unit'
require 'rack/test'

set :environment, :test

class DenunciasJPTests < Test::Unit::TestCase

  def test_it_says_hello_world
    browser = Rack::Test::Session.new(Rack::MockSession.new(Sinatra::Application))
    browser.get '/'
    assert browser.last_response.ok?
    assert_equal 'index page', browser.last_response.body
  end

  def test
    browser = Rack::Test::Session.new(Rack::MockSession.new(Sinatra::Application))
    browser.get '/denuncias'
    assert browser.last_response.body.empty? == false
  end
end