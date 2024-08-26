function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children === "string" ? createTextNode("app") : children,
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
  // 1. 处理dom
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);
  // 2.处理props
  Object.keys(el.props).forEach((key) => {
    if (key === "children") return;
    dom[key] = el.props[key];
  });

  // 处理children
  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}
