"use strict";


const DragDropContext = window.ReactBeautifulDnd.DragDropContext;
const Draggable = window.ReactBeautifulDnd.Draggable;
const Droppable = window.ReactBeautifulDnd.Droppable;
const styled = window.styled;


const ColumnContainer = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;
const TaskContainer = styled.div`
    padding: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    margin-bottom: 8px;
`;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
`;

// fake data generator
const initialData = {
    tasks: {
        'task-1':{ id: 'task-1', content: 'Take out the garbage'},
        'task-2':{ id: 'task-2', content: 'Watch movie'},
    },
    columns: {
        'column-1': {
            id: "column-1",
            title: 'To do',
            taskIds: ['task-1', 'task-2'],  //in order

        },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1'],
};


class Column extends React.Component {
    render() {
        return (
            <ColumnContainer>
                <Title>{this.props.column.title}</Title>
                <TaskList>
                    {this.props.tasks.map(task => <Task key={task.id} task={task} />)}
                </TaskList>
            </ColumnContainer>
        );
    }
}

class Task extends React.Component {
    render() {
        return (
            <TaskContainer>
                {this.props.task.content}
            </TaskContainer>
        );
    }
}




class App extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    state = initialData;

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.columnOrder.map(columnId => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                return <Column key={column.id} column={column} tasks={tasks} />;
                })}
            </DragDropContext>
        ); 
    }
}



ReactDOM.render(
    <App />,
    document.getElementById("app")
);

