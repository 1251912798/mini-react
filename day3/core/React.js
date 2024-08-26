function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string"
          ? createTextNode(child)
          : createElement(child);
      }),
    },
  };
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChildren = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChildren.sibling = newFiber;
    }
    prevChildren = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    // 1. 创建Dom
    const dom = (fiber.dom = createDom(fiber.type));
    // fiber.parent.dom?.append(dom);
    // 2. 处理props
    updateProps(dom, fiber.props);
  }
  // 3. 转换链表  设置指针
  initChildren(fiber);
  // 4. 返回下一个要执行的任务

  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent?.sibling;
}

let root = null;
let nextWorkOfUnit = null;
function workloop(IdleDeadline) {
  let flag = false;
  if (!flag && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    flag = IdleDeadline.timeRemaining() < 1;
  }
  if (!nextWorkOfUnit && root) {
    commitRoot();
  }
  requestIdleCallback(workloop);
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

requestIdleCallback(workloop);
const React = {
  render,
  createElement,
};

export default React;
