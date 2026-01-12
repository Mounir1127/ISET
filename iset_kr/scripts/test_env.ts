import dotenv from 'dotenv';
dotenv.config();

console.log('Testing environment...');
if (process.env.MONGO_URI) {
    console.log('MONGO_URI is defined (length: ' + process.env.MONGO_URI.length + ')');
} else {
    console.log('MONGO_URI is NOT defined');
}
console.log('Done.');
