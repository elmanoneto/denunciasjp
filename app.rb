# encoding: UTF-8
require 'sinatra'
require 'data_mapper'
require 'dm-migrations'
require File.dirname(__FILE__) + '/models.rb'
require 'pp'
require 'json'

enable :session
set :logging, true

#PRINCIPAL

# Retorna a página principal do site
get '/' do
	File.read(File.join('views', 'index.hbs'))
	# haml :index
end

# Retorna página explicando como o site funciona
get '/como-funciona' do
	haml :comofunciona
end

# Retorna busca
post '/busca' do
	params[:busca].empty? redirect back
	
	@denuncias = Denuncia.all(:denuncia.like => "%#{params[:busca]}%")
	@denuncias.to_json
end

#DENÚNCIAS

# Retorna lista de denúncias
get '/denuncias' do
	@denuncias = Denuncia.all(:order => [:id.desc], :limit => 10)
	@denuncias.to_json
end

# Retorna denúncia individual
get '/denuncias/:id' do
	@denuncias = Denuncia.get(params[:id])
	@denuncias.to_json
end

# Registrar denúncia
post '/denuncias' do
	unless params.nil?
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
			redirect '/'
		elsif  @denuncia.errors && defined? params[:foto][:type]
			if params[:foto][:type] != "image/jpeg"
				@denuncia.errors.add(:foto, "Formato de imagem inválido.")
			end
			erros = @denuncia.errors.values.map{|e| e.to_s}
			#redirect '/#registrar-denuncia'
			erros
		else
			erros = @denuncia.errors.values.map{|e| e.to_s}
			#redirect '/#registrar-denuncia'
			erros
		end
	end
	# haml :'denuncias/add'
end

#Cadastre-Se
post '/usuarios' do
	unless params.nil?
		
		@usuario = Usuario.create(
			:nome => params[:nome],
			:email => params[:email],
			:login => params[:login],
			:senha => params[:senha]
		)

		if @usuario.save
			redirect '/'
		else
			erros = @usuario.errors.values.map{|e| e.to_s}
			erros
		end
	end
end



# Editar denúncia
put '/denuncias/:id' do

end

# Deletar denúncia
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
# not_found do
# 	haml :'404', :layout => false
# end
