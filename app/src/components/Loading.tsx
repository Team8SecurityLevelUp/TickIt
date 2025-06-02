import './loading.css';

export const Loading = () => {
  return (
    <div className='loading-wrapper'>
      <aside className='loading-sidebar'>
        <div className='skeleton skeleton-sidebar-item' />
        <div className='skeleton skeleton-sidebar-item' />
        <div className='skeleton skeleton-sidebar-item' />
      </aside>

      <main className='loading-main'>
        <div className='skeleton skeleton-header' />
        <div className='skeleton skeleton-task' />
        <div className='skeleton skeleton-task' />
        <div className='skeleton skeleton-task' />
      </main>
    </div>
  );
};
