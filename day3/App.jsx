import React from "./core/React.js";

function Child({ num }) {
  return <div>数字：{num}</div>;
}

function Panent({ id }) {
  return <Child num={id}></Child>;
}

function App() {
  return (
    <div>
      1111
      <Child num={10} />
      {/* <Child num={20} />
      <Child num={30} />
      <Panent id={250} /> */}
    </div>
  );
}

// const App = (
//   <div>
//     1111<Panent></Panent>
//   </div>
// );

export default App;
