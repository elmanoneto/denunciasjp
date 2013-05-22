# encoding: UTF-8

require 'sinatra'
require 'rubygems'
require 'haml'
require 'data_mapper'
require 'dm-migrations'
require File.dirname(__FILE__) + '/models.rb'
require 'pp'

enable :session
set :logging, true

#PRINCIPAL

get '/' do
	haml :index
end

get '/como-funciona' do
	haml :comofunciona
end

post '/busca' do
	if params[:busca] == ""
		redirect back
	end
	
	@denuncias = Denuncia.all(:descricao.like => "%#{params[:busca]}%")
	@denuncias.to_json
end

#DENÚNCIAS

get '/denuncias' do
	@denuncias = Denuncia.all(:order => [:id.desc])
	@denuncias.to_json
end

get '/denuncias/:id' do
	@denuncias = Denuncia.get(params[:id])
	@denuncias.to_json
end

post '/denuncias' do
	unless params[:denuncia].nil?
		denuncia = params[:denuncia]

		@denuncia = Denuncia.create(
			:resumo => denuncia[:resumo],
			:endereco => denuncia[:endereco],
			:descricao => denuncia[:descricao],
		)

		if @denuncia.save
			puts 'Salvou'
		else
			session[:errors] = @denuncia.errors.values.map{|e| e.to_s}
		end
	end
	haml :'denuncias/add'
end

put '/denuncias/:id' do

end

delete '/denuncias/:id' do
	@denuncia = Denuncia.get(params[:id])
	@denuncia.destroy
end

not_found do
	haml :'404', :layout => false
end