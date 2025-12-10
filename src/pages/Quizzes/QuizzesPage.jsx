import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { quizApi } from '../../api/quizApi';

export default function QuizzesPage() {
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizApi.getAll(),
    select: (response) => response.data?.data || [],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">❓ Quizzes</h1>
          <p className="text-base-content/70">Test your knowledge with quizzes</p>
        </div>
        <button className="btn btn-primary">+ Create Quiz</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="card bg-base-200 shadow-md hover:shadow-lg transition">
                <div className="card-body">
                  <h2 className="card-title">{quiz.title}</h2>
                  <div className="space-y-2 my-2">
                    <p className="text-sm">
                      <span className="font-semibold">Questions:</span> {quiz.questions?.length || 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Duration:</span> {quiz.duration || 'No limit'}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Subject:</span> {quiz.subject}
                    </p>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary btn-sm">Start Quiz</button>
                    <button className="btn btn-ghost btn-sm">View</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-base-200 rounded-lg">
              <p className="text-base-content/70 text-lg">
                No quizzes yet. Create your first quiz!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
