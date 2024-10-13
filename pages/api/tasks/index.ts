import { supabase } from '@/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === 'POST') {
        const { user_id, title, estimated_duration } = req.body;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ user_id, title, estimated_duration, status: 'pending' }])
            .select('*');

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create task' });
        }
        
        return res.status(201).json(data);
    } else if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        
        return res.status(200).json(data);
    }
}
