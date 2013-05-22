# encoding: UTF-8

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://root:qwe123@localhost/denunciasjp')

class Denuncia
	include DataMapper::Resource

	property :id,	Serial

	property :autor,	String

	property :resumo,	String,  :required => true,
		:messages => {
			:presence => 'Resumo é obrigatório'
		}

	property :descricao,	Text,  :required => true,
		:messages => {
			:presence => 'Descrição é obrigatória'
		}

	property :endereco,	String

	property :foto,	String

	property :data,	DateTime

	validates_length_of :resumo, :max => 60
end

DataMapper.auto_upgrade!