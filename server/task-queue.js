// const task_queue = {
//     sto: storages.create('task_queue'),
//     runnning: undefined,
// };

// const req = require('../ui/utils/request.js');


// task_queue.load = function (data) {
//     task_queue.sto.put('tasks', data);
//     console.info(`任务队列已加载:${task_queue.sto.get('tasks')}`);
// }

// task_queue.running = function (data) {
//     let tasks = task_queue.sto.get('tasks');
//     if (tasks && tasks.length > 0) {
//         console.info(`任务队列正在运行:${tasks}`);


//         tasks.forEach(task => {
//             if (task) {
//                 var script = req.httpGet(task.getUrl());
//                 engines.execScript(task.name, script);
//             }
//         });


//         return true;
//     }
// }

// module.exports = task_queue;