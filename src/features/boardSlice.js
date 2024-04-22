// import { createSlice } from '@reduxjs/toolkit';

// const loadFromLocalStorage = () => {
//     const firstTask = [{
//         "id": "1712284250904",
//         "taskname": "Add first task...",
//         "creationDate": new Date().toLocaleDateString(),
//         "lastUpdatedDate": null,
//         "completionDate": new Date().toLocaleDateString(),
//         "priority": "High",
//         "completed": false,
//         "description": {
//           "text": "",
//           "img": "",
//           "url": ""
//         }
//       }];
//     const savedData = JSON.parse(localStorage.getItem('tasks')) || firstBoard;
//     if (!localStorage.getItem('tasks')||[]) {
//         localStorage.setItem('tasks', JSON.stringify(firstTask));
//     }
//     return savedData;
// };
// // const saveToLocalStorage = (currentBoardId) => {
// //     const dataToSave = {  currentBoardId };
// //     localStorage.setItem('currentBoardId', JSON.stringify(dataToSave));
// // };
// // const IdFromLocalStorage = () => {
// //     const firstId = "1";
// //     const savedData = JSON.parse(localStorage.getItem('currentBoardId')) || firstId;
// //     if (!localStorage.getItem('currentBoardId')||!firstId) {
// //         saveToLocalStorage(firstId);
// //     }
// //     return savedData;
// // };
// //{"currentBoardId":"1"}
// const initialState = {
//     tasks: loadFromLocalStorage()||[],
//     loading: false,
//     error: null,
//     // currentBoardId:'1711722491365'
//     // currentBoardId: IdFromLocalStorage().currentBoardId,
// };



// // Create board slice
// const boardSlice = createSlice({
//     name: 'task',
//     initialState,
//     reducers: {
//          addTask(state, action) {
//             const { task } = action.payload;
//             // const boardIndex = state.boards.findIndex(board => board.id === boardId);
//             // if (boardIndex !== -1) {
//                 state.tasks.push(task);
//                 localStorage.setItem('tasks', JSON.stringify(state.tasks));
//             // }
//          },
//          deleteTask(state, action) {
//             const { taskId } = action.payload;
//             // const board = state.boards.find(board => board.id === boardId);
//             // if (board) {
//                 tasks = tasks.filter(task => task.id !== taskId);
//                 localStorage.setItem('tasks', JSON.stringify(state.tasks));
//             }
//         },
//         updateTask(state, action) {
//             const { taskId, name, priority, completed, description,completionDate } = action.payload;

//                 const task = tasks.find(task => task.id === taskId);
//                 if (task) {
//                     task.taskname = name || task.taskname;
//                     task.priority = priority || task.priority;
//                     task.completed = completed;
//                     task.completionDate = completionDate || task.completionDate;
//                     if (description) {
//                         task.description = {
//                             text: description.text || '',
//                             img: description.img || '',
//                             url: description.url || '',
//                         };
//                     }
//                     task.lastUpdatedDate = new Date().toLocaleDateString();
//                     // Optionally, update the state in localStorage
//                     localStorage.setItem('tasks', JSON.stringify(state.tasks));
//                 }
//             }
//         },
    
   

// );

// export const { addTask,deleteTask, updateTask, completeTask, reorderTasks,setCurrentBoard } = boardSlice.actions;

// export default boardSlice.reducer;

