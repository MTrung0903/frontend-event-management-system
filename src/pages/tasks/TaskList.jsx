import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Card, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './TaskList.css';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: '1', content: 'Lên kế hoạch sự kiện A', priority: 'high' },
      { id: '2', content: 'Liên hệ nhà tài trợ', priority: 'medium' },
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      { id: '3', content: 'Thiết kế poster', priority: 'high' },
    ]
  },
  review: {
    id: 'review',
    title: 'Review',
    tasks: [
      { id: '4', content: 'Kiểm tra thiết bị', priority: 'low' },
    ]
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: '5', content: 'Đặt địa điểm', priority: 'high' },
    ]
  }
};

const TaskList = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Nếu không có điểm đến
    if (!destination) return;

    // Nếu vị trí không thay đổi
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Lấy cột nguồn và đích
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // Di chuyển trong cùng một cột
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: newTasks,
        },
      });
      return;
    }

    // Di chuyển giữa các cột
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks = Array.from(destColumn.tasks);
    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    });
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <Typography variant="h4">Danh sách công việc</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/tasks/add'}
        >
          Thêm công việc
        </Button>
      </div>

      <div className="kanban-board">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(columns).map((column) => (
            <div key={column.id} className="kanban-column">
              <h2 className="column-title">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className={`priority-indicator priority-${task.priority}`} />
                            <div className="task-content">
                              {task.content}
                            </div>
                            <div className="task-actions">
                              <IconButton size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskList; 