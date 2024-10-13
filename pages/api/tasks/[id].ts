import { supabase } from '@/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === 'PUT') {
        const { id } = req.query;

        if (req.method === 'PUT') {
            const { title, estimated_duration, status } = req.body;

            const { data, error } = await supabase
                .from('tasks')
                .update({ title, estimated_duration, status })
                .eq('id', id)
                .select('*');

            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update task' });
            }

            return res.status(200).json(data);
        } else {
            res.setHeader('Allow', ['PUT']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (req.method === 'DELETE') {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);
    
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to delete task' });
            }
    
            return res.status(204).end();
        }
    }
    
}
