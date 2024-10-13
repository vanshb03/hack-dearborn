'use client'
import { useEffect, useState } from 'react';
import {Spinner} from "@nextui-org/spinner";
import { Button } from '@nextui-org/button';
import { useAuth } from '../hooks/useAuth';

const Tasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {access_token} = useAuth();
    const fetchTasks = async () => {
        setIsLoading(true);
        const response = await fetch('/api/tasks', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDeleteTask = async (id: string) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(task => task.id !== id));
    };
    
    const render = () => {
      if (isLoading) return <Spinner size="md"  color='primary'/>;
      else return (
        <>  
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black">Tasks</h2>
            <ul className="space-y-2">
                {tasks.length && tasks.map(task => (
                    <li key={task.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                        <span className="text-gray-800">{task.title} - {task.estimated_duration} min</span>
                        <Button 
                        variant='solid'
                            onClick={() => handleDeleteTask(task.id)} 
                            className="text-white bg-red-500 transition duration-200"
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        { render() }
      </div>
    );
};

export default Tasks;
