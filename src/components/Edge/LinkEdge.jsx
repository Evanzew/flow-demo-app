import React, { useState } from "react";
import { getSmoothStepPath, getEdgeCenter, getMarkerEnd, useStoreState } from "react-flow-renderer";
import { Popover } from "antd";
import PopoverCard from "./PopoverCard";
import EdgeButton from "./EdgeButton";

const foreignObjectSize = 50;
const foreignObjectwidth = 100;

// 查找连线关联的节点
function getRelationNodeByEdge(id, edges) {
  if (!Array.isArray(edges)) {
    return null;
  }

  for (let i = 0; i < edges.length; i++) {
    const item = edges[i];
    if (item.id === id) {
      return {
        edge: id,
        source: item.source,
        target: item.target,
        label: item.label
      };
    }
  }
}

export default function LinkEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  borderRadius = 0,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  // 传入 PopoverCard 的参数，包含 source、target
  const [model, setModel] = useState(null);

  const edges = useStoreState((store) => store.edges);
  const currentEdge = edges.find(edge => edge.id === id);
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // 点击连线上的按钮
  const handleVisibleChange = (v) => {
    setModel(getRelationNodeByEdge(id, edges) || {});
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectwidth}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize }
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
      >
        <Popover
          placement="right"
          content={<PopoverCard {...model} />}
          trigger="click"
          overlayClassName="linkedge-overlay"
          onVisibleChange={handleVisibleChange}
        >
          <EdgeButton size="small" label={currentEdge?.label}></EdgeButton>
        </Popover>
      </foreignObject>
    </>
  );
}
