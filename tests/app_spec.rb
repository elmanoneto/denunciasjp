require File.dirname(__FILE__)+'/spec_helper'
require 'test/unit'
require 'json'

describe 'DenunciasJP' do
	include Rack::Test::Methods

	def app
		Sinatra::Application
	end

	it 'should open the index page' do
		get '/'
		last_response.status == 200
	end
end