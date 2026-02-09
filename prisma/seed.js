import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.movie.createMany({
        data: [
            {
                title: 'O Horizonte Final',
                description: 'Uma jornada épica rumo aos confins da galáxia.',
                duration: 124,
                genre: 'Ficção Científica',
                rating: 8.5,
                available: true,
            },
            {
                title: 'Sombras da Noite',
                description: 'Um grupo de amigos descobre um segredo em uma casa abandonada.',
                duration: 95,
                genre: 'Terror',
                rating: 6.2,
                available: true,
            },
            {
                title: 'Riso Eterno',
                description: 'As confusões de um atrapalhado guia turístico em Paris.',
                duration: 88,
                genre: 'Comédia',
                rating: 7.4,
                available: true,
            },
            {
                title: 'Laços de Sangue',
                description: 'Uma história emocionante sobre reconciliação familiar.',
                duration: 142,
                genre: 'Drama',
                rating: 9.1,
                available: true,
            },
            {
                title: 'Velocidade Máxima',
                description: 'Perseguições implacáveis nas ruas de uma metrópole futurista.',
                duration: 110,
                genre: 'Ação',
                rating: 7.8,
                available: true,
            },
            {
                title: 'O Enigma do Relógio',
                description: 'Um detetive precisa desvendar um crime antes do tempo acabar.',
                duration: 118,
                genre: 'Suspense',
                rating: 8.2,
                available: true,
            },
            {
                title: 'Amor em Versos',
                description: 'Dois escritores se apaixonam através de cartas anônimas.',
                duration: 105,
                genre: 'Romance',
                rating: 6.9,
                available: true,
            },
            {
                title: 'Mundo de Papel',
                description: 'Uma aventura mágica onde tudo é feito de dobraduras.',
                duration: 82,
                genre: 'Animação',
                rating: 8.8,
                available: true,
            },
            {
                title: 'Invasão Silenciosa',
                description: 'Alienígenas tentam se infiltrar na sociedade sem serem notados.',
                duration: 135,
                genre: 'Ficção Científica',
                rating: 5.5,
                available: true,
            },
            {
                title: 'O Último Suspiro',
                description: 'A luta de um herói de guerra para encontrar seu lugar no mundo.',
                duration: 156,
                genre: 'Drama',
                rating: 9.5,
                available: true,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
