// Modal/index.jsx

import React, { useContext, useRef } from "react";
import RelationNodeForm from "./RelationNodeForm";
import { FlowContext, Actions } from "../../context";
import { EnhancedDialog } from "../EnhanceDialog/EnhancedDialog";

// 通过节点类型来切换对应的表单组件
const componentsMap = {
  relation: RelationNodeForm,
};

export default function FlowModal() {
  const formRef = useRef();
  const { state, dispatch } = useContext(FlowContext);
  const { modalConfig } = state;

  const handleOk = () => {
    // 组件内部需要暴露一个 submit 方法
    formRef.current.submit().then(() => {
      dispatch({ type: Actions.CLOSE_MODAL });
    });
  };
  const handleCancel = () => dispatch({ type: Actions.CLOSE_MODAL });

  const Component = componentsMap[modalConfig.nodeType];

  return (
    <EnhancedDialog
      title="编辑节点"
      visible={modalConfig.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maxWidth="xs"
    >
      {Component && <Component ref={formRef} />}
    </EnhancedDialog>
  );
}
