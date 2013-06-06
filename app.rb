# encoding: UTF-8

require 'sinatra'
require 'haml'
require 'data_mapper'
require 'dm-migrations'
require File.dirname(__FILE__) + '/models.rb'
require 'pp'

enable :session
set :logging, true

#PRINCIPAL
get '/' do
	File.read(File.join('views', 'index.html'))
end

get '/como-funciona' do
	haml :comofunciona
end

post '/busca' do
	params[:busca].empty? redirect back
	
	@denuncias = Denuncia.all(:denuncia.like => "%#{params[:busca]}%")
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
		if params[:foto].nil?
			foto = nil
		else
		    foto = params[:foto][:filename]
		    File.open('public/img/uploads/' + params[:foto][:filename], "w") do |f|
		   		f.write(params[:foto][:tempfile].read)
		   	end
		end

		@denuncia = Denuncia.create(
			:resumo => params[:resumo],
			:endereco => params[:endereco],
			:denuncia => params[:denuncia],
			:foto => foto,
			:data => Date.today.strftime("%d-%m-%Y")
		)

		if @denuncia.save

		elsif  @denuncia.errors && defined? params[:foto][:type]
			if params[:foto][:type] != "image/jpeg"
				session[:errofoto] = "Formato de imagem inválido"
			end
			session[:errors] = @denuncia.errors.values.map{|e| e.to_s}
		else
			session[:errors] = @denuncia.errors.values.map{|e| e.to_s}
		end
	end
end

put '/denuncias/:id' do

end

delete '/denuncias/:id' do
	@denuncia = Denuncia.get(params[:id])
	@denuncia.destroy
end

#USUÁRIOS
post '/usuarios' do
end

get '/usuarios' do
end

get '/usuarios/:id' do
end

put '/usuarios/:id' do
end

delete '/usuarios/:id' do
end

#ERROS
not_found do
	haml :'404', :layout => false
end