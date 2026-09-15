import React, { useState } from 'react';
import { ScreenType, TaskTab, ReviewTask, CompletedReview } from './types';
import { INITIAL_TASK, INITIAL_COMPLETED_REVIEWS } from './data/artworks';
import { Sidebar } from './components/Sidebar';
import { TaskListScreen } from './components/TaskListScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { DoneScreen } from './components/DoneScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [task, setTask] = useState<ReviewTask>(INITIAL_TASK);
  const [isTaskSent, setIsTaskSent] = useState<boolean>(false);
  const [screen, setScreen] = useState<ScreenType>('list');
  const [activeTab, setActiveTab] = useState<TaskTab>('todo');
  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>(
    INITIAL_COMPLETED_REVIEWS
  );

  // Navigate back to list screen
  const handleBackToList = () => {
    setScreen('list');
    if (isTaskSent) {
      setActiveTab('done');
    }
  };

  // Open review screen
  const handleSelectTaskToReview = () => {
    setScreen('review');
  };

  // When review is submitted
  const handleSubmitResult = (updatedTask: ReviewTask) => {
    setTask(updatedTask);
    const fixCount = updatedTask.pages.filter(
      (p) => p.strokes.length > 0 || Boolean(p.comment)
    ).length;

    const newCompletedItem: CompletedReview = {
      id: `done-${Date.now()}`,
      name: updatedTask.name,
      coll: updatedTask.coll,
      designer: updatedTask.designer,
      when: 'วันนี้ 09:41',
      result: fixCount > 0 ? 'ขอแก้' : 'ผ่าน',
      img: updatedTask.pages[0].src,
      pageSummaries: updatedTask.pages.map((p) => ({
        tag: p.tag,
        result: p.strokes.length > 0 || Boolean(p.comment) ? 'ขอแก้' : 'ผ่าน',
      })),
    };

    setCompletedReviews((prev) => [newCompletedItem, ...prev]);
    setIsTaskSent(true);
    setScreen('done');
  };

  return (
    <ErrorBoundary>
      <div id="mm-track-app" className="flex h-screen w-full overflow-hidden bg-white">
        {/* Sidebar for Desktop */}
        <Sidebar
          todoCount={isTaskSent ? 0 : 1}
          currentScreen={screen}
          onNavigateToList={handleBackToList}
        />

        {/* Main View Area */}
        <main id="main-content" className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">
          {screen === 'list' && (
            <TaskListScreen
              task={task}
              isTaskSent={isTaskSent}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelectTaskToReview={handleSelectTaskToReview}
              completedReviews={completedReviews}
            />
          )}

          {screen === 'review' && (
            <ReviewScreen
              task={task}
              onBackToList={handleBackToList}
              onSubmitResult={handleSubmitResult}
            />
          )}

          {screen === 'done' && (
            <DoneScreen task={task} onBackToList={handleBackToList} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
