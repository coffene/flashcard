
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const decks = await prisma.deck.findMany();
        console.log('Successfully connected!');
        console.log('Decks found:', decks.length);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
