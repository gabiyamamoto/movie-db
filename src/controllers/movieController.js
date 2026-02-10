import * as movieModel from '../models/movieModel.js';

const validGenres = [
    'Ação',
    'Drama',
    'Comédia',
    'Terror',
    'Romance',
    'Animação',
    'Ficção Científica',
    'Suspense',
];

export const getAll = async (req, res) => {
    try {
        const filters = {};

        if (req.query.title) filters.title = req.query.title;
        if (req.query.genre) filters.genre = req.query.genre;
        if (req.query.available !== undefined) filters.available = req.query.available === 'true';
        if (req.query.minRating) filters.minRating = req.query.minRating;
        if (req.query.maxDuration) filters.maxDuration = req.query.maxDuration;

        const movies = await movieModel.findAll(filters);

        if (!movies || movies.length === 0) {
            return res.status(200).json({
                message: 'Nenhum registro encontrado.',
            });
        }
        res.status(200).json({
            total: movies.length,
            message: 'Lista de filmes disponíveis',
            filters,
            movies,
        });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await movieModel.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.status(200).json({
            message: 'Lista de filmes disponíveis',
            data,
        });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id, rating } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (parseFloat(rating) >= 9)
            return res.status(403).json({
                error: 'Não é possível apagar registros com rating maior ou igual a 9',
            });

        const exists = await movieModel.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await movieModel.remove(id);
        res.json({
            message: `O registro "${exists.title}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
    }
};

export const create = async (req, res) => {
    try {

        const { title, description, duration, genre, rating, available } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do movie!',
            });
        }
        //R1
        if (!title || title.trim().length < 3)
            return res.status(400).json({
                error: 'O título (title) é obrigatório e deve ter pelo menos 3 caracteres!',
            });
        //R2
        if (!description || description.trim().length < 10)
            return res.status(400).json({
                error: 'A descrição (description) é obrigatória e deve ter pelo menos 10 caracteres!',
            });
        //Estrutura Dados
        if (!duration)
            return res.status(400).json({
                error: 'A duração (duration) é obrigatória!',
            });
        //Estrutura Dados
        if (!genre) return res.status(400).json({ error: 'O genêro (genre) é obrigatório!' });

        //R3
        if (isNaN(parseInt(duration)) || duration <= 0)
            return res.status(400).json({
                error: 'A duração deve ser um número inteiro positivo.',
            });
        //R4
        if (duration > 300)
            return res.status(400).json({
                error: 'A duração deve ser um número inteiro positivo.',
            });
        //R6
        if (isNaN(rating) || rating < 0 || rating > 10)
            return res.status(400).json({
                error: 'A nota (rating) deve estar entre 0 e 10',
            });
        //R5
        if (!validGenres.includes(genre)) {
            return res.status(400).json({ error: 'Gênero inválido. Valores permitidos' + validGenres.join(', ') });
        }

        const data = await movieModel.create({
            title,
            description,
            duration,
            genre,
            rating,
            available: true
        });

        res.status(201).json({
            message: 'Registro cadastrado com sucesso!',
            data,
        });

    } catch (error) {
        //R7
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Já existe um filme com esse título!',
            });
        };

        console.error('Erro ao criar:', error);

        res.status(500).json({ error: 'Erro interno no servidor ao salvar o registro.' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, genre, rating, available } = req.body;

        if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await movieModel.findById(id);

        if (!exists) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        };

        //R8
        if (available === false)
            return res.status(400).json({ error: 'Filmes com available = false não podem ser atualizados' });

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do filme!',
            });
        };

        if (title !== undefined) {
            if (!title || title.trim().length < 3)
                return res.status(400).json({
                    error: 'O título (title) é obrigatório e deve ter pelo menos 3 caracteres!',
                });
        };

        if (description !== undefined) {
            if (!description || description.trim().length < 10)
                return res.status(400).json({
                    error: 'A descrição (description) é obrigatória e deve ter pelo menos 10 caracteres!',
                });
        };

        if (duration !== undefined) {
            if (isNaN(parseInt(duration)) || duration <= 0 || duration > 300)
                return res.status(400).json({
                    error: 'A duração deve ser um número inteiro positivo e menor que 300 min!',
                });
        };

        if (rating !== undefined) {
            if (isNaN(rating) || rating < 0 || rating > 10)
                return res.status(400).json({
                    error: 'A nota (rating) deve estar entre 0 e 10',
                });
        };

        if (genre !== undefined) {
            if (!validGenres.includes(genre))
                return res.status(400).json({ error: 'Gênero inválido. Valores permitidos' + validGenres.join(', ') });
        };

        if (available !== undefined) {
            if (typeof available !== 'boolean')
                return res.status.json({
                    error: 'Available deve ser boolean (true ou false).'
                });
        };

        const updatedData = {
            title: title ?? exists.title,
            description: description ?? exists.description,
            duration: duration ?? exists.duration,
            genre: genre ?? exists.genre,
            rating: rating ?? exists.rating,
            available: available ?? exists.available,
        };

        const data = await movieModel.update(id, updatedData);
        res.json({
            message: `O registro "${data.title}" foi atualizado com sucesso!`,
            data,
        });

    } catch (error) {

                if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Já existe um filme com esse título!',
            });
        };
        
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
};
