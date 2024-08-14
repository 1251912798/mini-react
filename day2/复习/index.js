let id = 0;
function workloop(IdleDeadline) {
  id++;
  let flag = false;
  while (!flag) {
    console.log(`ID:${id},run time`);

    flag = IdleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workloop);
}

requestIdleCallback(workloop);
