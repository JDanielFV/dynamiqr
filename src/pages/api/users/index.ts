import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.resolve(process.cwd(), 'public', 'users.json');

const readUsers = async () => {
  const data = await fs.promises.readFile(usersFilePath, 'utf8');
  return JSON.parse(data);
};

const writeUsers = async (users: any[]) => {
  await fs.promises.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userRole = req.headers['x-user-role'] as string;

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can manage users' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const users = await readUsers();
        res.status(200).json(users);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      try {
        const { email, password, role, limit } = req.body;
        if (!email || !password || !role) {
          return res.status(400).json({ message: 'Email, password, and role are required' });
        }

        const users = await readUsers();
        const newUserId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
        const newUser = { id: newUserId, email, password, role, limit: limit || 50 };
        users.push(newUser);
        await writeUsers(users);
        res.status(201).json(newUser);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, limit } = req.body;
        if (!id || !limit) {
          return res.status(400).json({ message: 'User ID and limit are required' });
        }

        let users = await readUsers();
        const userIndex = users.findIndex((u: any) => u.id === id);

        if (userIndex === -1) {
          return res.status(404).json({ message: 'User not found' });
        }

        users[userIndex].limit = limit;
        await writeUsers(users);
        res.status(200).json(users[userIndex]);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: 'User ID is required' });
        }

        let users = await readUsers();
        const initialLength = users.length;
        users = users.filter((u: any) => u.id !== parseInt(id as string));

        if (users.length === initialLength) {
          return res.status(404).json({ message: 'User not found' });
        }

        await writeUsers(users);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
