# encoding: UTF-8

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://root:qwe123@localhost/denunciasjp')

class Denuncia
	include DataMapper::Resource

	property :id, Serial
	property :autor, String
	property :resumo, String,  :required => true,
		:messages => {
			:presence => 'Resumo é obrigatório'
		}
		 validates_length_of :resumo, :max => 50, 
		 	:message => 'Resumo excedeu o limite de caracteres'
	property :denuncia,	Text,  :required => true,
		:messages => {
			:presence => 'Descrição é obrigatória'
		}
	property :endereco, Text
	property :foto, String
	property :data, DateTime
end

class Comentario
	include DataMapper::Resource

	property :id, Serial
	property :autor, String
	property :data, DateTime
	property :comentario, Text
end

#DataMapper.auto_migrate!
DataMapper.auto_upgrade!