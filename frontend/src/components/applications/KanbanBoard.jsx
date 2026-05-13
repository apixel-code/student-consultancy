import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { APPLICATION_STATUSES, STATUS_CONFIG, PRIORITY_CONFIG, TERMINAL_STATUSES, formatIntake } from '../../constants/application.js';

// ─── Draggable Card ────────────────────────────────────────────────────────────

const KanbanCard = ({ app, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app._id,
    data: { app },
    disabled: false,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const priorityCfg = PRIORITY_CONFIG[app.priority] || PRIORITY_CONFIG.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        'bg-white rounded-xl border border-gray-100 p-3 cursor-grab active:cursor-grabbing select-none',
        'shadow-sm hover:shadow-md transition-shadow',
        isDragging ? 'opacity-40 ring-2 ring-blue-400' : '',
        isOverlay ? 'rotate-1 shadow-xl ring-2 ring-blue-400 opacity-100' : '',
      ].join(' ')}
    >
      {/* Student */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0 uppercase">
          {app.student?.name?.[0] || '?'}
        </div>
        <p className="text-sm font-medium text-gray-900 truncate">{app.student?.name}</p>
      </div>

      {/* University & Course */}
      <p className="text-xs text-gray-600 font-medium truncate">{app.course?.name}</p>
      <p className="text-xs text-gray-400 truncate">{app.university?.name}</p>

      {/* Intake */}
      <p className="text-xs text-gray-400 mt-1.5">
        {formatIntake(app.intakeMonth, app.intakeYear)}
      </p>

      {/* Priority badge */}
      <div className="mt-2.5 flex items-center justify-between">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityCfg.class}`}>
          {priorityCfg.label}
        </span>
        {app.counselor && (
          <span className="text-[10px] text-gray-400 truncate max-w-[80px]">
            {app.counselor.name}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Droppable Column ──────────────────────────────────────────────────────────

const KanbanColumn = ({ status, applications }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: 'column', status },
  });

  const cfg = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col flex-shrink-0 w-56">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${cfg.header}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{cfg.icon}</span>
          <span className="text-xs font-semibold truncate">{status}</span>
        </div>
        <span className="text-xs font-bold bg-white/60 rounded-full px-1.5 min-w-[20px] text-center">
          {applications.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 min-h-[200px] rounded-b-xl border border-t-0 p-2 space-y-2 transition-colors',
          cfg.column,
          isOver ? 'ring-2 ring-blue-400 ring-inset' : '',
        ].join(' ')}
      >
        {applications.length === 0 && (
          <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-xs text-gray-300">Drop here</p>
          </div>
        )}
        {applications.map((app) => (
          <KanbanCard key={app._id} app={app} />
        ))}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const KanbanSkeleton = () => (
  <div className="flex gap-3 overflow-x-auto pb-4">
    {APPLICATION_STATUSES.map((s) => (
      <div key={s} className="flex-shrink-0 w-56">
        <div className="h-9 bg-gray-200 rounded-t-xl animate-pulse" />
        <div className="border border-t-0 border-gray-200 rounded-b-xl p-2 space-y-2 min-h-[200px]">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Board ───────────────────────────────────────────────────────────────

const KanbanBoard = ({ applications = [], onStatusChange, isLoading = false }) => {
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = APPLICATION_STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s);
    return acc;
  }, {});

  const handleDragStart = ({ active }) => {
    setActiveApp(active.data.current?.app || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveApp(null);
    if (!over || !active.data.current) return;

    const dragged = active.data.current.app;
    // `over.id` is the column status string (useDroppable id = status)
    const targetStatus = over.data.current?.status || over.id;

    if (
      dragged &&
      typeof targetStatus === 'string' &&
      APPLICATION_STATUSES.includes(targetStatus) &&
      dragged.status !== targetStatus
    ) {
      onStatusChange({ id: dragged._id, status: targetStatus });
    }
  };

  if (isLoading) return <KanbanSkeleton />;

  if (!applications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">📋</span>
        <p className="text-gray-500 font-medium">No applications to display</p>
        <p className="text-gray-400 text-sm mt-1">Create an application to see it on the board</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
          />
        ))}
      </div>

      {/* Ghost card shown while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeApp ? <KanbanCard app={activeApp} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
