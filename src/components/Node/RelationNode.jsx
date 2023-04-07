import React, { useContext, useState } from "react";
import { Handle } from "react-flow-renderer";
import { FlowContext, Actions } from "../../context";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// 编辑菜单
const EditMenu = (props) => {
  const { dispatch, anchorEl, open, handleClose, ...node } = props
  const edit = () => {
    dispatch({
      type: Actions.OPEN_MODAL,
      payload: {
        id: node.id,
        type: "relation",
      },
    });
  };
  const remove = () => {
    dispatch({
      type: Actions.REMOVE_FLOW_NODE,
      payload: node,
    });
  };
  return (
    <Menu 
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}>
      <MenuItem key="1" onClick={edit}>
        编辑
      </MenuItem>
      <MenuItem key="2" onClick={remove}>
        删除
      </MenuItem>
    </Menu>
  );
};

const RelationNode = (props) => {
  const { id, isConnectable = true } = props;
  const { dispatch, state } = useContext(FlowContext);
  const currentNode = state.flowData.get(id) || {};

  // Menu用的方法
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="relation-node">
      <div className="relation-node-title">{currentNode.name}</div>
      <div className="relation-node-action">
        <IconButton aria-label="delete" size="small" onClick={handleClick}>
          <MoreVertIcon fontSize="inherit" />
        </IconButton>
        <EditMenu anchorEl={anchorEl} open={open} handleClose={handleClose} dispatch={dispatch} {...props}/>
      </div>
      {/* 提供一个入口和一个出口 */}
      <Handle type="target" position="left" isConnectable={isConnectable} />
      <Handle type="source" position="right" isConnectable={isConnectable} />
    </div>
  );
};

export default React.memo(RelationNode);
