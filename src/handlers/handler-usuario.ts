/*
* handlers para Usuarios
*
*/

// Dependencias
import { Response, Request } from 'express';
import { getRepoUsuario } from '../repo/usuario-repo/repo-usuario-factory';
import { ResultSetHeader } from 'mysql2';
import { connection } from '../database/sql-connection';
import { Usuario } from '../models/model-usuarios';
import { ERR_REPOUSU_LOGIN_JA_EXITE } from '../repo/usuario-repo/repo-usuario-intf';

// Handler para usuario
const usuarioHandler = {
    // Handler para GET 
    getHandler: async (req: Request, res: Response) => {

        try {
            const getAllUsuarios = await getRepoUsuario().getUsuAll()
            res.status(200).send(getAllUsuarios)
            // ORM CODE = ------------
            // const getOrm = await appDataSource.getRepository(IUsuario).find()
            // console.log(getOrm);
            // return res.status(200).send(getOrm)
        } catch (error) {
            console.log(error)

            return res.status(500).send('Erro interno.')
        }
    },

    getIdHandler: async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        const id = req.params.id;
        try {
            const idParaNumero = Number(id)
            if (isNaN(idParaNumero)) {
                return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
            }
            const getOneId = await getRepoUsuario().getUsu({
                id: idParaNumero,
                login: '',
                senha: ''
            })
            res.status(200).send(getOneId)
        } catch (error) {
            console.log('Erro lendo um usuario por ID', error);
            return res.status(500).send('Erro interno');
        }
    },

    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }

        const { login, senha } = req.body;

        if (!login && !senha) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }

        const novoUsuario = new Usuario(login, senha);
        try {
            await getRepoUsuario().saveUsu(novoUsuario);
            const [lastInsertId] = await connection.promise().query<ResultSetHeader>('SELECT LAST_INSERT_ID() AS id')

            res.status(200).send(lastInsertId);
        } catch (error) {
            console.error('Erro  criando usuario:', error);
            res.status(400).send('erro')
        }

    },

    //Handler para PUT
    putHandler: async (req: Request, res: Response) => {

        const id = req.params.id
        const idToNumber = Number(id)
        if (isNaN(idToNumber)) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido')
        };

        const { login, senha } = req.body;

        const usuarioAtualizar = new Usuario(login, senha);
        usuarioAtualizar.id = idToNumber;
        
        if (login && senha) {
            try {
                const putUsuario = await getRepoUsuario().saveUsu(usuarioAtualizar)

                if (putUsuario !== null) {
                    res.status(200).json('Usuario atualizado com sucesso.' );
                } else {
                    res.status(400).send('Erro ao atualizar, utilize um ID válido.');
                }
            } catch (error) {
                console.log('erro putUsuario:' + error);
                return res.status(500).send('Erro interno');
            }
        } else {
            res.status(400).send('Todos os campos devem ser preenchidos')
        }
    },

    // Handlers para DELETE
    deleteHandler: async (req: Request, res: Response) => {

        if (!req.params.id) {
            return res.status(400).send('Utilize um ID correto.')
        };

        const id = req.params.id
        const idToNumber = Number(id)
        if (isNaN(idToNumber)) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
        }

        try {
            const deleteUsuario = await getRepoUsuario().deleteUsu(idToNumber)
            if (deleteUsuario.successo === true) {
                res.status(200).send('Usuario deletado com sucesso.');

            } else if (deleteUsuario.successo === false) {
                res.status(400).send('Nenhum Usuario encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum Usuario encontrado com o ID')
        }
    }
}


export = usuarioHandler