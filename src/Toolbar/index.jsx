import React, { useContext } from "react";
import classnames from "classnames";
import { FlowContext } from "../context";

export default function Toolbar() {
  const {
    state: { reactFlowInstance, flowData },
  } = useContext(FlowContext);

  // 保存
  const handleSave = () => {
    console.log('reactFlowInstance', reactFlowInstance.toObject());
    console.log('flowData', flowData);
  };

  // 重置节点
  // const handleRest = () => {};

  return (
    <div className="toolbar">
      {/* <button className={classnames(["button"])} onClick={handleRest}>
        重置
      </button> */}
      <button className={classnames(["button", "primary-btn"])} onClick={handleSave}>
        保存
      </button>
    </div>
  );
}
