import prisma from '../utils/prismaClient.js';

export const findAll = async (filters = {}) => {
    const { title, maxDuration, genre, available, minRating } = filters;
    const where = {};

    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (available !== undefined) where.available = available;
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (maxDuration) where.duration = { lte: parseFloat(maxDuration) };

    return await prisma.movie.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
};

export const findById = async (id) => {
    return await prisma.movie.findUnique({
        where: { id: parseInt(id) },
    });
};

export const remove = async (id) => {
    return await prisma.movie.delete({
        where: { id: parseInt(id) },
    });
};

export const create = async (data) => {
    return await prisma.movie.create({ data });
};

export const update = async (id, data) => {
    return await prisma.movie.update({
        where: { id: parseInt(id) },
        data,
    });
};