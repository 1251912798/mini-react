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

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChildren = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: child,
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

    fiber.parent.dom?.append(dom);

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

let nextWorkOfUnit = null;
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
