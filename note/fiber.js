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

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key];
  //   }
  // });
  // const children = el.props.children;
  // children.forEach((child) => {
  //   render(child, dom);
  // });
  // container.append(dom);
}
let nextWorkOfUnit = null;

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function handingProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChildren = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      children: null,
      subling: null,
      parent: fiber,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChildren.subling = newFiber;
    }

    prevChildren = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  // 1. 创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.addpend(dom);
    // 2. 处理props
    handingProps(dom, fiber.props);
  }

  // 3. 添加children指向
  initChildren(fiber);
  // 4. 返回下一个任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.subling) {
    return fiber.subling;
  }

  return fiber.parent?.subling;
}
function workloop(IdleDeadline) {
  let flag = false;
  if (!flag && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    flag = IdleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workloop);
}

requestIdleCallback(workloop);

const React = {
  render,
  createElement,
};

export default React;
