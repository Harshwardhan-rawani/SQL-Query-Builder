import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TableNode } from './TableNode';
import { useSchemaStore } from '@/store/schemaStore';
import { Table } from '@/types/schema';

const nodeTypes = {
  tableNode: TableNode,
};

export const SchemaCanvas = () => {
  const {
    tables,
    relationships,
    selectedTableId,
    addRelationship,
    updateTablePosition,
    selectTable,
    selectRelationship,
  } = useSchemaStore();

  // Convert tables to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return tables.map((table) => ({
      id: table.id,
      type: 'tableNode',
      position: table.position,
      data: { table },
      selected: table.id === selectedTableId,
    }));
  }, [tables, selectedTableId]);

  // Convert relationships to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map((rel) => ({
      id: rel.id,
      source: rel.fromTableId,
      target: rel.toTableId,
      sourceHandle: `${rel.fromColumnId}-source`,
      targetHandle: `${rel.toColumnId}-target`,
      type: 'smoothstep',
      animated: rel.relationType === 'many-to-many',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
      },
      label: rel.relationType === 'one-to-one' ? '1:1' : rel.relationType === 'one-to-many' ? '1:N' : 'N:N',
      labelStyle: { fontSize: 10, fontWeight: 500 },
      labelBgStyle: { fill: 'hsl(var(--card))' },
      labelBgPadding: [4, 2] as [number, number],
      labelBgBorderRadius: 4,
    }));
  }, [relationships]);

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Sync nodes when tables change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Sync edges when relationships change
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Update positions in store
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && 'id' in change) {
          updateTablePosition(change.id, change.position);
        }
      });
    },
    [setNodes, updateTablePosition]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) return;
      
      // Extract column IDs from handles
      const fromColumnId = params.sourceHandle.replace('-source', '');
      const toColumnId = params.targetHandle.replace('-target', '');
      
      addRelationship(params.source, fromColumnId, params.target, toColumnId);
    },
    [addRelationship]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectTable(node.id);
    },
    [selectTable]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      selectRelationship(edge.id);
    },
    [selectRelationship]
  );

  const onPaneClick = useCallback(() => {
    selectTable(null);
  }, [selectTable]);

  return (
    <div className="flex-1 canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="!bg-card !border !border-border !rounded-lg !shadow-md" />
        <MiniMap
          className="!bg-card !border !border-border !rounded-lg !shadow-md"
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
    </div>
  );
};
