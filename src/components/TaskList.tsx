import React, { useState, useEffect } from 'react';
import { Models, Query, ID } from 'appwrite';
import { databases, DATABASE_ID, TASKS_COLLECTION_ID } from '../lib/appwrite';
import { Loader2, Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Task {
  $id: string;
  title: string;
  completed: boolean;
  user_id: string;
  $createdAt: string;
}

interface TaskListProps {
  userId: string;
}

export default function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const loadTasks = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
      );
      setTasks(response.documents as Task[]);
    } catch (error) {
      toast.error('Taken laden mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          title: newTask.trim(),
          completed: false,
          user_id: userId,
        }
      );
      setTasks([response as Task, ...tasks]);
      setNewTask('');
      toast.success('Taak toegevoegd');
    } catch (error) {
      toast.error('Taak toevoegen mislukt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskId,
        { completed }
      );
      setTasks(tasks.map(task => 
        task.$id === taskId ? { ...task, completed } : task
      ));
    } catch (error) {
      toast.error('Taak bijwerken mislukt');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskId
      );
      setTasks(tasks.filter(task => task.$id !== taskId));
      toast.success('Taak verwijderd');
    } catch (error) {
      toast.error('Taak verwijderen mislukt');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 mt-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Mijn Lijstje</h2>
      
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Voeg een nieuwe taak toe..."
            className="flex-1 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 px-4"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTask.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-gray-900"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Toevoegen
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-4">Nog geen taken. Voeg er hierboven één toe!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.$id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTask(task.$id, !task.completed)}
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    task.completed
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-gray-600 hover:border-teal-500'
                  }`}
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </button>
                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.$id)}
                className="text-gray-500 hover:text-red-400 focus:outline-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}