// Graph/index.jsx

import React, { useRef, useContext, useEffect } from "react";
import ReactFlow, { addEdge, Controls, Background } from "react-flow-renderer";
import RelationNode from "../components/Node/RelationNode";
import LinkEdge from "../components/Edge/LinkEdge";
import { FlowContext, Actions } from "../context";


const defaultElements = [
  {
    id: "rmGjd9wV",
    position: { x: 283, y: 63.15625 },
    type: "relation",
    data: { label: "relation node", name: "custom Node" },
  },
  {
    id: "FkJ6fZXD",
    position: { x: 576.5871518688318, y: 118.88856445984582 },
    type: "relation",
    data: { label: "relation node", name: "Relation Node" },
  },
  {
    id: "reactflow__edge-rmGjd9wVnull-FkJ6fZXDnull",
    source: "rmGjd9wV",
    sourceHandle: null,
    target: "FkJ6fZXD",
    targetHandle: null,
    type: "link",
    label: "test edge"
  },
];

function getHash(len) {
  let length = Number(len) || 8;
  const arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
  const al = arr.length;
  let chars = "";
  while (length--) {
    chars += arr[parseInt(Math.random() * al, 10)];
  }
  return chars;
}

export default function FlowGraph(props) {
  const { state, dispatch } = useContext(FlowContext);
  const { elements, reactFlowInstance } = state;
  // 画布的 DOM 容器，用于计算节点坐标
  const graphWrapper = useRef(null);

  const setReactFlowInstance = (instance) => {
    dispatch({
      type: Actions.SET_INSTANCE,
      payload: instance,
    });
  };

  const setElements = (els) => {
    dispatch({
      type: Actions.SET_ELEMENTS,
      payload: els,
    });
  };

  // 自定义节点
  const nodeTypes = {
    relation: RelationNode,
  };

  // 自定义连线
  const edgeTypes = {
    link: LinkEdge,
  };

  // 画布加载完毕，保存当前画布实例
  const onLoad = (instance) => setReactFlowInstance(instance);
  // 连线
  const onConnect = (params) =>
  {
    const id = `reactflow__edge-${params.source}${params.sourceHandle}-${params.target}${params.targetHandle}`;
    dispatch({
      type: Actions.SET_FLOW_NODE,
      payload: {
        id,
        label: "Edge Label",
      },
    });

    dispatch({
      type: Actions.SET_ELEMENTS,
      payload: {
        id ,
        label: "Edge Label",
        ...params
      },
    });

    setElements(
      addEdge(
        {
          ...params,
          type: "link",
          label: "Edge Label"
        },
        elements
      )
    );
  }
    

  // 拖拽完成后放置节点
  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = graphWrapper.current.getBoundingClientRect();
    const nodeData = event.dataTransfer.getData("application/reactflow").split(',')
    const type = nodeData[0];
    const name = nodeData[1];
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getHash(),
      type,
      position,
      data: { label: `${type} node`, name },
    };
    dispatch({
      type: Actions.SET_FLOW_NODE,
      payload: {
        id: newNode.id,
        ...newNode.data,
      },
    });
    setElements(elements.concat(newNode));
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  useEffect(() => {
    defaultElements.forEach(element => {
      dispatch({
        type: Actions.SET_FLOW_NODE,
        payload: {
          id: element.id,
          ...element.data,
        },
      });
    });
    setElements(defaultElements);
  }, []);

  return (
    <div className="graph" ref={graphWrapper}>
      <ReactFlow
        elements={elements}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onLoad={onLoad}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
