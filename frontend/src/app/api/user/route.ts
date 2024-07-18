import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const dataFilePath = path.resolve(process.cwd(),  'public', 'users.json');
const secretKey = 'your_secret_key'; // Use an environment variable in a real application

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const { email } = decoded as { email: string };

        let users = [];

        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, '[]');
        }

        try {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            console.error('Error reading users file:', error);
        }

        const user = users.find((user: { email: string }) => user.email === email);

        if (user) {
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
