
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function testConn() {
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    console.log('URI found:', !!uri);
    if (!uri) return;
    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to MongoDB');
        await mongoose.disconnect();
    } catch (err) {
        console.error('FAILURE:', err);
    }
}
testConn();
