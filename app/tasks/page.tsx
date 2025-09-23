'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';

const Tasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    
    const fetchTasks = async () => {
        setIsLoading(true);
        const response = await fetch('/api/tasks', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const handleDeleteTask = async (id: string) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(task => task.id !== id));
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Your Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tasks.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">No tasks found.</p>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-card">
                                        <div>
                                            <span className="font-medium text-foreground">{task.title}</span>
                                            <p className="text-sm text-muted-foreground">{task.estimated_duration} minutes</p>
                                        </div>
                                        <Button 
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Tasks;
