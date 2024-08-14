let taskId = 0;
function callback(IdleDeadline) {
  taskId++;
  let flag = false;
  while (!flag) {
    console.log(`taskId: ${taskId},run`);

    flag = IdleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(callback);
}

requestIdleCallback(callback);
